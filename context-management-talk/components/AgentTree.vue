<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { arrow, filled, palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * The nesting the glossary slide needs: harness → session → lead agent →
 * subagents → nested subagent. The point of the picture is that every box
 * with a bar under it owns a SEPARATE context window.
 *
 * Bind `level` to $clicks: 1 harness, 2 session, 3 lead, 4 subagents,
 * 5 nested subagent.
 *
 * Type sizes are in viewBox units, which render at roughly 0.8 CSS px each —
 * so everything here is deliberately larger than it looks in the source.
 */
const props = withDefaults(defineProps<{ level?: number }>(), { level: 5 })

const W = 900
const H = 440
const BOX_H = 92

const boxes = {
  lead: { x: 310, y: 98, w: 280 },
  sub1: { x: 95, y: 250, w: 230 },
  sub2: { x: 345, y: 250, w: 230 },
  nested: { x: 620, y: 250, w: 230 },
}

const svg = ref<SVGSVGElement>()
const layer = ref<SVGGElement>()

/** a labelled box with a little context bar along its bottom edge */
function unit(
  rc: any, add: (n: SVGGElement) => void,
  b: { x: number; y: number; w: number },
  key: string, color: string, fillPct: number,
) {
  add(rc.rectangle(b.x, b.y, b.w, BOX_H, pencil(seedOf(`at-${key}`), { stroke: color })))
  const by = b.y + BOX_H - 24
  add(rc.rectangle(b.x + 14, by, b.w - 28, 12, pencil(seedOf(`at-${key}-t`), { stroke: palette().ink3 })))
  if (fillPct > 0) {
    add(rc.rectangle(b.x + 15, by + 1.5, (b.w - 30) * fillPct, 9, filled(color, seedOf(`at-${key}-f`))))
  }
}

function draw() {
  const c = palette()
  const L = props.level
  sketch(layer.value, (rc, add) => {
    if (L >= 1) {
      add(rc.rectangle(8, 8, W - 16, 392, pencil(seedOf('at-harness'), {
        stroke: c.ink3, strokeLineDash: [11, 9],
      })))
    }
    if (L >= 2) {
      add(rc.rectangle(30, 46, W - 60, 330, pencil(seedOf('at-session'), { stroke: c.ink2 })))
    }
    if (L >= 3) unit(rc, add, boxes.lead, 'lead', c.s1, 0.62)
    if (L >= 4) {
      unit(rc, add, boxes.sub1, 'sub1', c.s3, 0.3)
      unit(rc, add, boxes.sub2, 'sub2', c.s3, 0.24)
      arrow(rc, add, 400, 196, 250, 242, seedOf('at-a1'), c.ink3)
      arrow(rc, add, 470, 196, 462, 242, seedOf('at-a2'), c.ink3)
    }
    if (L >= 5) {
      unit(rc, add, boxes.nested, 'nested', c.s4, 0.18)
      arrow(rc, add, 580, 288, 614, 288, seedOf('at-a3'), c.ink3)
    }
  })
}

onMounted(draw)
watch(() => props.level, draw)
</script>

<template>
  <figure class="at">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="at__svg" role="img"
      aria-label="A harness contains a session, which contains a lead agent that dispatches subagents, one of which dispatches a nested subagent. Each agent has its own context window.">
      <g ref="layer" />

      <text v-if="level >= 1" x="28" y="34" class="at__tag">
        HARNESS — Claude Code · Copilot CLI · VS Code · OpenCode
      </text>
      <text v-if="level >= 2" x="50" y="76" class="at__tag">
        SESSION — one conversation, one budget
      </text>

      <template v-if="level >= 3">
        <text :x="boxes.lead.x + boxes.lead.w / 2" :y="boxes.lead.y + 34"
          class="at__name" text-anchor="middle">lead agent</text>
        <text :x="boxes.lead.x + boxes.lead.w / 2" :y="boxes.lead.y + 57"
          class="at__sub" text-anchor="middle">the one you talk to</text>
      </template>

      <template v-if="level >= 4">
        <template v-for="k in ['sub1', 'sub2']" :key="k">
          <text :x="boxes[k].x + boxes[k].w / 2" :y="boxes[k].y + 34"
            class="at__name" text-anchor="middle">subagent</text>
          <text :x="boxes[k].x + boxes[k].w / 2" :y="boxes[k].y + 57"
            class="at__sub" text-anchor="middle">its own window</text>
        </template>
      </template>

      <template v-if="level >= 5">
        <text :x="boxes.nested.x + boxes.nested.w / 2" :y="boxes.nested.y + 34"
          class="at__name" text-anchor="middle">nested subagent</text>
        <text :x="boxes.nested.x + boxes.nested.w / 2" :y="boxes.nested.y + 57"
          class="at__sub" text-anchor="middle">its own window again</text>
      </template>

      <text v-if="level >= 4" x="450" y="428" class="at__note" text-anchor="middle">
        every bar is a separate budget — only the result comes back up
      </text>
    </svg>
  </figure>
</template>

<style scoped>
.at { margin: 0; width: 100%; }
.at__svg { width: 100%; display: block; overflow: visible; }

.at__tag {
  fill: var(--ink-3);
  font-size: 17px;
  letter-spacing: 0.11em;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}

.at__name {
  fill: var(--ink);
  font-size: 30px;
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
}

.at__sub {
  fill: var(--ink-3);
  font-size: 16px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}

.at__note {
  fill: var(--ink-2);
  font-size: 23px;
  font-style: italic;
  font-family: var(--slidev-theme-fontFamily-sans, sans-serif);
}
</style>
