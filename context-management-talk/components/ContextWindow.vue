<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { filled, hatched, palette, pencil, sketch, seedOf, slot as slotColor } from '../utils/sketch'

/**
 * The deck's running metaphor: one context window drawn as a token budget.
 * Segments reveal progressively (bind `visible` to `$clicks`) so the same
 * component carries a click-by-click build and a finished before/after.
 */
interface Segment {
  label: string
  tokens: number
  /** categorical slot 1-5; defaults to position */
  slot?: number
  note?: string
}

const props = withDefaults(defineProps<{
  segments: Segment[]
  capacity?: number
  visible?: number
  title?: string
  subtitle?: string
  legend?: boolean
  compact?: boolean
  /** label drawn in the unused space */
  freeLabel?: string
  /**
   * Tokens the harness reserves for autocompaction. Drawn hatched at the RIGHT
   * end of the bar: it is part of the advertised window but you never get to
   * use it, so the real ceiling is capacity - buffer.
   */
  buffer?: number
  bufferLabel?: string
}>(), {
  capacity: 200000,
  visible: 99,
  title: 'Context window',
  subtitle: '',
  legend: true,
  compact: false,
  freeLabel: 'free',
  buffer: 0,
  bufferLabel: 'autocompact buffer',
})

const W = 900
const barH = computed(() => (props.compact ? 40 : 58))

const shown = computed(() => props.segments.filter((_, i) => i < props.visible))
const used = computed(() => shown.value.reduce((a, s) => a + s.tokens, 0))
const usedPct = computed(() => (used.value / props.capacity) * 100)
const bufferPct = computed(() => (props.buffer / props.capacity) * 100)
/** what you can actually fill */
const usable = computed(() => props.capacity - props.buffer)
const over = computed(() => used.value > usable.value)

const fmt = (n: number) => n.toLocaleString('en-US')
const pctLabel = (n: number) => (n < 1 ? `${n.toFixed(1)}%` : `${Math.round(n)}%`)

const svg = ref<SVGSVGElement>()

function draw() {
  const p = palette()
  const H = barH.value
  sketch(svg.value, (rc, add) => {
    // the window itself
    add(rc.rectangle(2, 2, W - 4, H, pencil(seedOf('cw-frame'), { stroke: p.ink2 })))

    let x = 3
    props.segments.forEach((s, i) => {
      if (i >= props.visible) return
      const w = (s.tokens / props.capacity) * (W - 6)
      if (w < 1.2) {
        // Too thin to draw as a box — a tick mark keeps it visible.
        add(rc.line(x, 5, x, H - 1, pencil(seedOf(`cw-tick${i}`), {
          stroke: slotColor(s.slot ?? i + 1),
          strokeWidth: 2.6,
        })))
      } else {
        add(rc.rectangle(x, 4, w, H - 6, filled(slotColor(s.slot ?? i + 1), seedOf(`cw-seg${i}`))))
      }
      x += w + 3
    })

    // the reserved autocompact buffer, pinned to the right edge
    if (props.buffer > 0) {
      const bw = (props.buffer / props.capacity) * (W - 6)
      add(rc.rectangle(W - 3 - bw, 4, bw, H - 6, hatched(p.warn, seedOf('cw-buf'))))
    }

    // overflow past the usable ceiling
    if (over.value) {
      add(rc.rectangle(W - 4, 4, 46, H - 6, hatched(p.crit, seedOf('cw-over'))))
    }
  })
}

onMounted(draw)
watch(() => [props.visible, props.segments, props.capacity, props.compact], draw, { deep: true })
</script>

<template>
  <figure class="cw">
    <figcaption class="cw__head">
      <span class="cw__title">
        {{ title }}<em v-if="subtitle">{{ subtitle }}</em>
      </span>
      <span class="cw__readout" :class="{ 'is-over': over }">
        <b>{{ fmt(used) }}</b> / {{ fmt(capacity) }}
        <i>{{ pctLabel(usedPct) }}</i>
      </span>
    </figcaption>

    <div class="cw__wrap">
      <svg
        ref="svg" class="cw__svg" :viewBox="`0 0 ${W} ${barH + 6}`"
        preserveAspectRatio="none" role="img"
        :aria-label="buffer > 0
          ? `${fmt(used)} of ${fmt(capacity)} tokens used, with ${fmt(buffer)} reserved as an autocompact buffer`
          : `${fmt(used)} of ${fmt(capacity)} tokens used`"
      />
      <span
        v-if="!over && usedPct < 88 && freeLabel" class="cw__free"
        :style="{ left: `calc(${Math.min(usedPct, 100)}% + 0.6rem)` }"
      >{{ freeLabel }}</span>
      <span
        v-if="buffer > 0 && bufferLabel" class="cw__buf"
        :style="{ right: `calc(${bufferPct}% + 0.6rem)` }"
      >{{ bufferLabel }} →</span>
    </div>

    <ul v-if="legend" class="cw__legend">
      <li
        v-for="(s, i) in segments" :key="s.label"
        :class="{ 'is-hidden': i >= visible }"
      >
        <span class="cw__swatch" :style="{ background: `var(--s${s.slot ?? i + 1})` }" />
        <span class="cw__label">{{ s.label }}<em v-if="s.note">{{ s.note }}</em></span>
        <span class="cw__val">{{ fmt(s.tokens) }}</span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.cw { margin: 0; width: 100%; }

.cw__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.4rem;
}

.cw__title { font-size: 0.92rem; color: var(--ink-2); }
.cw__title em { font-style: normal; color: var(--ink-3); margin-left: 0.5rem; }

.cw__readout {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-variant-numeric: tabular-nums;
  font-size: 0.72rem;
  color: var(--ink-3);
  white-space: nowrap;
}
.cw__readout b { color: var(--ink); font-weight: 500; }
.cw__readout i { font-style: normal; margin-left: 0.5em; color: var(--ink-2); }
.cw__readout.is-over b,
.cw__readout.is-over i { color: var(--st-crit); }

.cw__wrap { position: relative; }
.cw__svg { width: 100%; display: block; overflow: visible; }

.cw__free,
.cw__buf {
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  font-size: 0.72rem;
  color: var(--ink-3);
  white-space: nowrap;
  pointer-events: none;
}

.cw__buf { color: var(--st-warn); }

/* legend — the dependable identity channel, always present */
.cw__legend {
  list-style: none;
  margin: 0.7rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.22rem;
}
.cw__legend > li {
  display: grid;
  grid-template-columns: 11px 1fr auto;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.82rem;
  padding-left: 0;
  margin-bottom: 0;
  transition: opacity 260ms ease;
}
.cw__legend > li::before { content: none; }
.cw__legend > li.is-hidden { opacity: 0.2; }

.cw__swatch { width: 11px; height: 11px; border-radius: 2px; }

/* text wears text tokens, never the series colour */
.cw__label { color: var(--ink-2); }
.cw__label em { font-style: normal; color: var(--ink-3); margin-left: 0.45rem; font-size: 0.92em; }

.cw__val {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-variant-numeric: tabular-nums;
  color: var(--ink);
  font-size: 0.72rem;
}
</style>
