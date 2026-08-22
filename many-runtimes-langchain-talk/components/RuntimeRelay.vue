<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { arrow, palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * The centerpiece diagram: a real, specific night on the Step Tracker
 * story. Not "OpenCode can talk to either model" (a branch) — this is what
 * actually happened, in order: Claude's clock ran out, so did Copilot's,
 * so did the free API's daily tokens, so the last resort was the model
 * sitting on the presenter's own laptop. A cascade, not a choice.
 *
 * Bind `step` to $clicks: 1 Claude, 2 Copilot, 3 OpenCode + DeepSeek V4
 * Flash (free), 4 OpenCode + local Qwen3.8-27B via LM Studio.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 4 })

const W = 1160
const H = 210
const BOX_W = 250
const BOX_H = 112
const GAP = 40
const STEP = BOX_W + GAP
const X0 = 20
const Y = 60

const stops = [
  { key: 'claude', host: 'Claude', model: 'Opus 5· Sonnet 5', status: '5h clock: buzzer', color: () => palette().s1 },
  { key: 'claude', host: 'Claude', model: 'Opus 5· Sonnet 5', status: 'weekly cap: also hit', color: () => palette().s2 },
  { key: 'opencode1', host: 'OpenCode', model: 'DeepSeek V4 Flash · free', status: 'daily tokens: gone', color: () => palette().s4 },
  { key: 'opencode2', host: 'OpenCode', model: 'Qwen3.8-27B · LM Studio', status: 'local, free, takes over laptop', color: () => palette().good },
]

const layer = ref<SVGGElement>()

function stopX(i: number) { return X0 + i * STEP }

/** rough.js redraws every shape from scratch on every step change (see
 * sketch()), so tagging *all* shapes with a fade-in animation would replay
 * it for already-visible stops too. Only the stop that just appeared this
 * exact step should visibly fade in. */
function draw() {
  const c = palette()
  sketch(layer.value, (rc, add) => {
    stops.forEach((s, i) => {
      if (props.step < i + 1) return
      const isNew = i + 1 === props.step
      const stopAdd = isNew
        ? (node: SVGGElement) => { node.classList.add('rr-fade-in'); add(node) }
        : add
      const x = stopX(i)
      stopAdd(rc.rectangle(x, Y, BOX_W, BOX_H, pencil(seedOf(`rr-${s.key}`), { stroke: s.color() })))
      if (i > 0 && props.step >= i) {
        const px = stopX(i - 1)
        arrow(rc, stopAdd, px + BOX_W, Y + BOX_H / 2, x, Y + BOX_H / 2, seedOf(`rr-a${i}`), c.ink3)
      }
    })
  })
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <figure class="rr">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="rr__svg" role="img"
      aria-label="One story's state handed off in sequence from Claude to Copilot to OpenCode with DeepSeek V4 Flash to OpenCode with a local Qwen model, as each runtime's usage limit is hit in turn.">
      <g ref="layer" />

      <template v-for="(s, i) in stops" :key="s.key">
        <template v-if="step >= i + 1">
          <text :x="stopX(i) + BOX_W / 2" :y="Y + (s.model ? 30 : 42)" class="rr__name rr-fade-in" text-anchor="middle">{{ s.host }}</text>
          <text v-if="s.model" :x="stopX(i) + BOX_W / 2" :y="Y + 50" class="rr__model rr-fade-in" text-anchor="middle">{{ s.model }}</text>
          <text :x="stopX(i) + BOX_W / 2" :y="Y + BOX_H - 16" class="rr__sub rr-fade-in" text-anchor="middle">{{ s.status }}</text>
        </template>
      </template>

      <text v-if="step >= 4" :x="W / 2" :y="Y - 20" class="rr__baton rr-fade-in" text-anchor="middle">
        whack-a-limit: three hosts, zero lost work
      </text>
    </svg>
  </figure>
</template>

<style scoped>
.rr { margin: 0; width: 100%; }
.rr__svg { width: 100%; display: block; overflow: visible; }

.rr__name {
  fill: var(--ink);
  font-size: 24px;
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
}

.rr__model {
  fill: var(--ink-2);
  font-size: 11px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  letter-spacing: 0.02em;
}

.rr__sub {
  fill: var(--ink-3);
  font-size: 13px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}

.rr__baton {
  fill: var(--ink-2);
  font-size: 15px;
  font-style: italic;
  font-family: var(--slidev-theme-fontFamily-sans, sans-serif);
}
</style>

<!-- Unscoped: rough.js appends its <path> nodes imperatively, so they never
     receive the data-v-xxxx attribute a `scoped` block relies on to match. -->
<style>
@keyframes rr-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.rr-fade-in {
  animation: rr-fade-in 0.4s ease;
}
</style>
