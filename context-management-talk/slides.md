---
theme: seriph
colorSchema: dark
title: Context Engineering
info: |
  ## Context Engineering
  What context is, how an agent spends it, and how to keep a long-running
  task from drowning in its own transcript.

  What's in the AIr — AI Community talk series.
class: text-left
lineNumbers: false
drawings:
  persist: false
transition: slide-left
duration: 45min
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

<div class="kicker">What's in the AIr · 31 July 2026</div>

<h1 class="!text-7xl mt-3 mb-5">Context Engineering</h1>

<p class="text-2xl !text-[var(--ink-2)] max-w-[42rem] leading-snug">
  Your agent isn't getting dumber as the task gets longer.<br>
  It's running out of room to think.
</p>

<div class="mt-10 max-w-[30rem]">
  <ContextWindow
    compact :legend="false" :capacity="200000" title="" free-label=""
    :segments="[
      { label: 'system', tokens: 1800, slot: 1 },
      { label: 'tools', tokens: 3400, slot: 2 },
      { label: 'history', tokens: 118000, slot: 3 },
      { label: 'files', tokens: 52000, slot: 4 },
      { label: 'your ask', tokens: 180, slot: 5 },
    ]"
  />
</div>

<div class="mt-8 flex items-center gap-3 text-base !text-[var(--ink-3)]">
  <span>Piyush Bhargava</span><span class="opacity-40">·</span><span>45 min + Q&amp;A</span>
</div>

<!--
One breath of framing: this is not a prompt-tricks talk. It's about everything
*around* the prompt — the part you actually control.

Hands up: who has had an agent go great for ten minutes and then fall apart?
Keep that moment; you call back to it at the close.
-->

---
layout: center
clicks: 2
class: px-14
---

<div class="kicker mb-5">Same model, same question · early context vs. 95% full</div>

<div class="grid grid-cols-2 gap-12 items-start">

<div>
  <div class="mb-2 text-lg"><span class="metric">Turn 3</span> — "Which database did we decide on, and why?"</div>
  <ContextWindow
    compact :capacity="200000" title="what the model sees"
    :segments="[
      { label: 'system &amp; instructions', tokens: 1800, slot: 1 },
      { label: 'tool schemas', tokens: 3400, slot: 2 },
      { label: 'conversation history', tokens: 2600, slot: 3 },
      { label: 'architecture docs', tokens: 4200, slot: 4 },
      { label: 'your actual question', tokens: 180, slot: 5 },
    ]"
  />
  <p class="mt-4 text-lg"><span class="text-[var(--st-good)]">✓</span> "Postgres — the transactional requirement in checkout ruled out Dynamo."</p>
</div>

<div v-click="1">
  <div class="mb-2 text-lg"><span class="metric">Turn 40</span> — "Which database did we decide on, and why?"</div>
  <ContextWindow
    compact :capacity="200000" title="what the model sees"
    :segments="[
      { label: 'system &amp; instructions', tokens: 1800, slot: 1 },
      { label: 'tool schemas', tokens: 3400, slot: 2 },
      { label: 'conversation history', tokens: 142000, slot: 3 },
      { label: 'architecture docs', tokens: 42000, slot: 4 },
      { label: 'your actual question', tokens: 180, slot: 5 },
    ]"
  />
  <p class="mt-4 text-lg"><span class="text-[var(--st-crit)]">✗</span> "Postgres — because it scales better horizontally as we grow."</p>
  <p class="mt-1 text-sm !text-[var(--ink-3)]">that's the argument <em>for</em> Dynamo — the option that lost</p>
</div>

</div>

<div v-click="2" class="mt-8 text-center">
  <p class="text-2xl">Nothing about the model changed. Only <strong>what we put in front of it</strong>.</p>
  <p class="mt-2 text-lg !text-[var(--ink-3)]">The name survived. The reasoning didn't.</p>
</div>

<!--
Identical question, word for word, asked twice in one session. This is a
recall question, not a search problem — no one can object "why ask it twice,"
because reconfirming an agreed decision mid-project is completely normal.

Turn 3: fresh off the decision, small context, nails both the name AND the
reason.

Turn 40, same session, nothing about the decision itself ever changed — just
37 more turns of unrelated architecture discussion piled on top. Watch the bar:
94.7%, rounds to 95%, right at the edge of what's usable.

