<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * A harness as layers around a model: what ships is the whole onion, not the
 * centre. Bind `step` to $clicks: 0 the model alone, then one layer per click
 * out to the budget that bounds everything (4).
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 4 })

const W = 480
const H = 320
const CX = 240
const CY = 168

const rings = [
  { key: 'model', label: 'the model', rx: 62, ry: 36, tone: 's5', at: 0 },
  { key: 'agents', label: 'agents & skills', rx: 112, ry: 68, tone: 's1', at: 1 },
  { key: 'prompts', label: 'prompts & rules', rx: 160, ry: 99, tone: 's3', at: 2 },
  { key: 'gates', label: 'gates & reviews', rx: 204, ry: 128, tone: 's4', at: 3 },
  { key: 'budget', label: 'budget: time · credits', rx: 234, ry: 154, tone: 'ink3', at: 4 },
]

const layer = ref<SVGGElement>()
let shown = -1

function draw() {
  const p = palette()
  const fresh = props.step === shown + 1
  sketch(layer.value, (rc, add) => {
    rings.forEach((r) => {
      if (props.step < r.at) return
      const node = rc.ellipse(CX, CY, r.rx * 2, r.ry * 2, pencil(seedOf(`ho-${r.key}`), {
        stroke: p[r.tone],
        strokeLineDash: r.key === 'budget' ? [8, 6] : undefined,
      }))
      if (fresh && r.at === props.step) node.classList.add('ho-fade')
      add(node)
    })
  })
  shown = props.step
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="ho" role="img"
    aria-label="A harness drawn as layers around a model: agents and skills, prompts and rules, gates and reviews, and a budget of time and credits around everything.">
    <g ref="layer" />
    <template v-for="r in rings" :key="r.key">
      <text v-if="step >= r.at" :x="CX" :y="r.key === 'model' ? CY + 6 : r.key === 'budget' ? CY + r.ry - 9 : CY - r.ry + 20"
        :class="['ho__label', `ho__label--${r.key}`, 'ho-fade']" text-anchor="middle">{{ r.label }}</text>
    </template>
  </svg>
</template>

<style scoped>
.ho { width: 100%; display: block; overflow: visible; }
.ho__label { fill: var(--ink-2); font-size: 14px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.ho__label--model { fill: var(--ink); font-size: 18px; }
.ho__label--budget { fill: var(--ink-3); font-size: 12px; }
</style>

<!-- Unscoped: rough.js nodes never get the scoped data attribute. -->
<style>
@keyframes ho-fade { from { opacity: 0; } to { opacity: 1; } }
.ho-fade { animation: ho-fade 0.5s ease both; }
</style>
