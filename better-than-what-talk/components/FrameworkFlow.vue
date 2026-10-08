<script setup lang="ts">
import rough from 'roughjs'
import { computed, onMounted, ref, watch } from 'vue'
import { arrow, palette, pencil, seedOf } from '../utils/sketch'

/**
 * benchmark-runner end to end: one fixture, one run, one judgement, a second
 * judged run, a fair-race check, the comparison, and the published report.
 *
 * Two ways to use it:
 *
 * - `:step="$clicks"` (slide `clicks: 9`) plays the journey one frame per click:
 *   0 fixture · 1 prepare · 2 run · 3 upload · 4 grade · 5 count · 6 judge ·
 *   7 second lane · 8 fair race · 9 compare → publish.
 * - `:focus="['grade', 'count']"` draws the finished picture with only those
 *   regions bright. The zoom-in slides that follow use it, so the audience
 *   always sees where they are on the same map.
 *
 * Layout is a snake: the main lane runs left to right, the answer-key vault
 * and the second lane sit underneath, and the comparison row runs back right
 * to left to land on the published site.
 */
type Region = 'fixture' | 'run' | 'grade' | 'count' | 'judge' | 'lane2' | 'fair' | 'compare'
type Layer = Region | 'machine' | 'rail'

const props = withDefaults(defineProps<{
  step?: number
  focus?: Region[]
  caption?: boolean
}>(), { step: 9, caption: true })

const W = 960
const H = 468
const LAST = 9

const step = computed(() => (props.focus ? LAST : Math.min(Math.max(props.step, 0), LAST)))
const at = (n: number) => step.value >= n

// ── focus: dim everything that is not part of the region under discussion ──
function bright(layer: Layer): boolean {
  if (!props.focus) return true
  const f = props.focus
  if (layer === 'machine') return f.some((r) => r === 'grade' || r === 'count' || r === 'judge')
  if (layer === 'rail') return f.some((r) => r === 'fixture' || r === 'grade' || r === 'count')
  return f.includes(layer)
}
const fade = (layer: Layer) => ({ opacity: bright(layer) ? 1 : 0.16 })

// ── geometry ───────────────────────────────────────────────────────────────
const F = { x: 20, y: 30, w: 190, h: 220 } // fixture
const V = { x: 20, y: 268, w: 225, h: 52 } // vault of answer keys
const A = { x: 250, y: 30, w: 200, h: 175 } // agent machine
const J = { x: 530, y: 30, w: 410, h: 220 } // judge machine
const G = { x: 545, y: 68, w: 115, h: 100 } // grade
const C = { x: 675, y: 68, w: 115, h: 100 } // count
const D = { x: 805, y: 68, w: 120, h: 100 } // LLM judge
const K1 = { x: 825, y: 198, w: 80, h: 40 } // judgement 1
const L2 = { x: 250, y: 330, w: 690, h: 44 } // second lane
const K2 = { x: 822, y: 336, w: 86, h: 32 } // judgement 2
const FR = { x: 770, y: 398, w: 150, h: 62 } // fair race
const CP = { x: 565, y: 398, w: 160, h: 62 } // compare
const R = { x: 375, y: 398, w: 150, h: 62 } // report
const PB = { x: 20, y: 398, w: 315, h: 62 } // published

// The story travels as a bead along the top edge of whichever box is working.
const bead: [number, number][] = [
  [F.x + F.w / 2, F.y],
  [A.x + A.w / 2, A.y],
  [A.x + A.w / 2, A.y],
  [490, 117],
  [G.x + G.w / 2, G.y],
  [C.x + C.w / 2, C.y],
  [K1.x + K1.w / 2, K1.y],
  [K1.x + K1.w / 2, K1.y],
  [FR.x + FR.w / 2, FR.y],
  [PB.x + PB.w / 2, PB.y],
]
const beadAt = computed(() => bead[step.value])

const captions = [
  ['The fixture', 'Everything starts from a story a human team already shipped.'],
  ['Prepare', 'The agent gets exactly what the developer got. The answers stay home.'],
  ['Run', 'Any harness, any model, under a time limit.'],
  ['Upload', 'Everything it did, as one parcel.'],
  ['Grade', 'Code first. Did it break anything? Does the new behaviour exist?'],
  ['Count', 'Everything countable is counted, so no model does arithmetic.'],
  ['Judge', 'A model forms an opinion, inside rules that code enforces.'],
  ['Second lane', 'To compare, you need two of these.'],
  ['Fair race', 'Same story, same base, same judge? Then we may compare.'],
  ['Compare → publish', 'One verdict, published, and one more cell in the grid.'],
]

