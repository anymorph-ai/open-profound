---
name: geo-optimize
description: >
  Turn measured GEO gaps into concrete page and content changes. Reads audit or
  monitor results (real AI answers) and produces fixes: what to write, which
  pages to restructure, where to earn citations. Use when the user says "/geo
  optimize", "how do I get mentioned", "fix my AI visibility", or after an
  audit/monitor shows gaps.
user-invocable: true
argument-hint: "[url]"
license: MIT
---

# GEO Optimization (evidence-based)

Prerequisite: `geo/audit-report.md` or a monitor report. If neither exists,
run `geo-audit` first — optimizing without measurement is guessing, and generic
GEO advice is exactly what this tool exists to replace.

## Procedure

Work gap by gap, from the highest-value prompts where the brand lost.

1. **Diagnose from the answer, not from theory.** For each losing prompt read
   the actual answer: who was recommended, which sources were cited, what
   claims the engine repeated. The cited sources ARE the target list.
2. **Classify the gap**:
   - **Content gap** — no page of yours answers this prompt. Fix: create one.
   - **Citability gap** — your page exists but engines cite someone else's.
     Fix: restructure (direct answer in the first 40–60 words, question-based
     headings, self-contained 100–170-word passages, concrete numbers with
     sources, named author and date).
   - **Placement gap** — engines consistently cite third-party surfaces
     (review sites, Reddit, comparison listicles, YouTube) where you're absent.
     Fix: earn presence there; your own site can't win those prompts alone.
   - **Locale gap** — mentioned in `US` but absent in `KR`/`JP` answers.
     Fix: localized pages and local-language sources, not machine translation.
3. **Check crawler access** while you're at it: robots.txt must not block
   GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended; key
   content must be server-rendered. (This is a hygiene floor, not a strategy.)
4. **Deliver** `geo/optimize-plan.md`: per prompt — the gap class, the evidence
   (answer excerpt + winning source), the specific fix, and the file/page it
   applies to. If the user's site source is in the workspace, offer to apply
   page-level fixes directly.
5. **Close the loop.** Every fix should name the metric that will show it
   worked (engine × prompt mention/citation in the next monitor window). If no
   monitor exists, offer `/geo monitor`.

## What not to do

- No llms.txt cargo-culting as a "fix" — file it under hygiene, evidence for
  ranking impact is weak.
- No mention-farming or fake-review advice. Placement means earning real
  presence on surfaces engines already trust.
