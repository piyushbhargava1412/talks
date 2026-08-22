<script setup lang="ts">
import { computed } from 'vue'

/**
 * What actually lives on disk while the pipeline column runs: .arcus/specs/
 * <STORY-ID>/ fills up with artifacts, and session-checkpoint.json is the
 * one file that makes any of it resumable — on a usage-limit switch, a
 * crash, or just closing the laptop.
 *
 * Field names and the shape of session-checkpoint.json are real (see a spec
 * folder in this repo, e.g. .arcus/specs/ARC-0003/session-checkpoint.json,
 * which shows the same review_round:1 pattern this component walks
 * through). The task_N keys are compressed to one "tasks" line here for
 * space — the real file has one key per task.
 *
 * Rendered as its own column (mode="json" or mode="files"), each growing
 * top-down with nothing else sharing the column — so a line appearing
 * later never displaces anything else on the slide.
 *
 * Bound to the same $clicks as ArcusPipeline: 1 story, 2 spec, 3 plan,
 * 4 test plan, 5 implement, 6 review round 1, 7 loop back, 8 review
 * round 2 (approved), 9 pull request.
 */
const props = withDefaults(defineProps<{ step?: number; mode: 'json' | 'files' }>(), { step: 9 })

type FileEntry = { name: string; atStep: number }

const files: FileEntry[] = [
  { name: 'story.md', atStep: 1 },
  { name: 'context-pack.md, grounded-spec.md', atStep: 2 },
  { name: 'plan.md', atStep: 3 },
  { name: 'test-plan.md', atStep: 4 },
  { name: 'review.md', atStep: 6 },
  { name: 'PR_DESCRIPTION.md', atStep: 9 },
]

const visibleFiles = computed(() => files.filter(f => f.atStep <= props.step))
const latestFileStep = computed(() =>
  Math.max(0, ...visibleFiles.value.map(f => f.atStep)))

const currentStage = computed(() => ({
  1: 'scaffold', 2: 'spec_finalizer', 3: 'plan', 4: 'test_plan', 5: 'task_6',
  6: 'code_review', 7: 'task_7', 8: 'code_review', 9: 'closure',
} as Record<number, string>)[props.step] ?? '—')

const reviewRound = computed(() => (props.step >= 7 ? 1 : 0))
</script>

<template>
  <div class="cp">
    <template v-if="step < 1">
      <div class="cp__empty">no story yet —<br>nothing to track</div>
    </template>

    <template v-else-if="mode === 'json'">
      <div class="cp__filename">session-checkpoint.json</div>
      <pre class="cp__code"><span class="cp__k">story_id</span>: <span class="cp__s">"STEP-007"</span>,
<span class="cp__k">mode</span>: <span class="cp__s">"gated"</span>,
<span class="cp__k is-new">current_stage</span>: <span class="cp__s is-new">"{{ currentStage }}"</span>,
<span class="cp__k" :class="{ 'is-new': step === 7 }">review_round</span>: <span class="cp__v" :class="{ 'is-new': step === 7 }">{{ reviewRound }}</span>,
<span class="cp__k">stages</span>: {
<template v-if="step >= 1">  scaffold: <span class="cp__good" :class="{ 'is-new': step === 1 }">complete</span>
</template><template v-if="step >= 2">  context_pack: <span class="cp__good">complete</span>
  spec_finalizer: <span class="cp__good" :class="{ 'is-new': step === 2 }">complete</span>
</template><template v-if="step >= 3">  plan: <span class="cp__good" :class="{ 'is-new': step === 3 }">complete</span>
</template><template v-if="step >= 4">  test_plan: <span class="cp__good" :class="{ 'is-new': step === 4 }">complete</span>
</template><template v-if="step >= 5">  branch: <span class="cp__good">complete</span>
  tasks_1_6: <span class="cp__good" :class="{ 'is-new': step === 5 }">complete</span>
</template><template v-if="step >= 6 && step < 8">  code_review: <span class="cp__warn is-new">changes_requested</span>
</template><template v-if="step >= 7">  task_7: <span class="cp__good" :class="{ 'is-new': step === 7 }">complete</span>
</template><template v-if="step >= 8">  code_review: <span class="cp__good" :class="{ 'is-new': step === 8 }">complete</span>
</template><template v-if="step >= 9">  closure: <span class="cp__good is-new">complete</span>
</template>}</pre>
    </template>

    <template v-else>
      <div class="cp__path">.arcus/specs/<wbr>STEP-007/</div>
      <ul class="cp__files">
        <li v-for="f in visibleFiles" :key="f.name" :class="{ 'is-new': f.atStep === latestFileStep }">
          {{ f.name }}
        </li>
        <li v-if="step >= 5" class="cp__note" :class="{ 'is-new': step === 5 }">src/ · tasks 1–6</li>
        <li v-if="step >= 7" class="cp__note is-new">src/ · task 7 (fix)</li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.cp {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-2);
}

.cp__empty {
  color: var(--ink-3);
  font-style: italic;
  font-size: 11px;
  line-height: 1.6;
}

.cp__path {
  color: var(--ink-3);
  font-size: 11px;
  letter-spacing: 0.02em;
  margin-bottom: 0.35rem;
  word-break: break-all;
}

.cp__files {
  list-style: none;
  margin: 0;
  padding: 0;
}
.cp__files > li {
  padding: 0.05rem 0;
  color: var(--ink-2);
}
.cp__files > li::before { content: none; }
.cp__note { color: var(--ink-3); font-style: italic; }

.cp__filename {
  color: var(--ink);
  font-size: 11px;
  margin-bottom: 0.4rem;
}

.cp__code {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--ink-3);
}

.cp__k { color: var(--ink-2); }
.cp__s { color: var(--s6); }
.cp__v { color: var(--ink); }
.cp__good { color: var(--st-good); }
.cp__warn { color: var(--st-warn); }

.is-new {
  color: var(--ink) !important;
  background: rgba(250, 178, 25, 0.16);
  border-radius: 2px;
  padding: 0 2px;
  margin: 0 -2px;
}
</style>