The database name survived — "Postgres" gets repeated constantly for 37 turns,
so it's reinforced. The REASON was stated once, early, in prose, and that's
exactly the kind of thing that gets buried in the middle or diluted first.
So it doesn't say "I don't remember" — it confidently states a reason that's
actually backwards: horizontal scaling is the argument FOR Dynamo, the option
that lost. That's a real hallucination, not a lookup failure.

Callback for later: this is the exact Postgres/Dynamo pair that resurfaces on
the compaction slide in part five. Flag it here lightly ("hang on to this
example") so the callback lands as a deliberate payoff, not a coincidence.
-->

---
layout: center
class: text-center
---

<p class="statement max-w-[46rem] mx-auto">
  Prompt engineering is what you <span class="dim">say</span>.<br>
  Context engineering is <span class="dim">everything else</span> in the room
  when you say it.
</p>

<!-- The thesis. Say it, pause, move on. You repeat it at the close. -->

---
layout: center
clicks: 6
class: px-20
---

<div class="kicker mb-8">Agenda</div>

<div class="space-y-4 text-2xl">
  <div v-click="1" class="flex gap-6 items-baseline">
    <span class="metric !text-[var(--ink-3)] w-10">01</span><span>Words we'll use</span>
  </div>
  <div v-click="2" class="flex gap-6 items-baseline">
    <span class="metric !text-[var(--ink-3)] w-10">02</span><span>What context actually is</span>
  </div>
  <div v-click="3" class="flex gap-6 items-baseline">
    <span class="metric !text-[var(--ink-3)] w-10">03</span><span>What happens when a session starts</span>
  </div>
  <div v-click="4" class="flex gap-6 items-baseline">
    <span class="metric !text-[var(--ink-3)] w-10">04</span><span>Tokens, and what they cost</span>
  </div>
  <div v-click="5" class="flex gap-6 items-baseline">
    <span class="metric !text-[var(--ink-3)] w-10">05</span><span>Bloat, overload, compaction</span>
  </div>
  <div v-click="6" class="flex gap-6 items-baseline">
    <span class="metric !text-[var(--ink-3)] w-10">06</span><span><strong>Seven moves that fix it</strong></span>
  </div>
</div>

<!--
Twenty seconds. Tell them 06 is the practical part so the tactically-minded
hang on through the concepts.
-->

---
layout: section
---

<div class="kicker mb-3">Part one</div>

# Words we'll use

<!-- Two minutes. Nobody asks "what's a subagent?" out loud, so answer it up front. -->

---
clicks: 5
---

## Everything below is a separate context window

<div class="max-w-[93%] mx-auto">
  <AgentTree :level="$clicks" />
</div>

<!--
Build it click by click:
 1. HARNESS  — the app you're sitting in. It decides what gets loaded and when.
 2. SESSION  — one conversation. One budget. Ends when you close it.
 3. LEAD AGENT — the one you talk to. Owns the main window.
 4. SUBAGENT — dispatched by the lead, gets its OWN fresh window,
    returns only a result. This is the load-bearing idea of the whole talk.
 5. NESTED SUBAGENT — a subagent doing the same thing one level down.

The payoff line: a subagent can burn 80K tokens and hand back 500. That 80K
never touches the lead's window.
-->

---
layout: two-cols-header
layoutClass: gap-10
---

## The rest of the vocabulary

::left::

| term | what it means |
|---|---|
| **skill** | a folder of instructions the agent loads *on demand* |
| **agent** | a role definition — model, tools, prompt |
| **session** | one conversation, one budget |
| **harness** | the app running the loop |
| **context** | what's in the window right now |

::right::

<div class="pt-2">
<div class="kicker mb-3">Harnesses you might be using</div>

- Copilot CLI · Copilot app
- Claude Code CLI · Claude Code app
- VS Code · JetBrains
- OpenCode

<p class="mt-6 text-[var(--ink-3)]">
Same model underneath. Very different rules about <em>what gets loaded when</em> —
that's the harness's job, and it's the thing you're really tuning.
</p>
</div>

<!--
Don't read the table. Say the one thing that matters: a skill's *description*
is always loaded; its *body* is not. That's the mechanism behind half of
part six.
-->

---
layout: section
---

<div class="kicker mb-3">Part two</div>

# What context actually is

---
layout: center
class: px-16
---

## Context ≠ context window

<div class="grid grid-cols-2 gap-14 mt-8">

<SketchBox seed="ctxwin" color="var(--ink-2)">
  <div class="kicker mb-2">Context window</div>
  <p class="text-xl">The <strong>size of the desk</strong>.</p>
  <p class="mt-3 text-[var(--ink-2)]">
    A hard limit set by the model. 200K, 1M. You don't change it at runtime.
  </p>
</SketchBox>

<SketchBox seed="ctx" color="var(--s1)">
  <div class="kicker mb-2">Context</div>
  <p class="text-xl">The <strong>stuff on the desk</strong>.</p>
  <p class="mt-3 text-[var(--ink-2)]">
    Everything you and the harness put there this turn. Entirely yours to
    manage.
  </p>
</SketchBox>

</div>

<p v-click class="mt-10 text-center text-2xl">
  Ephemeral memory for one session — and it is <strong>rebuilt from scratch every turn</strong>.
</p>

<!--
The desk analogy carries the whole talk for the non-developers in the room.
Buying a bigger desk doesn't help if you pile the whole filing cabinet on it.
-->

---
clicks: 6
---

## What an agent spends it on

<div class="text-[var(--ink-3)] mb-6">Six things compete for one desk. Only one of them is your question.</div>

<ContextWindow
  :visible="$clicks" :capacity="200000"
  title="a coding agent, mid-task" subtitle="200K working budget"
  :segments="[
    { label: 'system prompt &amp; instructions', tokens: 4200, slot: 1, note: 'AGENTS.md, hooks, house rules' },
    { label: 'tool + MCP schemas', tokens: 12000, slot: 2, note: 're-sent every single turn' },
    { label: 'conversation history', tokens: 42000, slot: 3, note: 'grows forever, by default' },
    { label: 'tool results', tokens: 39000, slot: 4, note: 'greps, test output, stack traces' },
    { label: 'files it read', tokens: 31000, slot: 4, note: 'the sleeper cost' },
    { label: 'your actual turn', tokens: 180, slot: 5, note: '0.1% of the payload' },
  ]"
