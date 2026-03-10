"""
research_agent.py  –  Multi-Agent Deep Research Pipeline  v4
=============================================================

AGENT TEAM ARCHITECTURE
─────────────────────────────────────────────────────────────

  ┌─────────────────────────────────────────────────────┐
  │                  DIRECTOR AGENT                      │
  │  • Analyses topic deeply                             │
  │  • Produces 8-12 highly specific sub-topics          │
  │  • Defines 5+ required tables + 2-4 required charts  │
  └──────────────────────┬──────────────────────────────┘
                         │ spawns in parallel
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │RESEARCHER 1│  │RESEARCHER 2│  │RESEARCHER N│  × up to 10
  │ search ×3  │  │ search ×3  │  │ search ×3  │
  │ scrape     │  │ scrape     │  │ scrape     │
  │ write 1200w│  │ write 1200w│  │ write 1200w│
  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
        └───────────────┼───────────────┘
                        ▼
  ┌─────────────────────────────────────────────────────┐
  │                   CRITIC AGENT                       │
  │  • Reviews all sections for gaps                     │
  │  • Triggers up to 4 gap-fill sub-researches          │
  └──────────────────────┬──────────────────────────────┘
                         ▼
  ┌─────────────────────────────────────────────────────┐
  │                   DATA AGENT                         │
  │  • Extracts every table (≥5) from all content        │
  │  • Extracts chart data series (2-4 charts)           │
  │  • Runs table + chart extraction in parallel         │
  └──────────────────────┬──────────────────────────────┘
                         ▼
  ┌─────────────────────────────────────────────────────┐
  │                   EDITOR AGENT                       │
  │  • Assembles all sections into one 4000-6000w report │
  │  • Writes Executive Summary + Intro + Conclusion     │
  │  • Places <<TABLE_N>> markers at optimal positions   │
  └──────────────────────┬──────────────────────────────┘
                         ▼
  ┌─────────────────────────────────────────────────────┐
  │                  DOCX BUILDER                        │
  │  • Renders all tables (purple header, alt rows)      │
  │  • Embeds charts inline at section breaks            │
  │  • Styled headings, justified prose, full references │
  └─────────────────────────────────────────────────────┘

Public API:
  run_research_no_email(topic)  → docx_path
  run_research(topic, to_email) → emails docx
"""

from __future__ import annotations

import json, os, re, smtplib, subprocess, time, traceback, tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import datetime
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

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
# LLM LAYER — Gemini primary, Groq fallback
# ══════════════════════════════════════════════════════════════════════════════

_genai_client      = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL       = "gemini-3-flash-preview"
_groq_client       = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL         = "llama-3.3-70b-versatile"
GMAIL_ADDRESS      = os.getenv("GMAIL_ADDRESS", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")


def _llm(prompt: str, *, agent: str = "agent",
         temperature: float = 0.3, max_tokens: int = 8192,
         retries: int = 3) -> str:
    """Gemini with exponential back-off → Groq fallback. Logs which model used."""
    last_exc = None
    for attempt in range(retries):
        try:
            resp = _genai_client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config={"temperature": temperature, "max_output_tokens": max_tokens},
            )
            print(f"    [{agent}] ✅ Gemini")
            return resp.text.strip()
        except Exception as exc:
            last_exc = exc
            is_rate = any(k in str(exc).lower()
                          for k in ("429", "quota", "rate", "resource exhausted"))
            if is_rate and attempt < retries - 1:
                wait = 25 * (attempt + 1)
                print(f"    [{agent}] ⏳ rate-limit, waiting {wait}s …")
                time.sleep(wait)
            else:
                print(f"    [{agent}] ⚠️  Gemini error: {exc}")
                break
    try:
        print(f"    [{agent}] 🔄 Groq fallback")
        resp = _groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=min(max_tokens, 8000),
        )
        return resp.choices[0].message.content.strip()
    except Exception as groq_exc:
        raise RuntimeError(
            f"[{agent}] Both LLMs failed.\n  Gemini: {last_exc}\n  Groq: {groq_exc}")


def _parse_json(raw: str) -> object:
    raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
    return json.loads(raw)


# ══════════════════════════════════════════════════════════════════════════════
# SEARCH + SCRAPE  (shared utilities)
# ══════════════════════════════════════════════════════════════════════════════

_SCRAPE_CHARS = 14_000


def _search(query: str, max_results: int = 10) -> list[dict]:
    try:
        with DDGS() as ddgs:
            return [{"title": r["title"], "url": r["href"],
                     "snippet": r["body"], "query": query}
                    for r in ddgs.text(query, max_results=max_results)]
    except Exception as e:
        print(f"      search error '{query[:50]}': {e}")
        return []


