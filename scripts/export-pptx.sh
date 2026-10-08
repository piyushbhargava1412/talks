#!/usr/bin/env bash
# Exports one talk to PowerPoint, with Slidev's click reveals turned into
# native click animations — see build-pptx.py for how the deck is put
# together, and the README for what survives the conversion.
#
# usage: scripts/export-pptx.sh <talk-dir> [--no-notes]
#   e.g. scripts/export-pptx.sh better-than-what-talk
#        scripts/export-pptx.sh better-than-what-talk --no-notes
#
# Speaker notes are included by default; --no-notes leaves them out.
#
# Writes <talk-dir>/<title>.pptx (gitignored), named from the talk's
# `title:` frontmatter. Needs pnpm and uv on PATH.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

NOTES_FLAG=()
TALK_ARG=""
for arg in "$@"; do
  case "$arg" in
    --no-notes) NOTES_FLAG=(--no-notes) ;;
    -*) echo "unknown option: $arg" >&2; exit 1 ;;
    *) [ -z "$TALK_ARG" ] || { echo "usage: $0 <talk-dir> [--no-notes]" >&2; exit 1; }
       TALK_ARG="$arg" ;;
  esac
done
if [ -z "$TALK_ARG" ]; then
  echo "usage: $0 <talk-dir> [--no-notes]" >&2
  exit 1
fi

TALK="$ROOT/${TALK_ARG%/}"
if [ ! -f "$TALK/slides.md" ]; then
  echo "No slides.md in $TALK — expected a talk folder." >&2
  exit 1
fi

for tool in pnpm uv; do
  if ! command -v "$tool" >/dev/null; then
    echo "$tool is required but not on PATH." >&2
    exit 1
  fi
done

cd "$TALK"

# `slidev export` drives a headless Chromium through playwright-chromium.
# Talks don't ship it by default, so add it on first export.
if ! grep -q '"playwright-chromium"' package.json; then
  echo "Adding playwright-chromium to $(basename "$TALK") (first export)…"
  pnpm add -D playwright-chromium
elif [ ! -d node_modules ]; then
  pnpm install
fi
# No-op when the browser is already downloaded; covers a skipped postinstall.
pnpm exec playwright-core install chromium

TITLE="$(grep -m1 '^title:' slides.md | sed -e 's/^title:[[:space:]]*//' -e 's/[\/:*?"<>|]//g' -e 's/[[:space:]]*$//')"
OUT="$TALK/${TITLE:-$(basename "$TALK")}.pptx"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Vite re-optimizes dependencies the first time it sees a new lockfile and
# reloads the page mid-export, which can capture half-rendered slides. When
# that happens, the cache is warm afterwards, so one rerun is enough.
export_slides() {
  local log="$WORK/export.log"
  pnpm exec slidev export slides.md --with-clicks --timeout 120000 --wait 800 "$@" 2>&1 | tee "$log"
  if grep -q 'reloading' "$log"; then
    echo "Vite reloaded during export; exporting again…"
    pnpm exec slidev export slides.md --with-clicks --timeout 120000 --wait 800 "$@" 2>&1 | tee "$log"
    if grep -q 'reloading' "$log"; then
      echo "Warning: Vite reloaded again — check the deck for half-rendered slides." >&2
    fi
  fi
}

# The PPTX supplies the step images and the speaker notes; the PNG export
# is only used for its NNN-CC filenames, which map steps to slides.
export_slides --format pptx --output "$WORK/raw.pptx"
export_slides --format png --output "$WORK/png"

uv run --with python-pptx "$ROOT/scripts/build-pptx.py" "$WORK/png" "$WORK/raw.pptx" "$OUT" ${NOTES_FLAG[@]+"${NOTES_FLAG[@]}"}
echo "Done: $OUT"
