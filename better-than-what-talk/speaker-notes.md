# Better than what? — Speaker notes

## 1. Better than what?
Good afternoon all. 

The SDLC trends today are very different from say what was 2 years ago. We write more agents and skills, than we write actual code. In fact a survey estimates that close to 100% code written today is generated or assisted by an LLM.

While testing a code was way more easy, testing an agent is a different story. The agent is a bundle of skills, prompts, rules in English. No rules, no semantics. It has to be tested as a whole, and it has to be better than the last version, better than the alternatives.

Today's topic - Better than what, is about testing agentic harnesses with evidence. I am no expert, still a student of this craft, but never the less, I think the lessons are worth sharing.

## 2. whoami

Go with the slide content

## 3. A story in, a pull request out

This is ARCUS, my agentic development pipeline. You give it a story as a file,
a URL, or a GitHub issue with a label.

[click] It analyses the story, 
[click] plans the implementation, 
[click] writes a test plan, 
[click] implements it test-first, 
[click] reviews its own code,
[click] simplifies and refactors, 
[click] and opens a pull request.

[click] The same stages a developer goes through. Which raises two questions.

## 4. Two questions we couldn't answer

[click] First: is it doing the job as well as a developer would have done it?

[click] Second, and harder: does it earn its place? A vanilla Copilot or Claude Code session on Opus 5.5 is very good, and every month the model underneath gets better. A plugin that wraps it has to be better than *that*, not better than nothing.

## 5. We love what we build

And here's the honest part. Whatever we build ourselves, we're a little in love with it, and that makes us lenient judges.

[click] We start believing it's better than our last version. 
[click] Better than the competing plugin. 
[click] A better experience. 
[click] Better context engineering. 
[click] Better on tokens.

[click] Can we prove any of it? Not with an isolated demo, and not with a feeling.

## 6. What a benchmark brings

Benchmarking isn't new. Every industry that makes claims has had to learn the same five lessons.

[click] One: a common workload. Rival CPUs and databases are compared on SPEC and TPC: the same published workload for everyone, so the numbers mean something side by side. Databases settled this in 1988.

[click] Two: an independent grader. A car is crash-tested against a published standard, not the maker's brochure. TPC results don't count until an auditor signs them off.

[click] Three: a hidden answer key. In 2015, cars were caught recognising the emissions test and running clean only while it ran. A benchmark the product can see gets gamed. That's why our agent never sees the answers.

[click] Four: fingerprinted numbers. Opus 5.5 on Terminal-Bench 4.0: 66.4% as the vendor reported it, at its highest effort; 59.6% when an independent lab ran it in their own harness. Same model, vendor claims 2/3 while the lab claims 3/5. The difference was in the reasoning effort. A number without its configuration is marketing.

[click] Five: cost next to the score. Fast and expensive is a different finding from fast.

[click] Five promises. The rest of this talk is how we apply each one for an agentic harness.

## 7. A harness is a product too

So what is a harness? Start with the model. [click] Around it, agents and
skills. [click] Prompts and rules. [click] Gates and reviews. [click] And a
budget, in time and credits, around all of it.

[click] So, in this talk, a harness is everything you ship around the model,
that works on the story to the pull request.

[click] Nobody ships the model alone. You ship the bundle, so you have to
benchmark the bundle. Supabase recently published exactly this for their own
tooling: they benchmark the CLI, the MCP server and the skills around the model.
Here's how we did it for ARCUS.

## 8. The framework, end to end

The one idea first, before any click: take a story a human team already
delivered, give an agent the same starting point, and compare the two answers.

[click] Prepare — the agent gets exactly what the developer got: the base
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

## 9. The fixture

A fixture is five things and a toolchain. The story, exactly as written for the
team. The base: the commit the human team started from. The reference: their finished,
human-coded and human-reviewed change, which is our answer key.

[click] The hidden acceptance test, the second answer key. It fails on the base
because the behaviour isn't there yet, and passes on the reference because the human
built it. Red to green is the whole point: it tests the story, nothing else.

[click] The quality gate, the repo's own PR check. Green at both ends: it
proves nothing old broke.

