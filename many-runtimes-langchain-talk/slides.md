---
theme: seriph
colorSchema: dark
title: One Meta-Skill, Many Runtimes
info: |
  ## One Meta-Skill, Many Runtimes
  Orchestrating Agents Across Claude, Copilot, and OpenCode.

  LangChain Hyderabad Community meetup — 22 Aug 2026.
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

<div class="kicker">LangChain Community · Hyderabad · 22 Aug 2026</div>

<h1 class="!text-6xl mt-3 mb-5">One Meta-Skill,<br>Many Runtimes</h1>

<p class="text-2xl !text-[var(--ink-2)] max-w-[42rem] leading-snug">
  Orchestrating agents across Claude, Copilot, and OpenCode.
</p>

<div class="mt-10 flex items-center gap-3 text-base !text-[var(--ink-3)]">
  <span>Piyush Bhargava</span><span class="opacity-40">·</span><span>25 min + Q&amp;A</span>
</div>

<div class="assoc-block">
  <div class="kicker mb-3">In association with</div>
  <div class="assoc-logos">
    <img src="/images/thoughtworks-logo.svg" class="assoc-logo assoc-logo--card" alt="Thoughtworks" />
    <img src="/images/knacklabs-logo.png" class="assoc-logo" alt="KnackLabs" />
  </div>
</div>

<style>
/* Absolute + translateY(-50%) anchors to the slide's own definite box
   regardless of window size — avoids the vh/percentage-of-indefinite-parent
   traps that broke sizing elsewhere in this deck (see whoami / demo slide). */
