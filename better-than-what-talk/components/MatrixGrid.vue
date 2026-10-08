<script setup lang="ts">
import { computed } from 'vue'
import data from '../data/matrix.json'

/**
 * benchmark-runner's configuration × fixture matrix, as the talk shows it.
 * A cell reads `passed/n · median credits · median minutes`; the last column
 * pools passes across the row and nothing else (fixtures differ too much in
 * size for a pooled median to mean anything).
 *
 * - `rows` / `columns` pick a slice by key (default: everything).
 * - `step` reveals rows one at a time (bind to $clicks); omit to show all.
 * - `late` names cells ("row:col") that appear only once `step` passes the
 *   row count, so a slide can hold back its punchline.
 */
type Cell = [number, number, number, number]
type Row = { key: string, label: string, model: string, cells: Record<string, Cell> }

const props = withDefaults(defineProps<{
  rows?: string[]
  columns?: string[]
  step?: number
  late?: string[]
  total?: boolean
}>(), { total: true, late: () => [] })

const cols = computed(() => data.columns.filter((c) => !props.columns || props.columns.includes(c.key)))
const rowList = computed(() => (data.rows as Row[])
  .filter((r) => !props.rows || props.rows.includes(r.key))
  .filter((r) => cols.value.some((c) => r.cells[c.key])))

const shownRows = computed(() => (props.step === undefined ? rowList.value.length : props.step))
const lateShown = computed(() => props.step === undefined || props.step > rowList.value.length)

function cell(r: Row, col: string): Cell | undefined { return r.cells[col] }
function hidden(r: Row, col: string): boolean {
  return props.late.includes(`${r.key}:${col}`) && !lateShown.value
}
function tone(c: Cell): string {
  if (c[0] === c[1]) return 'mg-pass'
  if (c[0] === 0) return 'mg-fail'
  return 'mg-mixed'
}
function pooled(r: Row): [number, number] {
  return cols.value.reduce<[number, number]>((acc, c) => {
    const x = r.cells[c.key]
    return x ? [acc[0] + x[0], acc[1] + x[1]] : acc
  }, [0, 0])
}
</script>

<template>
  <table class="mg">
    <thead>
      <tr>
        <th>configuration</th>
        <th v-for="c in cols" :key="c.key">{{ c.label }}<span class="mg-sub">{{ c.sub }}</span></th>
        <th v-if="total">passes</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(r, i) in rowList" :key="r.key" :class="{ 'mg-hide': i >= shownRows }">
        <td class="mg-conf">{{ r.label }}<span class="mg-model">@{{ r.model }}</span></td>
        <td v-for="c in cols" :key="c.key">
          <template v-if="cell(r, c.key)">
            <span :class="['mg-cell', tone(cell(r, c.key)!), { 'mg-hide': hidden(r, c.key) }]">
              <b>{{ cell(r, c.key)![0] }}/{{ cell(r, c.key)![1] }}</b>
              <span class="mg-num">· {{ cell(r, c.key)![2].toLocaleString('en') }} cr · {{ cell(r, c.key)![3] }} m</span>
            </span>
          </template>
          <span v-else class="mg-none">·</span>
        </td>
        <td v-if="total" class="mg-total">{{ pooled(r)[0] }}/{{ pooled(r)[1] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.mg { width: 100%; }
.mg th { white-space: nowrap; }
.mg-sub {
  display: block;
  text-transform: none;
  letter-spacing: 0;
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
  font-size: 0.72rem;
  color: var(--ink-3);
}
.mg td { white-space: nowrap; vertical-align: middle; }
.mg-conf { color: var(--ink); }
.mg-model { color: var(--s1); font-family: var(--slidev-theme-fontFamily-mono, monospace); font-size: 0.72rem; }
.mg-cell { transition: opacity 0.5s ease; }
.mg-cell b { font-weight: 400; font-size: 1.05rem; }
.mg-num { color: var(--ink-3); font-size: 0.78rem; }
.mg-pass b { color: var(--st-good); }
.mg-fail b { color: var(--st-crit); }
.mg-mixed b { color: var(--st-warn); }
.mg-none { color: var(--ink-3); }
.mg-total { color: var(--ink); font-family: var(--slidev-theme-fontFamily-mono, monospace); }
.mg-hide { opacity: 0; }
tr { transition: opacity 0.5s ease; }
</style>
