#!/usr/bin/env node
// Zero-dependency client for the querying.ai API (Cloro-compatible).
// Auth: QUERYING_API_KEY env var. Base URL override: QUERYING_BASE_URL.
// Node 18+ (built-in fetch).

const BASE = process.env.QUERYING_BASE_URL ?? "https://api.querying.ai";
const KEY = process.env.QUERYING_API_KEY;

if (!KEY) {
  console.error("QUERYING_API_KEY is not set. Get a key at https://querying.ai");
  process.exit(2);
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${method} ${path}\n${text}`);
    process.exit(1);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text; // CSV etc.
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Poll a task until it reaches a terminal state. Monitors fire ordinary tasks,
// so audit polling and monitor cells share the same shape.
async function pollTask(id, { timeoutMs = 15 * 60_000, intervalMs = 5_000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const res = await api("GET", `/v1/async/task/${id}`);
    // Envelope: {success, task:{status,...}, response?} — response is a sibling of task.
    const t = res.task ?? res;
    const s = t.status ?? t.state;
    if (s && !["PENDING", "QUEUED", "PROCESSING", "RUNNING"].includes(s)) return res;
    if (Date.now() > deadline) {
      console.error(`Timed out waiting for task ${id} (last status: ${s})`);
      process.exit(1);
    }
    await sleep(intervalMs);
  }
}

function out(x) {
  console.log(typeof x === "string" ? x : JSON.stringify(x, null, 2));
}

function parseFlags(args) {
  const flags = {};
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const k = args[i].slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[k] = next;
        i++;
      } else flags[k] = true;
    } else rest.push(args[i]);
  }
  return { flags, rest };
}

const [cmd, ...argv] = process.argv.slice(2);
const { flags, rest } = parseFlags(argv);

switch (cmd) {
  // querying.mjs fire CHATGPT "best AI search API" [--country US] [--no-wait]
  case "fire": {
    const [taskType, prompt] = rest;
    if (!taskType || !prompt) usage();
    const submitted = await api("POST", "/v1/async/task", {
      taskType,
      payload: { prompt, country: flags.country ?? "US" },
    });
    if (flags["no-wait"]) {
      out(submitted);
      break;
    }
    out(await pollTask(submitted.task?.id ?? submitted.id));
    break;
  }

  // querying.mjs batch tasks.json — file: [{taskType, prompt, country?}, ...] (≤500)
  case "batch": {
    const { readFileSync } = await import("node:fs");
    const items = JSON.parse(readFileSync(rest[0], "utf8"));
    const submitted = await api(
      "POST",
      "/v1/async/task/batch",
      items.map((it) => ({
        taskType: it.taskType,
        payload: { prompt: it.prompt, country: it.country ?? "US" },
      })),
    );
    const ids = (submitted.tasks ?? submitted).map((t) => t.task?.id ?? t.id);
    const results = [];
    for (const id of ids) results.push(await pollTask(id)); // ponytail: serial poll; batches ≤200 finish within the shared deadline anyway
    out(results);
    break;
  }

  // querying.mjs capacity
  case "capacity":
    out(await api("GET", "/capacity"));
    break;

  // querying.mjs monitor create spec.json | list | get <id> [--days 30] |
  //   results <id> [--csv] [--since ISO] | answer <id> <taskId> | run <id> | delete <id>
  case "monitor": {
    const [sub, id, extra] = rest;
    switch (sub) {
      case "create": {
        const { readFileSync } = await import("node:fs");
        out(await api("POST", "/v1/monitors", JSON.parse(readFileSync(id, "utf8"))));
        break;
      }
      case "list":
        out(await api("GET", "/v1/monitors"));
        break;
      case "get":
        out(await api("GET", `/v1/monitors/${id}?days=${flags.days ?? 30}`));
        break;
      case "results": {
        const q = new URLSearchParams();
        if (flags.csv) q.set("format", "csv");
        if (flags.since) q.set("since", flags.since);
        out(await api("GET", `/v1/monitors/${id}/results?${q}`));
        break;
      }
      case "answer":
        out(await api("GET", `/v1/monitors/${id}/answers/${extra}`));
        break;
      case "run":
        out(await api("POST", `/v1/monitors/${id}/run`));
        break;
      case "delete":
        out(await api("DELETE", `/v1/monitors/${id}`));
        break;
      default:
        usage();
    }
    break;
  }

  default:
    usage();
}

function usage() {
  console.error(`Usage:
  querying.mjs fire <taskType> <prompt> [--country US] [--no-wait]
  querying.mjs batch <tasks.json>
  querying.mjs capacity
  querying.mjs monitor create <spec.json>
  querying.mjs monitor list
  querying.mjs monitor get <id> [--days 30]
  querying.mjs monitor results <id> [--csv] [--since ISO]
  querying.mjs monitor answer <id> <taskId>
  querying.mjs monitor run <id>
  querying.mjs monitor delete <id>

taskTypes: CHATGPT PERPLEXITY GEMINI GOOGLE_AIO GOOGLE_AIMODE
           (query-style engines accept prompt too)`);
  process.exit(2);
}