.assoc-block {
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
.assoc-logos {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.assoc-logo {
  width: 170px;
  height: auto;
  display: block;
}
/* Thoughtworks' mark is dark-on-transparent (built for a light page) — a
   white card renders it as designed rather than recoloring their brand
   colors. KnackLabs' file is already a white/transparent mark, so it sits
   directly on the dark background. */
.assoc-logo--card {
  background: #fff;
  padding: 0.9rem 1.3rem;
  border-radius: 0.5rem;
}
</style>

<!--
Quick, high-energy title. The bio slide comes next — brief, then straight
into the hook.
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
    <div v-click="5">— Fitness freak and certified walk-a-holic <span class="!text-[var(--ink-3)]">(relevant later)</span></div>
  </div>
  <div class="whoami-col flex items-center justify-center">
    <img v-if="$clicks >= 5" src="/images/about-me.jpeg" class="whoami-pic" />
  </div>
</div>

<style>
/* Fixed height + overflow:hidden on the row alone wasn't enough. CSS Grid's
   implicit row track still auto-sizes itself from content — independent of
   the container's own explicit height/overflow-clip — so once the image
   mounted, the row's *internal* track grew past 400px and both columns
   stretched to that larger, content-driven value; only the final paint got
   clipped back down. The bullets' flex box was centering itself within that
   larger (pre-clip) height, which is what visibly shifted them down.
   display:flex + min-height:0 on both children closes that loophole: a flex
   container's cross-axis stretch sizes children off its OWN definite box,
   not an auto content-based track, and min-height:0 defeats flexbox's
   default "never shrink below content" rule that would otherwise still let
   a child override that. */
.whoami-row {
  /* Slidev's internal design canvas here is ~552px tall, not 720 — so this
     is a much bigger fraction of the slide than the number suggests. Leaves
     real breathing room below the row instead of running to the edge. */
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
Fast — under 30 seconds. The walk-a-holic line is a plant for Step Tracker
later; don't explain it now, just let it sit.
-->

---
layout: center
class: text-center
clicks: 2
---

<div class="statement max-w-[38rem] mx-auto">
  <div>I'm a backend developer.<br></div>
  <div v-click="1">I just shipped a <span class="dim">PWA ...</span></div>
  <div v-click="2"><strong>... Solo ;)</strong></div>
</div>

<!--
Personal cold open. Never touched frontend seriously before this. Land the
line, pause a beat, then move — this is the hook, not the thesis.
-->

---
layout: two-cols-header
layoutClass: gap-10
---

## Great power. Real constraints.

::left::

<div class="pt-4">

<div class="kicker mb-2">What changed</div>

- AI closed the skill gap
- things that needed a **team** now need **skills**, **agents** and **prompts**
- ideas that felt out of reach are just... buildable

</div>

::right::

<div class="pt-4">

<div class="kicker mb-2">What restricts</div>

- usage limits — hourly, weekly, monthly
- better quality comes at a heavy price
- trust issues
- higher context switching
- a job. a family. a life outside the editor

</div>

<!--
Set up the tension the whole talk resolves: capability exploded, but the
container around it — my actual week — didn't.
-->

---
layout: center
class: text-center
---

<p class="statement max-w-[42rem] mx-auto">
  The ceiling isn't <strong>capability</strong> anymore.<br>
  <span class="dim">It's <strong>capacity</strong>.</span>
</p>

<!--
One beat, then pivot straight into the reframe on the next slide.
-->

---
layout: center
class: text-center
---

<p class="statement max-w-[44rem] mx-auto">
  So the fix isn't a better framework alone.<br>
  It's the one that <span class="dim">isn't committed to one host.</span>
</p>

<div v-click class="mt-10 text-xl !text-[var(--ink-3)]">
  one meta-skill, many runtimes
</div>

<!--
This is the thesis sentence of the whole talk. Say it slowly.
-->

---
layout: center
class: px-14
---

<div class="kicker mb-4">ARCUS — Any Repository Can Use Spec-driven development</div>

<h2 class="mb-6">The Meta Skill and its agentic team</h2>

<div class="grid grid-cols-4 gap-5">
  <SketchBox v-click="1" seed="lead" color="var(--s1)">
    <div class="kicker mb-1">Lucie · Lead</div>
    <p class="text-base">My "meta-skill" - orchestrates the team, owns the delivery</p>
  </SketchBox>
  <SketchBox v-click="2" seed="arch" color="var(--s2)">
    <div class="kicker mb-1">Angelina · Architect</div>
    <p class="text-base">Analyses the req, designs the approach</p>
  </SketchBox>
  <SketchBox v-click="3" seed="dev" color="var(--s3)">
    <div class="kicker mb-1">Diana · Developer</div>
    <p class="text-base">The star full stack engineer <3 implements tasks, one at a time</p>
  </SketchBox>
  <SketchBox v-click="4" seed="qa" color="var(--s4)">
    <div class="kicker mb-1">Quinn · QA</div>
    <p class="text-base">Helps with the test plan, verifies it later</p>
  </SketchBox>
</div>

<p v-click="5" class="mt-8 text-xl !text-[var(--ink-2)]">
  One story at a time — and none of them care which host they're running on.
</p>

<!--
This is my open-source plugin, arcus-plugin. Mention it lives on GitHub —
github.com/piyushbhargava1412/arcus-plugin — audience can try it after.

Real names for the team, introduced one at a time: Lucie (Lead), Angelina
(Architect), Diana (Developer), Quinn (QA).
-->

---
clicks: 9
class: px-10 pt-6
---

<div class="kicker mb-3">A typical flow - Host agnostic</div>

<div class="grid grid-cols-3 gap-8">
  <div>
    <ArcusPipeline :step="$clicks" />
  </div>
  <div class="pl-6" style="border-left: 1px solid var(--ctx-line)">
    <ArcusCheckpoint :step="$clicks" mode="json" />
  </div>
  <div class="pl-6" style="border-left: 1px solid var(--ctx-line)">
    <ArcusCheckpoint :step="$clicks" mode="files" />
  </div>
</div>

<!--
The slide opens with just the Story box — no checkpoint, no folder, because
without a story there's nothing to track yet. First click is Scaffold: no
persona runs it, it's a deterministic script, and it's the literal moment
session-checkpoint.json and .arcus/specs/STEP-007/ get created — watch both
right columns go from empty to their first line on this exact click.

From there: Lead turns it into a spec, Architect plans the approach. QA
shows up twice — first writing the test plan, then later reviewing the
diff — same role, both real ARCUS pipeline stages. Developer implements
task by task. QA reviews and — this is the honest part — requests changes
on round 1. It loops back to Developer, comes back for round 2, gets
approved, lands as a pull request.

Watch the two right-hand columns the whole time: session-checkpoint.json in
the middle is the one file underneath all of it — every stage completion,
and the review_round flip, is a write to that file. The right column is
what's actually on disk in .arcus/specs/STEP-007/ because of those writes.
That's the actual mechanism for "resume on another host": there is no
state anywhere that isn't also sitting on disk, in that file.
-->

---
layout: center
---

## How not to lose your homework

<div class="mt-6 space-y-4 text-xl max-w-[40rem]">
  <div v-click="1">— every story's spec, plan, and progress live as <strong>files on disk</strong>, not in a chat window</div>
  <div v-click="2">— hit a usage limit mid-story? that's fine — <strong>nothing is in the model's head</strong> that isn't also on disk</div>
  <div v-click="3">— open the same repo in a different host, and the next agent picks up <strong>exactly where the last one stopped</strong></div>
</div>

<!--
This is the enabling idea for the whole diagram on the next slide: the
handoff works because state was never trapped in one session.
-->

---
clicks: 4
class: px-14 pt-24
---

<div class="kicker mb-4 text-center">Whack-a-Limit</div>

<div class="w-full mt-6">
  <RuntimeRelay :step="$clicks" />
</div>

<!--
This is a real night, in order, not a menu of options. Click 1: Claude,
my daily driver — 5h and weekly caps, both eventually hit. Click 2: switch
to Copilot, same story continues, same wall shows up. Click 3: OpenCode,
talking to DeepSeek V4 Flash's free tier — great, until the daily token
limit says otherwise too. Click 4: the last resort — OpenCode pointed at
Qwen3.8-27B running locally through LM Studio. No cap at all, because
there's no one else's server to rate-limit me on — just my own laptop's
fans, and the fact that I can't open Slack while it's thinking.
-->

---
layout: center
class: text-center
---

<p class="statement max-w-[42rem] mx-auto">
  The local model works<br><span class="dim">while I sleep.</span>
</p>

<p v-click class="mt-8 text-lg !text-[var(--ink-3)] max-w-[36rem] mx-auto">
  close every other tab, let it run overnight — local compute is slow, but does not burn tokens a.k.a $$$
</p>

<!--
Quick beat, not a deep dive on local inference — the point is just that the
same meta-skill reaches all the way down to a model on your own machine.
-->

---
layout: center
clicks: 5
class: px-16
---

<div class="kicker mb-2">Every host defines their own standards</div>

## Three hosts, zero shared assumptions

<div class="mt-5 space-y-4 text-lg max-w-[52rem]">
  <div v-click="1">— <code>disallowed-tools</code> (kebab) is <strong>silently ignored</strong> on Claude Code. <code>disallowedTools</code> (camelCase) actually works. Same words. Opposite outcome.</div>
  <div v-click="2">— "Bash" isn't Bash everywhere: Copilot CLI splits it into <code>bash</code>, <code>read_bash</code>, <code>stop_bash</code>, <code>list_bash</code>. Claude Code just calls it <code>Bash</code>.</div>
  <div v-click="3">— Model tiers aren't universal: Claude Code resolves <code>sonnet</code> to a real model; Copilot CLI doesn't resolve tier words at all; OpenCode pins the literal model ID per agent at build time — no runtime override.</div>
  <div v-click="4">— <code>CLAUDE_PLUGIN_ROOT</code> is real, and fires on Copilot CLI too. OpenCode has no such token — it self-locates from its own file path instead.</div>
  <div v-click="5">— Nested subagents: Claude Code / OpenCode had subagents in their armor from long. CoPilot got its custom subagents recently (June 2026). And a Copilot child still only inherits its parent's <em>whole</em> toolset.</div>
</div>

<!--
This is the "for the builders in the room" slide — the LangChain crowd will
appreciate that none of this is theoretical, it's from shipping the actual
plugin across three hosts. Each of these was found by measuring, not by
reading docs — the docs were wrong about this as often as I was.

Point 1 is the funniest and scariest: it's an exact string match on
"disallowed-tools" vs "disallowedTools" that silently decides whether your
denylist does anything at all, with zero error either way.

Point 5: GitHub's own open issue tracker has a live "Tool Scoping for
Sub-Agents" feature request (github/copilot-cli#2992) — this isn't a dig,
it's a young feature catching up.
-->

---
class: px-10 pt-8 text-center
---

## Alright folks .. Showtime !!

<div class="mt-8 flex justify-center items-center gap-8 demo-row">
  <img src="/images/step-tracker-dashboard.png" class="demo-shot" alt="Step Tracker Pro dashboard: today's progress, active streaks, calendar heat-map" />
  <img src="/images/step-tracker-second.png" class="demo-shot" alt="Step Tracker Pro backup and restore: local JSON export and Google Drive sync" />
</div>

<style>
/* Same fix as the whoami slide: vh measures the real browser viewport, not
   Slidev's own (much smaller, ~552px-tall) design canvas that gets scaled
   to fit the window — so a vh-sized image ran clean off the bottom edge.
   A definite height here, well short of the canvas height, leaves real
   clearance below instead. */
.demo-row {
  height: 380px;
}
.demo-shot {
  height: 100%;
  width: auto;
  max-width: 46%;
  object-fit: contain;
  border-radius: 0.5rem;
  border: 1px solid var(--ctx-line);
}
</style>

<!--
LIVE DEMO — ~2 min. Switch tabs to the actual running app. Show today's
progress, the active streak, the calendar heat-map, then the backup/restore
tab on the right. This is the payoff slide — let it breathe, don't rush
past it.
-->

---
layout: center
---

## The receipts

<div class="mt-6 grid grid-cols-3 gap-5 text-center">
  <SketchBox seed="s15" color="var(--s1)">
    <div class="metric text-4xl">15+</div>
    <p class="text-sm !text-[var(--ink-3)] mt-1">stories shipped</p>
  </SketchBox>
  <SketchBox seed="s0" color="var(--s3)">
    <div class="metric text-4xl">&#8734;</div>
    <p class="text-sm !text-[var(--ink-3)] mt-1">stalls survived, zero losses</p>
  </SketchBox>
  <SketchBox seed="s2" color="var(--s4)">
    <div class="metric text-4xl">~2</div>
    <p class="text-sm !text-[var(--ink-3)] mt-1">days, main features live</p>
  </SketchBox>
</div>

<p v-click class="mt-8 text-lg !text-[var(--ink-2)]">
  gamification stories are next — same team, same trick.
</p>

<!--
Concrete numbers land the story before the takeaway. Keep this fast.
-->
---
layout: center
---

## Not every problem needs the Avengers

<div class="mt-6 max-w-[38rem]">
  <SketchBox seed="gemini" color="var(--s5)">
    <p class="text-lg">Step Tracker leans on the <strong>Google Fit API</strong> — so the brainstorming for that part happened with <strong>Google Gemini</strong>, not the agent team.</p>
  </SketchBox>
</div>

<p v-click class="mt-6 text-lg !text-[var(--ink-2)]">
  The meta-skill decides <em>who builds</em>. It doesn't stop me from deciding <em>who to think with</em>.
</p>

<!--
Short slide — keeps the talk honest that this isn't "one framework for
everything," it's knowing which tool earns the job.
-->

---
layout: center
clicks: 4
class: px-16
---

<div class="kicker mb-6">TL;DR</div>

<div class="space-y-4 text-2xl max-w-[46rem]">
  <div v-click="1">— The constraint was never skill. It was <strong>capacity</strong>.</div>
  <div v-click="2">— Build the <strong>meta-skill</strong>, not a loyalty to one host.</div>
  <div v-click="3">— Keep state on <strong>disk</strong>, and any runtime can pick it up.</div>
  <div v-click="4">— Down side: managing <strong>host specific constraints</strong> internally to deliver a unified framework.</div>
</div>

---
layout: center
class: text-center
---

<p class="statement max-w-[38rem] mx-auto">
  Questions
</p>

<p class="mt-3 text-lg !text-[var(--ink-3)]">(or bugs. I'll take bugs too.)</p>

<div class="mt-10 flex justify-center gap-14">
  <div class="text-center">
    <div class="qr-card"><img src="/images/qr-linkedin.svg" alt="QR code to Piyush Bhargava's LinkedIn profile" /></div>
    <div class="mt-2 kicker">Find me on LinkedIn</div>
  </div>
  <div class="text-center">
    <div class="qr-card"><img src="/images/qr-arcus.svg" alt="QR code to the ARCUS plugin docs" /></div>
    <div class="mt-2 kicker">try ARCUS yourself</div>
  </div>
</div>

<div class="mt-6 text-lg !text-[var(--ink-2)]">Thank you !</div>

<style>
.qr-card {
  background: #fff;
  padding: 0.7rem;
  border-radius: 0.5rem;
  width: 9rem;
  height: 9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-card img { width: 100%; height: 100%; }
</style>

<!--
ARCUS is open source — invite people to try it on their own repo. Point
their phone cameras at the right-hand code, or catch me after for the
GitHub link too. Left code is LinkedIn if anyone wants to keep arguing
about this in my DMs.
-->
