<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * A hand-drawn ruler along the bottom edge: one tick per slide, a longer tick
 * every fifth, and the ticks already covered inked in. The talk measures
 * itself as it goes.
 */
const props = defineProps<{ page: number, total: number }>()

const W = 900
const H = 16
const layer = ref<SVGGElement>()

function draw() {
  const p = palette()
  const n = props.total
  const step = W / (n - 1)
  const at = (i: number) => (i - 1) * step
  sketch(layer.value, (rc, add) => {
    add(rc.line(0, H - 2, W, H - 2, pencil(seedOf('ruler-base'), { stroke: p.line, strokeWidth: 1.2, roughness: 0.8 })))
    add(rc.line(0, H - 2, at(props.page), H - 2, pencil(seedOf('ruler-done'), { stroke: p.ink3, strokeWidth: 1.4, roughness: 0.8 })))
    for (let i = 1; i <= n; i++) {
      const major = i % 5 === 0 || i === 1 || i === n
      const here = i === props.page
      const len = here ? 13 : major ? 8 : 4
      add(rc.line(at(i), H - 2, at(i), H - 2 - len, pencil(seedOf(`ruler-${i}`), {
        stroke: here ? p.warn : i < props.page ? p.ink3 : p.line,
        strokeWidth: here ? 2 : 1.2,
        roughness: 0.7,
      })))
    }
  })
}

onMounted(draw)
watch(() => [props.page, props.total], draw)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="ruler" preserveAspectRatio="none" aria-hidden="true">
    <g ref="layer" />
  </svg>
</template>

<style scoped>
.ruler {
  position: absolute;
  left: 2.6rem;
  right: 2.6rem;
  bottom: 0.45rem;
  width: calc(100% - 5.2rem);
  height: 16px;
  overflow: visible;
  pointer-events: none;
  opacity: 0.85;
}
</style>
