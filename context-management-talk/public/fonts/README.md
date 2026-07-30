# Excalifont

The deck's handwriting is **Excalifont** — Excalidraw's own typeface, and the
successor to Virgil. Licensed under the **SIL Open Font License 1.1**, which
permits redistribution and embedding.

## What's here

`Excalifont-Regular.woff2` — 24,956 bytes.

Upstream ships Excalifont pre-split into seven `unicode-range` subsets. This is
subset **0**, the Latin one:

    packages/excalidraw/fonts/Excalifont/
      Excalifont-Regular-a88b72a24fb54c9f94e3b5fdaa7481c9.woff2

fetched from `github.com/excalidraw/excalidraw` (master).

It covers `U+20–7E`, Latin-1, en/em dashes, curly quotes, ellipsis, bullet and
similar punctuation — everything this deck sets in running text.

## Known gap

Arrows and symbols (`→ ↓ ≠ ■ ✓ ✗ ○ ● ◍ ◎`) are **not** in this subset and fall
back per-glyph to the next font in the stack. That's normal browser behaviour
and looks fine. To render those in Excalifont too, grab the other subsets from
the same upstream folder and add one `@font-face` per subset with its matching
`unicode-range` — the ranges are listed in that folder's `index.ts`.

## Wiring

- `style.css` — the `@font-face` block, plus the font stack on `:root`
- `slides.md` headmatter — `fonts.local: Excalifont`, which stops Slidev trying
  to fetch it from Google Fonts

Fallbacks are `Chalkboard SE` → `Chalkboard` → `Bradley Hand` → `cursive`.
Those are macOS built-ins, so the deck still renders hand-drawn without this
file — but only on a Mac. Keep the woff2 for portable PDF export.
