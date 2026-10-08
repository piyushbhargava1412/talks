# Talks

Slide decks for my talks, built with [Slidev](https://sli.dev/) and
published together as one static site.

## Layout

Each talk is a top-level folder with its own `slides.md` and its own pnpm
project (`package.json`, lockfile, components, styles). Any top-level
folder containing a `slides.md` counts as a talk; there is nothing to
register.

```
<talk-folder>/       one Slidev project per talk
scripts/
  build-all-talks.mjs   builds every talk into site/, plus a landing page
  export-pptx.sh        exports one talk to PowerPoint
  build-pptx.py         used by export-pptx.sh
.github/workflows/      publishes site/ on push to main
```

## Working on a talk

```bash
cd <talk-folder>
pnpm install
pnpm dev
```

Slidev opens at <http://localhost:3030>, with presenter mode at
`/presenter`.

## Adding a talk

Create a new top-level folder with a `slides.md` (copying an existing talk
is the quickest start) and push. The next deploy picks it up and lists it
on the landing page under its `title:` frontmatter.

## Publishing

Every push to `main` runs `scripts/build-all-talks.mjs`, which builds each
talk under `/talks/<talk-folder>/` and generates a landing page linking to
all of them, then deploys the result to GitHub Pages.

Speaker notes are included in the published build, so anyone with the
link can read them in presenter mode.

To preview the combined site locally, build it for the root path and serve
it:

```bash
PAGES_BASE=/ node scripts/build-all-talks.mjs
```

```bash
npx serve site
```

## Exporting to PowerPoint

For when a talk needs to run from someone else's machine, such as an
organizer presenting every talk from one laptop.

```bash
scripts/export-pptx.sh <talk-folder>
```

To leave the speaker notes out, for example when handing the deck to
someone else:

```bash
scripts/export-pptx.sh <talk-folder> --no-notes
```

This writes `<talk-folder>/<title>.pptx`. It needs `pnpm` and
[`uv`](https://docs.astral.sh/uv/). On a talk's first export it adds
`playwright-chromium` as a dev dependency and downloads the headless
browser Slidev exports with; commit those `package.json` and lockfile
changes.

What you get:

- One PowerPoint slide per Slidev slide.
- Each click reveal (`v-click` and friends) becomes a click-triggered fade
  in PowerPoint, so the clicker steps through the slide just as it does in
  Slidev, forwards and backwards.
- A push transition between slides, matching Slidev's `slide-left`.
- Speaker notes, shown in presenter view (unless you pass `--no-notes`).

What you lose:

- Slides are screenshots, so text isn't editable in PowerPoint.
- Animation within a step is a plain fade; motion, morphs and custom
  transitions don't carry over.

How it works: Slidev exports every click step twice, as a PPTX of
screenshots (which carries the notes) and as PNGs (whose filenames map
steps to slides). `build-pptx.py` keeps the first step of each slide and
stacks the later steps on top as full-slide pictures that fade in on
click.

Notes:

- Export after your last edit; the deck is a snapshot.
- If Vite reloads mid-export (it re-optimizes dependencies after a
  lockfile change), the script exports again automatically and warns if
  that happens twice. Check the deck if you see the warning.
- Decks with many steps are large (tens of MB), because every step is a
  full-slide PNG.
- `*.pptx` is gitignored so exports don't get committed.
- Tested in Keynote. Open the deck once in PowerPoint before handing it
  over.
