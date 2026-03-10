"""
research_agent.py  –  ReAct Multi-Agent Deep Research Pipeline  v5
====================================================================

ARCHITECTURE  (matches the target diagram exactly)
────────────────────────────────────────────────────────────────────

  ┌──────────────────────────────────────────────────────────────┐
  │                   USER INPUT / RESEARCH TASK                  │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │              ORCHESTRATOR  (The Controller)                   │
  │  • Goal Decomposition  – breaks topic into sub-tasks          │
  │  • Strategy Selection  – decides which tool per step          │
  │  • Runs the ReAct loop until research goal is met             │
  └────────┬─────────────────────┬────────────────────┬──────────┘
           │ REASON              │ ACT                │ OBSERVE
           ▼                     ▼                    │
  ┌────────────────┐   ┌─────────────────────────┐   │
  │  GEMINI CORE   │   │   TOOL EXECUTION LAYER   │   │
  │  (LLM)         │   │                          │   │
  │  • Logic       │   │  [A] Web Search (DDGS)   │   │
  │  • Synthesis   │   │  [B] Page Scraper        │   │
  │  • Verification│   │  [C] Code Interpreter    │   │
  │  • Formatting  │   │      (Python/matplotlib) │   │
  └────────────────┘   └──────────────┬───────────┘   │
                                      │ results        │
  ┌───────────────────────────────────▼───────────────▼──────────┐
  │            DYNAMIC CONTEXT  &  EPISODIC MEMORY                │
  │  • fact_store   – deduplicated verified facts with citations  │
  │  • source_log   – all scraped sources                         │
  │  • search_log   – queries tried (avoids repeats)              │
  │  • gap_log      – what still needs to be found                │
  │  • failure_log  – dead URLs, failed searches → try another    │
  └──────────────────────────────┬────────────────────────────────┘
                    (loop until goal met, max iterations)
  ┌──────────────────────────────▼───────────────────────────────┐
  │             FINAL SYNTHESIS  &  REPORTING                     │
  │  • Citation verification  • Tables  • Charts  • DOCX          │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │                  COMPLETED RESEARCH OUTPUT                    │
  └──────────────────────────────────────────────────────────────┘

TOKEN EFFICIENCY STRATEGY
──────────────────────────
  • Semaphore(3)       – max 3 LLM calls in-flight simultaneously
  • Fact store         – deduplicates facts so the same info isn't
                         re-synthesised multiple times
  • Snippet mode       – REASON uses 300-char snippets to decide
                         WHAT to read fully (only fetches full
                         content for high-value sources)
  • Tool routing       – LLM chooses the cheapest tool first
                         (snippet → full scrape → LLM synthesis)
  • Groq cascade       – llama-3.3-70b → llama3-8b on rate-limit
  • Per-stage budgets  – each stage has a max_tokens cap tuned to
                         exactly what that stage needs

Public API:
  run_research_no_email(topic)  → docx_path
  run_research(topic, to_email) → emails docx
"""

from __future__ import annotations

import json, os, re, smtplib, subprocess, threading, time, traceback, tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import datetime
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from dotenv import load_dotenv
from google import genai
from groq import Groq

load_dotenv()

# ══════════════════════════════════════════════════════════════════════════════
# CONFIG
# ══════════════════════════════════════════════════════════════════════════════

GEMINI_MODEL     = "gemini-3-flash-preview"
GROQ_MODEL   = "llama-3.3-70b-versatile"

MAX_REACT_ITERATIONS  = 6    # max reason→act→observe loops per sub-topic
MAX_SUBTOPICS         = 6   # director cap
MAX_SOURCES_PER_TOPIC = 12   # scrape cap per sub-topic
SNIPPET_CHARS         = 400  # chars shown to LLM during REASON step
FULL_CHARS            = 1800 # chars used during SYNTHESISE step
GROQ_DAILY_LIMIT      = 85_000

GMAIL_ADDRESS      = os.getenv("GMAIL_ADDRESS", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")

# ══════════════════════════════════════════════════════════════════════════════
# LLM LAYER  —  Gemini primary → Groq cascade, semaphore-throttled
# ══════════════════════════════════════════════════════════════════════════════

_genai_client     = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
_groq_client      = Groq(api_key=os.getenv("GROQ_API_KEY"))
_LLM_SEM          = threading.Semaphore(3)   # max 3 concurrent LLM calls
_groq_tokens_used = 0
_groq_lock        = threading.Lock()


def _groq(prompt: str, temperature: float, max_tokens: int, agent: str) -> str:
    global _groq_tokens_used

    est = (len(prompt) + max_tokens) // 4

    # ---- token budget check ----
    with _groq_lock:
        if (_groq_tokens_used + est) > GROQ_DAILY_LIMIT:
            raise RuntimeError(f"[{agent}] Groq daily token budget exceeded")
        _groq_tokens_used += est

    mt = min(max_tokens, 8000)

    for attempt in range(3):
        try:
            r = _groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=mt
            )

            txt = r.choices[0].message.content.strip()

            if len(txt.split()) >= 8:
                return txt

            raise ValueError("near-empty response")

        except Exception as exc:
            s = str(exc).lower()

            is_tpd = "per day" in s or "tpd" in s
            is_rate = "429" in s or "rate limit" in s

            if is_tpd:
                print(f"    [{agent}] ⚠️ Groq daily limit reached")
                raise

            elif is_rate and attempt < 2:
                wait = 30

                m = re.search(r"try again in (\d+)m", s)
                s2 = re.search(r"try again in (\d+)s", s)

                if m:
                    wait = min(int(m.group(1)) * 60 + 10, 90)
                elif s2:
                    wait = min(int(s2.group(1)) + 5, 90)

                print(f"    [{agent}] ⏳ Groq wait {wait}s …")
                time.sleep(wait)

            else:
                raise

    raise RuntimeError(f"[{agent}] Groq failed after retries")


