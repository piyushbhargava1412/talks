<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { filled, hatched, palette, pencil, seedOf, sketch } from '../utils/sketch'

/**
 * The deck's motif: a hand-drawn balance scale weighing two harness versions.
 *
 * - open (title slide): the beam sways gently and the pivot carries a "?" —
 *   nobody has measured anything yet.
 * - settled (thank-you slide): the beam has come to rest, the pivot carries a
 *   tick, and a clipboard of evidence leans against the stand with the five
 *   promises from slide 6 ticked off in their own colours.
 *
 * The beam and the two pans are drawn level, in their own groups, and tilted
 * with CSS transforms: the beam rotates about the pivot and each pan only
 * translates, so the pans keep hanging straight down like real ones.
 */
const props = withDefaults(defineProps<{
  settled?: boolean
  left?: string
  right?: string
}>(), { settled: false, left: 'ver X', right: 'ver Y' })

const W = 460
const H = 380
const PX = 230 // pivot
const PY = 80
const L = 150 // half beam
const RIM = 190 // pan rim, measured with the beam level

// Settled tilt, in degrees (positive = right pan down).
const SETTLED = 13

const offset = (deg: number) => {
  const r = (deg * Math.PI) / 180
  return { dy: L * Math.sin(r), dx: L * (1 - Math.cos(r)) }
}

const settledStyle = computed(() => {
  const { dx, dy } = offset(SETTLED)
  return {
    beam: { transform: `rotate(${SETTLED}deg)` },
    left: { transform: `translate(${dx}px, ${-dy}px)` },
    right: { transform: `translate(${-dx}px, ${dy}px)` },
  }
})

const promiseTones = ['s1', 's3', 'crit', 's6', 's4']

const stand = ref<SVGGElement>()
const beam = ref<SVGGElement>()
const panL = ref<SVGGElement>()
const panR = ref<SVGGElement>()
const pivot = ref<SVGGElement>()
const board = ref<SVGGElement>()

function drawPan(target: SVGGElement | undefined, hx: number, tone: string, key: string, weightH: number) {
  const p = palette()
  sketch(target, (rc, add) => {
    add(rc.line(hx, PY + 6, hx - 52, RIM, pencil(seedOf(`${key}-s1`), { stroke: p.ink3, strokeWidth: 1.2 })))
    add(rc.line(hx, PY + 6, hx + 52, RIM, pencil(seedOf(`${key}-s2`), { stroke: p.ink3, strokeWidth: 1.2 })))
    add(rc.rectangle(hx - 22, RIM - weightH, 44, weightH, filled(tone, seedOf(`${key}-w`))))
    add(rc.path(`M ${hx - 60} ${RIM} Q ${hx} ${RIM + 50} ${hx + 60} ${RIM} Z`,
      hatched(tone, seedOf(`${key}-bowl`), { hachureGap: 6 })))
    add(rc.line(hx - 62, RIM, hx + 62, RIM, pencil(seedOf(`${key}-rim`), { stroke: tone, strokeWidth: 2 })))
  })
}

