---
name: geo-prompts
description: >
  Design the prompt set for GEO measurement: the questions real buyers ask AI
  engines in the user's category. Use when the user says "/geo prompts",
  "prompt set", "what should I track", or before any audit/monitor that lacks
  prompts.
user-invocable: true
argument-hint: "<brand or site url>"
license: MIT
---

# GEO Prompt Set Design

The prompt set decides what "visibility" even means. Bad prompts (brand-navigational,
nobody-asks-this) produce flattering, useless numbers.

## Procedure

1. **Understand the category.** Fetch the site (WebFetch) if a URL was given:
   what it sells, to whom, against whom. Ask the user for competitors if unclear.
2. **Generate 10–30 prompts** across these intents (roughly even split):
   - **Category discovery** — "best <category> for <use case>" (never mentions the brand)
   - **Comparison** — "<competitor> alternatives", "<brand> vs <competitor>"
   - **Problem-first** — the pain phrased without any product words
   - **Buying-stage** — pricing, reviews, "is <category tool> worth it"
3. **Personas**: write each prompt the way a specific person types it (founder,
   practitioner, non-expert). Vary phrasing register — AI answers shift with it.
4. **Locale**: if the user sells outside the US, duplicate the highest-value
   prompts in the local language and mark them with `country` (e.g. `KR`, `JP`).
   Result country follows the query's `country`/language, so a Korean prompt
   with `country: KR` measures the Korean answer surface.
5. **Output** a table: `prompt | intent | persona | country`, plus suggested
   `aliases` (brand spellings/localizations) and `domains` (own domains for
   citation scoring). Save to `geo/prompts.json` in the working directory:

```json
{
  "prompts": ["...", "..."],
  "aliases": ["Brand", "브랜드"],
  "domains": ["brand.com"],
  "country": "US",
  "competitors": [{ "name": "Rival", "aliases": ["Rival Inc"] }]
}
```

## Constraints

- Monitor limits: ≤100 prompts, ≤20 aliases, ≤20 domains, prompt ≤2,000 chars,
  one firing ≤200 tasks (prompts × engines). Design within them.
- Never include prompts that embed the answer ("why is <brand> the best") —
  they measure nothing.
