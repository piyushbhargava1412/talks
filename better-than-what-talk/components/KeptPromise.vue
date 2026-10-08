<script setup lang="ts">
/**
 * Tags a slide with the benchmark promise(s) from slide 6 that it keeps, so the
 * audience can tick all five off as the framework unfolds. Colours match the
 * five cards on slide 6.
 *
 *   <KeptPromise :n="[1, 3]" />
 */
defineProps<{ n: number[] }>()

const promises: Record<number, { label: string, tone: string }> = {
  1: { label: 'common workload', tone: 'var(--s1)' },
  2: { label: 'independent grader', tone: 'var(--s3)' },
  3: { label: 'hidden answer key', tone: 'var(--st-crit)' },
  4: { label: 'fingerprinted numbers', tone: 'var(--s6)' },
  5: { label: 'cost next to score', tone: 'var(--s4)' },
}
const marks = ['', '①', '②', '③', '④', '⑤']
</script>

<template>
  <span class="kp">
    <span v-for="i in n" :key="i" class="kp__badge" :style="{ color: promises[i].tone, borderColor: promises[i].tone }">
      {{ marks[i] }} {{ promises[i].label }}
    </span>
  </span>
</template>

<style scoped>
.kp {
  display: inline-flex;
  gap: 0.4rem;
  margin-left: 0.8rem;
  vertical-align: middle;
}
.kp__badge {
  font-family: var(--slidev-theme-fontFamily-sans, cursive);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
  padding: 0.05rem 0.5rem;
  border: 1px solid;
  border-radius: 999px;
}
</style>