def _scrape(url: str) -> str:
    try:
        res = requests.get(url, timeout=12,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        soup = BeautifulSoup(res.text, "html.parser")
        for tag in soup(["script","style","nav","footer","header",
                         "aside","form","noscript","iframe","svg"]):
            tag.decompose()
        text = re.sub(r"\s{3,}", "  ", soup.get_text(separator=" ", strip=True))
        return text[:_SCRAPE_CHARS]
    except Exception:
        return ""


def _scrape_parallel(results: list[dict]) -> list[dict]:
    def job(r):
        return {**r, "content": _scrape(r["url"])}
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = [pool.submit(job, r) for r in results]
        out  = [f.result() for f in as_completed(futs)]
    return [s for s in out if s.get("content")]


# ══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ══════════════════════════════════════════════════════════════════════════════

@dataclass
class ResearchPlan:
    subtopics:       list[str]
    required_tables: list[str]
    required_charts: list[str]

@dataclass
class SectionResult:
    subtopic:    str
    sources:     list[dict]
    section_md:  str

@dataclass
class DataPlan:
    table_specs: list[dict]   # [{title, headers, rows}]
    chart_specs: list[dict]   # [{chart_type, title, labels, values, ...}]


# ══════════════════════════════════════════════════════════════════════════════
# AGENT 1 — DIRECTOR
# ══════════════════════════════════════════════════════════════════════════════

def director_agent(topic: str) -> ResearchPlan:
    """
    Produces an exhaustive research plan:
    - 8-12 highly specific, non-overlapping sub-topics
    - 5+ required tables (with exact columns specified)
    - 2-4 required charts
    """
    print("\n  [DIRECTOR] Analysing topic and building research plan …")
    prompt = f"""You are the Director of a world-class research team at a premier consultancy.

Topic: "{topic}"

Produce a complete research plan in 3 steps.

STEP 1 — SUB-TOPICS (8 to 12 entries)
Decompose the topic into highly specific, independently searchable sub-topics.
Each must cover a DISTINCT angle. Cover ALL of: market sizing, key players/competitors,
technology deep-dive, regulatory/legal frameworks, regional analysis, use cases,
investment/funding trends, challenges/risks, and future outlook.
Be very specific — NOT "market overview" but
"Global [topic] market size by segment 2020-2025 CAGR forecasts".

STEP 2 — REQUIRED TABLES (minimum 5)
Define exactly which tables the report MUST contain, specifying column headers.
Examples of good tables:
- "Market size by segment (Segment | 2020 Value | 2025 Value | CAGR | Key Driver)"
- "Top 10 competitors (Company | HQ | Revenue | Market Share | Key Products | Strengths)"
- "Technology comparison (Technology | Maturity | Cost | Advantage | Limitation | Use Case)"
- "Regulatory framework by region (Region | Regulation | Status | Key Requirement | Effective Date)"
- "Use case comparison (Use Case | Provider | Metrics | Status | Outlook)"

STEP 3 — REQUIRED CHARTS (2 to 4 entries)
Only include charts where time-series or categorical numerical data is likely available.
Examples: "Line chart: total market growth 2018-2033 (USD billion)",
          "Bar chart: market share by top 5 companies 2025 (%)"

Return ONLY valid JSON:
{{
  "subtopics": ["sub-topic 1", "sub-topic 2", ...],
  "required_tables": [
    "Table: Market size by segment — columns: Segment | 2025 Value (USD B) | 2030 Forecast | CAGR | Key Driver",
    "Table: Top competitors — columns: Company | HQ Country | Est. Revenue | Market Share | Key Products"
  ],
  "required_charts": [
    "Line chart: total market size growth 2018 to 2033 in USD billion",
    "Bar chart: top 5 companies by market share 2025"
  ]
}}"""

    raw = _llm(prompt, agent="DIRECTOR", temperature=0.2, max_tokens=2048)
    try:
        data = _parse_json(raw)
        plan = ResearchPlan(
            subtopics       = [str(s) for s in data.get("subtopics", [])[:12]],
            required_tables = [str(t) for t in data.get("required_tables", [])],
            required_charts = [str(c) for c in data.get("required_charts", [])],
        )
        print(f"  [DIRECTOR] ✓ {len(plan.subtopics)} sub-topics | "
              f"{len(plan.required_tables)} required tables | "
              f"{len(plan.required_charts)} required charts")
        for i, s in enumerate(plan.subtopics):
            print(f"    {i+1}. {s}")
        return plan
    except Exception as e:
        print(f"  [DIRECTOR] Parse error ({e}), using single-topic fallback")
        return ResearchPlan(subtopics=[topic], required_tables=[], required_charts=[])


# ══════════════════════════════════════════════════════════════════════════════
# AGENT 2 — RESEARCHER  (one per sub-topic, run in parallel)
# ══════════════════════════════════════════════════════════════════════════════

def researcher_agent(subtopic: str, agent_id: int,
                     global_source_offset: int) -> SectionResult:
    """
    Full research cycle for one sub-topic:
    3-pass search → parallel scrape → deep synthesis (1000-1400 words)
    Produces dense content with tables wherever comparative data exists.
    """
    name = f"RESEARCHER-{agent_id:02d}"
    print(f"\n  [{name}] ▶ {subtopic[:70]}")

    # Three search passes: broad, data-focused, recent
    seen_urls, raw_results = set(), []
    queries = [
        subtopic,
        f"{subtopic} statistics data market share 2024 2025",
        f"{subtopic} analysis report latest findings",
    ]
    for q in queries:
        for r in _search(q, max_results=10):
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                raw_results.append(r)

    print(f"  [{name}] {len(raw_results)} URLs → scraping …")
    scraped = _scrape_parallel(raw_results)

    # Deduplicate
    sources, seen_s = [], set()
    for s in scraped:
        if s["url"] not in seen_s:
            seen_s.add(s["url"])
            sources.append(s)
    sources = sources[:18]
    print(f"  [{name}] {len(sources)} sources")

    # Build source block with global citation numbers
    src_block = ""
    for i, s in enumerate(sources):
        idx = global_source_offset + i + 1
        src_block += (f"[{idx}] {s['title']} | {s['url']}\n"
                      f"    {s['content'][:2500]}\n\n")

    prompt = f"""You are a specialist analyst writing one section of a major industry report.

Sub-topic: "{subtopic}"
Citation numbers for this section start at [{global_source_offset + 1}].

Write a comprehensive, analyst-grade section of 1000 to 1400 words.

═══ MANDATORY STRUCTURE ═══
1. Start with  ## [Descriptive Section Title]
2. Use  ### Sub-heading  for at least 2 major sub-divisions
3. Bold ALL company names, product names, key statistics: **DJI**, **$83.81B**, **17.8% CAGR**
4. Cite every factual claim inline: [N]

═══ MANDATORY TABLE RULE ═══
Whenever you have 3 or more comparable items (companies, technologies, regions,
products, regulations, use cases) — PUT THEM IN A TABLE. Do not use bullet
lists for data that belongs in a table.

Table format:
TABLE:
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| value    | value    | value    |

═══ CONTENT REQUIREMENTS ═══
- Every sub-heading must have minimum 2 substantive paragraphs
- Include ALL specific numbers, percentages, company names, dollar values, dates
- Include at least ONE table — mandatory if any comparison or structured data exists
- Use bullet lists ONLY for non-comparative enumerated items
- Do NOT invent data — only use what appears in the sources

Sources:
{src_block}"""

    section_md = _llm(prompt, agent=name, temperature=0.3, max_tokens=4096)
    wc = len(section_md.split())
    print(f"  [{name}] ✓ {wc} words written")

    return SectionResult(subtopic=subtopic, sources=sources, section_md=section_md)


# ══════════════════════════════════════════════════════════════════════════════
# AGENT 3 — CRITIC
# ══════════════════════════════════════════════════════════════════════════════

def critic_agent(topic: str, plan: ResearchPlan,
                 sections: list[SectionResult],
                 all_sources: list[dict]) -> list[dict]:
    """
    Reviews all sections and fires gap-fill researcher threads for missing angles.
    Returns additional sources only (sections are written by the Editor).
    """
    print("\n  [CRITIC] Reviewing coverage …")

    previews = "\n\n".join(
        f"--- {r.subtopic} ---\n{r.section_md[:400]}" for r in sections)

    prompt = f"""You are a senior editor reviewing a research report draft.

Topic: "{topic}"

Planned sub-topics:
{json.dumps(plan.subtopics, indent=2)}

Required tables that must appear:
{json.dumps(plan.required_tables, indent=2)}

Section previews:
{previews[:4000]}

Identify up to 4 specific gaps:
- Important angles missing or very thin
- Required tables that cannot be built from existing content
- Key data (market figures, company details, specs) that are absent

Return ONLY a JSON array of targeted search queries (max 4), or []:
["specific query 1", "specific query 2"]"""

    try:
        raw  = _llm(prompt, agent="CRITIC", temperature=0.2, max_tokens=512)
        gaps = _parse_json(raw)
        if not isinstance(gaps, list) or not gaps:
            print("  [CRITIC] ✓ No critical gaps found")
            return []

        print(f"  [CRITIC] {len(gaps)} gap(s): {gaps}")
        already = {s["url"] for s in all_sources}
        extra, seen_u = [], set()

        def fill(q: str) -> list[dict]:
            return [s for s in _scrape_parallel(_search(q, max_results=10))
                    if s["url"] not in already]

        with ThreadPoolExecutor(max_workers=4) as pool:
            for result in as_completed([pool.submit(fill, q) for q in gaps[:4]]):
                for s in result.result():
                    if s["url"] not in seen_u:
                        seen_u.add(s["url"])
                        extra.append(s)

        print(f"  [CRITIC] {len(extra)} gap-fill sources added")
        return extra
    except Exception as e:
        print(f"  [CRITIC] Non-critical error: {e}")
        return []


# ══════════════════════════════════════════════════════════════════════════════
# AGENT 4 — DATA AGENT  (tables + charts, both in parallel)
# ══════════════════════════════════════════════════════════════════════════════

def data_agent(topic: str, plan: ResearchPlan,
               all_text: str) -> DataPlan:
    """
    Two parallel tasks:
    A) Extract/construct every required table from the research content
    B) Extract numerical series for charts
    """
    print("\n  [DATA AGENT] Extracting tables and charts in parallel …")

    tables_prompt = f"""You are a data extraction specialist building tables for a research report.

Topic: "{topic}"

The report MUST contain ALL of these tables:
{json.dumps(plan.required_tables, indent=2)}

Instructions:
- Extract or construct each table using ONLY data present in the research content below
- Fill every cell with a real value — use "N/A" only if genuinely unavailable
- Every table must have at minimum 4 data rows (not counting the header)
- Be specific: use actual company names, actual numbers, actual percentages
- If a required table has insufficient data for 4 rows, expand it with related
  data points that belong to the same theme

Return ONLY a JSON array — no markdown, no explanation:
[
  {{
    "title": "Exact table title",
    "headers": ["Col1", "Col2", "Col3", "Col4"],
    "rows": [
      ["val1", "val2", "val3", "val4"],
      ["val1", "val2", "val3", "val4"]
    ]
  }}
]

Research content:
{all_text[:14000]}"""

    charts_prompt = f"""You are a data visualisation specialist.

Topic: "{topic}"

Required charts:
{json.dumps(plan.required_charts, indent=2)}

Extract numerical data from the content to build these charts.
Rules:
- Line chart: time-series, minimum 4 data points
- Bar chart: minimum 4 categories
- Pie: parts summing ~100%
- You MAY combine data points from different sentences if they refer to the
  same metric across time (e.g. market value 2020 + 2022 + 2025 + 2030 forecast)
- Maximum 4 charts — omit a chart if data is genuinely insufficient
- Return [] if no chart can be built from available data

Return ONLY a JSON array:
[
  {{
    "chart_type": "line",
    "title": "Chart title",
    "xlabel": "X axis label",
    "ylabel": "Y axis label",
    "labels": ["2018","2020","2022","2025","2030"],
    "values": [10.5, 14.2, 22.8, 45.0, 90.0],
    "unit": "B USD",
    "source_note": "Compiled from multiple market research reports"
  }}
]

Research content:
{all_text[:12000]}"""

    table_specs, chart_specs = [], []

    def get_tables():
        raw = _llm(tables_prompt, agent="DATA/tables", temperature=0.1, max_tokens=6000)
        return _parse_json(raw)

    def get_charts():
        raw = _llm(charts_prompt, agent="DATA/charts", temperature=0.1, max_tokens=2048)
        return _parse_json(raw)

    with ThreadPoolExecutor(max_workers=2) as pool:
        tf = pool.submit(get_tables)
        cf = pool.submit(get_charts)
        try:
            result = tf.result()
            if isinstance(result, list):
                # Validate: must have headers + at least 3 rows
                table_specs = [t for t in result
                               if isinstance(t, dict)
                               and t.get("headers")
                               and isinstance(t.get("rows"), list)
                               and len(t["rows"]) >= 3]
        except Exception as e:
            print(f"  [DATA AGENT] Table error: {e}")
        try:
            result = cf.result()
            if isinstance(result, list):
                chart_specs = result[:4]
        except Exception as e:
            print(f"  [DATA AGENT] Chart error: {e}")

    print(f"  [DATA AGENT] ✓ {len(table_specs)} tables | {len(chart_specs)} charts")
    return DataPlan(table_specs=table_specs, chart_specs=chart_specs)


# ══════════════════════════════════════════════════════════════════════════════
# AGENT 5 — EDITOR
# ══════════════════════════════════════════════════════════════════════════════

def editor_agent(topic: str, sections: list[SectionResult],
                 gap_sources: list[dict], data_plan: DataPlan) -> str:
    """
    Assembles all researcher sections into one cohesive 4000-6000 word report.
    Places <<TABLE_N>> markers optimally throughout the report.
    Writes Executive Summary, Introduction, and complete Conclusion.
    """
    print("\n  [EDITOR] Assembling final report …")

    sections_text = "\n\n---SECTION---\n\n".join(r.section_md for r in sections)

    gap_extra = ""
    if gap_sources:
        gap_extra = "\n\nAdditional gap-fill content:\n"
        for s in gap_sources[:10]:
            gap_extra += f"[GAP] {s['title']}\n{s['content'][:1000]}\n\n"

    table_list = "\n".join(
        f"  <<TABLE_{i+1}>> → {t['title']}"
        for i, t in enumerate(data_plan.table_specs))

    prompt = f"""You are a senior editor at a premier research consultancy.
Assemble the final research report on: "{topic}"

YOUR TASKS:
1. ## Executive Summary (350-450 words)
   - Open with the single most important finding and its scale
   - Synthesise the 5 key findings with specific numbers
   - End with 3 strategic implications for stakeholders

2. ## Introduction (200-250 words)
   - Set the context, scope, and time period covered
   - State what the report covers and why it matters now

3. ASSEMBLE ALL SECTIONS
   - Keep ALL specific data, statistics, company names, citations from each section
   - Remove redundancy: if the same stat appears in 2 sections, keep it in the most
     relevant one only
   - Ensure smooth transitions between sections
   - Add gap-fill content from [GAP] sources where it naturally fits

4. PLACE TABLE MARKERS
   Insert these markers at the MOST relevant position in the text.
   Place the marker on its own line immediately after the relevant paragraph.
   Available tables:
{table_list}

5. ## Conclusion (450-500 words)
   - 3-4 named strategic themes with supporting data
   - Specific forward-looking outlook with timelines (2026, 2028, 2030)
   - Final paragraph: the single most important action for stakeholders
   - MUST BE FULLY COMPLETE — never cut off mid-sentence

6. LENGTH: 4000-6000 words total
7. Keep all markdown: ##, ###, **, -, TABLE: blocks
8. Keep all [N] citations

Researcher sections:
{sections_text}
{gap_extra}"""

    report = _llm(prompt, agent="EDITOR", temperature=0.3, max_tokens=8192)
    print(f"  [EDITOR] ✓ ~{len(report.split())} words")
    return report


# ══════════════════════════════════════════════════════════════════════════════
# CHART RENDERER
# ══════════════════════════════════════════════════════════════════════════════

_PALETTE = ["#4f46e5","#0ea5e9","#10b981","#f59e0b",
            "#ef4444","#ec4899","#8b5cf6","#06b6d4"]


def render_charts(specs: list[dict]) -> list[str]:
    paths = []
    for idx, spec in enumerate(specs[:4]):
        p = _render_one(spec, idx)
        if p:
            paths.append(p)
            print(f"  [CHARTS] ✓ {spec.get('title','chart')[:60]}")
    return paths


def _render_one(spec: dict, idx: int) -> str | None:
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
        colors = (_PALETTE * 4)[:len(labels)]

        if ctype == "bar":
            bars = ax.bar(labels, values, color=colors, edgecolor="white", linewidth=0.7)
            ax.set_xlabel(spec.get("xlabel",""), color="#555", fontsize=9)
            ax.set_ylabel(f"{spec.get('ylabel','')} ({unit})" if unit
                          else spec.get("ylabel",""), color="#555", fontsize=9)
            ax.tick_params(colors="#333", labelsize=8)
            ax.spines[:].set_color("#ddd")
            mv = max(values) or 1
            for b, v in zip(bars, values):
                ax.text(b.get_x() + b.get_width()/2, b.get_height() + mv*0.02,
                        f"{v:g}{unit}", ha="center", va="bottom",
                        color="#222", fontsize=8)

        elif ctype == "line":
            ax.plot(labels, values, color=_PALETTE[0], marker="o",
                    linewidth=2.5, markersize=7)
            ax.fill_between(range(len(labels)), values, alpha=0.12, color=_PALETTE[0])
            ax.set_xticks(range(len(labels)))
            ax.set_xticklabels(labels, rotation=30, ha="right", fontsize=8)
            ax.tick_params(colors="#333", labelsize=8)
            ax.spines[:].set_color("#ddd")
            ax.set_xlabel(spec.get("xlabel",""), color="#555", fontsize=9)
            ax.set_ylabel(f"{spec.get('ylabel','')} ({unit})" if unit
                          else spec.get("ylabel",""), color="#555", fontsize=9)
            for i, (l, v) in enumerate(zip(labels, values)):
                ax.annotate(f"{v:g}", (i, v), textcoords="offset points",
                            xytext=(0,9), ha="center", fontsize=7.5, color="#333")

        elif ctype == "pie":
            if abs(sum(values)-100) > 10:
                s = sum(values); values = [v/s*100 for v in values]
            wedges, texts, autotexts = ax.pie(
                values, labels=labels, colors=colors, autopct="%1.1f%%",
                startangle=140, wedgeprops={"edgecolor":"white","linewidth":1.5})
            for t in texts:      t.set_color("#333"); t.set_fontsize(8)
            for a in autotexts:  a.set_color("#111"); a.set_fontsize(8)
        else:
            plt.close(fig); return None

        if spec.get("source_note"):
            fig.text(0.5, -0.03, f"Source: {spec['source_note']}",
                     ha="center", color="#888", fontsize=7, style="italic")
        ax.set_title(spec["title"], color="#1e1b4b", fontsize=12,
                     fontweight="bold", pad=12)
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
    """Escape string for JS template literal."""
    return (s.replace("\\","\\\\").replace("`","\\`").replace("$","\\$")
             .replace("\r","")
             .replace("\u2018","'").replace("\u2019","'")
             .replace("\u201c",'"').replace("\u201d",'"')
             .replace("\u2013","-").replace("\u2014","-")
             .replace("\u2026","...").replace("\u00a0"," "))


def _md_table_to_rows(lines: list[str]) -> list[list[str]] | None:
    rows = []
    for ln in lines:
        ln = ln.strip()
        if not ln: continue
        if re.match(r'^[\s|:\-]+$', ln): continue
        if "|" not in ln: break
        cells = [c.strip() for c in ln.strip("|").split("|")]
        if not all(c == "" for c in cells):
            rows.append(cells)
    return rows if len(rows) >= 2 else None


def _table_to_js(t: dict, total_dxa: int = 9360) -> str:
    """Convert table spec or markdown rows dict → JS Table(...) code string."""
    headers = t.get("headers", [])
    rows    = t.get("rows", [])
    all_rows = [headers] + rows if headers else rows
    if not all_rows:
        return ""
    col_count = max(len(r) for r in all_rows)
    col_dxa   = max(total_dxa // col_count, 900)
    actual_total = col_dxa * col_count

    row_js = []
    for ridx, row in enumerate(all_rows):
        row = (list(row) + [""] * col_count)[:col_count]
        is_hdr = ridx == 0
        cells  = []
        for cell in row:
            fill  = "4f46e5" if is_hdr else ("f5f3ff" if ridx % 2 == 1 else "ffffff")
            tcol  = "ffffff" if is_hdr else "1f2937"
            cells.append(
                f"""new TableCell({{
              width:{{size:{col_dxa},type:WidthType.DXA}},
              shading:{{fill:"{fill}",type:ShadingType.CLEAR}},
              margins:{{top:80,bottom:80,left:120,right:120}},
              borders:{{
                top:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
                bottom:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
                left:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}},
                right:{{style:BorderStyle.SINGLE,size:1,color:"c7d2fe"}}
              }},
              children:[new Paragraph({{children:[new TextRun({{
                text:`{_esc(str(cell))}`,size:19,
                bold:{"true" if is_hdr else "false"},color:"{tcol}"
              }})]}})]
            }})""")
        row_js.append("new TableRow({children:[" + ",".join(cells) + "]})")

    title_esc = _esc(t.get("title",""))
    col_widths = ",".join([str(col_dxa)] * col_count)
    return f"""
new Paragraph({{children:[new TextRun({{text:`{title_esc}`,size:22,bold:true,
  color:"3730a3",italics:true}})],spacing:{{before:200,after:80}}}}),
new Table({{
  width:{{size:{actual_total},type:WidthType.DXA}},
  columnWidths:[{col_widths}],
  rows:[{",".join(row_js)}]
}}),
new Paragraph({{children:[new TextRun("")],spacing:{{before:80,after:200}}}}),"""


def build_docx(topic: str, report_text: str, data_plan: DataPlan,
               chart_paths: list[str], all_sources: list[dict]) -> str:

    run_dir  = Path(__file__).parent.resolve()
    out_name = re.sub(r'[^a-z0-9]+', '_', topic[:35].lower())
    js_file  = run_dir / "build_report.js"
    out_path = str(run_dir / f"research_{out_name}.docx")

    # Auto-install docx locally
    pkg_dir = run_dir / "node_modules" / "docx"
    if not pkg_dir.exists():
        print("  📦 Installing docx npm package …")
        r = subprocess.run("npm install docx", shell=True, cwd=str(run_dir),
                           capture_output=True, text=True, timeout=120)
        if r.returncode != 0:
            raise RuntimeError(f"npm install failed:\n{r.stderr}")
        print("  ✅ docx installed")
    docx_abs = str(pkg_dir).replace("\\", "/")

    # Pre-build table JS strings keyed by placeholder
    table_js: dict[str, str] = {}
    for i, t in enumerate(data_plan.table_specs):
        table_js[f"<<TABLE_{i+1}>>"] = _table_to_js(t)

    # ── Parse report markdown → JS content array ──────────────────────────
    parts:     list[str] = []
    chart_idx: int       = 0
    h2_count:  int       = 0

    # Cover page
    parts.append(f"""
new Paragraph({{children:[new TextRun({{text:`{_esc(topic.title())}`,
  bold:true,size:56,color:"1e1b4b"}})],
  spacing:{{before:2880,after:240}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new TextRun({{text:"Research Report",
  size:28,color:"4f46e5"}})],
  spacing:{{before:0,after:120}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new TextRun({{text:`Generated: {datetime.now().strftime("%B %d, %Y")}`,
  size:20,color:"666666"}})],
  spacing:{{before:0,after:80}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new TextRun({{
  text:`Sources: {len(all_sources)}  |  Tables: {len(data_plan.table_specs)}  |  Charts: {len(chart_paths)}`,
  size:20,color:"666666"}})],
  spacing:{{before:0,after:2880}},alignment:AlignmentType.CENTER}}),
new Paragraph({{children:[new PageBreak()]}}),""")

    lines = report_text.split("\n")
    i = 0
    while i < len(lines):
        raw = lines[i]
        ln  = raw.strip()

        # Table placeholder  <<TABLE_N>>
        m = re.search(r'<<TABLE_(\d+)>>', ln)
        if m:
            key = f"<<TABLE_{m.group(1)}>>"
            if key in table_js:
                parts.append(table_js[key])
            i += 1
            continue

        # H3
        if ln.startswith("### "):
            parts.append(f"""
new Paragraph({{heading:HeadingLevel.HEADING_3,
  children:[new TextRun({{text:`{_esc(ln[4:])}`,bold:true,size:26,color:"3730a3"}})],
  spacing:{{before:280,after:120}}}}),""")
            i += 1

        # H2 — inject a chart every 3 h2s
        elif ln.startswith("## "):
            h2_count += 1
            parts.append(f"""
new Paragraph({{heading:HeadingLevel.HEADING_2,
  children:[new TextRun({{text:`{_esc(ln[3:])}`,bold:true,size:30,color:"4f46e5"}})],
  spacing:{{before:400,after:160}},
  border:{{bottom:{{style:BorderStyle.SINGLE,size:4,color:"c7d2fe",space:4}}}}}}),""")
            if h2_count % 3 == 0 and chart_idx < len(chart_paths):
                p = chart_paths[chart_idx].replace("\\", "/")
                parts.append(f"""
new Paragraph({{children:[new ImageRun({{data:fs.readFileSync(`{p}`),
  transformation:{{width:620,height:350}},type:"png"}})],
  spacing:{{before:160,after:160}},alignment:AlignmentType.CENTER}}),""")
                chart_idx += 1
            i += 1

        # H1
        elif ln.startswith("# "):
            parts.append(f"""
new Paragraph({{heading:HeadingLevel.HEADING_1,
  children:[new TextRun({{text:`{_esc(ln[2:])}`,bold:true,size:36,color:"1e1b4b"}})],
  spacing:{{before:480,after:200}}}}),""")
            i += 1

        # Inline markdown table (pipe table)
        elif ln.startswith("|") and i+1 < len(lines) and \
             re.match(r'^[\s|:\-]+$', lines[i+1].strip()):
            tbl_lines = []
            j = i
            while j < len(lines) and "|" in lines[j]:
                tbl_lines.append(lines[j]); j += 1
            rows = _md_table_to_rows(tbl_lines)
            if rows:
                spec = {"title": "", "headers": rows[0], "rows": rows[1:]}
                parts.append(_table_to_js(spec))
            i = j

        # "TABLE:" marker in text (researcher-generated)
        elif ln.upper().startswith("TABLE:"):
            tbl_lines = []
            j = i + 1
            while j < len(lines) and "|" in lines[j]:
                tbl_lines.append(lines[j]); j += 1
            rows = _md_table_to_rows(tbl_lines)
            if rows:
                spec = {"title": "", "headers": rows[0], "rows": rows[1:]}
                parts.append(_table_to_js(spec))
            i = j

        # Bullet
        elif re.match(r"^[-*]\s+", ln):
            text = re.sub(r"^[-*]\s+", "", ln)
            text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
            parts.append(f"""
new Paragraph({{numbering:{{reference:"bullets",level:0}},
  children:[new TextRun({{text:`{_esc(text)}`,size:22,color:"1f2937"}})],
  spacing:{{before:40,after:40}}}}),""")
            i += 1

        # Blank
        elif not ln:
            parts.append("""
new Paragraph({children:[new TextRun("")],spacing:{before:40,after:40}}),""")
            i += 1

        # Normal paragraph
        else:
            clean = re.sub(r"\*\*(.+?)\*\*", r"\1", ln)
            parts.append(f"""
new Paragraph({{
  children:[new TextRun({{text:`{_esc(clean)}`,size:22,color:"1f2937"}})],
  spacing:{{before:80,after:80}},alignment:AlignmentType.JUSTIFIED}}),""")
            i += 1

    # Remaining charts
    while chart_idx < len(chart_paths):
        p = chart_paths[chart_idx].replace("\\", "/")
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

    for idx2, s in enumerate(all_sources):
        te = _esc(f"[{idx2+1}]  {s['title']}")
        ue = _esc(s["url"])
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
  numbering:{{config:[{{reference:"bullets",levels:[{{
    level:0,format:LevelFormat.BULLET,text:"\\u2022",
    alignment:AlignmentType.LEFT,
    style:{{paragraph:{{indent:{{left:720,hanging:360}}}}}}
  }}]}}]}},
  styles:{{
    default:{{document:{{run:{{font:"Arial",size:22,color:"1f2937"}}}}}},
    paragraphStyles:[
      {{id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",
        quickFormat:true,
        run:{{size:36,bold:true,font:"Arial",color:"1e1b4b"}},
        paragraph:{{spacing:{{before:480,after:200}},outlineLevel:0}}}},
      {{id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",
        quickFormat:true,
        run:{{size:30,bold:true,font:"Arial",color:"4f46e5"}},
        paragraph:{{spacing:{{before:400,after:160}},outlineLevel:1}}}},
      {{id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",
        quickFormat:true,
        run:{{size:26,bold:true,font:"Arial",color:"3730a3"}},
        paragraph:{{spacing:{{before:280,after:120}},outlineLevel:2}}}}
    ]
  }},
  sections:[{{
    properties:{{page:{{
      size:{{width:12240,height:15840}},
      margin:{{top:1440,right:1440,bottom:1440,left:1440}}
    }}}},
    children:[
      {all_content}
    ]
  }}]
}});