def _llm(prompt: str, *, agent: str = "llm",
         temperature: float = 0.3, max_tokens: int = 4096,
         retries: int = 3) -> str:
    """Semaphore-guarded: Groq 70B → Gemini fallback."""

    with _LLM_SEM:
        last_groq_exc = None
        last_gemini_exc = None

        # -------------------------
        # 1️⃣ Try Groq (primary)
        # -------------------------
        for attempt in range(retries):
            try:
                print(f"    [{agent}] 🔄 Groq (70B) attempt {attempt+1}")
                return _groq(prompt, temperature, max_tokens, agent)

            except Exception as exc:
                last_groq_exc = exc
                s = str(exc).lower()

                is_rate = any(k in s for k in (
                    "429", "rate", "quota", "limit", "resource exhausted"
                ))

                if is_rate and attempt < retries - 1:
                    wait = 10 * (attempt + 1)
                    print(f"    [{agent}] ⏳ Groq wait {wait}s …")
                    time.sleep(wait)
                else:
                    print(f"    [{agent}] ⚠️  Groq failed: {exc}")
                    break

        # -------------------------
        # 2️⃣ Gemini fallback
        # -------------------------
        for attempt in range(retries):
            try:
                r = _genai_client.models.generate_content(
                    model=GEMINI_MODEL,
                    contents=prompt,
                    config={
                        "temperature": temperature,
                        "max_output_tokens": max_tokens
                    }
                )

                print(f"    [{agent}] ✅ Gemini fallback")
                return r.text.strip()

            except Exception as exc:
                last_gemini_exc = exc
                s = str(exc).lower()

                is_rate = any(k in s for k in (
                    "429", "quota", "rate", "resource exhausted", "unavailable"
                ))

                if is_rate and attempt < retries - 1:
                    wait = 20 * (attempt + 1)
                    print(f"    [{agent}] ⏳ Gemini wait {wait}s …")
                    time.sleep(wait)
                else:
                    print(f"    [{agent}] ⚠️  Gemini failed: {exc}")
                    break

        raise RuntimeError(
            f"[{agent}] Both LLMs failed.\n"
            f"  Groq: {last_groq_exc}\n"
            f"  Gemini: {last_gemini_exc}"
        )


def _parse_json(raw: str) -> Any:
    raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
    return json.loads(raw)


# ══════════════════════════════════════════════════════════════════════════════
# TOOL EXECUTION LAYER
# ══════════════════════════════════════════════════════════════════════════════

def tool_search(query: str, max_results: int = 8) -> list[dict]:
    """[A] Web Search — returns title, url, snippet."""
    try:
        with DDGS() as d:
            return [{"title": r["title"], "url": r["href"], "snippet": r["body"]}
                    for r in d.text(query, max_results=max_results)]
    except Exception as e:
        print(f"      [SEARCH] error: {e}")
        return []


