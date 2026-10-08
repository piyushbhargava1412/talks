<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { filled, palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * Where one arcus run's credits went, stage by stage, against the whole of a
 * vanilla run on the same ticket and model, drawn to one scale.
 *
 * Ticket B, both @opus-5.5. Figures are benchmark-runner's per-stage spend
 * (AIU) from the published comparison; stages are grouped the way the
 * comparison's phase table groups them.
 *
 * Bind `step` to $clicks: 0 the arcus bar · 1 the vanilla bar · 2 the vanilla
 * total carried up through the arcus bar.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 2 })

const W = 900
const H = 205
const X0 = 120
const PX = 1.0 // px per credit

const arcus = [
  { key: 'main', label: 'main session', sub: 'opus-5.5', value: 278.21, tone: 's5' },
  { key: 'orch', label: 'implement orchestrator', sub: 'opus-5', value: 270.11, tone: 's2' },
  { key: 'workers', label: 'workers ×5', sub: 'sonnet-5', value: 100.15, tone: 's3' },
  { key: 'review', label: 'review', sub: '4 agents', value: 82.97, tone: 's6' },
  { key: 'commit', label: '', sub: '', value: 9.13, tone: 'ink3' },
]
const ARCUS_TOTAL = 740.57
const VANILLA = 223.88

const A_Y = 40
const V_Y = 140
const BAR_H = 44

function starts() {
  let x = X0
  return arcus.map((s) => { const at = x; x += s.value * PX; return at })
}
const xs = starts()

const layer = ref<SVGGElement>()
let shown = -1

function draw() {
  const p = palette()
  const fresh = props.step === shown + 1
  sketch(layer.value, (rc, add) => {
    const at = (n: number) => (node: SVGGElement) => {
      if (fresh && n === props.step) node.classList.add('ss-fade')
      add(node)
    }
    arcus.forEach((s, i) => {
      add(rc.rectangle(xs[i], A_Y, s.value * PX, BAR_H, filled(p[s.tone], seedOf(`ss-${s.key}`), { strokeWidth: 1 })))
    })
    if (props.step >= 1) {
      at(1)(rc.rectangle(X0, V_Y, VANILLA * PX, BAR_H, filled(p.s1, seedOf('ss-vanilla'), { strokeWidth: 1 })))
    }
    if (props.step >= 2) {
      const x = X0 + VANILLA * PX
      at(2)(rc.line(x, V_Y + BAR_H, x, A_Y - 12, pencil(seedOf('ss-mark'), { stroke: p.warn, strokeLineDash: [6, 5] })))
    }
  })
  shown = props.step
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="ss" role="img"
    aria-label="One arcus run on Ticket B cost 741 credits: main session 278, implement orchestrator 270, five workers 100, review 83, commits 9. The whole vanilla run on the same ticket cost 224 credits — less than arcus's main session alone.">
    <g ref="layer" />

    <text :x="X0 - 14" :y="A_Y + 20" class="ss__row" text-anchor="end">arcus</text>
    <text :x="X0 - 14" :y="A_Y + 36" class="ss__sub" text-anchor="end">741 credits</text>
    <template v-for="(s, i) in arcus" :key="s.key">
      <template v-if="s.label">
        <text :x="xs[i] + 8" :y="A_Y + 20" class="ss__seg">{{ s.label }}</text>
        <text :x="xs[i] + 8" :y="A_Y + 35" class="ss__segsub">{{ Math.round(s.value / ARCUS_TOTAL * 100) }}% · {{ s.sub }}</text>
      </template>
    </template>
    <text :x="X0 + ARCUS_TOTAL * PX + 8" :y="A_Y + 28" class="ss__sub">commits</text>

    <template v-if="step >= 1">
      <text :x="X0 - 14" :y="V_Y + 20" class="ss__row ss-fade" text-anchor="end">vanilla</text>
      <text :x="X0 - 14" :y="V_Y + 36" class="ss__sub ss-fade" text-anchor="end">224 credits</text>
      <text :x="X0 + 8" :y="V_Y + 28" class="ss__seg ss-fade">the whole run · opus-5.5</text>
    </template>
    <text v-if="step >= 2" :x="X0 + VANILLA * PX + 10" :y="V_Y - 14" class="ss__warn ss-fade">the main session alone costs more than the entire vanilla run</text>
  </svg>
</template>

<style scoped>
.ss { width: 100%; display: block; overflow: visible; }
.ss__row { fill: var(--ink); font-size: 18px; font-family: var(--slidev-theme-fontFamily-serif, cursive); }
.ss__sub { fill: var(--ink-3); font-size: 11px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.ss__seg { fill: #fff; font-size: 13px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.ss__segsub { fill: rgba(255, 255, 255, 0.8); font-size: 10.5px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.ss__warn { fill: var(--st-warn); font-size: 13px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
</style>

<!-- Unscoped: rough.js nodes never get the scoped data attribute. -->
<style>
@keyframes ss-fade { from { opacity: 0; } to { opacity: 1; } }
.ss-fade { animation: ss-fade 0.5s ease both; }
</style>