/>

<p v-click="6" class="mt-8 text-2xl">
  You control all six. Most of us only ever edit
  <span class="text-[var(--s5)]">■</span> <strong>the last one</strong>.
</p>

<!--
Narrate each click:
 1. system — small, but it's the constitution. Cheap to get right.
 2. tools — people forget this is re-sent EVERY turn. 15 MCP servers is a tax.
 3. history — grows without anyone deciding it should.
 4. tool results — one `grep` across a monorepo, 20K gone.
 5. files — one `cat` of a big file, 30K gone.
 6. the ask — the sliver.
-->

---
layout: two-cols-header
layoutClass: gap-10
---

## Look at it yourself

::left::

```txt
Context Usage

claude-sonnet-5 · 23k/1000k tokens (2%)

  ○ System Prompt     10.3k    (1%)
  ○ System Tools      11.3k    (1%)
  ● MCP Tools          1.1k   (<1%)
  ◍ Messages              0    (0%)
  · Free Space       866.5k   (87%)
  ◎ Buffer           110.8k   (11%)
```

<p class="text-[var(--ink-3)] text-sm mt-2">a real session, brand new — nothing typed yet</p>

::right::

<div class="pt-3">

- **23k gone before you say a word** — prompt, tools, MCP
- Run it **at the start**: that's your floor
- Run it again **when things get weird**
- The number that matters isn't *used*, it's **what's using it**

</div>

<div v-click class="mt-6">
<SketchBox seed="habit" color="var(--st-warn)">
  <p class="text-xl">One habit to take home: <strong>look at your context before you blame the model.</strong></p>
</SketchBox>
</div>

<!--
Real numbers, real session, 1M window. Note Messages is literally 0 — this is
the bill before the conversation starts.

Then set up the next slide: one line in there is not what it looks like. Let
someone spot "Buffer" if they're quick.
-->

---
clicks: 3
---

## You have less than it says

<ContextWindow
  :capacity="1000000" :buffer="110800" :legend="false"
  title="claude-sonnet-5" subtitle="advertised: 1,000,000 tokens" free-label=""
  :segments="[
    { label: 'system prompt', tokens: 10300, slot: 1 },
    { label: 'system tools', tokens: 11300, slot: 2 },
    { label: 'MCP tools', tokens: 1100, slot: 2 },
  ]"
/>

<div class="mt-10 space-y-4 text-xl max-w-[46rem]">
  <p v-click="1">
    That hatched strip on the right is the <strong>autocompact buffer</strong> — 110.8k, reserved by the harness.
  </p>
  <p v-click="2">
    You never get to fill it. The real ceiling is <span class="metric">889k</span>, not <span class="metric">1M</span>.
  </p>
  <p v-click="3" class="!text-[var(--st-warn)]">
    And compaction fires when you reach <em>that</em> line — not at 100%.
  </p>
