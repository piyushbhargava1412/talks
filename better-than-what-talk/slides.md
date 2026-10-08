---
theme: seriph
colorSchema: dark
title: Better than what?
info: |
  ## Better than what?
  Benchmarking agentic harnesses with evidence.

  AVEVA India R&D Meetup, Hyderabad — 9 Oct 2026.
class: text-left
lineNumbers: false
drawings:
  persist: false
transition: slide-left
duration: 30min (Q&A included)
fonts:
  # Excalifont is the real Excalidraw typeface — self-hosted from
  # public/fonts (see the @font-face block in style.css), so it must be
  # listed under `local` or Slidev will try to fetch it from Google Fonts.
  sans: Excalifont
  serif: Excalifont
  mono: JetBrains Mono
  local: Excalifont
  weights: '400'
---

<div class="kicker">AVEVA India R&amp;D Meetup · Hyderabad · 9 Oct 2026</div>

<h1 class="!text-6xl mt-3 mb-5">Better than what?</h1>

<p class="text-2xl !text-[var(--ink-2)] max-w-[40rem] leading-snug">
  Benchmarking agentic harnesses with evidence.
</p>

<div class="mt-10 flex items-center gap-3 text-base !text-[var(--ink-3)]">
<span>Piyush Bhargava</span>
<span class="opacity-40">·</span>
<span>Tech Principal</span>
<span class="opacity-40">·</span>
<img src="/images/thoughtworks-logo.svg" class="assoc-logo" alt="Thoughtworks" />
</div>

<style>
/* Thoughtworks' mark is dark-on-transparent (built for a light page), so a
   white card renders it as designed rather than recolouring the brand. */
.assoc-logo {
  width: 85px;
  height: auto;
  display: block;
  background: #fff;
  padding: 0.45rem 0.65rem;
  border-radius: 0.3rem;
}
</style>

<!--
Quick title. The bio comes next — brief, then straight into the job ARCUS does.
-->

---
clicks: 5
class: px-10
---

## whoami

<div class="flex gap-10 whoami-row">
  <div class="whoami-col flex flex-col justify-center space-y-5 text-lg !text-[var(--ink-2)]">
    <div v-click="1">— Application Developer, Tech Principal @ ThoughtWorks</div>
    <div v-click="2">— IIIT Hyderabad, class of 2005</div>
    <div v-click="3">— 21+ years writing software, 8 of them at ThoughtWorks</div>
    <div v-click="4">— AI enthusiast <span class="!text-[var(--ink-3)]">— clearly, given the next 25 minutes</span></div>
    <div v-click="5">— Fitness freak and certified walk-a-holic</div>
  </div>
  <div class="whoami-col flex items-center justify-center">
    <img v-if="$clicks >= 5" src="/images/about-me.jpeg" class="whoami-pic" />
  </div>
</div>

<style>
/* Carried over from the LangChain talk, where the reasons are written up in
   full: a flex row with a fixed height and min-height:0 children keeps the
   photo from growing the row and shifting the bullets when it mounts. */
.whoami-row {
  height: 400px;
  overflow: hidden;
}

.whoami-col {
  flex: 1 1 50%;
  min-height: 0;
}

.whoami-pic {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: cover;
  border-radius: 0.6rem;
}
</style>

<!--
Under 30 seconds.
-->

---
clicks: 8
class: px-10 pt-8
---

<div class="kicker">The job</div>

## A story in, a pull request out

<div class="flex items-center gap-2 mt-6">
  <span class="card-title !mb-0 mr-2">in</span>
  <span class="chip">📄 story file</span>
  <span class="chip">🔗 story URL</span>
  <span class="chip">🏷 labelled GitHub issue</span>
</div>

<div class="flex items-center gap-2 mt-5 flex-nowrap job-row">
  <SketchBox v-click="1" tone="s5" seed="job-1"><span class="t-ink">analyse</span></SketchBox><span v-click="2" class="t-dim">→</span>
  <SketchBox v-click="2" tone="s1" seed="job-2"><span class="t-ink">plan</span></SketchBox><span v-click="3" class="t-dim">→</span>
  <SketchBox v-click="3" tone="s4" seed="job-3"><span class="t-ink">test plan</span></SketchBox><span v-click="4" class="t-dim">→</span>
  <SketchBox v-click="4" tone="s3" seed="job-4"><span class="t-ink">TDD implement</span></SketchBox><span v-click="5" class="t-dim">→</span>
  <SketchBox v-click="5" tone="s6" seed="job-5"><span class="t-ink">review</span></SketchBox><span v-click="6" class="t-dim">→</span>
  <SketchBox v-click="6" tone="s2" seed="job-6"><span class="t-ink">simplify</span></SketchBox><span v-click="7" class="t-dim">→</span>
  <SketchBox v-click="7" tone="good" seed="job-7"><span class="t-ink">pull request</span></SketchBox>
</div>

<style>
.job-row :deep(.sb__body) { padding: 0.6rem 0.8rem; white-space: nowrap; }
</style>

<div v-click="8" class="mt-12 punchline">ARCUS: an agentic SDLC pipeline that delivers a story the way a developer would.</div>

<!--
This is ARCUS, my agentic development pipeline. You give it a story as a file,
a URL, or a GitHub issue with a label.

[click] It analyses the story, [click] plans the implementation, [click] writes
a test plan, [click] implements it test-first, [click] reviews its own code,
[click] simplifies and refactors, [click] and opens a pull request.

[click] The same stages a developer goes through. Which raises two questions.
-->

---
clicks: 2
class: px-14 pt-14
---

<div class="kicker">Two questions we couldn't answer</div>

<div class="statement !text-4xl mt-8" v-click="1"><span class="dim">1.</span> Is it doing the job as well as a developer would have?</div>

<div class="statement !text-4xl mt-8" v-click="2"><span class="dim">2.</span> Does it earn its place next to a vanilla Copilot or Claude Code session, <span class="dim">where the models get smarter every month?</span></div>

<!--
[click] First: is it doing the job as well as a developer would have done it?

[click] Second, and harder: does it earn its place? A vanilla Copilot or Claude
Code session on Opus 5.5 is very good, and every month the model underneath
gets better. A plugin that wraps it has to be better than *that*, not better
than nothing.
-->

---
clicks: 6
class: px-12 pt-10
---

<div class="kicker">We love what we build</div>

<div class="grid grid-cols-[1.6fr_1fr] gap-6 mt-6 items-center">
  <div class="space-y-4 text-2xl">
    <div v-click="1" class="claim" style="--r: -1.5deg">"It's better than our last version."</div>
    <div v-click="2" class="claim ml-12" style="--r: 1deg">"It's better than that other plugin."</div>
    <div v-click="3" class="claim ml-4" style="--r: -0.6deg">"It's a better developer experience."</div>
    <div v-click="4" class="claim ml-16" style="--r: 1.4deg">"Its context engineering is better."</div>
    <div v-click="5" class="claim ml-6" style="--r: -1deg">"It's better on tokens."</div>
  </div>
  <div v-click="6" class="text-center">
    <div class="big-q">?</div>
    <div class="punchline">Can we prove any of it?</div>
  </div>
