<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * Schematic of the "lost in the middle" effect: retrieval reliability by
 * POSITION within the context, not by context size.
 *
 * DELIBERATELY UNITLESS — this is the shape of a well-replicated finding, not
 * a measurement. The axis has no numbers and the chip says "schematic". Swap
 * in real numbers from a paper or your own eval if you want it to carry
 * evidence rather than intuition.
 */
withDefaults(defineProps<{ title?: string }>(), {
  title: 'where the answer sits in the context',
})

const W = 620
const H = 260
const BASE = 200

const svg = ref<SVGSVGElement>()
const layer = ref<SVGGElement>()

onMounted(() => {
  const c = palette()
  sketch(layer.value, (rc, add) => {
    add(rc.line(60, BASE, 560, BASE, pencil(seedOf('rc-base'), { stroke: c.line })))
    add(rc.curve(
      [[60, 46], [180, 74], [310, 168], [440, 132], [560, 62]],
      pencil(seedOf('rc-line'), { stroke: c.s1, strokeWidth: 2.6, roughness: 1.2 }),
    ))
    // anchor the dip so "middle" is unambiguous
    add(rc.line(310, 168, 310, BASE, pencil(seedOf('rc-guide'), {
      stroke: c.ink3, strokeWidth: 1.2, strokeLineDash: [6, 6],
    })))
    for (const [cx, cy] of [[60, 46], [310, 168], [560, 62]] as const) {
      add(rc.circle(cx, cy, 11, pencil(seedOf(`rc-d${cx}`), {
        stroke: c.s1, fill: c.s1, fillStyle: 'solid',
      })))
    }
  })
})
</script>

<template>
  <figure class="rc">
    <figcaption class="rc__head">
      <span class="rc__title">{{ title }}</span>
      <span class="rc__chip">schematic · shape only</span>
    </figcaption>

    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="rc__svg" role="img"
      aria-label="Recall is high at the start of the context, drops through the middle, and partly recovers at the end.">
      <g ref="layer" />
      <text x="26" y="120" class="rc__axis" transform="rotate(-90 26 120)" text-anchor="middle">recall</text>
      <text x="60" y="226" class="rc__lab">start</text>
      <text x="310" y="226" class="rc__lab" text-anchor="middle">middle</text>
      <text x="560" y="226" class="rc__lab" text-anchor="end">end</text>
      <text x="310" y="192" class="rc__note" text-anchor="middle">buried</text>
    </svg>
  </figure>
</template>

<style scoped>
.rc { margin: 0; width: 100%; }

.rc__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.4rem;
}
.rc__title { font-size: 0.88rem; color: var(--ink-2); }
.rc__chip {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-size: 0.58rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--ink-3);
  border: 1px solid var(--ctx-line);
  border-radius: 999px;
  padding: 0.12rem 0.5rem;
  white-space: nowrap;
}

.rc__svg { width: 100%; display: block; overflow: visible; }

.rc__lab,
.rc__axis {
  fill: var(--ink-3);
  font-size: 17px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.rc__axis { letter-spacing: 0.14em; text-transform: uppercase; }

.rc__note {
  fill: var(--ink-2);
  font-size: 19px;
  font-style: italic;
}
</style>
