<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { arrow, filled, hatched, palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * How context fills up across spec → plan → implement → review → PR.
 *
 * Two series per stage: the naive run (everything stays in one window) and the
 * handoff run (each stage writes its output to a file, the next stage starts
 * from that file). Bind `step` to $clicks to walk the pipeline one stage at a
 * time; set `showHandoff` to reveal the second series.
 *
 * Numbers are illustrative of the SHAPE, not measurements — swap in your own
 * from a real session if you want the slide to carry evidence.
 */
const props = withDefaults(defineProps<{
  /** how many stages are revealed */
  step?: number
  /** reveal the handoff series alongside the naive one */
  showHandoff?: boolean
  capacity?: number
}>(), { step: 5, showHandoff: false, capacity: 200000 })

const stages = [
  { name: 'spec', naive: 18000, handoff: 18000 },
  { name: 'plan', naive: 46000, handoff: 34000 },
  { name: 'implement', naive: 118000, handoff: 82000 },
  { name: 'review', naive: 172000, handoff: 54000 },
  { name: 'PR', naive: 214000, handoff: 21000 },
]

// geometry
const W = 900
const H = 320
const BASE = 244
const TOP = 46
const span = BASE - TOP

const colW = (W - 90) / stages.length
const x0 = 62
const barW = 30

const y = (v: number) => BASE - Math.min(v / props.capacity, 1) * span
const p = palette

const svg = ref<SVGSVGElement>()
const layer = ref<SVGGElement>()

const labels = computed(() =>
  stages.map((s, i) => ({
    ...s,
    cx: x0 + i * colW + colW / 2,
    revealed: i < props.step,
    over: s.naive > props.capacity,
  })),
)

function draw() {
  const c = p()
  sketch(layer.value, (rc, add) => {
    // baseline + capacity line
    add(rc.line(x0 - 12, BASE, W - 16, BASE, pencil(seedOf('pf-base'), { stroke: c.line })))
    add(rc.line(x0 - 12, TOP, W - 16, TOP, pencil(seedOf('pf-cap'), {
      stroke: c.crit, strokeWidth: 1.4, strokeLineDash: [9, 7],
    })))

    stages.forEach((s, i) => {
      if (i >= props.step) return
      const cx = x0 + i * colW + colW / 2
      const pair = props.showHandoff
      const naiveX = pair ? cx - barW - 4 : cx - barW / 2

      // naive column
      const capped = Math.min(s.naive, props.capacity)
      add(rc.rectangle(naiveX, y(capped), barW, BASE - y(capped),
        filled(c.s1, seedOf(`pf-n${i}`))))
      if (s.naive > props.capacity) {
        add(rc.rectangle(naiveX, TOP - 26, barW, 24, hatched(c.crit, seedOf(`pf-o${i}`))))
      }

      // handoff column
      if (pair) {
        add(rc.rectangle(cx + 4, y(s.handoff), barW, BASE - y(s.handoff),
          filled(c.s2, seedOf(`pf-h${i}`))))
      }

      // arrow to the next stage
      if (i < stages.length - 1 && i + 1 < props.step) {
        const ax = cx + colW / 2 - 16
        arrow(rc, add, ax - 10, BASE + 26, ax + 22, BASE + 26, seedOf(`pf-a${i}`), c.ink3)
      }
    })
  })
}

onMounted(draw)
watch(() => [props.step, props.showHandoff, props.capacity], draw)
</script>

<template>
  <figure class="pf">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="pf__svg" role="img"
      aria-label="Context usage across the spec, plan, implement, review and PR stages — naive versus handoff.">
      <g ref="layer" />

      <text :x="x0 - 18" :y="TOP + 4" class="pf__cap" text-anchor="end">window</text>
      <text :x="x0 - 18" :y="BASE + 4" class="pf__cap" text-anchor="end">0</text>

      <template v-for="(l, i) in labels" :key="l.name">
        <text v-if="l.revealed" :x="l.cx" :y="BASE + 30" class="pf__stage" text-anchor="middle">
          {{ l.name }}
        </text>
        <text
          v-if="l.revealed && i === step - 1" :x="l.cx" :y="TOP - 34"
          class="pf__val" :class="{ 'is-over': l.over }" text-anchor="middle"
        >{{ l.over ? 'overflow' : `${Math.round(l.naive / 1000)}K` }}</text>
      </template>
    </svg>

    <ul class="pf__legend">
      <li><span class="pf__key" style="background: var(--s1)" />one window, everything accumulates</li>
      <li v-if="showHandoff"><span class="pf__key" style="background: var(--s2)" />handoff files between stages</li>
    </ul>
  </figure>
</template>

<style scoped>
.pf { margin: 0; width: 100%; }
.pf__svg { width: 100%; display: block; overflow: visible; }

.pf__stage {
  fill: var(--ink);
  font-size: 26px;
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
}

.pf__cap {
  fill: var(--ink-3);
  font-size: 17px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}

.pf__val {
  fill: var(--ink);
  font-size: 23px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.pf__val.is-over { fill: var(--st-crit); }

.pf__legend {
  list-style: none;
  margin: 0.2rem 0 0;
  padding: 0;
  display: flex;
  gap: 1.8rem;
  font-size: 0.8rem;
  color: var(--ink-2);
}
.pf__legend > li {
  padding-left: 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.pf__legend > li::before { content: none; }
.pf__key { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }
</style>
