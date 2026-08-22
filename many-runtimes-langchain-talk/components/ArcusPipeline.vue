<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { arrow, palette, pencil, sketch, seedOf } from '../utils/sketch'

/**
 * The meta-skill's journey for one story: input, through the four ARCUS
 * roles, to a shipped pull request — including a real review loop, because
 * "changes requested" is the common case, not the exception. QA shows up
 * twice: writing the test plan, then reviewing the diff — same role, real
 * ARCUS pipeline (test_plan and code_review are both QA-persona stages).
 *
 * Story is drawn from the start (step 0) — it's the precondition, not
 * something the pipeline produces. Scaffold is the first real click: it's
 * the literal moment session-checkpoint.json and .arcus/specs/<ID>/ get
 * created (see scaffold's "Artifacts created" in the real pipeline docs) —
 * no persona runs it, it's a deterministic script, drawn in neutral ink
 * rather than one of the four persona colors.
 *
 * Vertical stack so it reads top-to-bottom in its own column, alongside the
 * checkpoint JSON and folder-state columns on the same slide.
 *
 * Bind `step` to $clicks: (0 story, always shown) 1 scaffold, 2 spec (Lead),
 * 3 plan (Architect), 4 test plan (QA), 5 implement (Developer), 6 review
 * round 1 (QA flags changes), 7 loop back to Developer, 8 review round 2
 * (approved), 9 pull request.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 9 })

const W = 420
const BOX_W = 300
const BOX_H = 46
const VGAP = 20
const STEP = BOX_H + VGAP
const X0 = 95
const Y0 = 10
const LOOP_X = 55

const boxes = [
  { key: 'story', name: 'Story', role: 'the input', revealAt: 0, dashed: true, color: () => palette().ink3 },
  { key: 'scaffold', name: 'Scaffold', role: 'Lucie', revealAt: 1, color: () => palette().ink3 },
  { key: 'spec', name: 'Spec', role: 'Angelina', revealAt: 2, color: () => palette().s1 },
  { key: 'plan', name: 'Plan', role: 'Angelina', revealAt: 3, color: () => palette().s2 },
  { key: 'testplan', name: 'Test Plan', role: 'Quinn', revealAt: 4, color: () => palette().s4 },
  { key: 'implement', name: 'Implement', role: 'Diana', revealAt: 5, color: () => palette().s3 },
  { key: 'review', name: 'Review', role: 'Quinn', revealAt: 6, color: () => reviewColor() },
  { key: 'pr', name: 'Pull Request', role: 'Lucie', revealAt: 9, color: () => palette().good },
]

const H = Y0 + boxes.length * STEP + 10

const reviewColor = () => (props.step >= 8 ? palette().good : palette().warn)
const reviewLabel = computed(() => {
  if (props.step >= 8) return 'Quinn · approved'
  if (props.step >= 6) return 'Quinn · round 1'
  return 'QA'
})

const layer = ref<SVGGElement>()

function boxY(i: number) { return Y0 + i * STEP }

/** rough.js redraws every shape from scratch on every step change (see
 * sketch()), so tagging *all* shapes with a fade-in animation would replay
 * it for already-visible boxes too. Only the shape(s) that just appeared
 * *this* step should visibly fade — everything from a prior step is added
 * plain, so its rebuild is visually a no-op. */
function draw() {
  sketch(layer.value, (rc, add) => {
    const addFor = (isNew: boolean) => isNew
      ? (node: SVGGElement) => { node.classList.add('ap-fade-in'); add(node) }
      : add

    boxes.forEach((b, i) => {
      if (props.step < b.revealAt) return
      const isNew = b.revealAt === props.step
      const boxAdd = addFor(isNew)
      const y = boxY(i)
      boxAdd(rc.rectangle(X0, y, BOX_W, BOX_H, pencil(seedOf(`ap-${b.key}`), {
        stroke: b.color(),
        strokeLineDash: b.dashed ? [7, 6] : undefined,
      })))
      if (i > 0 && props.step >= b.revealAt) {
        const prev = boxes[i - 1]
        if (props.step >= prev.revealAt) {
          const py = boxY(i - 1)
          arrow(rc, boxAdd, X0 + BOX_W / 2, py + BOX_H, X0 + BOX_W / 2, y, seedOf(`ap-a${i}`), palette().ink3)
        }
      }
    })

    // the feedback loop: Review flags changes, work goes back to Implement —
    // routed as a small loop to the left of the boxes.
    if (props.step >= 7) {
      const c = palette().warn
      const loopAdd = addFor(props.step === 7)
      const reviewY = boxY(6) + BOX_H / 2
      const implY = boxY(5) + BOX_H / 2
      loopAdd(rc.line(X0, reviewY, LOOP_X, reviewY, pencil(seedOf('ap-loop1'), { stroke: c, strokeLineDash: [6, 5] })))
      loopAdd(rc.line(LOOP_X, reviewY, LOOP_X, implY, pencil(seedOf('ap-loop2'), { stroke: c, strokeLineDash: [6, 5] })))
      arrow(rc, loopAdd, LOOP_X, implY, X0, implY, seedOf('ap-loop3'), c)
    }
  })
}

onMounted(draw)
watch(() => props.step, draw)
</script>

<template>
  <figure class="ap">
    <svg ref="svg" :viewBox="`0 0 ${W} ${H}`" class="ap__svg" role="img"
      aria-label="A story is scaffolded, then moves through Spec by the Lead, Plan by the Architect, Test Plan by QA, Implement by the Developer, and Review by QA — which loops back to Developer once before approving — ending as a pull request.">
      <g ref="layer" />

      <template v-for="(b, i) in boxes" :key="b.key">
        <template v-if="step >= b.revealAt">
          <text :x="X0 + BOX_W / 2" :y="boxY(i) + 20" class="ap__name ap-fade-in" text-anchor="middle">{{ b.name }}</text>
          <text :x="X0 + BOX_W / 2" :y="boxY(i) + 36" class="ap__role ap-fade-in" text-anchor="middle">
            {{ b.key === 'review' ? reviewLabel : b.role }}
          </text>
        </template>
      </template>

      <template v-if="step >= 7 && step < 9">
        <text :x="LOOP_X - 8" :y="(boxY(5) + boxY(6)) / 2 + BOX_H / 2 - 4"
          class="ap__loop-label ap-fade-in" text-anchor="end">changes requested</text>
        <text :x="LOOP_X - 8" :y="(boxY(5) + boxY(6)) / 2 + BOX_H / 2 + 10"
          class="ap__loop-label ap-fade-in" text-anchor="end">fix, round 2</text>
      </template>
    </svg>
  </figure>
</template>

<style scoped>
.ap { margin: 0; width: 100%; }
.ap__svg { width: 100%; display: block; overflow: visible; }

.ap__name {
  fill: var(--ink);
  font-size: 18px;
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
}

.ap__role {
  fill: var(--ink-3);
  font-size: 11px;
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ap__loop-label {
  fill: var(--st-warn);
  font-size: 11px;
  font-style: italic;
  font-family: var(--slidev-theme-fontFamily-sans, sans-serif);
}
</style>

<!-- Unscoped: rough.js appends its <path> nodes imperatively, so they never
     receive the data-v-xxxx attribute a `scoped` block relies on to match. -->
<style>
@keyframes ap-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.ap-fade-in {
  animation: ap-fade-in 0.4s ease;
}
</style>