</div>

<style>
.claim {
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
  color: var(--ink);
  transform: rotate(var(--r));
  width: fit-content;
}
.big-q {
  font-family: var(--slidev-theme-fontFamily-serif, cursive);
  font-size: 9rem;
  line-height: 1;
  color: var(--st-warn);
}
</style>

<!--
And here's the honest part. Whatever we build ourselves, we're a little in love
with it, and that makes us lenient judges.

[click] We start believing it's better than our last version. [click] Better than
the competing plugin. [click] A better experience. [click] Better context
engineering. [click] Better on tokens.

[click] Can we prove any of it? Not with a demo, and not with a feeling.
-->

---
clicks: 4
class: px-10 pt-8
---

<div class="kicker">Benchmarks, and their fine print</div>

## Every industry tests its claims

<div class="grid grid-cols-3 gap-5 mt-4">
  <SketchBox v-click="1" tone="s1" seed="bm-crash"><div class="text-3xl">🚗</div><div class="card-list"><b>Crash tests</b> rate a car against a published standard, not the maker's brochure.</div></SketchBox>
  <SketchBox v-click="2" tone="s1" seed="bm-spec"><div class="text-3xl">🗄️</div><div class="card-list"><b>SPEC and TPC</b> let you compare CPUs and databases from rival vendors on the same workload.</div></SketchBox>
  <SketchBox v-click="3" tone="crit" seed="bm-diesel" dashed><div class="text-3xl">🏭</div><div class="card-list"><b>The 2015 emissions scandal</b>: cars that detected the test and behaved only then. <span class="t-warn">A benchmark the product can see gets gamed.</span></div></SketchBox>
</div>

<div v-click="4" class="grid grid-cols-[1.25fr_1fr] gap-8 mt-6 items-center">
  <div>
    <div class="card-title">models too · Opus 5.5 on Terminal-Bench 4.0</div>
    <TwoBars />
  </div>
  <div class="space-y-3">
    <div class="card-list">Same model, same benchmark, different harness and effort. And the default effort just moved from <b>high</b> to <b>medium</b>.</div>
    <div class="punchline">A number without its configuration is marketing.</div>
  </div>
</div>

<!--
None of this is new. [click] Cars are crash-tested against a published standard,
not the maker's brochure. [click] Databases and CPUs from rival vendors are
compared on SPEC and TPC workloads.

[click] And the cautionary tale: in 2015, cars were caught detecting the
emissions test and behaving only while it ran. A benchmark the product can see
gets gamed. Remember that: it's why our answer key stays hidden.

[click] Models go through this too. Opus 5.5 on Terminal-Bench 4.0: 66.4% as the
vendor reported it, at the highest effort; 59.6% when an independent lab ran it
in their own harness. Same model, seven points apart. And its default effort
just changed from high to medium, so "out of the box" isn't "at its best".
A number without its configuration is marketing.
-->

---
clicks: 5
class: px-10 pt-8
---

<div class="kicker">A harness is a product too</div>

<div class="grid grid-cols-[1.15fr_1fr] gap-8 items-center mt-4">
  <HarnessOnion :step="Math.min($clicks, 4)" />
  <div class="space-y-5">
    <div class="card-list text-lg">A harness is a framework built on top of a model: agents, skills, prompts, gates and a budget that together deliver a workflow.</div>
    <div v-click="5" class="punchline">You ship the bundle, so you benchmark the bundle.</div>
    <div v-click="5" class="card-list t-dim">Supabase does exactly this for its CLI, MCP server and skills: it benchmarks the tooling around the model, not the model.</div>
  </div>
</div>

<!--
So what is a harness? Start with the model. [click] Around it, agents and
skills. [click] Prompts and rules. [click] Gates and reviews. [click] And a
budget, in time and credits, around all of it.

[click] Nobody ships the model alone. You ship the bundle, so you have to
benchmark the bundle. Supabase recently published exactly this for their own
tooling: they benchmark the CLI, the MCP server and the skills around the model.
Here's how we did it for ARCUS.
-->

---
clicks: 9
class: px-8 pt-6
---

<div class="kicker mb-2">The framework, end to end</div>

<FrameworkFlow :step="$clicks" />

<!--
The one idea first, before any click: take a story a human team already
delivered, give an agent the same starting point, and compare the two answers.