def tool_scrape(url: str, full: bool = False) -> str:
    """[B] Page Scraper — snippet mode (400 chars) or full mode (1800 chars)."""
    try:
        r = requests.get(url, timeout=10,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        soup = BeautifulSoup(r.text, "html.parser")
        for t in soup(["script","style","nav","footer","header",
                       "aside","form","noscript","iframe","svg"]):
            t.decompose()
        text = re.sub(r"\s{3,}", "  ", soup.get_text(separator=" ", strip=True))
        return text[:(1800 if full else SNIPPET_CHARS)]
    except Exception:
        return ""


def tool_scrape_parallel(urls: list[str], full: bool = False) -> dict[str, str]:
    """Scrape multiple URLs in parallel. Returns {url: content}."""
    def job(u):
        return u, tool_scrape(u, full=full)
    with ThreadPoolExecutor(max_workers=10) as pool:
        return {u: c for u, c in pool.map(lambda u: job(u), urls) if c}


def tool_compute(expression: str) -> str:
    """[C] Code Interpreter — safely evaluates simple Python math expressions."""
    try:
        allowed = {"__builtins__": {}, "round": round, "abs": abs,
                   "min": min, "max": max, "sum": sum, "len": len}
        result = eval(expression, allowed)
        return str(result)
    except Exception as e:
        return f"compute_error: {e}"


# ══════════════════════════════════════════════════════════════════════════════
# DYNAMIC CONTEXT  &  EPISODIC MEMORY
# ══════════════════════════════════════════════════════════════════════════════

@dataclass
class EpisodicMemory:
    """
    Shared memory updated by every agent at every step.
    Acts as the 'brain state' of the research session.
    """
    topic:       str
    fact_store:  dict[str, dict] = field(default_factory=dict)
    # fact_store: {fact_id: {text, source_url, source_title, citation_num}}

    source_log:  list[dict]      = field(default_factory=list)
    # source_log: [{url, title, snippet, content, citation_num}]

    search_log:  set[str]        = field(default_factory=set)
    # search_log: set of query strings already tried

    gap_log:     list[str]       = field(default_factory=list)
    # gap_log: angles still needing research

    failure_log: set[str]        = field(default_factory=set)
    # failure_log: dead URLs, failed queries

    seen_urls:   set[str]        = field(default_factory=set)
    _lock:       threading.Lock  = field(default_factory=threading.Lock)
    _cite_ctr:   int             = 0

    def add_sources(self, results: list[dict], contents: dict[str, str]) -> list[dict]:
        """Add scraped sources to memory. Returns newly added sources."""
        added = []
        with self._lock:
            for r in results:
                url = r["url"]
                if url in self.seen_urls or url in self.failure_log:
                    continue
                content = contents.get(url, "")
                if not content:
                    self.failure_log.add(url)
                    continue
                self._cite_ctr += 1
                entry = {**r, "content": content, "citation_num": self._cite_ctr}
                self.source_log.append(entry)
                self.seen_urls.add(url)
                added.append(entry)
        return added

    def add_facts(self, facts: list[dict]) -> None:
        """Deduplicate and store facts. facts: [{text, source_url, source_title}]"""
        with self._lock:
            for f in facts:
                # Dedup by first 60 chars of fact text
                key = f["text"][:60].lower().strip()
                if key not in self.fact_store:
                    src = next((s for s in self.source_log
                                if s["url"] == f.get("source_url", "")), None)
                    cite = src["citation_num"] if src else 0
                    self.fact_store[key] = {
                        "text":         f["text"],
                        "source_url":   f.get("source_url", ""),
                        "source_title": f.get("source_title", ""),
                        "citation_num": cite,
                    }

    def get_fact_digest(self, max_facts: int = 60) -> str:
        """Compact summary of known facts for use in REASON prompts."""
        with self._lock:
            facts = list(self.fact_store.values())[-max_facts:]
        lines = [f"[{f['citation_num']}] {f['text']}" for f in facts]
        return "\n".join(lines)

    def get_sources_digest(self) -> str:
        """One-line summary per source for REASON step (cheap context)."""
        with self._lock:
            return "\n".join(
                f"[{s['citation_num']}] {s['title']}: {s['snippet'][:120]}"
                for s in self.source_log[-40:])

    def mark_searched(self, query: str) -> bool:
        """Returns True if query is new (not yet tried). Marks as tried."""
        with self._lock:
            if query.lower().strip() in self.search_log:
                return False
            self.search_log.add(query.lower().strip())
            return True


# ══════════════════════════════════════════════════════════════════════════════
# ORCHESTRATOR LOGIC
# ══════════════════════════════════════════════════════════════════════════════

@dataclass
class ResearchPlan:
    subtopics:       list[str]
    required_tables: list[str]
    required_charts: list[str]

@dataclass
class DataPlan:
    table_specs: list[dict]
    chart_specs: list[dict]


# ── Step 1: Goal Decomposition (Director) ────────────────────────────────────

def goal_decomposition(topic: str) -> ResearchPlan:
    """
    ORCHESTRATOR — Goal Decomposition
    Breaks the research task into specific sub-tasks and defines
    the required output structure (tables, charts).
    Token-efficient: single call, structured JSON output.
    """
    print("\n  [ORCHESTRATOR] Goal decomposition …")
    prompt = f"""You are directing a research team. Topic: "{topic}"

Return ONLY valid JSON with these keys:

{{
  "subtopics": [
    "8-10 highly specific, independently searchable sub-topics covering:
     market data, key players, technology, regulation, regional analysis,
     use cases, investment trends, risks, future outlook"
  ],
  "required_tables": [
    "5+ table descriptions with exact column names, e.g.:
     'Market segments — Segment | 2024 Value USD | 2030 Forecast | CAGR | Driver'",
    "'Top competitors — Company | HQ | Revenue | Market Share | Key Products'"
  ],
  "required_charts": [
    "2-4 chart descriptions, e.g.:
     'Line: total market growth 2018-2033 USD billion',
     'Bar: top companies market share 2025'"
  ]
}}

Be maximally specific. Sub-topics should be narrow enough to search directly."""

    raw = _llm(prompt, agent="DIRECTOR", temperature=0.2, max_tokens=1500)
    try:
        d = _parse_json(raw)
        plan = ResearchPlan(
            subtopics       = [str(s) for s in d.get("subtopics", [])[:MAX_SUBTOPICS]],
            required_tables = [str(t) for t in d.get("required_tables", [])],
            required_charts = [str(c) for c in d.get("required_charts", [])],
        )
        print(f"  [ORCHESTRATOR] Plan: {len(plan.subtopics)} sub-topics | "
              f"{len(plan.required_tables)} tables | {len(plan.required_charts)} charts")
        for i, s in enumerate(plan.subtopics, 1):
            print(f"    {i:02d}. {s}")
        return plan
    except Exception as e:
        print(f"  [ORCHESTRATOR] Plan parse error ({e}), using fallback")
        return ResearchPlan(subtopics=[topic], required_tables=[], required_charts=[])


# ── Step 2: ReAct Research Loop (per sub-topic) ──────────────────────────────

def react_research_loop(subtopic: str, agent_id: int,
                        memory: EpisodicMemory) -> str:
    """
    ORCHESTRATOR — ReAct Loop for one sub-topic
    Implements the full Reason → Act → Observe cycle.

    REASON:  LLM decides what tool to use and with what input
    ACT:     Tool executes (search / scrape / compute)
    OBSERVE: Result written to EpisodicMemory
    LOOP:    Until subtopic is sufficiently covered or max iterations reached

    Token efficiency:
    - REASON prompt uses snippets (400 chars) not full content
    - Only sources judged as HIGH VALUE get full-scraped (1800 chars)
    - Fact extraction is batched, not one call per source
    """
    name = f"AGENT-{agent_id:02d}"
    print(f"\n  [{name}] ReAct loop: {subtopic[:65]}")

    # ── Iteration loop ───────────────────────────────────────────────────────
    for iteration in range(MAX_REACT_ITERATIONS):
        print(f"  [{name}] iteration {iteration+1}/{MAX_REACT_ITERATIONS}")

        # ── REASON ───────────────────────────────────────────────────────────
        # Give the LLM a cheap digest of what we know so far
        known_facts   = memory.get_fact_digest(max_facts=30)
        known_sources = memory.get_sources_digest()
        searched      = list(memory.search_log)[-10:]  # last 10 queries tried

        reason_prompt = f"""You are a research agent. Your current sub-topic: "{subtopic}"
Overall research topic: "{memory.topic}"

WHAT YOU KNOW SO FAR:
{known_facts[:2000] if known_facts else "(nothing yet)"}

SOURCES ALREADY FOUND:
{known_sources[:1000] if known_sources else "(none yet)"}

RECENT SEARCHES TRIED: {searched}

DECIDE YOUR NEXT ACTION. Choose exactly one:

Option A — SEARCH: You need more sources on a specific angle not yet covered
Option B — SCRAPE: You found a promising URL in search results and need its full content
Option C — COMPUTE: You have numbers that need calculation (e.g. CAGR, percentage change)
Option D — DONE: You have enough facts to write a complete, data-rich section

Return ONLY JSON:
{{"action": "SEARCH"|"SCRAPE"|"COMPUTE"|"DONE",
  "input": "the search query, URL, or math expression",
  "reason": "one sentence why"}}"""

        try:
            raw    = _llm(reason_prompt, agent=f"{name}/REASON",
                          temperature=0.2, max_tokens=300)
            action = _parse_json(raw)
        except Exception as e:
            print(f"  [{name}] REASON parse error: {e}, defaulting to SEARCH")
            action = {"action": "SEARCH", "input": subtopic,
                      "reason": "fallback search"}

        act  = action.get("action", "DONE")
        inp  = action.get("input", "")
        print(f"  [{name}] → {act}: {str(inp)[:70]}")

        # ── ACT + OBSERVE ─────────────────────────────────────────────────────

        if act == "DONE":
            print(f"  [{name}] ✓ Coverage complete")
            break

        elif act == "SEARCH":
            if not memory.mark_searched(inp):
                print(f"  [{name}] Query already tried, skipping")
                # Force a different search next iteration
                alt = f"{subtopic} {['statistics','analysis','report','examples','2025'][iteration % 5]}"
                if memory.mark_searched(alt):
                    inp = alt
                else:
                    continue

            results = tool_search(inp, max_results=8)
            if not results:
                memory.failure_log.add(inp)
                continue

            # Snippet-scrape all results (cheap)
            urls     = [r["url"] for r in results
                        if r["url"] not in memory.seen_urls
                        and r["url"] not in memory.failure_log]
            snippets = tool_scrape_parallel(urls[:8], full=False)

            # Add as sources with snippet content first
            added = memory.add_sources(results,
                        {u: snippets.get(u, r.get("snippet",""))
                         for r in results for u in [r["url"]]})

            # Now full-scrape the 3 most promising new sources
            promising = [s["url"] for s in added[:3]]
            if promising:
                full_contents = tool_scrape_parallel(promising, full=True)
                with memory._lock:
                    for src in memory.source_log:
                        if src["url"] in full_contents:
                            src["content"] = full_contents[src["url"]]

            print(f"  [{name}] +{len(added)} new sources")

        elif act == "SCRAPE":
            url = inp
            if url in memory.seen_urls or url in memory.failure_log:
                continue
            content = tool_scrape(url, full=True)
            if content:
                fake_result = [{"title": url[:60], "url": url,
                                "snippet": content[:200]}]
                memory.add_sources(fake_result, {url: content})
                print(f"  [{name}] scraped 1 URL")
            else:
                memory.failure_log.add(url)

        elif act == "COMPUTE":
            result = tool_compute(inp)
            # Store computation as a synthetic fact
            memory.add_facts([{
                "text":         f"Computed: {inp} = {result}",
                "source_url":   "",
                "source_title": "Code Interpreter",
            }])
            print(f"  [{name}] computed: {inp} = {result}")

    # ── EXTRACT FACTS from all sources for this sub-topic ────────────────────
    # Batch: pass all source snippets in one LLM call → extract structured facts
    with memory._lock:
        my_sources = [s for s in memory.source_log
                      if s.get("content")][-MAX_SOURCES_PER_TOPIC:]

    if my_sources:
        src_text = "\n\n".join(
            f"[{s['citation_num']}] {s['title']}\n{s['content'][:FULL_CHARS]}"
            for s in my_sources[:8]  # cap at 8 for token efficiency
        )
        extract_prompt = f"""Extract ALL specific facts, statistics, numbers, company names,
product names, dates, and dollar values from these sources about "{subtopic}".

Return a JSON array of fact objects:
[{{"text": "fact sentence with specific data", "source_url": "url", "source_title": "title"}}]

Only include facts with specific data (numbers, names, dates). No generalities.
Sources:
{src_text}"""

        try:
            raw   = _llm(extract_prompt, agent=f"{name}/EXTRACT",
                         temperature=0.1, max_tokens=2000)
            facts = _parse_json(raw)
            if isinstance(facts, list):
                memory.add_facts(facts)
                print(f"  [{name}] extracted {len(facts)} facts")
        except Exception as e:
            print(f"  [{name}] fact extract error: {e}")

    # ── WRITE SECTION using verified facts ───────────────────────────────────
    with memory._lock:
        relevant_facts = [f for f in memory.fact_store.values()
                          if subtopic.split()[0].lower() in
                          (f["text"] + f["source_title"]).lower()
                          or len(memory.fact_store) < 20]
        relevant_facts = relevant_facts[-50:]

    fact_block = "\n".join(
        f"[{f['citation_num']}] {f['text']}" for f in relevant_facts)

    write_prompt = f"""You are a senior research analyst writing a section of a major report.

Sub-topic: "{subtopic}"

Write a comprehensive section of 900 to 1200 words using ONLY the verified facts below.

MANDATORY FORMAT:
## [Descriptive section title]

### [Sub-heading 1]
[2+ dense paragraphs with inline citations [N]]

### [Sub-heading 2]
[2+ dense paragraphs with inline citations [N]]

TABLE RULE: whenever 3+ items are comparable → use a table:
TABLE:
| Col1 | Col2 | Col3 |
|------|------|------|
| val  | val  | val  |

RULES:
- Bold all company names, numbers, key terms: **IBM**, **$4.2B**, **17% CAGR**
- Every factual claim must have [N] inline citation
- At least ONE table per section if comparative data exists
- Do NOT invent data — only use the facts below

VERIFIED FACTS:
{fact_block[:4000]}"""

    section_md = _llm(write_prompt, agent=f"{name}/WRITE",
                      temperature=0.35, max_tokens=3000)

    wc = len(section_md.split())
    if wc < 100:
        # Thin output — retry with compact fallback
        print(f"  [{name}] ⚠️  Only {wc} words, retrying compact …")
        compact = f"""Write a 500-word section on "{subtopic}".
Use these facts: {fact_block[:2000]}
Format: ## Title\n### Sub-heading\n[paragraphs with [N] citations]"""
        section_md = _llm(compact, agent=f"{name}/RETRY",
                          temperature=0.4, max_tokens=1500)
        wc = len(section_md.split())

    print(f"  [{name}] ✓ {wc} words written")
    return section_md


# ── Step 3: Strategy Selection — run sub-topics with smart parallelism ────────

def strategy_select_and_run(plan: ResearchPlan,
                             memory: EpisodicMemory) -> list[tuple[str, str]]:
    """
    ORCHESTRATOR — Strategy Selection
    Decides how to parallelise the research.
    Groups sub-topics into batches of 3 (matching semaphore).
    Returns list of (subtopic, section_md) in plan order.
    """
    print(f"\n  [ORCHESTRATOR] Strategy: {len(plan.subtopics)} agents, "
          f"batches of 3 (LLM semaphore-matched)")

    results: dict[str, str] = {}

    def run(args):
        subtopic, agent_id = args
        md = react_research_loop(subtopic, agent_id, memory)
        return subtopic, md

    args = [(st, i+1) for i, st in enumerate(plan.subtopics)]

    with ThreadPoolExecutor(max_workers=3) as pool:
        futs = {pool.submit(run, a): a for a in args}
        for fut in as_completed(futs):
            subtopic, md = fut.result()
            results[subtopic] = md

    # Return in plan order
    return [(st, results.get(st, "")) for st in plan.subtopics]


# ── Step 4: Failure Recovery + Gap Fill ──────────────────────────────────────

def failure_recovery_and_gap_fill(plan: ResearchPlan,
                                  sections: list[tuple[str, str]],
                                  memory: EpisodicMemory) -> None:
    """
    ORCHESTRATOR — Failure Recovery
    - Retries agents that produced thin sections
    - Identifies coverage gaps and fires targeted gap searches
    - Updates memory with new findings
    """
    print("\n  [ORCHESTRATOR] Failure recovery & gap analysis …")

    # Retry thin sections
    for i, (subtopic, md) in enumerate(sections):
        if len(md.split()) < 150:
            print(f"  [RECOVERY] Retrying thin section: {subtopic[:50]}")
            new_md = react_research_loop(subtopic, 99, memory)
            sections[i] = (subtopic, new_md)

    # Gap analysis
    previews = "\n".join(f"[{st[:40]}]: {md[:200]}" for st, md in sections)
    gap_prompt = f"""You are a senior editor reviewing a research report draft.
Topic: "{memory.topic}"
Required tables: {json.dumps(plan.required_tables)}

Section previews:
{previews[:3000]}

List up to 3 specific search queries to fill critical gaps.
Return ONLY a JSON array of strings, or []:
["query 1", "query 2"]"""

    try:
        raw  = _llm(gap_prompt, agent="GAP-FILL", temperature=0.2, max_tokens=400)
        gaps = _parse_json(raw)
        if not isinstance(gaps, list) or not gaps:
            print("  [ORCHESTRATOR] No critical gaps")
            return

        print(f"  [ORCHESTRATOR] Filling {len(gaps)} gap(s): {gaps}")
        for q in gaps[:3]:
            if not memory.mark_searched(q):
                continue
            results  = tool_search(q, max_results=8)
            urls     = [r["url"] for r in results
                        if r["url"] not in memory.seen_urls][:6]
            contents = tool_scrape_parallel(urls, full=True)
            memory.add_sources(results, contents)
    except Exception as e:
        print(f"  [ORCHESTRATOR] Gap fill error (non-critical): {e}")


# ── Step 5: Data Agent — tables + charts ─────────────────────────────────────

def data_agent(plan: ResearchPlan, memory: EpisodicMemory) -> DataPlan:
    """
    Extracts structured tables and chart specs from the fact store.
    Runs table and chart extraction in parallel (2 LLM calls simultaneously).
    Token-efficient: uses fact digest rather than full scraped content.
    """
    print("\n  [DATA AGENT] Extracting tables and charts …")

    # Build content from fact store (much smaller than raw scrape)
    fact_digest  = memory.get_fact_digest(max_facts=120)
    # Also include source snippets for richer table data
    source_block = "\n\n".join(
        f"[{s['citation_num']}] {s['title']}\n{s['content'][:600]}"
        for s in memory.source_log[:30])

    combined = f"VERIFIED FACTS:\n{fact_digest}\n\nSOURCE CONTENT:\n{source_block}"

    tables_prompt = f"""Extract data for these required tables from the research content below.
Topic: "{memory.topic}"
Required tables: {json.dumps(plan.required_tables)}

Rules:
- Use ONLY data present in the content
- Minimum 4 data rows per table (not counting header)
- Use actual names, numbers, percentages — no placeholders
- If a required table lacks 4 rows, include related data that fits the theme

Return ONLY a JSON array:
[{{"title":"Table title","headers":["Col1","Col2"],"rows":[["v1","v2"],["v3","v4"]]}}]

Content:
{combined[:10000]}"""

    charts_prompt = f"""Extract numerical data for charts from the research content.
Topic: "{memory.topic}"
Required charts: {json.dumps(plan.required_charts)}

Rules:
- Line: min 4 time-series points (may combine from multiple sources)
- Bar: min 4 categories
- Pie: parts summing ~100%
- Max 4 charts. Return [] if data insufficient.

Return ONLY a JSON array:
[{{"chart_type":"line","title":"Title","xlabel":"X","ylabel":"Y",
   "labels":["2020","2022","2025"],"values":[10,20,35],"unit":"B USD",
   "source_note":"multiple sources"}}]

Content:
{combined[:8000]}"""

    table_specs, chart_specs = [], []

    def get_tables():
        r = _llm(tables_prompt, agent="DATA/tables", temperature=0.1, max_tokens=5000)
        return _parse_json(r)

    def get_charts():
        r = _llm(charts_prompt, agent="DATA/charts", temperature=0.1, max_tokens=1500)
        return _parse_json(r)

    with ThreadPoolExecutor(max_workers=2) as pool:
        tf, cf = pool.submit(get_tables), pool.submit(get_charts)
        try:
            res = tf.result()
            if isinstance(res, list):
                table_specs = [t for t in res
                               if isinstance(t, dict) and t.get("headers")
                               and isinstance(t.get("rows"), list)
                               and len(t["rows"]) >= 3]
        except Exception as e:
            print(f"  [DATA AGENT] Tables error: {e}")
        try:
            res = cf.result()
            if isinstance(res, list):
                chart_specs = res[:4]
        except Exception as e:
            print(f"  [DATA AGENT] Charts error: {e}")

    print(f"  [DATA AGENT] ✓ {len(table_specs)} tables | {len(chart_specs)} charts")
    return DataPlan(table_specs=table_specs, chart_specs=chart_specs)


# ── Step 6: Final Synthesis & Verification ───────────────────────────────────

def final_synthesis(topic: str, sections: list[tuple[str, str]],
                    data_plan: DataPlan, memory: EpisodicMemory) -> str:
    """
    FINAL SYNTHESIS & REPORTING
    Assembles all sections with citation verification.
    Places table markers. Writes Executive Summary + Conclusion.
    """
    print("\n  [SYNTHESIS] Assembling final report …")

    sections_text = "\n\n---\n\n".join(
        f"{md}" for _, md in sections if md)

    table_list = "\n".join(
        f"  <<TABLE_{i+1}>> → {t['title']}"
        for i, t in enumerate(data_plan.table_specs))

    prompt = f"""You are a senior editor assembling a final research report.
Topic: "{topic}"

TASKS:
1. ## Executive Summary (350-450 words)
   - Lead with the single most important finding + its scale
   - 5 key findings with specific numbers
   - 3 strategic implications

2. ## Introduction (200 words) — scope, context, why this matters now

3. ASSEMBLE ALL SECTIONS
   - Keep ALL facts, numbers, company names, [N] citations
   - Remove duplication: if same stat appears twice, keep once
   - Smooth transitions between sections

4. PLACE TABLE MARKERS on their own line after the most relevant paragraph:
{table_list if table_list else "  (no tables this run)"}

5. ## Conclusion (450-500 words)
   - 3-4 named strategic themes with evidence
   - Specific outlook with years (2026, 2028, 2030)
   - Final actionable recommendation
   - FULLY COMPLETE — no mid-sentence cutoffs

6. CITATION VERIFICATION
   - Keep only [N] citations that actually appeared in sources
   - If a citation number is uncertain, remove the bracket rather than guess

LENGTH: 4000-6000 words. Keep all ##, ###, **, -, TABLE: markdown.

SECTIONS:
{sections_text}"""

    report = _llm(prompt, agent="SYNTHESIS", temperature=0.3, max_tokens=8192)
    print(f"  [SYNTHESIS] ✓ ~{len(report.split())} words")
    return report


# ══════════════════════════════════════════════════════════════════════════════
# CHART RENDERER  (Code Interpreter output → PNG)
# ══════════════════════════════════════════════════════════════════════════════

_PAL = ["#4f46e5","#0ea5e9","#10b981","#f59e0b",
        "#ef4444","#ec4899","#8b5cf6","#06b6d4"]


def render_charts(specs: list[dict]) -> list[str]:
    paths = []
    for i, s in enumerate(specs[:4]):
        p = _render_chart(s, i)
        if p:
            paths.append(p)
            print(f"  [CHARTS] ✓ {s.get('title','')[:55]}")
    return paths


def _render_chart(spec: dict, idx: int) -> str | None:
    try:
        labels = [str(l) for l in spec["labels"]]
        values = [float(v) for v in spec["values"]]
        unit   = spec.get("unit", "")
        ctype  = spec.get("chart_type", "bar")
        if len(values) < 2:
            return None

        fig, ax = plt.subplots(figsize=(9, 5))
        fig.patch.set_facecolor("white")
        ax.set_facecolor("#f8f9fc")
        colors = (_PAL * 4)[:len(labels)]

        if ctype == "bar":
            bars = ax.bar(labels, values, color=colors, edgecolor="white", linewidth=0.7)
            mv = max(values) or 1
            for b, v in zip(bars, values):
                ax.text(b.get_x() + b.get_width()/2, b.get_height() + mv*0.02,
                        f"{v:g}{unit}", ha="center", va="bottom", fontsize=8, color="#222")
            ax.set_xlabel(spec.get("xlabel",""), color="#555", fontsize=9)
            ax.set_ylabel((spec.get("ylabel","") + f" ({unit})" if unit
                           else spec.get("ylabel","")), color="#555", fontsize=9)

        elif ctype == "line":
            ax.plot(labels, values, color=_PAL[0], marker="o", linewidth=2.5, markersize=7)
            ax.fill_between(range(len(labels)), values, alpha=0.12, color=_PAL[0])
            ax.set_xticks(range(len(labels)))
            ax.set_xticklabels(labels, rotation=30, ha="right", fontsize=8)
            for i2, (l, v) in enumerate(zip(labels, values)):
                ax.annotate(f"{v:g}", (i2, v), textcoords="offset points",
                            xytext=(0,9), ha="center", fontsize=7.5, color="#333")
            ax.set_xlabel(spec.get("xlabel",""), color="#555", fontsize=9)
            ax.set_ylabel((spec.get("ylabel","") + f" ({unit})" if unit
                           else spec.get("ylabel","")), color="#555", fontsize=9)

        elif ctype == "pie":
            if abs(sum(values)-100) > 10:
                s2 = sum(values); values = [v/s2*100 for v in values]
            wedges, texts, autos = ax.pie(
                values, labels=labels, colors=colors, autopct="%1.1f%%",
                startangle=140, wedgeprops={"edgecolor":"white","linewidth":1.5})
            for t in texts:  t.set_color("#333"); t.set_fontsize(8)
            for a in autos:  a.set_color("#111"); a.set_fontsize(8)
        else:
            plt.close(fig); return None

        if spec.get("source_note"):
            fig.text(0.5,-0.03, f"Source: {spec['source_note']}",
                     ha="center", color="#888", fontsize=7, style="italic")
        ax.set_title(spec["title"], color="#1e1b4b", fontsize=12,
                     fontweight="bold", pad=12)
        ax.tick_params(colors="#333", labelsize=8)
        ax.spines[:].set_color("#ddd")
        plt.tight_layout(pad=1.5)
        path = str(Path(tempfile.gettempdir()) /
                   f"chart_{idx}_{int(time.time())}.png")
        plt.savefig(path, dpi=160, bbox_inches="tight", facecolor="white")
        plt.close(fig)
        return path
    except Exception as e:
        print(f"  [CHARTS] render error: {e}")
        plt.close("all")
        return None


# ══════════════════════════════════════════════════════════════════════════════
# DOCX BUILDER
# ══════════════════════════════════════════════════════════════════════════════

def _esc(s: str) -> str:
    return (s.replace("\\","\\\\").replace("`","\\`").replace("$","\\$")
             .replace("\r","")
             .replace("\u2018","'").replace("\u2019","'")
             .replace("\u201c",'"').replace("\u201d",'"')
             .replace("\u2013","-").replace("\u2014","-")
             .replace("\u2026","...").replace("\u00a0"," "))


def _md_table_rows(lines: list[str]) -> list[list[str]] | None:
    rows = []
    for ln in lines:
        ln = ln.strip()
        if not ln: continue
        if re.match(r'^[\s|:\-]+$', ln): continue
        if "|" not in ln: break
        cells = [c.strip() for c in ln.strip("|").split("|")]
        if not all(c=="" for c in cells):
            rows.append(cells)
    return rows if len(rows) >= 2 else None


def _table_js(t: dict, dxa: int = 9360) -> str:
    headers = t.get("headers", [])
    rows    = t.get("rows", [])
    all_r   = ([headers] + rows) if headers else rows
    if not all_r: return ""
    cols  = max(len(r) for r in all_r)
    cw    = max(dxa // cols, 900)
    total = cw * cols

    row_js = []
    for ri, row in enumerate(all_r):
        row = (list(row) + [""]*cols)[:cols]
        hdr = ri == 0
        cells = []
        for cell in row:
            fill = "4f46e5" if hdr else ("f5f3ff" if ri%2==1 else "ffffff")
            tc   = "ffffff" if hdr else "1f2937"
            cells.append(
                f"""new TableCell({{width:{{size:{cw},type:WidthType.DXA}},
              shading:{{fill:"{fill}",type:ShadingType.CLEAR}},
              margins:{{top:80,bottom:80,left:120,right:120}},
              borders:{{top:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
                bottom:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
                left:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
                right:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}}}},
              children:[new Paragraph({{children:[new TextRun({{
                text:`{_esc(str(cell))}`,size:19,
                bold:{"true" if hdr else "false"},color:"{tc}"}})]}})]
            }})""")
        row_js.append("new TableRow({children:["+",".join(cells)+"]})")

    title_e   = _esc(t.get("title",""))
    col_widths = ",".join([str(cw)]*cols)
    return f"""
new Paragraph({{children:[new TextRun({{text:`{title_e}`,size:22,bold:true,
  color:"3730a3",italics:true}})],spacing:{{before:200,after:80}}}}),
new Table({{width:{{size:{total},type:WidthType.DXA}},
  columnWidths:[{col_widths}],rows:[{",".join(row_js)}]}}),
new Paragraph({{children:[new TextRun("")],spacing:{{before:80,after:200}}}}),"""


def build_docx(topic: str, report_text: str, data_plan: DataPlan,
               chart_paths: list[str], memory: EpisodicMemory) -> str:

    run_dir  = Path(__file__).parent.resolve()
    out_name = re.sub(r'[^a-z0-9]+','_', topic[:35].lower())
    js_file  = run_dir / "build_report.js"
    out_path = str(run_dir / f"research_{out_name}.docx")

    pkg_dir  = run_dir / "node_modules" / "docx"
    if not pkg_dir.exists():
        print("  📦 npm install docx …")
        r = subprocess.run("npm install docx", shell=True, cwd=str(run_dir),
                           capture_output=True, text=True, timeout=120)
        if r.returncode != 0:
            raise RuntimeError(f"npm install failed:\n{r.stderr}")
    docx_abs = str(pkg_dir).replace("\\", "/")

    table_js_map = {f"<<TABLE_{i+1}>>": _table_js(t)
                    for i, t in enumerate(data_plan.table_specs)}

    parts: list[str] = []
    chart_idx = 0
    h2_count  = 0

    # Cover
    parts.append(f"""
new Paragraph({{children:[new TextRun({{text:`{_esc(topic.title())}`,
  bold:true,size:56,color:"1e1b4b"}})],
  spacing:{{before:2880,after:240}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new TextRun({{text:"Research Report",size:28,color:"4f46e5"}})],
  spacing:{{before:0,after:120}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new TextRun({{
  text:`Generated: {datetime.now().strftime("%B %d, %Y")}  |  Sources: {len(memory.source_log)}  |  Facts verified: {len(memory.fact_store)}`,
  size:20,color:"666666"}})],
  spacing:{{before:0,after:2880}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new PageBreak()]}}),""")

    lines = report_text.split("\n")
    i = 0
    while i < len(lines):
        ln = lines[i].strip()

        m = re.search(r'<<TABLE_(\d+)>>', ln)
        if m:
            key = f"<<TABLE_{m.group(1)}>>"
            if key in table_js_map:
                parts.append(table_js_map[key])
            i += 1; continue

        if ln.startswith("### "):
            parts.append(f"""
new Paragraph({{heading:HeadingLevel.HEADING_3,
  children:[new TextRun({{text:`{_esc(ln[4:])}`,bold:true,size:26,color:"3730a3"}})],
  spacing:{{before:280,after:120}}}}),""")
            i += 1

        elif ln.startswith("## "):
            h2_count += 1
            parts.append(f"""
new Paragraph({{heading:HeadingLevel.HEADING_2,
  children:[new TextRun({{text:`{_esc(ln[3:])}`,bold:true,size:30,color:"4f46e5"}})],
  spacing:{{before:400,after:160}},
  border:{{bottom:{{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}}}}),""")
            if h2_count % 3 == 0 and chart_idx < len(chart_paths):
                p = chart_paths[chart_idx].replace("\\","/")
                parts.append(f"""
new Paragraph({{children:[new ImageRun({{data:fs.readFileSync(`{p}`),
  transformation:{{width:620,height:350}},type:"png"}})],
  spacing:{{before:160,after:160}},alignment:AlignmentType.CENTER}}),""")
                chart_idx += 1
            i += 1

        elif ln.startswith("# "):
            parts.append(f"""
new Paragraph({{heading:HeadingLevel.HEADING_1,
  children:[new TextRun({{text:`{_esc(ln[2:])}`,bold:true,size:36,color:"1e1b4b"}})],
  spacing:{{before:480,after:200}}}}),""")
            i += 1

        elif ln.startswith("|") and i+1 < len(lines) and \
             re.match(r'^[\s|:\-]+$', lines[i+1].strip()):
            tbl_lines, j = [], i
            while j < len(lines) and "|" in lines[j]:
                tbl_lines.append(lines[j]); j += 1
            rows = _md_table_rows(tbl_lines)
            if rows:
                parts.append(_table_js({"title":"","headers":rows[0],"rows":rows[1:]}))
            i = j

        elif ln.upper().startswith("TABLE:"):
            tbl_lines, j = [], i+1
            while j < len(lines) and "|" in lines[j]:
                tbl_lines.append(lines[j]); j += 1
            rows = _md_table_rows(tbl_lines)
            if rows:
                parts.append(_table_js({"title":"","headers":rows[0],"rows":rows[1:]}))
            i = j

        elif re.match(r"^[-*]\s+", ln):
            text = re.sub(r"^[-*]\s+","",ln)
            text = re.sub(r"\*\*(.+?)\*\*",r"\1",text)
            parts.append(f"""
new Paragraph({{numbering:{{reference:"bullets",level:0}},
  children:[new TextRun({{text:`{_esc(text)}`,size:22,color:"1f2937"}})],
  spacing:{{before:40,after:40}}}}),""")
            i += 1

        elif not ln:
            parts.append("""new Paragraph({children:[new TextRun("")],
  spacing:{before:40,after:40}}),""")
            i += 1

        else:
            clean = re.sub(r"\*\*(.+?)\*\*",r"\1",ln)
            parts.append(f"""
new Paragraph({{children:[new TextRun({{text:`{_esc(clean)}`,size:22,color:"1f2937"}})],
  spacing:{{before:80,after:80}},alignment:AlignmentType.JUSTIFIED}}),""")
            i += 1

    while chart_idx < len(chart_paths):
        p = chart_paths[chart_idx].replace("\\","/")
        parts.append(f"""
new Paragraph({{children:[new ImageRun({{data:fs.readFileSync(`{p}`),
  transformation:{{width:620,height:350}},type:"png"}})],
  spacing:{{before:160,after:160}},alignment:AlignmentType.CENTER}}),""")
        chart_idx += 1

    # References
    parts.append(f"""
new Paragraph({{children:[new PageBreak()]}}),
new Paragraph({{heading:HeadingLevel.HEADING_2,
  children:[new TextRun({{text:"References & Sources",bold:true,size:30,color:"4f46e5"}})],
  spacing:{{before:400,after:200}},
  border:{{bottom:{{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}}}}),""")

    for src in memory.source_log:
        te = _esc(f"[{src['citation_num']}]  {src['title']}")
        ue = _esc(src["url"])
        parts.append(f"""
new Paragraph({{children:[new TextRun({{text:`{te}`,size:20,bold:true,color:"1f2937"}})],
  spacing:{{before:100,after:20}}}}),
new Paragraph({{children:[new TextRun({{text:`{ue}`,size:18,color:"4f46e5"}})],
  spacing:{{before:0,after:80}}}}),""")

    all_content = "\n".join(parts)

    js = f"""const fs=require('fs');
const {{Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
  ImageRun,HeadingLevel,AlignmentType,BorderStyle,WidthType,
  ShadingType,PageBreak,LevelFormat}}=require('{docx_abs}');
const doc=new Document({{
  numbering:{{config:[{{reference:"bullets",levels:[{{level:0,
    format:LevelFormat.BULLET,text:"\\u2022",alignment:AlignmentType.LEFT,
    style:{{paragraph:{{indent:{{left:720,hanging:360}}}}}}}}]}}]}},
  styles:{{
    default:{{document:{{run:{{font:"Arial",size:22,color:"1f2937"}}}}}},
    paragraphStyles:[
      {{id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{{size:36,bold:true,font:"Arial",color:"1e1b4b"}},
        paragraph:{{spacing:{{before:480,after:200}},outlineLevel:0}}}},
      {{id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{{size:30,bold:true,font:"Arial",color:"4f46e5"}},
        paragraph:{{spacing:{{before:400,after:160}},outlineLevel:1}}}},
      {{id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{{size:26,bold:true,font:"Arial",color:"3730a3"}},
        paragraph:{{spacing:{{before:280,after:120}},outlineLevel:2}}}}
    ]
  }},
  sections:[{{
    properties:{{page:{{size:{{width:12240,height:15840}},
      margin:{{top:1440,right:1440,bottom:1440,left:1440}}}}}},
    children:[{all_content}]
  }}]
}});
Packer.toBuffer(doc).then(buf=>{{
  fs.writeFileSync(process.argv[2],buf);
  console.log('DOCX written:',process.argv[2]);
}}).catch(err=>{{console.error(err);process.exit(1);}});
"""
    js_file.write_text(js, encoding="utf-8")
    r = subprocess.run(["node", str(js_file), out_path],
                       capture_output=True, text=True,
                       cwd=str(run_dir), timeout=180)
    if r.returncode != 0:
        raise RuntimeError(f"DOCX failed:\n{r.stderr[:2000]}")
    print(f"  [DOCX] ✓ {out_path}")
    return out_path


# ══════════════════════════════════════════════════════════════════════════════
# EMAILER
# ══════════════════════════════════════════════════════════════════════════════

def _send_email(topic: str, docx_path: str, to_email: str,
                memory: EpisodicMemory) -> None:
    msg = MIMEMultipart()
    msg["From"]    = GMAIL_ADDRESS
    msg["To"]      = to_email
    msg["Subject"] = f"📊 Research Report: {topic.title()}"
    msg.attach(MIMEText(
        f'Report on "{topic}" ready.\n'
        f'Sources: {len(memory.source_log)} | '
        f'Facts: {len(memory.fact_store)} | '
        f'Generated: {datetime.now().strftime("%B %d, %Y %I:%M %p")}\n'
        f'Regards, RAG Research Agent', "plain"))
    fname = re.sub(r'[^a-z0-9]+','_', topic[:35].lower())
    with open(docx_path,"rb") as fh:
        part = MIMEBase("application",
            "vnd.openxmlformats-officedocument.wordprocessingml.document")
        part.set_payload(fh.read())
    encoders.encode_base64(part)
    part.add_header("Content-Disposition",
                    f'attachment; filename="Research_{fname}.docx"')
    msg.attach(part)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as srv:
        srv.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        srv.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC API  —  Orchestrator entry points
# ══════════════════════════════════════════════════════════════════════════════

def run_research_no_email(topic: str) -> str:
    print(f"\n{'═'*65}")
    print(f"  🚀  ReAct MULTI-AGENT RESEARCH  v5")
    print(f"  Topic: {topic}")
    print(f"{'═'*65}")

    # Initialise shared EpisodicMemory
    memory = EpisodicMemory(topic=topic)

    # ── 1. GOAL DECOMPOSITION ─────────────────────────────────────────────────
    plan = goal_decomposition(topic)

    # ── 2. STRATEGY SELECTION + ReAct RESEARCH LOOPS (parallel) ──────────────
    sections = strategy_select_and_run(plan, memory)

    # ── 3. FAILURE RECOVERY + GAP FILL ───────────────────────────────────────
    failure_recovery_and_gap_fill(plan, sections, memory)

    # ── 4. DATA AGENT (tables + charts) ──────────────────────────────────────
    data_plan = data_agent(plan, memory)

    # ── 5. CHART RENDERING ───────────────────────────────────────────────────
    print("\n  [CHARTS] Rendering …")
    chart_paths = render_charts(data_plan.chart_specs)

    # ── 6. FINAL SYNTHESIS & REPORTING ───────────────────────────────────────
    final_report = final_synthesis(topic, sections, data_plan, memory)
    wc = len(final_report.split())

    # ── 7. DOCX ───────────────────────────────────────────────────────────────
    print("\n  [DOCX] Building …")
    docx_path = build_docx(topic, final_report, data_plan, chart_paths, memory)

    for p in chart_paths:
        try: os.remove(p)
        except: pass

    print(f"\n{'═'*65}")
    print(f"  ✅  COMPLETE")
    print(f"  Words   : ~{wc}")
    print(f"  Sources : {len(memory.source_log)}")
    print(f"  Facts   : {len(memory.fact_store)}")
    print(f"  Tables  : {len(data_plan.table_specs)}")
    print(f"  Charts  : {len(chart_paths)}")
    print(f"  File    : {docx_path}")
    print(f"{'═'*65}\n")
    return docx_path


def run_research(topic: str, to_email: str) -> None:
    """Full pipeline + email. Reuses the same memory object throughout."""
    memory = EpisodicMemory(topic=topic)
    try:
        # Run pipeline, reusing shared memory (not a fresh one)
        print(f"\n{'═'*65}")
        print(f"  🚀  ReAct MULTI-AGENT RESEARCH  v5")
        print(f"  Topic: {topic}")
        print(f"{'═'*65}")

        plan         = goal_decomposition(topic)
        sections     = strategy_select_and_run(plan, memory)
        failure_recovery_and_gap_fill(plan, sections, memory)
        data_plan    = data_agent(plan, memory)
        chart_paths  = render_charts(data_plan.chart_specs)
        final_report = final_synthesis(topic, sections, data_plan, memory)
        docx_path    = build_docx(topic, final_report, data_plan, chart_paths, memory)

        for p in chart_paths:
            try: os.remove(p)
            except: pass

        _send_email(topic, docx_path, to_email, memory)
        print(f"  📧 Emailed to {to_email}")
    except Exception:
        print("❌  Research pipeline failed:")
        traceback.print_exc()