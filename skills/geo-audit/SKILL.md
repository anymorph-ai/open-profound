---
name: geo-audit
description: >
  One-time GEO audit: fire the prompt set across real AI engines via
  querying.ai, then report brand mentions, citations, and competitor share on
  the actual answers. Use when the user says "/geo audit", "AI visibility
  audit", "is my brand mentioned by ChatGPT", "one-time GEO check".
user-invocable: true
argument-hint: "<brand or site url>"
license: MIT
---

# GEO Audit (one-time snapshot)

## Procedure

1. **Prompt set**: load `geo/prompts.json` if present; otherwise run the
   `geo-prompts` skill first.
2. **Engine selection**: default `CHATGPT`, `PERPLEXITY`, `GEMINI`,
   `GOOGLE_AIO`. Offer the rest (`CLAUDE`, `GROK`, `DEEPSEEK`, `AMAZON`,
   `GOOGLE_AIMODE`) when relevant to the user's market. Check availability
   with `node scripts/querying.mjs capacity`.
3. **Confirm cost**: show `prompts × engines = N tasks` and get user
   confirmation if N > 10.
4. **Fire**: write the task list to `geo/audit-tasks.json` as
   `[{"taskType": "CHATGPT", "prompt": "...", "country": "US"}, ...]`, then:

```bash
node scripts/querying.mjs batch geo/audit-tasks.json > geo/audit-raw.json
```

   Batches are ≤500 tasks / ≤8MB. Polling is built in; a full run takes minutes.
5. **Score each answer** (same rules the monitor scorer uses, so a later
   monitor is comparable):
   - `mentioned` — any alias appears in answer text (case-insensitive,
     Unicode-normalized; substring match is intended for CJK)
   - `cited` — any source host matches a registered domain or its subdomain
     (`www.` ignored)
   - `position` — character offset of the earliest alias hit (prominence proxy)
   - `competitorHits` — same alias matching per competitor
6. **Report** (markdown, save to `geo/audit-report.md`):
   - Mention rate and citation rate per engine
   - Share of voice vs competitors (denominator = answers; shares don't sum to 100%)
   - Top cited domains and top cited pages (what wins, where to place content)
   - For each prompt where the brand is **absent**: the actual answer excerpt,
     who was recommended instead, and which sources the engine cited
   - Failed tasks listed as missing data — never counted as "not mentioned"

## Handing off

End by offering the two follow-ups: `/geo optimize` on the losing pages/topics,
and `/geo monitor` to turn this snapshot into a baseline with recurring runs.
