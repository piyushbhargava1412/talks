<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { palette, pencil, sketch, seedOf } from '../utils/sketch'

/** A hand-drawn box around whatever you slot into it. */
const props = withDefaults(defineProps<{
  /** stroke colour; defaults to chalk ink */
  color?: string
  /** optional solid fill behind the content */
  fill?: string
  /** distinct seed keeps each box's wobble stable and unique */
  seed?: string
  dashed?: boolean
}>(), { seed: 'box', dashed: false })

const host = ref<HTMLElement>()
const svg = ref<SVGSVGElement>()
let ro: ResizeObserver | undefined

function draw() {
  const el = host.value
  const s = svg.value
  if (!el || !s) return
  const w = el.clientWidth
  const h = el.clientHeight
  if (!w || !h) return
  s.setAttribute('viewBox', `0 0 ${w} ${h}`)
  sketch(s, (rc, add) => {
    add(rc.rectangle(3, 3, w - 6, h - 6, pencil(seedOf(props.seed), {
      stroke: props.color || palette().ink,
      strokeLineDash: props.dashed ? [8, 6] : undefined,
      ...(props.fill ? { fill: props.fill, fillStyle: 'solid' } : {}),
    })))
  })
}

onMounted(() => {
  draw()
  ro = new ResizeObserver(draw)
  if (host.value) ro.observe(host.value)
})
onBeforeUnmount(() => ro?.disconnect())
watch(() => [props.color, props.fill, props.seed, props.dashed], draw)
</script>

<template>
  <div ref="host" class="sb">
    <svg ref="svg" class="sb__svg" preserveAspectRatio="none" aria-hidden="true" />
    <div class="sb__body"><slot /></div>
  </div>
</template>

<style scoped>
.sb {
  position: relative;
  display: block;
}

.sb__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.sb__body {
  position: relative;
  padding: 0.85rem 1.1rem;
}
</style>
