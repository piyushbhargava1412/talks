<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { filled, palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * ARCUS 6 vs ARCUS 7 (and vanilla), with each run split at the start of the
 * review: plan + implement on the left, review on the right, one shared scale.
 *
 * Totals over six runs (three stories × two models) from the ARCUS bench. The
 * split point is the first gate run, the same point in both versions; the main
 * session's credits before it are modelled from context size, so they are an
 * estimate, while wall time and subagent credits are exact.
 *
 * Bind `step` to $clicks: 0 the plan + implement panel · 1 the review panel.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 1 })

const W = 900
const H = 150
const LABEL_X = 100
const A_X = 120 // plan + implement panel
const B_X = 520 // review panel
const PX = 0.19 // px per credit, shared by both panels

const rows = [
  { key: 'a6', label: 'ARCUS 6', tone: 's1', impl: 881, implMin: 42, review: 255, y: 30 },
  { key: 'a7', label: 'ARCUS 7', tone: 's5', impl: 713, implMin: 35, review: 1652, y: 70 },
  { key: 'v', label: 'vanilla', tone: 'ink3', impl: 776, implMin: 37, review: 0, y: 110 },
]
const BAR_H = 26

const layer = ref<SVGGElement>()
let shown = -1

function draw() {
  const p = palette()
  const fresh = props.step === shown + 1
  sketch(layer.value, (rc, add) => {
    const at = (n: number) => (node: SVGGElement) => {
      if (fresh && n === props.step) node.classList.add('sp-fade')
      add(node)
    }
    rows.forEach((r) => {
      add(rc.rectangle(A_X, r.y, r.impl * PX, BAR_H, filled(p[r.tone], seedOf(`sp-i-${r.key}`), { strokeWidth: 1 })))
      if (props.step >= 1 && r.review) {
        at(1)(rc.rectangle(B_X, r.y, r.review * PX, BAR_H, filled(p[r.tone], seedOf(`sp-r-${r.key}`), { strokeWidth: 1 })))
      }
    })
    if (props.step >= 1) at(1)(rc.line(B_X - 22, 4, B_X - 22, H - 6, pencil(seedOf('sp-div'), { stroke: p.line })))
  })
  shown = props.step
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="sp" role="img"
    aria-label="Over six runs, up to the start of review: ARCUS 6 881 credits and 42 minutes, ARCUS 7 713 credits and 35 minutes, vanilla's whole run 776 credits and 37 minutes. The review: ARCUS 6 255 credits, ARCUS 7 1,652 credits; vanilla has no review stage.">
    <g ref="layer" />
    <text :x="A_X" y="12" class="sp__head">PLAN + IMPLEMENT</text>
    <text v-if="step >= 1" :x="B_X" y="12" class="sp__head sp-fade">REVIEW</text>

    <template v-for="r in rows" :key="r.key">
      <text :x="LABEL_X" :y="r.y + 18" class="sp__label" text-anchor="end">{{ r.label }}</text>
      <text :x="A_X + r.impl * PX + 8" :y="r.y + 18" class="sp__val">
        {{ r.impl.toLocaleString('en') }} cr · {{ r.implMin }} min<tspan v-if="r.key === 'a7'" class="sp__good"> · −19%</tspan><tspan v-if="r.key === 'v'" class="sp__dim"> (whole run)</tspan>
      </text>
      <template v-if="step >= 1">
        <text v-if="r.review" :x="B_X + r.review * PX + 8" :y="r.y + 18" class="sp__val sp-fade">{{ r.review.toLocaleString('en') }} cr</text>
        <text v-else :x="B_X" :y="r.y + 18" class="sp__dim sp-fade">no review stage at all</text>
      </template>
    </template>
  </svg>
</template>

<style scoped>
.sp { width: 100%; display: block; overflow: visible; }
.sp__head { fill: var(--ink-3); font-size: 10px; letter-spacing: 0.16em; font-family: var(--slidev-theme-fontFamily-mono, monospace); }
.sp__label { fill: var(--ink); font-size: 16px; font-family: var(--slidev-theme-fontFamily-serif, cursive); }
.sp__val { fill: var(--ink-2); font-size: 13px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.sp__good { fill: var(--st-good); }
.sp__dim { fill: var(--ink-3); font-size: 12px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
</style>

<!-- Unscoped: rough.js nodes never get the scoped data attribute. -->
<style>
@keyframes sp-fade { from { opacity: 0; } to { opacity: 1; } }
.sp-fade { animation: sp-fade 0.5s ease both; }
</style>