onMounted(() => {
  const p = palette()

  sketch(stand.value, (rc, add) => {
    add(rc.line(PX - 3, PY + 18, PX - 3, 334, pencil(seedOf('bs-post1'))))
    add(rc.line(PX + 3, PY + 18, PX + 3, 334, pencil(seedOf('bs-post2'))))
    add(rc.polygon([[PX - 70, 364], [PX + 70, 364], [PX + 40, 334], [PX - 40, 334]],
      hatched(p.ink3, seedOf('bs-foot'), { stroke: p.ink })))
    add(rc.line(PX - 120, 366, PX + 120, 366, pencil(seedOf('bs-ground'), { stroke: p.line })))
  })

  sketch(beam.value, (rc, add) => {
    add(rc.rectangle(PX - L, PY - 4, 2 * L, 8, pencil(seedOf('bs-beam'), { fill: p.ink3, fillStyle: 'solid' })))
    add(rc.circle(PX - L, PY + 6, 9, pencil(seedOf('bs-hookL'))))
    add(rc.circle(PX + L, PY + 6, 9, pencil(seedOf('bs-hookR'))))
  })

  drawPan(panL.value, PX - L, p.s1, 'bs-panL', 26)
  drawPan(panR.value, PX + L, p.s2, 'bs-panR', props.settled ? 40 : 26)

  sketch(pivot.value, (rc, add) => {
    add(rc.circle(PX, PY, 50, pencil(seedOf('bs-pivot'), {
      stroke: props.settled ? p.good : p.warn,
      strokeWidth: 2.2,
      fill: p.surface,
      fillStyle: 'solid',
    })))
  })

  if (props.settled) {
    sketch(board.value, (rc, add) => {
      add(rc.rectangle(34, 252, 104, 112, pencil(seedOf('bs-board'), { fill: p.track, fillStyle: 'solid' })))
      add(rc.rectangle(68, 245, 36, 14, pencil(seedOf('bs-clip'), { fill: p.ink3, fillStyle: 'solid' })))
      promiseTones.forEach((t, i) => {
        add(rc.line(76, 278 + i * 18, 124, 278 + i * 18, pencil(seedOf(`bs-row${i}`), { stroke: p.line, strokeWidth: 1.4 })))
      })
    })
  }
})
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="bs" :class="{ 'bs--open': !settled }" role="img"
    :aria-label="settled
      ? `A balance scale that has come to rest between Harness ${left} and Harness ${right}, with a clipboard of evidence ticking off all five promises.`
      : `A balance scale weighing Harness ${left} against Harness ${right}, with a question mark on the pivot.`">
    <g ref="stand" />

    <g ref="board" />
    <template v-if="settled">
      <text v-for="(t, i) in promiseTones" :key="t" x="48" :y="284 + i * 18" class="bs__tick"
        :style="{ fill: `var(--${t === 'crit' ? 'st-crit' : t})` }">✓</text>
    </template>

    <g class="bs__pan bs__pan--l" :style="settled ? settledStyle.left : undefined">
      <g ref="panL" />
      <text :x="PX - L" :y="RIM + 52" class="bs__kicker" text-anchor="middle">harness</text>
      <text :x="PX - L" :y="RIM + 78" class="bs__name" text-anchor="middle" style="fill: var(--s1)">{{ left }}</text>
    </g>
    <g class="bs__pan bs__pan--r" :style="settled ? settledStyle.right : undefined">
      <g ref="panR" />
      <text :x="PX + L" :y="RIM + 52" class="bs__kicker" text-anchor="middle">harness</text>
      <text :x="PX + L" :y="RIM + 78" class="bs__name" text-anchor="middle" style="fill: var(--s2)">{{ right }}</text>
    </g>

    <g class="bs__beam" :style="settled ? settledStyle.beam : undefined">
      <g ref="beam" />
    </g>

    <g ref="pivot" />
    <text :x="PX" :y="PY + 12" class="bs__mark" text-anchor="middle"
      :style="{ fill: settled ? 'var(--st-good)' : 'var(--st-warn)' }">{{ settled ? '✓' : '?' }}</text>
  </svg>
</template>

<style scoped>
.bs { width: 100%; height: auto; display: block; overflow: visible; }

.bs__beam { transform-origin: 230px 80px; }
.bs__beam, .bs__pan { transform-box: view-box; }

.bs__mark { font-family: var(--slidev-theme-fontFamily-serif, cursive); font-size: 34px; }
.bs__kicker {
  fill: var(--ink-3);
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.bs__name { font-family: var(--slidev-theme-fontFamily-serif, cursive); font-size: 26px; }
.bs__tick { font-family: var(--slidev-theme-fontFamily-sans, cursive); font-size: 15px; }

/* The open scale never settles: a slow sway between 3° and 10°, right pan
   down. Pan offsets are L·sinθ / L·(1−cosθ) at each keyframe's angle. */
.bs--open .bs__beam { animation: bs-beam 5.5s ease-in-out infinite; }
.bs--open .bs__pan--l { animation: bs-pan-l 5.5s ease-in-out infinite; }
.bs--open .bs__pan--r { animation: bs-pan-r 5.5s ease-in-out infinite; }

@keyframes bs-beam {
  0%, 100% { transform: rotate(3deg); }
  50% { transform: rotate(10deg); }
}
@keyframes bs-pan-l {
  0%, 100% { transform: translate(0.2px, -7.85px); }
  50% { transform: translate(2.28px, -26.05px); }
}
@keyframes bs-pan-r {
  0%, 100% { transform: translate(-0.2px, 7.85px); }
  50% { transform: translate(-2.28px, 26.05px); }
}

@media (prefers-reduced-motion: reduce) {
  .bs--open .bs__beam, .bs--open .bs__pan--l, .bs--open .bs__pan--r { animation: none; }
  .bs--open .bs__beam { transform: rotate(6deg); }
  .bs--open .bs__pan--l { transform: translate(0.82px, -15.68px); }
  .bs--open .bs__pan--r { transform: translate(-0.82px, 15.68px); }
}
</style>