</div>

<!--
The point they came for: the advertised window is not the usable window.

Why the buffer exists: the harness needs room to run the compaction summary
itself. If it waited until the window was genuinely full, there'd be no space
left to do the summarising in.

So two numbers in your head are always wrong — the window is smaller than
advertised, and the moment of failure comes earlier than you think.

11% in this session. It varies by harness and window size; check yours.
-->

---

## The chat window is a lie

<div class="text-[var(--ink-3)] mb-4">No conversation. One flat blob of tokens, rebuilt every single turn.</div>

````md magic-move {lines: false}
```jsonc
// what it feels like you sent
{ "message": "fix the failing test" }
```

```jsonc
// what actually goes over the wire
{
  "system": "You are a coding agent. Follow AGENTS.md...",  //  4,200 tok
  "tools":  [ read, write, bash, grep, ...20 more ],        // 12,000 tok
  "messages": [
    { "role": "user", "content": "fix the failing test" }   //    180 tok
  ]
}
```

```jsonc
// what actually goes over the wire — at turn 40
{
  "system": "You are a coding agent. Follow AGENTS.md...",  //   4,200 tok
  "tools":  [ read, write, bash, grep, ...20 more ],        //  12,000 tok
  "messages": [
    /* turns 1-39: every question, every answer, every    */ // 121,000 tok
    /* tool call, every file it read, every stack trace,  */ //  58,000 tok
    /* and every wrong guess it already made              */
    { "role": "user", "content": "fix the failing test" }    //     180 tok
  ]
}
```
````

<p v-click class="mt-5 text-2xl max-w-[44rem]">
  The model is <strong>stateless</strong>. The "memory" is you, paying to re-upload it.
</p>

<!--
Let step three sit for a beat so people read the comment column, not the JSON.

If someone raises caching: yes, it makes the re-upload cheap. It does NOT make
it small. Attention cost and distraction cost are unchanged. Park it for part 4.
-->

---
layout: section
---

<div class="kicker mb-3">Part three</div>

# What happens when a session starts

---
clicks: 3
---

## Before you type anything

<div class="grid grid-cols-2 gap-10 mt-4">

<div>
<div class="kicker mb-3">Loaded into the window at boot</div>

<div v-click="1">

- system prompt
- **every tool name + full JSON schema**
- **every MCP server's tools** — same deal
- skill **descriptions only** (one line each)
- agent **descriptions only**
- `AGENTS.md` / `CLAUDE.md` / `copilot-instructions.md` — **in full**

</div>
</div>

<div>
<div class="kicker mb-3">Not loaded — yet</div>

<div v-click="2">

- skill **bodies** (`SKILL.md`)
- agent **bodies**
- any file the instructions merely *mention*
- anything a tool would return

</div>
</div>

</div>

<div v-click="3" class="mt-4">
<ContextWindow
  compact :capacity="1000000" :buffer="110800"
  title="the bill before you say hello" subtitle="real session"
  :segments="[
    { label: 'system prompt', tokens: 10300, slot: 1 },
    { label: 'system tools', tokens: 11300, slot: 2 },
    { label: 'MCP tools', tokens: 1100, slot: 2 },
  ]"
/>
</div>

<!--
The two-list shape is the point: descriptions load, bodies don't. That's
progressive disclosure, and it's why a fat AGENTS.md is so expensive — it's on
the LEFT list, paid on turn one and on every turn after.

The bar is the same real session as two slides ago, with the autocompact
buffer still hatched on the right. Working room is what's left between the
coloured blocks and that strip.
-->

---
layout: center
class: px-16
---

## The AGENTS.md trap

<div class="grid grid-cols-2 gap-12 mt-6">

<SketchBox seed="fat" color="var(--st-crit)">
  <div class="kicker mb-2">Encyclopedia · 6,800 tok</div>

```md
# AGENTS.md
## Architecture
<40 lines on the service layer>
## Testing
<30 lines of conventions>
## Deploy
<25 lines of runbook>
```

  <p class="mt-3 text-[var(--ink-2)]">Paid on <strong>every turn</strong>. Mostly irrelevant to <em>this</em> task.</p>
</SketchBox>

<SketchBox seed="thin" color="var(--st-good)">
  <div class="kicker mb-2">Index · 600 tok</div>

