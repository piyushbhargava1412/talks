<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { filled, hatched, palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * What compaction actually does to a session.
 *
 * step 0 — the session so far, oldest turn on the left
 * step 1 — the window is full; the oldest span is marked for compaction
 * step 2+ — that span collapses into one lossy summary block
 *
 * The mechanism is summarisation, not truncation — the block does not vanish,
 * it gets flattened. That distinction is the point of the slide.
 *
 * Commentary lives in the SLIDE, not in here: text inside the SVG collided
 * with the strip and there is no layout engine in an SVG to prevent it.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 3 })

const W = 900
const H = 205
const TRACK_Y = 66
const TRACK_H = 58

/** the session, oldest first */
const turns = [
  { w: 92, label: 'brainstorm', slot: 's1' },
  { w: 78, label: 'spec', slot: 's1' },
  { w: 88, label: 'plan', slot: 's1' },
  { w: 66, label: 'decisions', slot: 's1' },
  { w: 120, label: '', slot: 's3' },
  { w: 96, label: '', slot: 's3' },
  { w: 134, label: '', slot: 's4' },
  { w: 108, label: '', slot: 's4' },
  { w: 92, label: '', slot: 's3' },
]
const COMPACTED = 4

const svg = ref<SVGSVGElement>()
const layer = ref<SVGGElement>()
const oldWidth = turns.slice(0, COMPACTED).reduce((a, t) => a + t.w + 4, 0)

function draw() {
  const c = palette()
  const s = props.step
  sketch(layer.value, (rc, add) => {
    add(rc.rectangle(20, TRACK_Y - 8, W - 40, TRACK_H + 16,
      pencil(seedOf('cs-frame'), { stroke: c.ink2 })))

    if (s < 2) {
      let x = 26
      turns.forEach((t, i) => {
        add(rc.rectangle(x, TRACK_Y, t.w, TRACK_H, filled(c[t.slot], seedOf(`cs-t${i}`))))
        x += t.w + 4
      })
      if (s >= 1) {
        add(rc.rectangle(24, TRACK_Y - 4, oldWidth, TRACK_H + 8,
          hatched(c.crit, seedOf('cs-mark'))))
      }
    } else {
      const sumW = 74
      add(rc.rectangle(26, TRACK_Y, sumW, TRACK_H, hatched(c.ink3, seedOf('cs-sum'))))
      let x = 26 + sumW + 4
      turns.slice(COMPACTED).forEach((t, i) => {
        add(rc.rectangle(x, TRACK_Y, t.w, TRACK_H, filled(c[t.slot], seedOf(`cs-k${i}`))))
        x += t.w + 4
      })
      // space reclaimed by the summary
      add(rc.rectangle(x + 4, TRACK_Y, W - 46 - x, TRACK_H,
        pencil(seedOf('cs-free'), { stroke: c.ink3, strokeLineDash: [7, 6] })))
    }
  })
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <figure class="cs">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="cs__svg" role="img"
      aria-label="Compaction summarises the oldest turns of a session into one lossy block, reclaiming space but flattening the early spec, plan and decisions.">
      <g ref="layer" />

      <text x="26" y="42" class="cs__axis">oldest turn</text>
      <text :x="W - 46" y="42" class="cs__axis" text-anchor="end">newest turn</text>

      <template v-if="step < 2">
        <text
          v-for="(t, i) in turns.slice(0, COMPACTED)" :key="t.label"
          :x="26 + turns.slice(0, i).reduce((a, p) => a + p.w + 4, 0) + t.w / 2"
          :y="TRACK_Y + TRACK_H + 36" class="cs__lab" text-anchor="middle"
        >{{ t.label }}</text>
      </template>

      <template v-else>
        <text x="63" :y="TRACK_Y + TRACK_H + 36" class="cs__lab" text-anchor="middle">summary</text>
        <text x="63" :y="TRACK_Y + TRACK_H + 58" class="cs__lab cs__lab--dim" text-anchor="middle">(lossy)</text>
      </template>
    </svg>
  </figure>
</template>

<style scoped>
.cs { margin: 0; width: 100%; }
.cs__svg { width: 100%; display: block; overflow: visible; }

.cs__axis {
  fill: var(--ink-3);
  font-size: 16px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}

.cs__lab {
  fill: var(--ink-2);
  font-size: 20px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.cs__lab--dim { fill: var(--ink-3); }
</style>