// ── rough.js layers ───────────────────────────────────────────────────────
// One <g> per layer, so focus can dim a region's sketch and its labels together.
// Vue owns the <text>; rough.js owns these groups, and redraws them per step.
const svg = ref<SVGSVGElement>()
const layers: Partial<Record<Layer, SVGGElement>> = {}
const setLayer = (key: Layer) => (el: unknown) => { if (el) layers[key] = el as SVGGElement }

let shown = -1

function draw() {
  const root = svg.value
  if (!root) return
  for (const g of Object.values(layers)) while (g?.firstChild) g.removeChild(g.firstChild)
  const rc = rough.svg(root)
  const p = palette()
  // Only shapes that appear on this very click fade in; redrawn older ones must not flicker.
  const playing = !props.focus && step.value === shown + 1
  const to = (key: Layer, revealAt: number) => (node: SVGGElement) => {
    if (playing && revealAt === step.value) node.classList.add('ff-fade')
    layers[key]?.appendChild(node)
  }
  const box = (key: Layer, revealAt: number, b: { x: number, y: number, w: number, h: number }, stroke: string, extra = {}) => {
    if (!at(revealAt)) return
    to(key, revealAt)(rc.rectangle(b.x, b.y, b.w, b.h, pencil(seedOf(`ff-${key}-${b.x}-${b.y}`), { stroke, ...extra })))
  }
  const line = (key: Layer, revealAt: number, pts: [number, number][], stroke: string, dashed = false) => {
    if (!at(revealAt)) return
    for (let i = 0; i < pts.length - 1; i++) {
      const [[x1, y1], [x2, y2]] = [pts[i], pts[i + 1]]
      const last = i === pts.length - 2
      if (last) arrow(rc, to(key, revealAt), x1, y1, x2, y2, seedOf(`ff-l-${key}-${i}-${x1}`), stroke)
      else to(key, revealAt)(rc.line(x1, y1, x2, y2, pencil(seedOf(`ff-l-${key}-${i}-${y1}`), { stroke, strokeLineDash: dashed ? [6, 5] : undefined })))
    }
  }

  // 0 · fixture
  box('fixture', 0, F, p.s5)
  // 1 · prepare: sandbox + vault
  box('fixture', 1, V, p.warn, { strokeLineDash: [7, 5] })
  box('run', 1, A, p.ink3)
  box('run', 1, { x: A.x + 12, y: A.y + 34, w: A.w - 24, h: A.h - 46 }, p.s1, { strokeLineDash: [6, 5] })
  line('run', 1, [[F.x + F.w, 100], [A.x, 100]], p.ink3)
  // 3 · upload
  box('run', 3, { x: 472, y: 100, w: 36, h: 32 }, p.s4)
  line('run', 3, [[A.x + A.w, 116], [472, 116]], p.ink3)
  line('run', 3, [[508, 116], [J.x, 116]], p.ink3)
  // 4 · grade, on the judge machine, with the vault opening onto it
  box('machine', 4, J, p.ink3)
  box('grade', 4, G, p.s3)
  line('rail', 4, [[V.x + V.w, 294], [G.x + 57, 294], [G.x + 57, G.y + G.h]], p.warn, true)
  // 5 · count
  box('count', 5, C, p.s3)
  line('count', 5, [[G.x + G.w, 118], [C.x, 118]], p.ink3)
  // 6 · judge, ringed by the code that checks it
  box('judge', 6, D, p.s6)
  box('judge', 6, { x: D.x - 9, y: D.y - 8, w: D.w + 18, h: D.h + 16 }, p.warn, { strokeLineDash: [5, 5], roughness: 1 })
  line('judge', 6, [[C.x + C.w, 118], [D.x - 9, 118]], p.ink3)
  box('judge', 6, K1, p.s6)
  line('judge', 6, [[K1.x + K1.w / 2, D.y + D.h + 8], [K1.x + K1.w / 2, K1.y]], p.ink3)
  // 7 · a second judged run of the same fixture
  box('lane2', 7, L2, p.ink3, { strokeLineDash: [8, 6] })
  box('lane2', 7, K2, p.s6)
  line('lane2', 7, [[F.x + F.w, 236], [240, 236], [240, L2.y + 22], [L2.x, L2.y + 22]], p.ink3)
  // 8 · fair race
  box('fair', 8, FR, p.warn)
  line('fair', 8, [[K1.x + K1.w, 218], [950, 218], [950, FR.y + 31], [FR.x + FR.w, FR.y + 31]], p.ink3)
  line('fair', 8, [[K2.x + K2.w / 2, K2.y + K2.h], [K2.x + K2.w / 2, FR.y]], p.ink3)
  // 9 · compare → report → published site + matrix
  box('compare', 9, CP, p.s1)
  box('compare', 9, R, p.s1)
  box('compare', 9, PB, p.good)
  line('compare', 9, [[FR.x, FR.y + 31], [CP.x + CP.w, FR.y + 31]], p.ink3)
  line('compare', 9, [[CP.x, FR.y + 31], [R.x + R.w, FR.y + 31]], p.ink3)
  line('compare', 9, [[R.x, FR.y + 31], [PB.x + PB.w, FR.y + 31]], p.ink3)
  if (at(9)) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        to('compare', 9)(rc.rectangle(200 + c * 40, 409 + r * 15, 36, 12, pencil(seedOf(`ff-m-${r}-${c}`), {
          stroke: p.ink3, strokeWidth: 1, roughness: 0.8,
        })))
      }
    }
  }
  shown = step.value
}