Packer.toBuffer(doc).then(buf=>{{
  fs.writeFileSync(process.argv[2],buf);
  console.log('DOCX written:',process.argv[2]);
}}).catch(err=>{{console.error(err);process.exit(1);}});
"""

    js_file.write_text(js, encoding="utf-8")
    result = subprocess.run(
        ["node", str(js_file), out_path],
        capture_output=True, text=True,
        cwd=str(run_dir), timeout=180)
    if result.returncode != 0:
        raise RuntimeError(f"DOCX build failed:\n{result.stderr[:2000]}")
    print(f"  [DOCX] ✓ {out_path}")
    return out_path


# ══════════════════════════════════════════════════════════════════════════════
# EMAILER
# ══════════════════════════════════════════════════════════════════════════════

def _send_email(topic: str, docx_path: str, to_email: str,
                n_sources: int, n_charts: int) -> None:
    msg = MIMEMultipart()
    msg["From"]    = GMAIL_ADDRESS
    msg["To"]      = to_email
    msg["Subject"] = f"📊 Research Report: {topic.title()}"
    msg.attach(MIMEText(
        f'Report on "{topic}" ready.\n'
        f'Sources: {n_sources} | Charts: {n_charts}\n'
        f'Generated: {datetime.now().strftime("%B %d, %Y %I:%M %p")}\n'
        f'Regards, RAG Research Agent', "plain"))
    fname = re.sub(r'[^a-z0-9]+', '_', topic[:35].lower())
    with open(docx_path, "rb") as fh:
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
# ORCHESTRATOR
# ══════════════════════════════════════════════════════════════════════════════

def run_research_no_email(topic: str) -> str:
    print(f"\n{'═'*65}")
    print(f"  🚀  MULTI-AGENT RESEARCH TEAM")
    print(f"  Topic: {topic}")
    print(f"{'═'*65}")

    # ── DIRECTOR ──────────────────────────────────────────────────────────────
    plan = director_agent(topic)

    # ── RESEARCHERS (parallel, max 6 concurrent) ──────────────────────────────
    print(f"\n  Launching {len(plan.subtopics)} Researcher Agents …")
    section_results: list[SectionResult] = []
    all_sources: list[dict] = []
    seen_urls:   set[str]   = set()

    # Pre-assign source offsets: each researcher gets up to 18 sources → offset by 20
    def run_researcher(args):
        subtopic, agent_id, offset = args
        return researcher_agent(subtopic, agent_id, offset)

    args_list = [
        (subtopic, i + 1, i * 20)
        for i, subtopic in enumerate(plan.subtopics)
    ]

    with ThreadPoolExecutor(max_workers=min(len(plan.subtopics), 6)) as pool:
        futs = {pool.submit(run_researcher, args): args for args in args_list}
        for fut in as_completed(futs):
            result = fut.result()
            section_results.append(result)
            for s in result.sources:
                if s["url"] not in seen_urls:
                    seen_urls.add(s["url"])
                    all_sources.append(s)

    # Restore planned order
    order = {st: i for i, st in enumerate(plan.subtopics)}
    section_results.sort(key=lambda r: order.get(r.subtopic, 999))
    print(f"\n  ✓ {len(section_results)} sections | {len(all_sources)} total sources")

    # ── CRITIC ────────────────────────────────────────────────────────────────
    gap_sources = critic_agent(topic, plan, section_results, all_sources)
    for s in gap_sources:
        if s["url"] not in seen_urls:
            seen_urls.add(s["url"])
            all_sources.append(s)

    # ── DATA AGENT ────────────────────────────────────────────────────────────
    all_text = ("\n\n".join(r.section_md for r in section_results) + "\n\n" +
                "\n\n".join(s["content"][:1200] for s in gap_sources))
    data_plan = data_agent(topic, plan, all_text)

    # ── CHARTS ────────────────────────────────────────────────────────────────
    print("\n  [CHARTS] Rendering …")
    chart_paths = render_charts(data_plan.chart_specs)

    # ── EDITOR ────────────────────────────────────────────────────────────────
    final_report = editor_agent(topic, section_results, gap_sources, data_plan)
    wc = len(final_report.split())

    # ── DOCX ──────────────────────────────────────────────────────────────────
    print("\n  [DOCX] Building …")
    docx_path = build_docx(topic, final_report, data_plan, chart_paths, all_sources)

    for p in chart_paths:
        try: os.remove(p)
        except Exception: pass

    print(f"\n{'═'*65}")
    print(f"  ✅  COMPLETE")
    print(f"  Words: ~{wc} | Sources: {len(all_sources)} | "
          f"Tables: {len(data_plan.table_specs)} | Charts: {len(chart_paths)}")
    print(f"  File: {docx_path}")
    print(f"{'═'*65}\n")
    return docx_path


def run_research(topic: str, to_email: str) -> None:
    try:
        docx_path = run_research_no_email(topic)
        _send_email(topic, docx_path, to_email, 0, 0)
        print(f"  📧 Emailed to {to_email}")
    except Exception:
        print("❌  Research pipeline failed:")
        traceback.print_exc()