```md
# AGENTS.md
| I need… | Go to |
|---|---|
| tech stack | docs/map.md#stack |
| test rules | docs/test.md#conventions |
| deploy | docs/run.md#deploy |
```

  <p class="mt-3 text-[var(--ink-2)]">Paid once, cheaply. The agent <strong>fetches only what it needs</strong>.</p>
</SketchBox>

</div>

<p v-click class="mt-8 text-center text-2xl">
  A navigation index, not a knowledge dump.
</p>

<!--
This is the highest-ROI slide in the deck for most people in the room — it's a
15-minute change to a file they already have.
-->

---
layout: center
class: px-20
---

## Point at sections, not files

<div class="mt-8 space-y-6 max-w-[46rem] mx-auto">

<SketchBox seed="bad" color="var(--st-crit)">
  <p class="text-xl">See <code>docs/architecture.md</code> for the data model.</p>
  <p class="mt-2 text-[var(--ink-3)]">→ agent reads the whole file · <span class="metric">9,400 tokens</span></p>
</SketchBox>

<div class="text-center text-3xl !text-[var(--ink-3)]">↓</div>

<SketchBox seed="good" color="var(--st-good)">
  <p class="text-xl">See <code>[architecture.md#data-model]</code>.</p>
  <p class="mt-2 text-[var(--ink-3)]">→ agent reads one section · <span class="metric">400 tokens</span></p>
</SketchBox>

</div>

<p v-click class="mt-8 text-center text-xl !text-[var(--ink-2)]">
  Same information available. <strong>23× less of it resident.</strong>
</p>

<!--
Caveat worth saying out loud: this works when the agent honours the anchor.
Most will read the section; some will still slurp the file. Check yours once —
the /context number tells you immediately.
-->

---
layout: section
---

<div class="kicker mb-3">Part four</div>

# Tokens, and what they cost

---
layout: two-cols-header
layoutClass: gap-12
---

## Input and output are not the same price

::left::

<div class="pt-2">

- a token ≈ **¾ of a word**
- **input** = everything you send, every turn
- **output** = what the model writes back
- output costs **~5×** input
- but input **volume** dwarfs output volume

</div>

<div class="mt-3">
<SketchBox seed="tokfact" color="var(--s1)">
  <p class="text-lg">In a long agentic session, <strong>input is the bill</strong> — you re-send the entire context every single turn.</p>
</SketchBox>
</div>

::right::

<div class="pt-2">
<div class="kicker mb-3">Rate card · per million tokens</div>

| model | in | out | window |
|---|---|---|---|
| **Opus 5** | $5 | $25 | 1M |
| **Sonnet 5** | $3 | $15 | 1M |
| **Haiku 4.5** | $1 | $5 | 200K |

<div class="kicker mt-2 mb-1">Caching changes the maths</div>

| | multiplier |
|---|---|
| cache **read** | ~0.1× input |
| cache **write** | 1.25× (5 min) · 2× (1 hr) |

<p class="text-[var(--ink-3)] text-sm mt-1">rates as of mid-2026 — check before you present</p>

</div>

<!--
Caching is the honest counter-argument to this whole section, so raise it
yourself: a stable prefix gets you ~90% off the re-upload. But note the two
catches — it needs a byte-identical prefix (so a timestamp in your system
prompt kills it), and it does nothing about attention. Cheap noise is still
noise.
-->

---
clicks: 2
---

## What it costs to let context grow

<CostCurve :series="$clicks + 1" />

<div v-click="1" class="mt-1 grid grid-cols-3 gap-5">
  <SketchBox seed="c1" color="var(--s1)">
    <p>naive · <span class="metric">4.10M</span> input tokens</p>
    <p class="text-[var(--ink-3)]">≈ <span class="metric">$20.50</span> at Opus rates</p>
  </SketchBox>
  <SketchBox seed="c2" color="var(--s2)">
    <p>engineered · <span class="metric">1.40M</span></p>
    <p class="text-[var(--ink-3)]">≈ <span class="metric">$7.00</span></p>
  </SketchBox>
  <SketchBox seed="c3" color="var(--ink-2)">
    <p>and the cheap one</p>
    <p class="text-[var(--ink-3)]">is also the one that <strong>works</strong></p>
  </SketchBox>
</div>

<!--
The arithmetic is deliberately checkable on stage — the model is stateless, so
cumulative input = the sum of the context size at each turn. Naive: context
grows 5K→200K over 40 turns, so ~40 × 102.5K. Engineered: 40 × 35K flat.

Make the last box the point. Nobody in the room is here to save $13. They're
here because the 4.1M run produces worse code.
-->

---
layout: section
---

<div class="kicker mb-3">Part five</div>

# Bloat, overload, compaction

---
clicks: 5
---

## Watch it fill up

<div class="text-[var(--ink-3)] mb-3">One story, one window: spec → plan → implement → review → PR</div>

<PipelineFill :step="$clicks" :capacity="200000" />

<!--
THE slide. Advance one stage at a time and narrate what got added:

 spec       18K — the conversation that produced the requirements
 plan       46K — plus the architecture debate and the rejected options
 implement 118K — plus every file read, every test run, every stack trace
 review    172K — plus the diff, plus the review comments
 PR        214K — over the line. Compaction fires, or the run fails.

Nobody made a bad decision at any single step. Every step was reasonable.
That's what makes this the default outcome rather than a mistake.
-->

---
layout: center
class: px-14
---

## What overload actually does

<div class="grid grid-cols-3 gap-6 mt-8">

<SketchBox seed="f1" color="var(--st-crit)">
  <div class="kicker mb-1">Poisoning</div>
  <p>A wrong guess lands in the history — and becomes a "fact" it now reasons from.</p>
</SketchBox>

<SketchBox seed="f2" color="var(--st-crit)">
  <div class="kicker mb-1">Distraction</div>
  <p>So much transcript that it starts imitating its past turns instead of thinking.</p>
</SketchBox>

<SketchBox seed="f3" color="var(--st-crit)">
  <div class="kicker mb-1">Confusion</div>
  <p>Twenty tools loaded, three relevant. It reaches for the wrong one.</p>
</SketchBox>

<SketchBox seed="f4" color="var(--st-crit)">
  <div class="kicker mb-1">Clash</div>
  <p>Turn 6 says X. Turn 31 says not-X. Both are still in the window.</p>
</SketchBox>

<SketchBox seed="f5" color="var(--st-crit)">
  <div class="kicker mb-1">Rot</div>
  <p>Quality decays with length even when nothing in there is wrong.</p>
</SketchBox>

<SketchBox seed="f6" color="var(--ink-2)">
  <div class="kicker mb-1">And then…</div>
  <p class="text-xl">the harness compacts, which is its own problem →</p>
</SketchBox>

</div>

<!--
Don't read six boxes. Pick the two your audience will recognise — poisoning
and clash get the most nods — tell a 20-second story for each, and move.

Callback opportunity: distraction is what happened to the database rationale
in the cold open — 37 turns of architecture chatter gave it plenty of
plausible-sounding material to reconstruct a confident, wrong reason from.
-->

---
clicks: 4
---

## Compaction: the rescue that costs you the plan

<div class="max-w-[94%] mx-auto">
  <CompactionStrip :step="$clicks" />
</div>

<div class="mt-3 space-y-1 text-lg">
  <p v-click="1" class="!text-[var(--st-crit)]">
    You hit the buffer line → the harness compacts, starting at the <strong>oldest</strong> end.
  </p>
  <p v-click="3" class="!text-[var(--st-crit)]">
    The brainstorm, the spec, the plan, and the reasoning behind every decision — flattened into one paragraph.
  </p>
  <p v-click="3" class="!text-[var(--ink-3)]">
    Meanwhile the verbose tool output from two minutes ago survives verbatim.
  </p>
  <p v-click="4" class="!text-[var(--st-warn)] text-xl pt-1">
    It <strong>summarises</strong>, it doesn't delete — and your spec and plan are the oldest things in the room.
  </p>
</div>

<!--
Callback: "Remember the database decision from the cold open?" — same
Postgres/Dynamo pair. In the hook, the reasoning was just diluted — buried
under 37 turns of chatter, so it confidently guessed wrong. This is the
mechanism that makes it worse: compaction doesn't dilute, it actively
DELETES the reasoning down to a keyword. "We chose Postgres over Dynamo
because of the transactional requirement" becomes "chose Postgres." Ask it
again after that and it isn't reconstructing a plausible-sounding wrong
answer anymore — it may just flip the choice entirely, because the reason
that anchored it is gone.

Correct the common misconception explicitly: compaction is lossy
SUMMARISATION, not truncation. Nothing is dropped outright; it's flattened.

You don't control when it fires or what it keeps. Which is the whole argument
for part six.
-->

---
layout: center
class: text-center
---

<p class="statement max-w-[42rem] mx-auto">
  Compaction is the seatbelt.<br>
  <span class="dim">Don't drive at it on purpose.</span>
</p>

---
layout: section
---

<div class="kicker mb-3">Part six</div>

# Seven moves

<!-- The practical part. ~15 minutes. One idea per slide, all of them cheap to adopt. -->

---
clicks: 2
---

## Move 1 — hand off through files

<div class="text-[var(--ink-3)] mb-2">Each stage writes its output. The next stage starts from that file, not from the transcript.</div>

<div class="max-w-[90%] mx-auto">
  <PipelineFill :step="5" :show-handoff="$clicks >= 1" :capacity="200000" />
</div>

<div v-click="2" class="mt-0 grid grid-cols-2 gap-8">
  <SketchBox seed="h1" color="var(--ink-2)">
    <p><strong>What survives:</strong> the decision, in a file, in full fidelity.</p>
  </SketchBox>
  <SketchBox seed="h2" color="var(--ink-2)">
    <p><strong>What's dropped:</strong> the 40 turns of argument that produced it.</p>
  </SketchBox>
</div>

<!--
Callback to the part-five slide — same chart, second series. Big visual payoff.

The files are cheap and boring: spec.md, plan.md, review.md. The discipline is
that stage N+1 reads the FILE, not the conversation.

Bonus nobody expects: this also survives compaction, because a file on disk
isn't in the window at all.
-->

---
clicks: 2
---

## Move 2 — send subagents

<div class="max-w-[62%] mx-auto -mt-2">
  <AgentTree :level="4" />
</div>

<div v-click="1" class="mt-1 grid grid-cols-2 gap-8">
  <SketchBox seed="s1" color="var(--st-crit)">
    <p><strong>In the lead window:</strong> "search the codebase for every auth call site" — 40 greps, 60K tokens of results, resident forever.</p>
  </SketchBox>
  <SketchBox seed="s2" color="var(--st-good)">
    <p><strong>In a subagent:</strong> same 40 greps, 60K burned in <em>its</em> window — and it returns a 400-token list.</p>
  </SketchBox>
</div>

<p v-click="2" class="mt-4 text-center text-2xl">
  <strong>150× compression</strong>, and the lead never sees the mess.
</p>

<!--
This is the move for long-running tasks — the one thing to take away if they
take one thing.

Rule of thumb: if a task is (a) independent and (b) produces far more
intermediate output than final answer, it belongs in a subagent. Search,
investigation, and verification all qualify.

Honest caveat: subagents cost latency and can't see the lead's context, so you
must brief them properly. Don't use one for a two-file edit.
-->

---
layout: center
class: px-16
---

## Move 3 — make AGENTS.md an index

<div class="mt-6 max-w-[44rem] mx-auto space-y-5">

- Loaded **in full, on every turn** — so every line is rent
- Link out with **section anchors**, don't inline
- Target: **under 100 lines**
- Ask of each line: *"is this true for every task in this repo?"* — if not, it belongs behind a link

</div>

<div class="mt-8 max-w-[44rem] mx-auto">
<SketchBox seed="m3" color="var(--s1)">
  <p class="text-xl">Same trick as move 1, different surface: <strong>keep the map resident, keep the territory on disk.</strong></p>
</SketchBox>
</div>

---
layout: center
class: px-16
---

## Move 4 — modular skills

<div class="grid grid-cols-2 gap-12 mt-8">

<div>
<div class="kicker mb-3">The mechanism</div>

- description → **always** in the window
- body → loaded **only when triggered**
- so: sharp descriptions, lean bodies

</div>

<div>
<div class="kicker mb-3">The rule</div>

- **`SKILL.md` under 500 lines**
- longer → split it, or push detail into `references/`
- one skill, one job

</div>

</div>

<div class="mt-10 max-w-[44rem] mx-auto">
<SketchBox seed="m4" color="var(--st-warn)">
  <p class="text-xl">A 2,000-line skill isn't "thorough". It's a <strong>2,000-line file you just pasted mid-task</strong>.</p>
</SketchBox>
</div>

---
layout: center
class: px-20
---

## Move 5 — demand less prose

<div class="mt-6 max-w-[46rem] mx-auto">

- Verbose agents **poison their own context** — every rambling answer is re-sent forever
- Put it in `AGENTS.md`, in the agent prompt, in the skill body
- Ask for **artefacts over narration**: a diff, a file, a list

</div>

<div class="mt-8 max-w-[46rem] mx-auto">
<SketchBox seed="m5" color="var(--s1)">

```md
## Output
- No preamble, no recap of what you just did.
- Report the outcome first, in one sentence.
- Don't re-explain code you just wrote.
```

</SketchBox>
</div>

<p v-click class="mt-6 text-center text-xl !text-[var(--ink-2)]">
  Compounding: it's not one shorter answer, it's <strong>every future turn carrying one less paragraph</strong>.
</p>

---
layout: center
class: px-20
---

## Move 6 — fetch late, not early

<div class="grid grid-cols-2 gap-12 mt-8">

<SketchBox seed="m6a" color="var(--st-crit)">
  <div class="kicker mb-2">Eager</div>
  <p class="text-xl">Load the six files it <em>might</em> need, up front.</p>
  <p class="mt-2 text-[var(--ink-3)]">Five are noise. All six are resident for the rest of the session.</p>
</SketchBox>

<SketchBox seed="m6b" color="var(--st-good)">
  <div class="kicker mb-2">Just in time</div>
  <p class="text-xl">Give it the <em>map</em>, let it fetch on demand.</p>
  <p class="mt-2 text-[var(--ink-3)]">It reads the one file it actually needs, when it needs it.</p>
</SketchBox>

</div>

<p v-click class="mt-8 text-center text-xl !text-[var(--ink-2)]">
  Agents are good at finding things. Trust them to look, instead of pre-loading the library.
</p>

---
layout: center
class: px-20
---

## Move 7 — keep state on disk

<div class="mt-6 max-w-[46rem] mx-auto">

- a **todo file** the agent ticks off
- a **decisions file** — what was chosen, and *why*
- a **scratchpad** for findings

</div>

<div class="mt-8 max-w-[46rem] mx-auto">
<SketchBox seed="m7" color="var(--st-good)">
  <p class="text-xl">Anything on disk is <strong>immune to compaction</strong> — and it's still there tomorrow, in the next session, for the next person.</p>
</SketchBox>
</div>

<p v-click class="mt-6 text-center text-xl !text-[var(--ink-2)]">
  This is the direct answer to the compaction problem: don't ask the window to remember the plan.
</p>

<!--
Tie it back explicitly to the compaction slide. The failure there was that the
plan lived only in the transcript. Move it to a file and the failure mode
stops existing.
-->

---
layout: section
---

<div class="kicker mb-3">Part seven</div>

# Wrapping up

---
layout: two-cols-header
layoutClass: gap-10
---

## "Just use the 1M window"

::left::

<div class="pt-4">
  <RecallCurve />
</div>

::right::

<div class="pt-6 space-y-6">

<div>
<div class="kicker mb-2">Why it doesn't save you</div>

- 1M **isn't 1M** — ~11% is reserved buffer
- a window is **capacity**, not **attention**
- start and end get used; the **middle gets skimmed**
- add more, and you push what matters *into* the middle

</div>

<div v-click>
<SketchBox seed="onem" color="var(--st-warn)">
  <p class="text-xl">A system designed to do the job inside <strong>200K</strong> will outlive one that needs a million.</p>
</SketchBox>
</div>

</div>

<!--
Say "shape" out loud — the curve is schematic, not measured. If you want it to
carry evidence, cite a specific paper or your own eval.

And note the cost angle: 1M of context at $5/MTok is $5 per turn. Nobody
budgets for that.
-->

---
layout: center
clicks: 5
class: px-16
---

<div class="kicker mb-6">Take home</div>

<div class="space-y-4 text-2xl max-w-[46rem]">
  <div v-click="1">— The window is a <strong>budget</strong>. Spend it on purpose.</div>
  <div v-click="2">— Look at <code>/context</code> before you blame the model.</div>
  <div v-click="3">— Keep the <strong>map</strong> resident, keep the <strong>territory</strong> on disk.</div>
  <div v-click="4">— Send a subagent whenever the mess is bigger than the answer.</div>
  <div v-click="5">— Don't let compaction be your memory strategy.</div>
</div>

<!--
Callback: that agent that fell apart after ten minutes at the start of the
talk — now they know which of the six segments ate it.
-->

---
layout: center
class: text-center
---

<p class="statement max-w-[40rem] mx-auto">
  Which one are you<br><span class="dim">changing on Monday?</span>
</p>

<div v-click class="mt-14 text-xl !text-[var(--ink-3)]">
  Questions
</div>

<!--
Ask it as a real question and wait — don't rush to Q&A. Getting two or three
people to name the one thing they'll do makes it stick, and it usually starts
the Q&A for you.
-->
