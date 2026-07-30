import rough from 'roughjs'
import type { RoughSVG } from 'roughjs/bin/svg'
import type { Options } from 'roughjs/bin/core'

/**
 * Shared rough.js helpers — the "pencil" the whole deck is drawn with.
 *
 * Two things matter here:
 *
 * 1. Every shape passes an explicit `seed`. Without it rough.js re-randomises
 *    on each redraw, so a resize or a click-driven re-render makes the slide
 *    visibly wobble. Fixed seeds keep the sketch stable but still hand-drawn.
 *
 * 2. Colours are resolved to literal values before they reach rough.js.
 *    rough.js writes `stroke`/`fill` as SVG presentation attributes, and
 *    `var(--x)` is not reliably resolved there — so read the custom property
 *    off the document first.
 */

let cache: Record<string, string> | null = null

/** Resolve the deck's CSS custom properties to literal colours, once. */
export function palette(): Record<string, string> {
  if (cache) return cache
  const cs = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback
  cache = {
    ink: read('--ink', '#e8e5da'),
    ink2: read('--ink-2', '#b3b0a4'),
    ink3: read('--ink-3', '#85837a'),
    line: read('--ctx-line', '#3a3a36'),
    surface: read('--ctx-surface-1', '#1a1a19'),
    track: read('--ctx-track', '#262625'),
    s1: read('--s1', '#3987e5'),
    s2: read('--s2', '#d95926'),
    s3: read('--s3', '#199e70'),
    s4: read('--s4', '#c98500'),
    s5: read('--s5', '#d55181'),
    good: read('--st-good', '#0ca30c'),
    warn: read('--st-warn', '#fab219'),
    crit: read('--st-crit', '#d03b3b'),
  }
  return cache
}

/** Categorical slot by 1-based index, never cycled past 5. */
export function slot(n: number): string {
  const p = palette()
  return p[`s${Math.min(Math.max(n, 1), 5)}`]
}

/** Base pencil stroke. */
export const pencil = (seed: number, extra: Options = {}): Options => ({
  stroke: palette().ink,
  strokeWidth: 1.7,
  roughness: 1.5,
  bowing: 1.4,
  seed,
  ...extra,
})

/** A solid-filled shape — used where fill area encodes a quantity. */
export const filled = (color: string, seed: number, extra: Options = {}): Options => ({
  stroke: color,
  strokeWidth: 1.5,
  roughness: 1.3,
  bowing: 1,
  fill: color,
  fillStyle: 'solid',
  seed,
  ...extra,
})

/** A hatched shape — "wasted", "at risk", or annotation regions. */
export const hatched = (color: string, seed: number, extra: Options = {}): Options => ({
  stroke: color,
  strokeWidth: 1.4,
  roughness: 1.5,
  bowing: 1.1,
  fill: color,
  fillStyle: 'hachure',
  hachureAngle: -41,
  hachureGap: 5,
  seed,
  ...extra,
})

/**
 * Clear a target element and redraw it with rough.js.
 *
 * The target may be the <svg> itself or a <g> inside it — pass a <g> when the
 * component also renders Vue-managed <text> labels in the same SVG, so Vue and
 * rough.js each own their own subtree and neither wipes the other.
 */
export function sketch(
  target: SVGSVGElement | SVGGElement | null | undefined,
  draw: (rc: RoughSVG, add: (node: SVGGElement) => void) => void,
): void {
  if (!target) return
  const root = (target as SVGGElement).ownerSVGElement ?? (target as SVGSVGElement)
  while (target.firstChild) target.removeChild(target.firstChild)
  const rc = rough.svg(root)
  draw(rc, (node) => target.appendChild(node))
}

/** Deterministic seed from a string, so each named shape keeps its own wobble. */
export function seedOf(key: string): number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h % 100000)
}

/** A hand-drawn arrow: shaft plus two head strokes. */
export function arrow(
  rc: RoughSVG,
  add: (n: SVGGElement) => void,
  x1: number, y1: number, x2: number, y2: number,
  seed: number,
  color?: string,
): void {
  const stroke = color || palette().ink3
  add(rc.line(x1, y1, x2, y2, pencil(seed, { stroke })))
  const a = Math.atan2(y2 - y1, x2 - x1)
  const len = 9
  for (const spread of [2.6, -2.6]) {
    add(rc.line(
      x2, y2,
      x2 + len * Math.cos(a + spread),
      y2 + len * Math.sin(a + spread),
      pencil(seed + 1, { stroke }),
    ))
  }
}