onMounted(draw)
watch(() => [props.step, props.focus?.join(',')], draw)
</script>

<template>
  <figure class="ff">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="ff__svg" role="img"
      aria-label="A fixture is prepared into a sandbox while its answer keys stay in a vault; the agent's run is uploaded, graded by code, counted and judged by a model on a separate machine; a second judged run of the same fixture joins it at a fairness check, and the comparison is published as a report on a site with a matrix.">

      <!-- ── fixture + vault ── -->
      <g :style="fade('fixture')" class="ff-region">
        <g :ref="setLayer('fixture')" />
        <text :x="F.x + 14" :y="F.y + 24" class="ff__title">FIXTURE</text>
        <text :x="F.x + 18" :y="F.y + 56" class="ff__row">story, as written</text>
        <text :x="F.x + 18" :y="F.y + 82" class="ff__row">● base commit</text>
        <g class="ff-move" :style="{ transform: at(1) ? 'translate(0px, 168px)' : 'none' }">
          <text :x="F.x + 18" :y="F.y + 108" class="ff__row ff__row--key">🔒 reference</text>
        </g>
        <g class="ff-move" :style="{ transform: at(1) ? 'translate(94px, 140px)' : 'none' }">
          <text :x="F.x + 18" :y="F.y + 136" class="ff__row ff__row--key">🔒 hidden test</text>
        </g>
        <text :x="F.x + 18" :y="F.y + 164" class="ff__row">✓ quality gate</text>
        <text :x="F.x + 18" :y="F.y + 190" class="ff__row">⚙ toolchain</text>
        <text v-if="at(1)" :x="V.x + 12" :y="V.y + 18" class="ff__tag ff__tag--warn ff-fade">VAULT · ANSWER KEYS</text>
      </g>

      <!-- ── agent machine ── -->
      <g :style="fade('run')" class="ff-region">
        <g :ref="setLayer('run')" />
        <template v-if="at(1)">
          <text :x="A.x + 14" :y="A.y + 24" class="ff__title ff-fade">AGENT MACHINE</text>
          <text :x="A.x + 24" :y="A.y + 58" class="ff__row ff-fade">base copy + story</text>
        </template>
        <template v-if="at(2)">
          <text :x="A.x + 24" :y="A.y + 86" class="ff__badge ff-fade">harness@model</text>
          <rect :x="A.x + 24" :y="A.y + 100" width="150" height="7" rx="3" class="ff__track" />
          <rect :x="A.x + 24" :y="A.y + 100" width="150" height="7" rx="3"
            :class="['ff__timer', { 'ff__timer--run': step === 2 && !focus }]" />
          <text :x="A.x + 24" :y="A.y + 124" class="ff__note ff-fade">⏱ under a time limit</text>
        </template>
        <template v-if="at(3)">
          <text :x="A.x + 24" :y="A.y + 148" class="ff__note ff-fade">→ diff · session log · notes</text>
          <text x="490" y="122" class="ff__icon ff-fade" text-anchor="middle">📦</text>
          <text x="490" y="150" class="ff__tag ff-fade" text-anchor="middle">ARTIFACT</text>
        </template>
      </g>

      <!-- ── judge machine ── -->
      <g :style="fade('machine')" class="ff-region">
        <g :ref="setLayer('machine')" />
        <template v-if="at(4)">
          <text :x="J.x + 14" :y="J.y + 24" class="ff__title ff-fade">JUDGE MACHINE</text>
          <text :x="J.x + J.w - 14" :y="J.y + 24" class="ff__tag ff-fade" text-anchor="end">AFTER THE AGENT FINISHES</text>
        </template>
      </g>
      <g :style="fade('rail')" class="ff-region">
        <g :ref="setLayer('rail')" />
        <text v-if="at(4)" x="400" y="288" class="ff__tag ff__tag--warn ff-fade" text-anchor="middle">ANSWER KEYS UNLOCK HERE</text>
      </g>
      <g :style="fade('grade')" class="ff-region">
        <g :ref="setLayer('grade')" />
        <template v-if="at(4)">
          <text :x="G.x + 12" :y="G.y + 22" class="ff__name ff-fade">grade</text>
          <text :x="G.x + 12" :y="G.y + 38" class="ff__tag ff-fade">CODE</text>
          <text :x="G.x + 12" :y="G.y + 62" class="ff__chip ff-fade">✓ quality gate</text>
          <text :x="G.x + 12" :y="G.y + 84" class="ff__chip ff-fade" style="animation-delay: .25s">✓ hidden test</text>
        </template>
      </g>
      <g :style="fade('count')" class="ff-region">
        <g :ref="setLayer('count')" />
        <template v-if="at(5)">
          <text :x="C.x + 12" :y="C.y + 22" class="ff__name ff-fade">count</text>
          <text :x="C.x + 12" :y="C.y + 38" class="ff__tag ff-fade">CODE</text>
          <text v-for="(f, i) in ['files vs human', 'credits · minutes', 'tool calls · stages']" :key="f"
            :x="C.x + 12" :y="C.y + 60 + i * 15" class="ff__note ff-fade" :style="{ animationDelay: `${0.2 + i * 0.25}s` }">{{ f }}</text>
        </template>
      </g>
      <g :style="fade('judge')" class="ff-region">
        <g :ref="setLayer('judge')" />
        <template v-if="at(6)">
          <text :x="D.x + 12" :y="D.y + 22" class="ff__name ff-fade">LLM judge</text>
          <text :x="D.x + 12" :y="D.y + 38" class="ff__tag ff__tag--violet ff-fade">MODEL</text>
          <text :x="D.x + 12" :y="D.y + 60" class="ff__note ff-fade">9 dimensions</text>
          <text :x="D.x + 12" :y="D.y + 75" class="ff__note ff-fade">explains the grade,</text>
          <text :x="D.x + 12" :y="D.y + 90" class="ff__note ff-fade">never overturns it</text>
          <text :x="D.x - 12" :y="D.y + D.h + 26" class="ff__tag ff__tag--warn ff-fade" text-anchor="end">CODE CHECKS THE JUDGE</text>
          <text :x="K1.x + K1.w / 2" :y="K1.y + 25" class="ff__card ff-fade" text-anchor="middle">📄 judgement</text>
        </template>
      </g>

      <!-- ── second lane ── -->
      <g :style="fade('lane2')" class="ff-region">
        <g :ref="setLayer('lane2')" />
        <template v-if="at(7)">
          <text :x="L2.x + 16" :y="L2.y + 27" class="ff__row ff-fade">same fixture · another <tspan class="ff__badge">harness@model</tspan> → run → grade → count → judge</text>
          <text :x="K2.x + K2.w / 2" :y="K2.y + 21" class="ff__card ff-fade" text-anchor="middle">📄 judgement</text>
        </template>
      </g>

      <!-- ── fair race → compare → report → published ── -->
      <g :style="fade('fair')" class="ff-region">
        <g :ref="setLayer('fair')" />
        <template v-if="at(8)">
          <text :x="FR.x + 12" :y="FR.y + 22" class="ff__name ff-fade">fair race?</text>
          <text :x="FR.x + 12" :y="FR.y + 42" class="ff__note ff-fade">held · changed · moved</text>
        </template>
      </g>
      <g :style="fade('compare')" class="ff-region">
        <g :ref="setLayer('compare')" />
        <template v-if="at(9)">
          <text :x="CP.x + 12" :y="CP.y + 22" class="ff__name ff-fade">compare</text>
          <text :x="CP.x + 12" :y="CP.y + 42" class="ff__note ff-fade">2 diffs · 2 judgements</text>
          <text :x="R.x + 12" :y="R.y + 22" class="ff__name ff-fade">📊 report</text>
          <text :x="R.x + 12" :y="R.y + 42" class="ff__note ff-fade">verdict · spend earned?</text>
          <text :x="PB.x + 12" :y="PB.y + 22" class="ff__name ff-fade">🌐 pages site</text>
          <text :x="PB.x + 12" :y="PB.y + 42" class="ff__note ff-fade">orphan branch + matrix</text>
          <rect x="241" y="424" width="35" height="11" rx="1" class="ff__cell" />
        </template>
      </g>

      <!-- the story, travelling -->
      <g v-if="!focus" class="ff-bead" :style="{ transform: `translate(${beadAt[0]}px, ${beadAt[1]}px)` }">
        <circle r="13" class="ff-bead__halo" />
        <circle r="6.5" class="ff-bead__dot" />
      </g>
    </svg>

    <figcaption v-if="caption && !focus" class="ff__caption">
      <span class="ff__caption-n">{{ step }}</span>
      <span class="ff__caption-t">{{ captions[step][0] }}</span>
      <span class="ff__caption-c">{{ captions[step][1] }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.ff { margin: 0; width: 100%; }
.ff__svg { width: 100%; display: block; overflow: visible; }

.ff-region { transition: opacity 0.45s ease; }

.ff__title {
  fill: var(--ink-3);
  font-size: 11px;
  letter-spacing: 0.16em;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.ff__tag {
  fill: var(--ink-3);
  font-size: 9px;
  letter-spacing: 0.14em;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.ff__tag--warn { fill: var(--st-warn); }
.ff__tag--violet { fill: var(--s6); }
.ff__row {
  fill: var(--ink-2);
  font-size: 14px;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
}
.ff__row--key { fill: var(--st-warn); }
.ff__name {
  fill: var(--ink);
  font-size: 16px;
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
}
.ff__note {
  fill: var(--ink-2);
  font-size: 11.5px;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
}
.ff__chip {
  fill: var(--st-good);
  font-size: 13px;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
}
.ff__badge {
  fill: var(--s1);
  font-size: 12px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.ff__card {
  fill: var(--ink);
  font-size: 12px;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
}
.ff__icon { font-size: 20px; }

.ff__track { fill: var(--ctx-track); }
.ff__timer {
  fill: var(--s1);
  transform-box: fill-box;
  transform-origin: left center;
  transform: scaleX(0.8);
}
.ff__timer--run { animation: ff-timer 2.6s ease-out both; }
@keyframes ff-timer {
  from { transform: scaleX(0); }
  to { transform: scaleX(0.8); }
}

.ff__cell {
  fill: var(--st-good);
  animation: ff-cell 1.6s ease-in-out 0.6s 3 both;
}
@keyframes ff-cell {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

.ff-move { transition: transform 0.9s cubic-bezier(.5, 0, .2, 1); }

.ff-bead { transition: transform 0.9s cubic-bezier(.5, 0, .2, 1); }
.ff-bead__dot { fill: var(--s5); }
.ff-bead__halo {
  fill: var(--s5);
  opacity: 0.25;
  transform-box: fill-box;
  transform-origin: center;
  animation: ff-pulse 1.8s ease-in-out infinite;
}
@keyframes ff-pulse {
  0%, 100% { transform: scale(0.7); opacity: 0.35; }
  50% { transform: scale(1.25); opacity: 0.08; }
}

.ff__caption {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-top: 0.3rem;
  min-height: 1.6rem;
}
.ff__caption-n {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-size: 0.75rem;
  color: var(--s5);
}
.ff__caption-t {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.ff__caption-c {
  font-size: 1.15rem;
  color: var(--ink);
}
</style>

<!-- Unscoped: rough.js appends its <path> nodes imperatively, so they never
     receive the data-v-xxxx attribute a `scoped` block relies on to match. -->
<style>
@keyframes ff-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.ff-fade { animation: ff-fade 0.5s ease both; }
</style>
