---
name: geo-monitor
description: >
  Recurring GEO monitoring via querying.ai monitors: register prompt sets that
  fire on a schedule, then pull scored time-series, share-of-voice, and actual
  answers. Use when the user says "/geo monitor", "track over time", "weekly AI
  visibility", "monitor my brand in AI answers", or asks how a monitor is doing.
user-invocable: true
argument-hint: "[create|report|list] [monitor-id]"
license: MIT
---

# GEO Monitoring (recurring)

Monitors live server-side at querying.ai: the scheduler fires the prompt set
every `intervalHours`, scores each answer, and keeps the time-series. This
skill creates them and reads them — nothing runs on the user's machine between
sessions.

## Create

1. Load `geo/prompts.json` (run `geo-prompts` if missing). Write the monitor
   spec to `geo/monitor.json`:

```json
{
  "name": "acme — US buyers",
  "engines": ["CHATGPT", "PERPLEXITY", "GOOGLE_AIO"],
  "prompts": ["..."],
  "aliases": ["Acme"],
  "domains": ["acme.com"],
  "country": "US",
  "intervalHours": 24,
  "competitors": [{ "name": "Rival", "aliases": [] }],
  "alertBelowPct": 30
}
```

2. Show the cost line before creating: `prompts × engines = k tasks per run,
   every intervalHours` — recurring spend needs eyes-open consent.
3. `node scripts/querying.mjs monitor create geo/monitor.json` — record the
   returned id in `geo/monitor.json` as `"id"`.

Limits: ≤200 tasks/run, ≤20 monitors per account, ≤100 prompts, intervalHours
1–168. `alertBelowPct` emails when the 7-day mention rate crosses below.

## Report

`node scripts/querying.mjs monitor get <id> --days 30` returns everything the
dashboard shows. Read it in this order and write a short report:

1. `stats` vs `previous` — is it moving? Lead with the delta, not the rate.
2. `health` — failed/pending tasks in the last 24h. **Failures live only
   here**; if runs look flat, check health before concluding anything.
3. `engineRates[]` — which engine is weak. That's where optimization aims.
4. `shareOfVoice` — position vs competitors (shares don't sum to 100%).
5. `topDomains[]` / `topPages[]` — where to place content / what's winning.
6. For surprising cells, pull the actual answer:
   `node scripts/querying.mjs monitor answer <id> <taskId>` (taskIds are in
   `cells[]`). Quote it — scores without evidence aren't actionable.

Raw rows for spreadsheets: `monitor results <id> --csv --since 2026-08-01`.

## Housekeeping

`monitor list` to enumerate, `monitor run <id>` to fire out-of-schedule,
`monitor delete <id>` only on explicit user request.