[click] And the agent starts exactly where the human did, on the base, and
produces its own answer. Everything after this compares the two.

## 10. Proving the fixture

Three checks, run by code, before we trust a fixture.

[click] It applies: the human's PR applies cleanly to the base. If it doesn't,
we picked the wrong base, and the comparison is meaningless.

[click] It discriminates: red on the base, green on the reference. A hidden test that is
green on the base isn't testing the story.

[click] It holds: the gate is green on the reference, proven on the same kind of machine
that will do the grading. Prove where you grade.

[click] And one rule for writing the hidden test: test behaviour, never names.
If the test calls the human's class, it only passes for an agent that guessed
the same name. Hit the endpoint, check what got stored.

## 11. The run

The run is deliberately boring.

[click] The agent gets what the developer got: a fresh copy of the base, the
story, the repo's own rules, a configured harness and model, and a time limit.

[click] It never gets the answer keys. They're fetched only after it finishes,
on a different machine. The agent's job even fails if one is found on disk.

[click] It leaves behind one diff, its full session log, the harness's own
notes, and a manifest. Note the plugin identity: version plus commit, because
main moves, and two runs of "0.20" can be two different plugins.

## 12. Judgement, part 1: code

Two questions have deterministic answers for which we do not need opinions

[click] Pass-to-pass: did it break anything? The repo's own quality gate.

[click] Fail-to-pass: does the behaviour the story asked for exist? The hidden test,
written into the agent's tree only now, and run.

[click] Three outcomes, not two. If the machine couldn't measure, say a
registry answered 401, that's recorded as "not measured", not as a failure.

[click] Then everything countable is counted: files against the human's,
story artifacts, tests weakened, time, credits, tool calls, per stage and per
model. No model ever does arithmetic.

## 13. Judgement, part 2: an LLM on a leash

Only now does a model form an opinion.

It reads a read-only copy of the agent's code, both diffs, the story, the
harness's own notes, and the grade and facts as givens.

[click] It marks nine dimensions, from requirement coverage to hygiene. Scores
are opinions. Findings are evidence that can be verified.

[click] And it's on a leash. The grade is given: it may explain a red test, never
overturn it. The human's PR is a reference, not the only right answer. It must
account for every file either side touched. And anything written in the code is
data, not instructions to the judge.