[click] Prepare — the agent gets exactly what the developer got: the pre-PR
commit and the story. The answer keys (the human's PR and the hidden test) go
into a vault that never reaches the agent's machine.

[click] Run — any harness, any model, under a time limit.

[click] Upload — the diff, the session log and the harness's own notes travel
as one artifact.

[click] Grade — on a different machine, after the agent has finished. The vault
opens only here. Code first: the repo's own quality gate, then the hidden test.

[click] Count — everything countable is counted: files against the human's,
credits, minutes, tool calls, per stage. No model does arithmetic.

[click] Judge — a model reads the code against the human's PR on 9 dimensions.
It may explain the grade, never overturn it, and code checks every claim it makes.

[click] Second lane — a comparison needs two of these: same fixture, another
configuration.

[click] Fair race — same story, same base commit, same judge? Anything that moved
without being declared is printed as a caveat.

[click] Compare and publish — one verdict, published on the site, and one more
cell in the matrix. The next six slides zoom into each box.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · 1 / 6</div>
    <h2>The fixture</h2>
    <div class="zoom-sub">A story a human team already delivered, frozen so anyone can replay it.</div>
  </div>
  <FrameworkFlow :focus="['fixture']" class="zoom-map" />
</div>

<div class="grid grid-cols-[1.1fr_1fr] gap-8 items-start">
  <FixtureLine :step="$clicks" />
  <div class="space-y-2">
    <SketchBox tone="s5" seed="fx-story"><div class="card-list"><b>The story</b>, exactly as the team got it</div></SketchBox>
    <SketchBox tone="s5" seed="fx-pre"><div class="card-list"><b>pre-PR</b>: the commit the human started from</div></SketchBox>
    <SketchBox tone="warn" seed="fx-at" dashed><div class="card-list">🔒 <b>at-PR</b>: the human's PR, the answer key</div></SketchBox>
    <SketchBox tone="warn" seed="fx-hidden" dashed><div class="card-list">🔒 <b>hidden acceptance test</b>: the second answer key</div></SketchBox>
    <SketchBox tone="good" seed="fx-gate"><div class="card-list"><b>quality gate</b>: the repo's own PR check</div></SketchBox>
    <SketchBox tone="ink3" seed="fx-tool"><div class="card-list"><b>toolchain</b>: e.g. the JDK the base builds on</div></SketchBox>
  </div>
</div>

<!--
A fixture is five things and a toolchain. The story, exactly as written for the
team. pre-PR: the commit the human team started from. at-PR: their finished,
human-coded and human-reviewed change, which is our answer key.

[click] The hidden acceptance test, the second answer key. It fails at pre-PR
because the behaviour isn't there yet, and passes at at-PR because the human
built it. Red to green is the whole point: it tests the story, nothing else.

[click] The quality gate, the repo's own PR check. Green at both ends: it
proves nothing old broke.

[click] And the agent starts exactly where the human did, at pre-PR, and
produces its own answer. Everything after this compares the two.
-->

---
clicks: 4
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · 2 / 6</div>
    <h2>Proving the fixture</h2>
    <div class="zoom-sub">Before a single credit is spent on an agent, the fixture has to prove itself.</div>
  </div>
  <FrameworkFlow :focus="['fixture']" class="zoom-map" />
</div>

<div class="grid grid-cols-3 gap-5">
  <SketchBox v-click="1" tone="s5" seed="pf-1">
    <div class="card-title">check 1 · it applies</div>
    <div class="card-list">The human's PR applies cleanly at pre-PR.<div class="t-dim mt-2 text-sm">Otherwise the agent and the human didn't start from the same place.</div></div>
  </SketchBox>
  <SketchBox v-click="2" tone="good" seed="pf-2">
    <div class="card-title">check 2 · it discriminates</div>
    <div class="card-list">The hidden test is <span class="t-crit">red</span> at pre-PR and <span class="t-good">green</span> at at-PR.<div class="t-dim mt-2 text-sm">Otherwise it isn't testing this story.</div></div>
  </SketchBox>
  <SketchBox v-click="3" tone="s1" seed="pf-3">
    <div class="card-title">check 3 · it holds</div>
    <div class="card-list">The gate is green at at-PR, on the same kind of machine that will grade.<div class="t-dim mt-2 text-sm">Prove where you grade, or the proof proves nothing.</div></div>
  </SketchBox>
</div>

<div v-click="4" class="mt-6">
  <div class="card-title">and one rule for the hidden test: behaviour, never names</div>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <SketchBox tone="crit" seed="pf-bad" dashed><div class="card-list"><span class="t-crit">✗</span> <code>new PlanController().create(2026)</code><div class="t-dim text-sm mt-1">passes only if the agent picked the human's class names</div></div></SketchBox>
    <SketchBox tone="good" seed="pf-good"><div class="card-list"><span class="t-good">✓</span> <code>POST /plans?year=2026</code> → every day of 2026 covered, no overlaps<div class="t-dim text-sm mt-1">any correct implementation passes</div></div></SketchBox>
  </div>
</div>

<!--
Three checks, run by code, before we trust a fixture.

[click] It applies: the human's PR applies cleanly at pre-PR. If it doesn't,
we picked the wrong base, and the comparison is meaningless.

[click] It discriminates: red at pre-PR, green at at-PR. A hidden test that is
green at pre-PR isn't testing the story.

[click] It holds: the gate is green at at-PR, proven on the same kind of machine
that will do the grading. Prove where you grade.

[click] And one rule for writing the hidden test: test behaviour, never names.
If the test calls the human's class, it only passes for an agent that guessed
the same name. Hit the endpoint, check what got stored.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · 3 / 6</div>
    <h2>The run</h2>
    <div class="zoom-sub">One harness, one model, one story, on a machine that has never seen the answers.</div>
  </div>
  <FrameworkFlow :focus="['run']" class="zoom-map" />
</div>

<div class="grid grid-cols-3 gap-5">
  <SketchBox v-click="1" tone="s1" seed="rn-gets">
    <div class="card-title">the agent gets</div>
    <div class="card-list">
      <div>a fresh copy of <b>pre-PR</b></div>
      <div>the <b>story</b> and the repo's own rules</div>
      <div><code class="t-s1">harness@model</code>, e.g. <code>arcus@opus-5.5</code></div>
      <div>a hard <b>time limit</b></div>
    </div>
  </SketchBox>
  <SketchBox v-click="2" tone="warn" seed="rn-never" dashed>
    <div class="card-title">the agent never gets</div>
    <div class="card-list">
      <div>🔒 the human's PR</div>
      <div>🔒 the hidden test</div>
      <div class="t-dim text-sm mt-2">Fetched only after the agent finishes, on a different machine. The agent's checkout even fails if one is found.</div>
    </div>
  </SketchBox>
  <SketchBox v-click="3" tone="s4" seed="rn-leaves">
    <div class="card-title">the agent leaves behind</div>
    <div class="card-list">
      <div><b>one diff</b> against pre-PR</div>
      <div>the <b>session log</b>: every tool call, every credit</div>
      <div>the harness's <b>own notes</b>: plan, spec, review</div>
      <div>a <b>manifest</b>: model asked for and model that answered, plugin <code>v0.20+c9c70c1</code>, minutes, credits</div>
    </div>
  </SketchBox>
</div>

<div v-click="3" class="mt-5 punchline">"main" moves, so a version alone isn't an identity. The commit is.</div>

<!--
The run is deliberately boring.

[click] The agent gets what the developer got: a fresh copy of pre-PR, the
story, the repo's own rules, a configured harness and model, and a time limit.

[click] It never gets the answer keys. They're fetched only after it finishes,
on a different machine. The agent's job even fails if one is found on disk.

[click] It leaves behind one diff, its full session log, the harness's own
notes, and a manifest. Note the plugin identity: version plus commit, because
main moves, and two runs of "0.20" can be two different plugins.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · 4 / 6</div>
    <h2>Judgement, part 1: code</h2>
    <div class="zoom-sub">Two questions with answers that aren't opinions. Code asks them first.</div>
  </div>
  <FrameworkFlow :focus="['grade', 'count']" class="zoom-map" />
</div>

<div class="grid grid-cols-[1fr_1fr_1.05fr] gap-5">
  <SketchBox v-click="1" tone="good" seed="g-p2p">
    <div class="card-title">pass-to-pass</div>
    <div class="punchline !text-lg">Did it break anything?</div>
    <div class="card-list mt-2">The repo's own <b>quality gate</b>, run on the agent's tree, exactly as the team's PRs run it.</div>
  </SketchBox>
  <SketchBox v-click="1" tone="good" seed="g-f2p">
    <div class="card-title">fail-to-pass</div>
    <div class="punchline !text-lg">Does the story's behaviour exist?</div>
    <div class="card-list mt-2">The <b>hidden acceptance test</b>, written into the tree only now, then run.</div>
  </SketchBox>
  <SketchBox v-click="3" tone="s3" seed="g-facts">
    <div class="card-title">then: everything countable</div>
    <div class="card-list">
      <div>files touched vs the human's</div>
      <div>story artefacts present or missing</div>
      <div>tests deleted, assertions removed</div>
      <div>minutes · credits · tool calls</div>
      <div>…per stage, and per model</div>
    </div>
  </SketchBox>
</div>

<div v-click="2" class="mt-5 flex gap-3 items-baseline">
  <span class="card-title !mb-0 whitespace-nowrap">three outcomes, not two</span>
  <span class="chip t-good">pass</span>
  <span class="chip t-crit">fail</span>
  <span class="chip t-warn">couldn't measure</span>
  <span class="t-dim text-sm">a registry that said 401 is not the agent's fault, so it is never counted as a fail</span>
</div>

<div v-click="3" class="mt-4 punchline">No model does arithmetic. Free, repeatable, and it forms no opinion.</div>

<!--
Two questions have answers that aren't opinions, so code answers them before
any model is asked anything.

[click] Pass-to-pass: did it break anything? The repo's own quality gate.
Fail-to-pass: does the behaviour the story asked for exist? The hidden test,
written into the agent's tree only now, and run.

[click] Three outcomes, not two. If the machine couldn't measure, say a
registry answered 401, that's recorded as "not measured", never as a fail.

[click] Then everything countable is counted: files against the human's,
story artefacts, tests weakened, time, credits, tool calls, per stage and per
model. No model ever does arithmetic.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · 5 / 6</div>
    <h2>Judgement, part 2: an LLM on a leash</h2>
    <div class="zoom-sub">A model reads the code against the human's PR, inside rules that code enforces.</div>
  </div>
  <FrameworkFlow :focus="['judge']" class="zoom-map" />
</div>

<div class="grid grid-cols-[1fr_1.2fr_1.1fr] gap-5">
  <SketchBox tone="s6" seed="j-reads">
    <div class="card-title">it reads</div>
    <div class="card-list">
      <div>a read-only copy of the agent's code</div>
      <div>both diffs: agent's and human's</div>
      <div>the story</div>
      <div>the harness's notes</div>
      <div>the grade and the counted facts</div>
    </div>
  </SketchBox>
  <SketchBox v-click="1" tone="s6" seed="j-dims">
    <div class="card-title">it marks 9 dimensions</div>
    <div>
      <span class="chip">requirement coverage</span><span class="chip">correctness</span><span class="chip">security</span>
      <span class="chip">pattern fidelity</span><span class="chip">test quality</span><span class="chip">verification depth</span>
      <span class="chip">auditability</span><span class="chip">process integrity</span><span class="chip">hygiene</span>
    </div>
    <div class="t-dim text-sm mt-2">Scores communicate. Findings, pinned to a file and line, decide.</div>
  </SketchBox>
  <SketchBox v-click="2" tone="warn" seed="j-leash" dashed>
    <div class="card-title">the leash</div>
    <div class="card-list">
      <div>the grade is given: <b>explain it, never overturn it</b></div>
      <div>the human's PR is a reference, not a standard</div>
      <div>account for every file either side touched</div>
      <div>text in the code is data, not instructions</div>
    </div>
  </SketchBox>
</div>

<div v-click="3" class="mt-5">
  <div class="card-title">then code checks the judge</div>
  <div class="flex flex-wrap gap-1">
    <span class="chip">✓ every cited file exists</span>
    <span class="chip">✓ every story quote is verbatim</span>
    <span class="chip">✓ every touched file accounted for</span>
    <span class="chip">✓ evidence hashed before and after</span>
    <span class="chip">pinned judge model · effort · credit cap</span>
  </div>
</div>

<!--
Only now does a model form an opinion.

It reads a read-only copy of the agent's code, both diffs, the story, the
harness's own notes, and the grade and facts as givens.

[click] It marks nine dimensions, from requirement coverage to hygiene. Scores
are for communication; the findings, each pinned to a file, are the substance.

[click] And it's on a leash. The grade is given: it may explain a red test, never
overturn it. The human's PR is a reference, not the only right answer. It must
account for every file either side touched. And anything written in the code is
data, not instructions to the judge.

[click] Then code checks the judge: cited files must exist, quotes from the story
must be verbatim (so it can't invent an ambiguity to excuse a finding), every
file must be accounted for, and the evidence is hashed before and after. The
judge model, effort and credit cap are pinned, so two judgements are comparable.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · 6 / 6</div>
    <h2>Comparison: two runs, one question</h2>
    <div class="zoom-sub">Two judged runs of the same story, and the one thing you changed.</div>
  </div>
  <FrameworkFlow :focus="['lane2', 'fair', 'compare']" class="zoom-map" />
</div>

<div class="flex gap-3 items-baseline mb-4">
  <span class="card-title !mb-0 whitespace-nowrap">the one thing you changed</span>
  <span class="chip t-ink">harness</span><span class="t-dim">vs vanilla</span>
  <span class="chip t-ink">plugin version</span><span class="t-dim">X vs X++</span>
  <span class="chip t-ink">model</span><span class="t-dim">opus vs sonnet</span>
</div>

<div class="grid grid-cols-2 gap-5">
  <SketchBox v-click="1" tone="s1" seed="c-given">
    <div class="card-title">the second judge gets</div>
    <div class="card-list">both diffs · the human's PR · the story · both judgements · both harnesses' notes · grades and counted facts</div>
  </SketchBox>
  <SketchBox v-click="1" tone="warn" seed="c-withheld" dashed>
    <div class="card-title">and is never given</div>
    <div class="card-list">either code tree · the raw session logs<div class="t-dim text-sm mt-2">Two diffs can be read whole. Two trees can't, and the side read harder would look different.</div></div>
  </SketchBox>
</div>

<div v-click="2" class="mt-5">
  <div class="card-title">it answers</div>
  <div class="flex flex-wrap gap-1">
    <span class="chip">which did better, or <b>neither</b></span>
    <span class="chip">how sure, and what would change its mind</span>
    <span class="chip">a row per dimension, never summed</span>
    <span class="chip">did the extra spend earn anything?</span>
    <span class="chip">every caveat</span>
  </div>
</div>

<div v-click="3" class="mt-5 punchline">Code grades come first. Severity isn't additive. Cost is judged separately.</div>

<!--
A comparison takes two judged runs of the same story, and names the one thing
you changed: the harness, the plugin version, or the model.

[click] The second judge gets both diffs, the answer key, the story, both
judgements and both harnesses' notes. It never gets the code trees: two diffs
can be read whole, two repositories can't, and whichever side it read harder
would look different for the wrong reason.

[click] It answers which did better, and "neither" is a real answer. How sure it
is and what would change its mind. A row per dimension, read and never summed.
And separately: did the extra time and money buy anything?

[click] Three rules carry it. The code grades come first. One missing security
check outweighs five naming nits. And cost never decides quality; it gets its own
verdict.
-->

---
clicks: 4
class: px-10 pt-6
---

<div class="zoom-head">
  <div>
    <div class="kicker">The framework · on every result</div>
    <h2>A mini system card</h2>
    <div class="zoom-sub">Every comparison opens by saying what was the same and what was not, before any verdict.</div>
  </div>
  <FrameworkFlow :focus="['fair']" class="zoom-map" />
</div>

<table class="sc">
  <thead><tr><th></th><th>vanilla@opus-5.5</th><th>arcus@opus-5.5</th><th></th></tr></thead>
  <tbody>
    <tr v-click="1"><td>story · pre-PR · answer key</td><td>Ticket B</td><td>Ticket B</td><td><span class="sc-tag sc-held">held constant</span></td></tr>
    <tr v-click="1"><td>model asked for · effort</td><td>opus-5.5 · medium</td><td>opus-5.5 · medium</td><td><span class="sc-tag sc-held">held constant</span></td></tr>
    <tr v-click="1"><td>judge · rubric · effort</td><td>opus-5 · <code>976e31</code> · high</td><td>opus-5 · <code>976e31</code> · high</td><td><span class="sc-tag sc-held">held constant</span></td></tr>
    <tr v-click="2"><td>plugin</td><td>none</td><td><code>v0.20+c9c70c1</code></td><td><span class="sc-tag sc-change">part of the change</span></td></tr>
    <tr v-click="2"><td>prompt · time limit</td><td><code>009bb5</code> · 30 min</td><td><code>de90ff</code> · 3 h</td><td><span class="sc-tag sc-change">part of the change</span></td></tr>
    <tr v-click="3"><td>models that answered</td><td>opus-5.5</td><td>opus-5.5 · opus-5 · sonnet-5 · gpt-5.4 · haiku</td><td><span class="sc-tag sc-moved">moved, not declared</span></td></tr>
    <tr v-click="3"><td>CLI version</td><td>1.0.88</td><td>1.0.88</td><td><span class="sc-tag sc-rec">recorded, not under test</span></td></tr>
  </tbody>
</table>

<div v-click="4" class="mt-4 punchline">A difference you were told about is a caveat. One nobody mentioned makes the verdict worthless.</div>

<style>
.sc { width: 100%; margin-top: 0.4rem; }
.sc td, .sc th { padding-top: 0.32rem !important; padding-bottom: 0.32rem !important; }
.sc-tag {
  font-family: var(--slidev-theme-fontFamily-mono, monospace);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
.sc-held { color: var(--ink-3); }
.sc-change { color: var(--s1); }
.sc-moved { color: var(--st-crit); }
.sc-rec { color: var(--st-warn); }
</style>

<!--
Before any verdict, every comparison opens with this: the mini system card,
the thing the model labs publish next to every benchmark number.

[click] What was held constant: same story, same starting commit, same answer
key; same model asked for, at the same effort; same judge, rubric and effort.

[click] What was part of the change: here we're asking about the harness, so
the plugin, its prompt and its time budget are expected to differ.

[click] And what moved without anyone declaring it. We asked for Opus 5.5 on
both sides, but the plugin's subagents answered on four other models. That's not
a reason to refuse the comparison; it's a caveat the verdict has to carry, and
the judge is told to prefer "neither" over a winner it can't separate from it.
The CLI version is shown, but nobody chooses it, so it's never blamed.

[click] A difference you were told about is a caveat. A difference nobody
mentioned makes the verdict worthless.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="kicker">Running it, reading it</div>

## One dispatch, one link

<div class="grid grid-cols-[0.9fr_1.4fr] gap-6 mt-3">
  <SketchBox tone="s1" seed="run-form">
    <div class="card-title">run workflow · benchmark</div>
    <div class="form-row"><span>fixture</span><span class="form-val">Ticket B ▾</span></div>
    <div class="form-row"><span>harness</span><span class="form-val">arcus ▾</span></div>
    <div class="form-row"><span>model</span><span class="form-val">opus-5.5 ▾</span></div>
    <div class="form-row"><span>plugin ref</span><span class="form-val">wip/size-routing</span></div>
    <div class="form-row"><span>stop after</span><span class="form-val">— ▾</span></div>
    <div class="mt-3 text-right"><span class="chip t-good">▶ run</span></div>
  </SketchBox>
  <div class="space-y-3">
    <div v-click="1" class="flex items-center gap-2 flex-nowrap">
      <SketchBox tone="s1" seed="run-a"><span class="t-ink">agent job</span><div class="t-dim text-xs">no answer keys on disk</div></SketchBox><span class="t-dim">→</span>
      <SketchBox tone="s3" seed="run-j"><span class="t-ink">judge job</span><div class="t-dim text-xs">another machine</div></SketchBox><span class="t-dim">→</span>
      <SketchBox tone="good" seed="run-p"><span class="t-ink">published</span><div class="t-dim text-xs">a link in the job summary</div></SketchBox>
    </div>
    <div v-click="2" class="card-list">
      <div class="card-title">or on a laptop, to iterate on a rubric in seconds</div>
      <code>./go.sh run</code> · <code>judge &lt;bench&gt;</code> · <code>compare &lt;a&gt; &lt;b&gt;</code> · <code>matrix</code>
    </div>
    <div v-click="3" class="card-list">
      <div class="card-title">every report, on a small static site</div>
      Judgements and comparisons land on a protected orphan <code>pages</code> branch, one folder each, filterable by fixture. One link to drop into a PR or a release note.
    </div>
  </div>
</div>

<style>
.form-row {
  display: flex;
  justify-content: space-between;
  padding: 0.28rem 0;
  border-bottom: 1px dashed var(--ctx-line);
  font-size: 0.92rem;
  color: var(--ink-3);
}
.form-val { color: var(--ink); font-family: var(--slidev-theme-fontFamily-mono, monospace); font-size: 0.8rem; }
</style>

<!--
Running it is one dispatch: pick the fixture, the harness, the model, and
optionally a plugin branch, for example a work-in-progress one.

[click] The agent job runs on a machine with no answer keys. The judge job runs on
another one. The verdict lands as a link in the job summary.

[click] Locally it's the same pipeline, which is how you iterate on a rubric in
seconds instead of a commit and a push.

[click] And every report is published to a small static site, built from a
protected orphan branch, one folder per report. That link is what goes into a
pull request or a release note.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="kicker">From pairs to a grid</div>

## Every configuration, on every story

<div class="grid grid-cols-2 gap-5 mt-2 mb-4">
  <SketchBox tone="s6" seed="mx-cmp"><div class="card-list"><b>compare</b> is a <i>reading</i> of two runs, by a model.</div></SketchBox>
  <SketchBox tone="s3" seed="mx-mx"><div class="card-list"><b>matrix</b> is <i>arithmetic</i> over every run. Free, no model.</div></SketchBox>
</div>

<div v-click="1">
  <MatrixGrid />
</div>

<div class="flex gap-6 mt-4 items-baseline">
  <div v-click="2" class="card-list text-sm"><span class="card-title">marked, never pooled silently</span><br><span class="chip">G</span> older hidden test <span class="chip">P</span> harness prompt changed <span class="chip">L</span> local run</div>
  <div v-click="3" class="punchline !text-lg">The matrix says where to look. Compare explains one pair of cells.</div>
</div>

<!--
A comparison answers one pair. The matrix answers "where should I even look?"

Compare is a model reading two runs. Matrix is arithmetic over all of them, and
costs nothing.

[click] Rows are configurations: harness, model and plugin version. Columns are
tickets. Each cell: how many runs passed the hidden test out of how many, median
credits, median minutes. The last column pools passes, and only passes: tickets
differ too much in size to average their cost.

[click] Cells that would quietly mix two different measurements are marked: a
run graded by an older hidden test, a harness prompt that changed between runs,
a laptop run beside CI runs.

[click] The matrix tells you where to look; compare explains one pair of cells.
And notice: every cell says 1/1. Hold that thought.
-->

---
clicks: 4
class: px-10 pt-6
---

<div class="kicker">How many runs?</div>

## One run is an anecdote

<div class="grid grid-cols-3 gap-4 mt-3">
  <SketchBox v-click="1" tone="good" seed="an-1"><div class="card-title">run 1</div><div class="card-list"><span class="t-good text-xl">✓ pass</span><div>14 min · 222 credits</div></div></SketchBox>
  <SketchBox v-click="1" tone="crit" seed="an-2"><div class="card-title">run 2</div><div class="card-list"><span class="t-crit text-xl">✗ fail</span><div>31 min · 610 credits</div></div></SketchBox>
  <SketchBox v-click="1" tone="good" seed="an-3"><div class="card-title">run 3</div><div class="card-list"><span class="t-good text-xl">✓ pass</span><div>44 min · 933 credits</div></div></SketchBox>
</div>
<div v-click="1" class="t-dim text-sm mt-1">Same harness, same model, same ticket. Illustrative, and entirely ordinary.</div>

<div class="grid grid-cols-2 gap-x-8 gap-y-2 mt-5 card-list">
  <div v-click="2"><b>Agents are stochastic.</b> One sample can't separate the harness from luck.</div>
  <div v-click="2"><b>Luck ships.</b> A lucky X++ gets released; an unlucky one gets binned. Both look evidence-based.</div>
  <div v-click="3"><b>The judge is a second dice roll.</b> The same run read twice: same substance, different scores.</div>
  <div v-click="3"><b>Cost attracts outliers.</b> One run that wanders for two hours becomes "the cost".</div>
</div>

<div v-click="4" class="mt-5 punchline">n=1 is a smoke test, not a verdict.</div>

<!--
Every cell on the last slide said 1/1. Here's why that should worry us.

[click] Same harness, same model, same ticket, run three times: pass, fail, pass,
and anywhere from 14 to 44 minutes. That's illustrative, but it's entirely
ordinary for agents.

[click] Agents are stochastic, so one sample can't tell the harness's effect
from luck. And luck ships: a lucky X++ gets released, an unlucky one gets
rejected, and both decisions look evidence-based.

[click] The judge adds a second dice roll: the same run read twice gives the
same substance with different scores. And one run that wanders for two hours
becomes "the cost of that configuration".

[click] n=1 is cheap, and it's the right tool for a quick smoke test of a branch.
It's not a verdict.
-->

---
clicks: 4
class: px-10 pt-6
---

<div class="kicker">How many runs?</div>

## Three runs, and five only when they disagree

<div class="flex items-stretch gap-3 mt-4 flex-nowrap">
  <SketchBox tone="s1" seed="ad-3" class="flex-1">
    <div class="card-title">three runs</div>
    <div class="card-list">the default for every cell</div>
  </SketchBox>
  <div class="self-center t-dim">→</div>
  <SketchBox v-click="1" tone="warn" seed="ad-agree" class="flex-[1.6]">
    <div class="card-title">do they agree?</div>
    <div class="card-list text-sm">
      <div>same hidden-test outcome</div>
      <div>same quality-gate result</div>
      <div>judge scores within ±1 on most dimensions</div>
      <div>cost within ~25% of the median</div>
    </div>
  </SketchBox>
  <div class="self-center t-dim">→</div>
  <div class="flex-[1.5] space-y-2">
    <SketchBox v-click="2" tone="good" seed="ad-yes"><div class="card-list"><b class="t-good">yes</b> → stop. Three was enough.</div></SketchBox>
    <SketchBox v-click="3" tone="crit" seed="ad-no" dashed><div class="card-list"><b class="t-crit">no</b> → two more runs. A 3-of-5 majority and a tighter median.</div></SketchBox>
  </div>
</div>

<div v-click="4" class="grid grid-cols-3 gap-5 mt-6 card-list">
  <div><div class="card-title">report both</div><b>pass^3</b>: passed every time, i.e. reliability. Next to <b>pass@3</b>: passed at least once, i.e. capability.</div>
  <div><div class="card-title">read a cell</div><span class="t-good">3/3</span> solid · <span class="t-warn">2/3</span> flaky · <span class="t-crit">1/3</span> lucky</div>
  <div><div class="card-title">what it costs</div>If one cell in four disagrees, ~3.5 runs per cell on average, not 5.</div>
</div>

<!--
So what's enough?

Three runs is the default for every cell.

[click] Then we ask whether they agree: the same hidden-test outcome, the same
gate result, judge scores within one point on most dimensions, and cost within
about a quarter of the median.

[click] If they agree, stop. Three was enough.

[click] If they don't, run two more. Five gives you a three-of-five majority and a
tighter median, which breaks the tie.

[click] Report pass^3, passed every time, which is reliability and what a team
needs, next to pass@3, passed at least once, which is capability and what demos
show. A cell then reads 3/3 solid, 2/3 flaky, 1/3 lucky. And because only the
disagreeing cells go to five, it costs about 3.5 runs per cell, not 5. With
plugin runs at hundreds to thousands of credits each, that difference is the
budget.
-->

---
clicks: 5
class: px-10 pt-6
---

<div class="kicker">Three questions it answers</div>

## Better than what?

<div class="grid grid-cols-3 gap-5 mt-3">
  <SketchBox v-click="1" tone="s5" seed="q-vanilla"><div class="card-title">vs doing nothing</div><div class="card-list"><b>arcus</b> vs a <b>vanilla</b> session, same model. Is the harness earning its place?</div></SketchBox>
  <SketchBox v-click="2" tone="s1" seed="q-version"><div class="card-title">vs our last release</div><div class="card-list"><b>arcus X++</b> vs <b>arcus X</b>, same model. Is the new version better?</div></SketchBox>
  <SketchBox v-click="3" tone="s3" seed="q-model"><div class="card-title">vs another model</div><div class="card-list"><b>@opus</b> vs <b>@sonnet</b>, same harness. Does the advantage hold?</div></SketchBox>
</div>

<div v-click="4" class="mt-7">
  <div class="card-title">and a release gate built from them</div>
  <div class="flex items-center gap-2 flex-nowrap gate-row">
    <SketchBox tone="s1" seed="g-1"><span class="t-ink">WIP branch</span></SketchBox><span class="t-dim">→</span>
    <SketchBox tone="s1" seed="g-2"><span class="t-ink">every ticket × 3</span><div class="t-dim text-xs">5 on disagreement</div></SketchBox><span class="t-dim">→</span>
    <SketchBox tone="s3" seed="g-3"><span class="t-ink">X vs X++ rows</span><div class="t-dim text-xs">in the matrix</div></SketchBox><span class="t-dim">→</span>
    <SketchBox tone="s6" seed="g-4"><span class="t-ink">compare</span><div class="t-dim text-xs">the cells that moved</div></SketchBox><span class="t-dim">→</span>
    <SketchBox v-click="5" tone="good" seed="g-5"><span class="t-ink">release</span><div class="t-dim text-xs">as reliable, no costlier</div></SketchBox>
  </div>
</div>

<style>
.gate-row :deep(.sb__body) { padding: 0.55rem 0.75rem; white-space: nowrap; }
</style>

<!--
Put together, the framework answers three versions of "better than what?".

[click] Versus doing nothing: arcus against a vanilla session on the same model.

[click] Versus our last release: X++ against X, same model.

[click] Versus another model: does the harness's advantage hold on a cheaper or
different model?

[click] And they compose into a release gate. A work-in-progress branch runs on
every ticket, three times each, five where the runs disagree. We compare the X
and X++ rows in the matrix, and run a comparison on the cells that moved.

[click] X++ ships only if it's at least as reliable and no more expensive on most
tickets. Not "it felt better in the demo".
-->

---
clicks: 6
class: px-10 pt-6
---

<div class="kicker">What the reports revealed</div>

## The receipts

<div class="mt-2">
  <MatrixGrid :rows="['v-opus', 'x-opus', 'xpp-opus']" :columns="['A', 'B', 'C']" :step="$clicks" :late="['xpp-opus:B']" :total="false" />
</div>

<div class="grid grid-cols-2 gap-5 mt-5">
  <SketchBox v-click="5" tone="s1" seed="rc-1">
    <div class="card-title">first read · the baseline</div>
    <div class="card-list">A vanilla session on Opus 5.5 passed every hidden test, at the lowest cost on every ticket. On the bug fix: <b>6 min, 56 credits</b>.</div>
  </SketchBox>
  <SketchBox v-click="6" tone="warn" seed="rc-2">
    <div class="card-title">second read · the release</div>
    <div class="card-list">X++ <b>halved</b> X's cost on the bug fix, exactly what its new size-based routing promised, and <span class="t-crit">broke</span> the 5-point story. One release, two verdicts.</div>
  </SketchBox>
</div>

<div v-click="6" class="t-dim text-sm mt-3">Every cell says 1/1, which is exactly why the last two slides exist.</div>

<!--
Here's the matrix for real, anonymised: three tickets, all on Opus 5.5.

[click] Vanilla: passes all three, at the lowest cost everywhere.
[click] arcus X, our previous release: passes all three, at three to eight times
the credits.
[click] arcus X++, the new release.
[click] And on Ticket B, the 5-point story: zero out of one.

[click] First read: the baseline was the surprise. A vanilla session on Opus 5.5
did the bug fix in 6 minutes for 56 credits, and passed everything.

[click] Second read: X++ did exactly what we built it to do on small tickets:
size-based routing halved the cost of the bug fix, 465 credits down to 222. And it
broke the bigger story. One release, two verdicts, and only a per-ticket view
shows you both. And yes: every cell is 1/1. That's what slides 18 and 19 are for.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="kicker">What the reports revealed</div>

## The judge was wrong

<div class="grid grid-cols-2 gap-6 mt-4">
  <SketchBox v-click="1" tone="s6" seed="jw-llm">
    <div class="card-title">the LLM-only comparison · Ticket B, X vs X++</div>
    <div class="punchline !text-2xl">"X++ did better."</div>
    <div class="card-list mt-2">
      <div>full-width calibration samples</div>
      <div>plan ranges that don't overlap</div>
      <div>a guard against concurrent runs</div>
    </div>
    <div class="t-dim text-sm mt-2">medium confidence · all true, all well argued</div>
  </SketchBox>
  <SketchBox v-click="2" tone="crit" seed="jw-test">
    <div class="card-title">the hidden test</div>
    <div class="punchline !text-2xl"><span class="t-crit">X++ 0/5.</span> X 5/5.</div>
    <div class="card-list mt-2">
      <div>every call to the new endpoint: <code class="t-crit">403 Forbidden</code></div>
      <div>a security rule for the new path was never added</div>
      <div>the code was elegant, and unreachable</div>
    </div>
  </SketchBox>
</div>

<div v-click="3" class="mt-7 punchline !text-2xl">Code grades. Models explain.</div>
<div v-click="3" class="card-list t-dim mt-1">That's why the grade is a given the judge may explain but never overturn.</div>

<!--
This is my favourite finding, because it's the one that justifies the design.

[click] Before the hidden test existed, an LLM compared X and X++ on Ticket B and
said X++ did better. Its reasons were real: better sampling, non-overlapping
ranges, a guard against concurrent runs. Medium confidence, well argued.

[click] Then we added the hidden test. X++: zero out of five. Every call to its
new endpoint returned 403, because nobody added a security rule for the new path.
Beautiful code that no request could ever reach. X passed all five.

[click] So: code grades, models explain. That's why, in this framework, the judge
is handed the grade as a given. It may explain it. It may never overturn it.
-->

---
clicks: 3
class: px-10 pt-6
---

<div class="kicker">What the reports revealed</div>

## Where the credits went

<StageSpend :step="Math.min($clicks, 2)" class="mt-1" />

<div v-click="3" class="grid grid-cols-[1fr_1.4fr] gap-6 mt-3">
  <div class="card-list">
    <div class="card-title">and the reviewers?</div>
    They found a real duplicate-key bug, and <b>approved the change anyway</b>: one or two warnings counts as "approved". The value was real; it was lost at approval.
  </div>
  <div>
    <div class="card-title">leads for slimming arcus, each traceable to a line in a report</div>
    <span class="chip">orchestrator on opus-5: 9.3 credits / call vs 4.2</span>
    <span class="chip">pass paths, not file contents</span>
    <span class="chip">remove redundant gates</span>
    <span class="chip">generate once, not repeatedly</span>
    <span class="chip">merge overlapping reviewers</span>
    <span class="chip">make review findings blocking</span>
  </div>
</div>

<!--
Across tickets, arcus spent up to eight times the credits of a vanilla session.
Here's one run, Ticket B, taken apart by stage.

The main session, the implementation orchestrator on Opus 5, five workers on
Sonnet, four review agents, and commits.

[click] Now the whole vanilla run on the same ticket, same scale.

[click] arcus's main session alone costs more than the entire vanilla run. And
the orchestrator charges about 9 credits per tool call, against 4 for the
vanilla session.

[click] And the review stage? It found a real bug, a duplicate-key failure on
replan, and approved anyway, because "one or two warnings" counts as approved.
The value was real; we threw it away at the approval step.

Every chip on the right is a lead we can trace to a line in a report: model
choice for subagents, passing paths instead of contents, redundant gates,
generating the same content more than once, overlapping reviewers, and making review
findings blocking. Evidence for the next release, not a feeling.
-->

---
clicks: 3
class: px-14 pt-12
---

<div class="kicker">So, do we even need a plugin?</div>

<div class="statement !text-5xl mt-6" v-click="1">Developers may not. <span class="t-warn">Organisations do.</span></div>

<div class="card-list text-lg mt-8 max-w-[44rem]" v-click="2">A standardised, opinionated, governed way of working, wrapped around the same vanilla sessions, and carrying the organisation's own context, guidelines and guardrails.</div>

<div class="punchline mt-8" v-click="3">The benchmark is how the wrapper <i>earns</i> that role, instead of assuming it.</div>
<div class="t-dim text-sm mt-2" v-click="3">A topic for another day.</div>

<!--
Which raises the obvious question: if vanilla is this good, why build a plugin
at all?

[click] Developers may not need one. Organisations do.

[click] Underneath, everything is a vanilla session. What an organisation needs is
how those sessions are wrapped: standardised, opinionated, governed, and carrying
its own context, conventions and guardrails.

[click] The benchmark is how that wrapper earns its role instead of assuming it.
That's a whole talk of its own.
-->

---
clicks: 6
class: px-10 pt-6
---

<div class="kicker">Where this goes next</div>

## The roadmap

<div class="grid grid-cols-3 gap-4 mt-4">
  <SketchBox v-click="1" tone="s1" seed="nx-suites"><div class="card-title">🧪 two suites</div><div class="card-list text-sm">A <b>regression</b> suite for daily work, and a <b>held-out</b> suite run only at release, so arcus is never tuned to the tickets it's graded on.</div></SketchBox>
  <SketchBox v-click="2" tone="s4" seed="nx-factory"><div class="card-title">🏭 a fixture factory</div><div class="card-list text-sm">Mine merged PRs. An agent drafts the hidden test, a human reviews it. Revert the human's PR hunk by hunk: each revert must turn a test red.</div></SketchBox>
  <SketchBox v-click="3" tone="s3" seed="nx-runtime"><div class="card-title">🔌 any runtime</div><div class="card-list text-sm">Copilot CLI today. Claude Code, Codex and OpenCode behind the same fixture and the same judge.</div></SketchBox>
  <SketchBox v-click="4" tone="s6" seed="nx-telemetry"><div class="card-title">📡 behavioural telemetry</div><div class="card-list text-sm">Which skills loaded vs were available. How often a review finding changed the code. Stage-level benchmarks.</div></SketchBox>
  <SketchBox v-click="5" tone="s5" seed="nx-judge"><div class="card-title">⚖️ a calibrated judge</div><div class="card-list text-sm">Agreement against a human panel, and judges from other vendors to rule out self-preference.</div></SketchBox>
  <SketchBox v-click="6" tone="good" seed="nx-ci"><div class="card-title">🔁 continuous benchmarking</div><div class="card-list text-sm">Every plugin PR benchmarked like a performance test. The matrix is the release dashboard; the gate is a dashboard, not a meeting.</div></SketchBox>
</div>

<!--
Where it goes next.

[click] Two suites: a regression suite we iterate against every day, and a
held-out suite we only run at release, so we never tune arcus to the tickets it
is graded on.

[click] A fixture factory: mine merged pull requests, let an agent draft the
hidden test, have a human review it, and prove it by reverting the human's change
one hunk at a time; every revert must turn a test red.

[click] Any runtime: Claude Code, Codex and OpenCode behind the same fixtures and
the same judge.

[click] Behavioural telemetry: which skills actually loaded, and how often a
review finding actually changed the code.

[click] A calibrated judge, checked against humans and against judges from other
vendors.

[click] And continuous benchmarking: every plugin PR benchmarked like a
performance test, with the matrix as the release dashboard.
-->

---
clicks: 5
class: px-14 pt-10
---

<div class="kicker">Next time someone says their agent is better, ask</div>

<div class="mt-6 space-y-3">
  <div v-click="1" class="statement !text-5xl !leading-tight">Better than <span class="t-warn">what?</span></div>
  <div v-click="2" class="statement !text-5xl !leading-tight">On <span class="t-warn">which</span> stories?</div>
  <div v-click="3" class="statement !text-5xl !leading-tight">Graded by <span class="t-warn">whom?</span></div>
  <div v-click="4" class="statement !text-5xl !leading-tight">At what <span class="t-warn">cost?</span></div>
</div>

<div v-click="5" class="mt-8">
  <div class="punchline">If the answers aren't on the result, it's a feeling.</div>
  <div class="card-list t-dim mt-1">Your eval harness is part of your agentic harness. Build it first.</div>
</div>

<!--
So, next time someone tells you their agent, their plugin, their harness is
better, ask four questions.

[click] Better than what? [click] On which stories? [click] Graded by whom?
[click] At what cost?

[click] If the answers aren't written on the result, it's a feeling. Your eval
harness is part of your agentic harness, so build it first. It's the thing that
tells you what everything else has to beat.
-->

---
class: px-14 pt-12
---

<div class="grid grid-cols-[1.4fr_1fr] gap-10 items-center h-[420px]">
  <div>
    <div class="kicker">Thank you</div>
    <h1 class="!text-6xl mt-3">Questions?</h1>
    <div class="card-list text-lg mt-6">Piyush Bhargava · Thoughtworks</div>
  </div>
  <div class="text-center">
    <img src="/images/qr-linkedin.svg" class="w-44 mx-auto rounded bg-white p-2" alt="LinkedIn QR code" />
    <div class="kicker mt-3">connect on LinkedIn</div>
  </div>
</div>

<!--
Thank you. Happy to take questions.
-->
