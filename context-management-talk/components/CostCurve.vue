<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * Cumulative INPUT tokens across a 40-turn agentic session.
 *
 * The arithmetic is deliberately checkable on stage: the model is stateless,
 * so every turn re-sends the whole context. Cumulative input = the sum of the
 * context size at each turn.
 *
 *   naive      — context grows 5K → 200K linearly; cumulative ≈ 40 × 102.5K
 *   engineered — context held flat at ~35K;        cumulative  = 40 × 35K
 *
 * Multiply by the model's input rate for the money figure. Output tokens are
 * a separate, much smaller line — this chart is only the input side.
 */
const props = withDefaults(defineProps<{
  turns?: number
  /** 1 = naive only · 2 = both lines + legend · 3 = also reveal the ratio callout */
  series?: number
}>(), { turns: 40, series: 3 })

const W = 900
const H = 296
const L = 78
const R = W - 30
const TOP = 26
const BASE = 230

const START_K = 5
const END_K = 200
const FLAT_K = 35

const naive = computed(() => {
  const out: number[] = [0]
  let sum = 0
  for (let n = 1; n <= props.turns; n++) {
    sum += START_K + ((END_K - START_K) * n) / props.turns
    out.push(sum)
  }
  return out
})
const engineered = computed(() =>
  Array.from({ length: props.turns + 1 }, (_, n) => n * FLAT_K),
)

const maxY = computed(() => Math.max(...naive.value) * 1.06)
const x = (n: number) => L + (n / props.turns) * (R - L)
const y = (v: number) => BASE - (v / maxY.value) * (BASE - TOP)

const fmtM = (k: number) => `${(k / 1000).toFixed(2)}M`
const naiveTotal = computed(() => naive.value[props.turns])
const engTotal = computed(() => engineered.value[props.turns])
const ratio = computed(() => (naiveTotal.value / engTotal.value).toFixed(1))

const svg = ref<SVGSVGElement>()
const layer = ref<SVGGElement>()

function draw() {
  const c = palette()
  sketch(layer.value, (rc, add) => {
    add(rc.line(L, BASE, R, BASE, pencil(seedOf('cc-x'), { stroke: c.line })))
    add(rc.line(L, TOP, L, BASE, pencil(seedOf('cc-y'), { stroke: c.line })))

    if (props.series >= 2) {
      add(rc.linearPath(
        engineered.value.map((v, n) => [x(n), y(v)] as [number, number]),
        pencil(seedOf('cc-eng'), { stroke: c.s2, strokeWidth: 2.4, roughness: 1.1 }),
      ))
    }
    add(rc.linearPath(
      naive.value.map((v, n) => [x(n), y(v)] as [number, number]),
      pencil(seedOf('cc-naive'), { stroke: c.s1, strokeWidth: 2.4, roughness: 1.1 }),
    ))
  })
}

onMounted(draw)
watch(() => [props.series, props.turns], draw)
</script>

<template>
  <figure class="cc">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="cc__svg" role="img"
      aria-label="Cumulative input tokens over 40 turns: the naive run curves upward to about 4.1 million, the engineered run stays linear at about 1.4 million.">
      <g ref="layer" />

      <text :x="L - 12" :y="TOP + 6" class="cc__tick" text-anchor="end">{{ fmtM(maxY) }}</text>
      <text :x="L - 12" :y="BASE + 4" class="cc__tick" text-anchor="end">0</text>
      <text :x="L" :y="BASE + 26" class="cc__tick">turn 1</text>
      <text :x="R" :y="BASE + 26" class="cc__tick" text-anchor="end">turn {{ turns }}</text>
      <text x="20" :y="(TOP + BASE) / 2" class="cc__axis"
        :transform="`rotate(-90 20 ${(TOP + BASE) / 2})`" text-anchor="middle">
        cumulative input tokens
      </text>

      <!-- selective direct labels: endpoints only -->
      <text :x="R - 6" :y="y(naiveTotal) - 14" class="cc__end" text-anchor="end">
        {{ fmtM(naiveTotal) }}
      </text>
      <text v-if="series >= 2" :x="R - 6" :y="y(engTotal) - 14" class="cc__end" text-anchor="end">
        {{ fmtM(engTotal) }}
      </text>
    </svg>

    <div class="cc__foot">
      <ul class="cc__legend">
        <li><span class="cc__key" style="background: var(--s1)" />naive — context keeps growing</li>
        <li v-if="series >= 2"><span class="cc__key" style="background: var(--s2)" />engineered — context held flat</li>
      </ul>
      <p v-if="series >= 3" class="cc__ratio">
        <span class="metric">{{ ratio }}×</span> the input tokens, for the same work
      </p>
    </div>
  </figure>
</template>

<style scoped>
.cc { margin: 0; width: 100%; }
.cc__svg { width: 100%; display: block; overflow: visible; }

.cc__tick,
.cc__axis {
  fill: var(--ink-3);
  font-size: 17px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.cc__axis { letter-spacing: 0.1em; }

.cc__end {
  fill: var(--ink);
  font-size: 23px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}

.cc__foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 0.1rem;
}

.cc__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.6rem;
  font-size: 0.8rem;
  color: var(--ink-2);
}
.cc__legend > li {
  padding-left: 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.cc__legend > li::before { content: none; }
.cc__key { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

.cc__ratio {
  margin: 0;
  font-size: 0.92rem;
  color: var(--ink-2);
  white-space: nowrap;
}
</style>