[click] Then code checks the judge: cited files must exist, quotes from the story
must be verbatim (so it can't invent an ambiguity to excuse a finding), every
file must be accounted for, and the evidence is hashed before and after. The
judge model, effort and credit cap are pinned, so two judgements are comparable.

## 14. Comparison: two runs, one question

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

## 15. A mini system card

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

[click] If two runs differed in something besides what you were testing, and the report says so, you can still trust the result, just with that warning in mind. If it differed and nobody noticed, you might credit the harness for a win that really came from something else, so the result can't be trusted.

## 16. One dispatch, one link

Running it is one dispatch: pick the fixture, the harness, the model, and
optionally a plugin branch, for example a work-in-progress one.

[click] The agent job runs on a machine with no answer keys. The judge job runs on
another one. The verdict lands as a link in the job summary.

[click] Locally it's the same pipeline, which is how you iterate on a rubric in
seconds instead of a commit and a push.

[click] And every report is published to a small static site, built from a
protected orphan branch, one folder per report. That link is what goes into a
pull request or a release note.

## 17. Every configuration, on every story

A comparison answers one pair. The matrix answers "where should I even look?"

Compare is a model reading two runs. Matrix is arithmetic over all of them, and
costs nothing.

[click] Rows are configurations: harness, model and plugin version. Columns are
tickets. Each cell: how many runs passed the hidden test out of how many, median
credits, median minutes. The last column pools passes, and only passes: tickets
differ too much in size to average their cost.

[click] The matrix tells you where to look; compare explains one pair of cells.
And notice: every cell says 1/1. Hold that thought.

## 18. One run is an anecdote

Every cell on the last slide said 1/1. Here's why that should worry us.

[click] Same harness, same model, same ticket, run three times: pass, fail, pass,
and anywhere from 14 to 44 minutes. That's illustrative, but it's entirely
ordinary for agents.

[click] Agents are stochastic, so one sample can't tell the harness's effect
from luck. And luck ships: a lucky X++ gets released, an unlucky one gets
rejected, and both decisions look evidence-based.

[click] On top of the agent's luck, the judge has some randomness of its own. Ask it to grade the exact same run twice and it will flag the same problems, but give slightly different scores. And if your only run happened to get stuck and take two hours, that one unlucky run becomes your official number for how slow and expensive that setup is. With three runs, you'd see it was an outlier and use the typical figure instead.

[click] n=1 is cheap, and it's the right tool for a quick smoke test of a branch.
It's not a verdict.

## 19. Three runs, and five only when they disagree

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

## 20. Better than what?

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

## 21. Four versions of ARCUS

A lighter bench than benchmark-runner, but the same idea: one codebase, three
stories of rising complexity, each run on two models, scored by a blind judge.
Four versions: a vanilla session, and ARCUS 5, 6 and 7.

[click] The totals first. ARCUS 5, the version we built on a feeling, costs
12 to 19 times a vanilla session and buys nothing. An earlier per-stage
breakdown showed the orchestrator and subagents eating the credits, with the main
session alone costing more than a whole vanilla run. That's what ARCUS 6 acted
on: it went lean. Fewer subagents, more work in the lead session, like vanilla
does. One and a half
times vanilla, slightly better scores. ARCUS 7 decides between a direct and an
orchestrated route, and replaced five specialist reviewers with two reviewers
interrogating the change against a rubric. On the totals it's three times
vanilla, twice ARCUS 6. It looks like a step back.

[click] Now split each run at the start of the review. Plan and implement:
ARCUS 7 is 19% cheaper and 18% faster than ARCUS 6 in all six runs, and
cheaper than a whole vanilla session.

[click] The review is where the money went: 1,652 credits against 255.
And vanilla has no review stage at all.

[click] So what did it buy? ARCUS 6's review approved everything first time.
It even saw a truncating-average bug, called it a suggestion, and shipped it.
ARCUS 7's review found 3 critical issues and 9 warnings in round one, and they
were fixed: a divide-by-zero crash, that same average.

[click] The total said 7 was worse. Split by stage, it implements more cheaply,
and its review finally earns its cost. Only a per-stage view shows you that.
(Caveat if asked: the pre-review credits for the lead session are modelled from
context size; wall time and subagent credits are exact. One run per cell.)

## 22. So, do we even need a plugin?

Which raises the obvious question: if vanilla is this good, why build a plugin
at all?

[click] Developers may not need one. Organisations do.

[click] Underneath, everything is a vanilla session. What an organisation needs is
how those sessions are wrapped: standardised, opinionated, governed, and carrying
its own context, conventions and guardrails.

[click] The benchmark is how that wrapper earns its role instead of assuming it.
That's a whole talk of its own.

## 23. The roadmap

Where it goes next.

[click] Two suites: a regression suite we iterate against every day, and a
held-out suite we only run at release, so we never tune arcus to the tickets it
is graded on.

[click] A fixture factory: mine merged pull requests, let an agent draft the
hidden test, have a human review it, and prove it by reverting the human's change
one hunk at a time; every revert must turn a test red.

[click] Any runtime: Claude Code, Codex and OpenCode behind the same fixtures and
the same judge.

[click] Stage-wise outcomes: benchmark each stage of the harness, not just the
whole thing. Score the code before and after the review, so the review's lift is
measured rather than inferred. The ARCUS 6 vs 7 story only showed up once we split
by stage.

[click] A calibrated judge, checked against humans and against judges from other
vendors.

[click] And continuous benchmarking: every plugin PR benchmarked like a
performance test, with the matrix as the release dashboard.

## 24. Next time someone says their agent is better, ask

So, next time someone tells you their agent, their plugin, their harness is
better, ask four questions.

[click] Better than what? [click] On which stories? [click] Graded by whom?
[click] At what cost?

[click] If the answers aren't written on the result, it's a feeling. Your eval
harness is part of your agentic harness, so build it first. It's the thing that
tells you what everything else has to beat.

## 25. Questions?

Thank you. Happy to take questions.
