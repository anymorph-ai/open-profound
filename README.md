# Open Profound

**Data-driven GEO for Claude Code — measured on real AI answers, not guesses.**

Open Profound is an open-source agent skill suite that measures how AI engines
actually answer your buyers' questions — ChatGPT, Perplexity, Gemini, Google
AI Overviews, Google AI Mode, and Naver's AI surfaces — and turns the gaps
into concrete page and content fixes.

Most GEO tools predict citability from page structure. Open Profound skips the
prediction: it fires your prompt set at the real consumer surfaces through the
[querying.ai](https://querying.ai) API and scores the answers that came back.
One API key. No other vendors, no scraping setup, zero npm dependencies.

## Why "Open Profound"

The same way [open-lovable](https://github.com/firecrawl/open-lovable) is the
open-source take on Lovable, Open Profound is the open-source take on
[Profound](https://tryprofound.com) — the category-defining AI-visibility
platform. Commercial platforms (Profound, Peec, Otterly) do this well and
charge accordingly. Open-source trackers mostly query LLM *APIs*, which are not
the surfaces your buyers see — an API answer from `gpt-4o` is not the ChatGPT
answer with web search, and nothing from an API resembles a Google AI Overview.
Open Profound runs on real surfaces, inside the agent you already use.

## Install

```
/plugin marketplace add anymorph-ai/open-profound
/plugin install open-profound@anymorph-open-profound
```

Then set your key (get one at [querying.ai](https://querying.ai)):

```bash
export QUERYING_API_KEY=vt_...
```

Use a per-user `vt_...` key — the monitor endpoints authenticate by key shape
and only accept these.

## Use

| Command | What happens |
|---|---|
| `/geo prompts acme.com` | Designs the 10–30 questions buyers actually ask AI in your category |
| `/geo audit acme.com` | Fires them across engines, reports mentions · citations · share of voice — with the actual answers as evidence |
| `/geo optimize` | Classifies each loss (content / citability / placement / locale gap) and writes the fix plan |
| `/geo monitor` | Registers a recurring server-side monitor; pull time-series reports any time |

The loop: **prompts → audit → optimize → monitor**. Changes get measured
against a baseline instead of vibes.

## What you get that predictions can't give you

- Which competitor is recommended instead of you, per prompt, per engine — quoted
- Which domains and pages engines cite for your category (your placement targets)
- Where you're strong in `US` but invisible in `KR`/`JP` answers
- Whether last month's content work moved the numbers (monitors keep the series)

## Engines

The engines querying.ai serves to API customers:

`CHATGPT` · `PERPLEXITY` · `GEMINI` · `GOOGLE_AIO` (AI Overviews) ·
`GOOGLE_AIMODE` (AI Mode) · `NAVER_AI_BRIEF` · `NAVER_AI_MODE` (Korean market).
Live availability: `node scripts/querying.mjs capacity`.

## Costs

Each prompt × engine is one querying.ai task, billed in credits. The skills
show the task count before firing anything non-trivial, and monitor creation
always shows per-run cost — recurring spend needs eyes-open consent.

## License

MIT. Not affiliated with Profound (tryprofound.com); the name states the goal —
an open alternative to that category of tool.
