<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { arrow, palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * The fixture as a git line: the commit the human started from (pre-PR) and
 * the human's merged change (at-PR), with what the two answer keys say at
 * each end, and the agent branching off the same starting point.
 *
 * Bind `step` to $clicks: 0 the two commits · 1 the hidden test row (red at
 * pre-PR, green at at-PR) · 2 the quality gate row (green at both) · 3 the
 * agent's branch from pre-PR.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 3 })

const W = 490
const H = 270
const PRE = 175
const AT = 405
const Y = 70

const layer = ref<SVGGElement>()
let shown = -1

function draw() {
  const p = palette()
  const fresh = props.step === shown + 1
  sketch(layer.value, (rc, add) => {
    const addAt = (n: number) => (node: SVGGElement) => {
      if (fresh && n === props.step) node.classList.add('fl-fade')
      add(node)
    }
    // history, then the two commits
    add(rc.line(20, Y, W - 20, Y, pencil(seedOf('fl-line'), { stroke: p.ink3 })))
    add(rc.circle(PRE, Y, 22, pencil(seedOf('fl-pre'), { stroke: p.s5, fill: p.surface, fillStyle: 'solid' })))
    add(rc.circle(AT, Y, 22, pencil(seedOf('fl-at'), { stroke: p.good, fill: p.surface, fillStyle: 'solid' })))
    arrow(rc, add, PRE + 18, Y - 26, AT - 18, Y - 26, seedOf('fl-pr'), p.ink3)
    // the agent's branch: same start, its own answer
    if (props.step >= 3) {
      const a = addAt(3)
      a(rc.line(PRE + 8, Y + 9, 290, 150, pencil(seedOf('fl-br'), { stroke: p.s1, strokeLineDash: [6, 5] })))
      a(rc.circle(302, 158, 20, pencil(seedOf('fl-ag'), { stroke: p.s1 })))
    }
  })
  shown = props.step
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="fl" role="img"
    aria-label="The human's pull request goes from the pre-PR commit to the at-PR commit. The hidden test fails at pre-PR and passes at at-PR; the quality gate passes at both. The agent branches from the same pre-PR commit.">
    <g ref="layer" />

    <text :x="PRE" :y="Y + 40" class="fl__name" text-anchor="middle">pre-PR</text>
    <text :x="PRE" :y="Y + 56" class="fl__note" text-anchor="middle">where the human started</text>
    <text :x="AT" :y="Y + 40" class="fl__name" text-anchor="middle">at-PR</text>
    <text :x="AT" :y="Y + 56" class="fl__note" text-anchor="middle">the human's merged change</text>
    <text :x="(PRE + AT) / 2" :y="Y - 34" class="fl__tag" text-anchor="middle">HUMAN-CODED, HUMAN-REVIEWED PR · THE ANSWER KEY</text>

    <template v-if="step >= 1">
      <text x="0" y="214" class="fl__row fl-fade">hidden test</text>
      <text :x="PRE" y="214" class="fl__res fl__res--bad fl-fade" text-anchor="middle">✗ red</text>
      <text :x="AT" y="214" class="fl__res fl__res--good fl-fade" text-anchor="middle">✓ green</text>
    </template>
    <template v-if="step >= 2">
      <text x="0" y="246" class="fl__row fl-fade">quality gate</text>
      <text :x="PRE" y="246" class="fl__res fl__res--good fl-fade" text-anchor="middle">✓ green</text>
      <text :x="AT" y="246" class="fl__res fl__res--good fl-fade" text-anchor="middle">✓ green</text>
    </template>
    <template v-if="step >= 3">
      <text x="322" y="156" class="fl__name fl__name--agent fl-fade">the agent</text>
      <text x="322" y="172" class="fl__note fl-fade">same start, its own answer</text>
    </template>
  </svg>
</template>

<style scoped>
.fl { width: 100%; display: block; overflow: visible; }
.fl__name {
  fill: var(--ink);
  font-size: 17px;
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
}
.fl__name--agent { fill: var(--s1); }
.fl__note {
  fill: var(--ink-3);
  font-size: 11px;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
}
.fl__tag {
  fill: var(--ink-3);
  font-size: 8.5px;
  letter-spacing: 0.12em;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
}
.fl__row {
  fill: var(--ink-2);
  font-size: 14px;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
}
.fl__res { font-size: 15px; font-family: var(--slidev-theme-fontFamily-sans, cursive); }
.fl__res--good { fill: var(--st-good); }
.fl__res--bad { fill: var(--st-crit); }
</style>

<!-- Unscoped: rough.js nodes never get the scoped data attribute. -->
<style>
@keyframes fl-fade { from { opacity: 0; } to { opacity: 1; } }
.fl-fade { animation: fl-fade 0.5s ease both; }
</style>
