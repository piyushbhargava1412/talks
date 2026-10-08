<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { filled, hatched, palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * One model, one benchmark, two numbers: Opus 5.5 on Terminal-Bench 4.0 as
 * the vendor reported it, and as an independent evaluator measured it.
 */
const W = 440
const H = 150
const X0 = 150
const SCALE = 2.8 // px per percentage point

const bars = [
  { key: 'vendor', label: 'vendor-reported', sub: 'xhigh effort', value: 66.4, y: 26 },
  { key: 'indep', label: 'independent', sub: 'their own harness', value: 59.6, y: 84 },
]

const layer = ref<SVGGElement>()

onMounted(() => {
  const p = palette()
  sketch(layer.value, (rc, add) => {
    add(rc.line(X0, 10, X0, H - 14, pencil(seedOf('tb-axis'), { stroke: p.line })))
    bars.forEach((b, i) => {
      const w = b.value * SCALE
      add(rc.rectangle(X0, b.y, w, 30, i === 0
        ? filled(p.s1, seedOf(`tb-${b.key}`))
        : hatched(p.s1, seedOf(`tb-${b.key}`))))
    })
    // the gap, bracketed
    const x1 = X0 + bars[1].value * SCALE
    const x2 = X0 + bars[0].value * SCALE
    add(rc.line(x1, 128, x2, 128, pencil(seedOf('tb-gap'), { stroke: p.warn })))
    add(rc.line(x1, 122, x1, 134, pencil(seedOf('tb-gap1'), { stroke: p.warn })))
    add(rc.line(x2, 122, x2, 134, pencil(seedOf('tb-gap2'), { stroke: p.warn })))
  })
})
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="tb" role="img"
    aria-label="Opus 5.5 on Terminal-Bench 4.0: 66.4 percent as reported by the vendor at xhigh effort, 59.6 percent as measured independently — about seven points apart.">
    <g ref="layer" />
    <template v-for="b in bars" :key="b.key">
      <text :x="X0 - 12" :y="b.y + 14" class="tb__label" text-anchor="end">{{ b.label }}</text>
      <text :x="X0 - 12" :y="b.y + 28" class="tb__sub" text-anchor="end">{{ b.sub }}</text>
      <text :x="X0 + b.value * SCALE + 10" :y="b.y + 21" class="tb__value">{{ b.value }}%</text>
    </template>
    <text :x="X0 + 63 * SCALE" y="146" class="tb__gap" text-anchor="middle">~7 points</text>
  </svg>
</template>

<style scoped>
.tb { width: 100%; display: block; overflow: visible; }
.tb__label { fill: var(--ink); font-size: 15px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.tb__sub { fill: var(--ink-3); font-size: 10.5px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.tb__value { fill: var(--ink); font-size: 17px; font-family: var(--slidev-theme-fontFamily-serif, cursive); }
.tb__gap { fill: var(--st-warn); font-size: 12px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
</style>
