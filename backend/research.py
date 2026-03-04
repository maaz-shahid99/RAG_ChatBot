from ddgs import DDGS
from groq import Groq
import google.generativeai as genai
from fpdf import FPDF
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import requests
from bs4 import BeautifulSoup
import os, tempfile, smtplib, json, re
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini = genai.GenerativeModel("gemini-3.1-pro-preview")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

# ── Web Search & Scraping ─────────────────────────────────────────────────────

def search_web(topic: str, max_results: int = 8) -> list:
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(topic, max_results=max_results):
            results.append({"title": r["title"], "url": r["href"], "snippet": r["body"]})
    return results

def scrape_url(url: str) -> str:
    try:
        res = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(res.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()
        return soup.get_text(separator=" ", strip=True)[:4000]
    except Exception:
        return ""

# ── Chart Generation ──────────────────────────────────────────────────────────

def extract_chart_data(topic: str, combined_text: str) -> list:
    """Ask Gemini to extract numerical data suitable for charts."""
    prompt = f"""Analyze this research content about "{topic}" and extract numerical data suitable for charts.

Return ONLY a valid JSON array (no markdown, no explanation) with this exact format:
[
  {{
    "chart_type": "bar",
    "title": "Chart Title",
    "xlabel": "X Axis Label",
    "ylabel": "Y Axis Label",
    "labels": ["Label1", "Label2", "Label3"],
    "values": [10, 20, 30],
    "unit": "%"
  }},
  {{
    "chart_type": "pie",
    "title": "Chart Title",
    "labels": ["Segment1", "Segment2"],
    "values": [60, 40],
    "unit": "%"
  }}
]

Rules:
- Only include charts where you found REAL numerical data in the content
- Maximum 3 charts
- For bar charts: at least 3 data points
- For pie charts: values must sum to ~100 or represent proportions
- If no suitable numerical data exists, return empty array: []

Content:
{combined_text[:6000]}"""

    try:
        response = gemini.generate_content(prompt)
        raw = response.text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        charts = json.loads(raw)
        return charts if isinstance(charts, list) else []
    except Exception as e:
        print(f"⚠️ Chart extraction failed: {e}")
        return []

def render_chart(chart: dict, idx: int) -> str | None:
    """Render a single chart and save as PNG. Returns file path or None."""
    try:
        tmp_dir = tempfile.gettempdir()
        path = os.path.join(tmp_dir, f"chart_{idx}_{int(datetime.now().timestamp())}.png")

        fig, ax = plt.subplots(figsize=(7, 4))
        fig.patch.set_facecolor("#1a1a2e")
        ax.set_facecolor("#16213e")

        labels = [str(l) for l in chart["labels"]]
        values = [float(v) for v in chart["values"]]
        unit = chart.get("unit", "")

        COLORS = ["#7c3aed", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"]

        if chart["chart_type"] == "bar":
            bars = ax.bar(labels, values, color=COLORS[:len(labels)], edgecolor="#2a2a3a", linewidth=0.5)
            ax.set_xlabel(chart.get("xlabel", ""), color="#aaa", fontsize=9)
            ax.set_ylabel(chart.get("ylabel", "") + (f" ({unit})" if unit else ""), color="#aaa", fontsize=9)
            ax.tick_params(colors="#ccc", labelsize=8)
            ax.spines[:].set_color("#2a2a3a")
            # Value labels on bars
            for bar, val in zip(bars, values):
                ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.01,
                        f"{val}{unit}", ha="center", va="bottom", color="#fff", fontsize=8)

        elif chart["chart_type"] == "pie":
            wedges, texts, autotexts = ax.pie(
                values, labels=labels, colors=COLORS[:len(labels)],
                autopct="%1.1f%%", startangle=140,
                wedgeprops={"edgecolor": "#1a1a2e", "linewidth": 1.5}
            )
            for t in texts: t.set_color("#ccc"); t.set_fontsize(8)
            for a in autotexts: a.set_color("#fff"); a.set_fontsize(8)

        ax.set_title(chart["title"], color="#e0e0e0", fontsize=11, fontweight="bold", pad=12)
        plt.tight_layout(pad=1.5)
        plt.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
        plt.close(fig)
        return path
    except Exception as e:
        print(f"⚠️ Chart render failed: {e}")
        plt.close("all")
        return None

# ── Report Generation ─────────────────────────────────────────────────────────

def generate_report(topic: str, sources: list) -> str:
    combined = "\n\n".join(
        f"Source [{i+1}]: {s['title']} ({s['url']})\n{s['content']}"
        for i, s in enumerate(sources) if s["content"]
    )

    prompt = f"""You are an expert research analyst. Write a comprehensive research report on: "{topic}"

Use the numbered sources below. When referencing data, cite the source number like [1], [2] etc.

Structure with these exact sections:
1. Executive Summary
2. Background & Context
3. Key Findings (include ALL numerical data, statistics, percentages you find)
4. Current Trends & Developments
5. Analysis & Implications
6. Conclusion

Important:
- Be thorough and detailed (minimum 800 words)
- Include ALL numerical data and statistics found in the sources
- Cite sources using [1], [2] etc. inline
- Use professional, clear language
- Highlight key numbers and trends

Sources:
{combined}"""

    try:
        print("🤖 Generating report with Gemini...")
        response = gemini.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"⚠️ Gemini failed ({e}), falling back to Groq...")
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000
        )
        return response.choices[0].message.content

# ── PDF Creation ──────────────────────────────────────────────────────────────

def clean(text: str) -> str:
    return text.encode("latin-1", "replace").decode("latin-1")

def create_pdf(topic: str, report_text: str, sources: list, chart_paths: list) -> str:
    pdf = FPDF()
    pdf.set_margins(20, 20, 20)
    pdf.set_auto_page_break(auto=True, margin=20)

    # ── Cover Page ────────────────────────────────────────────────────────────
    pdf.add_page()
    pdf.set_fill_color(15, 15, 30)
    pdf.rect(0, 0, 210, 297, "F")

    pdf.set_y(80)
    pdf.set_font("Helvetica", "B", 26)
    pdf.set_text_color(124, 58, 237)
    pdf.multi_cell(170, 12, clean("Research Report"), align="C")
    pdf.ln(6)

    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(224, 224, 224)
    pdf.multi_cell(170, 10, clean(topic.title()), align="C")
    pdf.ln(10)

    pdf.set_draw_color(124, 58, 237)
    pdf.set_line_width(0.8)
    pdf.line(40, pdf.get_y(), 170, pdf.get_y())
    pdf.ln(10)

    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(150, 150, 180)
    pdf.cell(170, 8, clean(f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"), align="C")
    pdf.ln(6)
    pdf.cell(170, 8, clean(f"Sources consulted: {len(sources)}"), align="C")
    pdf.ln(6)
    pdf.cell(170, 8, clean(f"Charts included: {len(chart_paths)}"), align="C")

    # ── Report Pages ──────────────────────────────────────────────────────────
    pdf.add_page()
    pdf.set_fill_color(15, 15, 19)
    pdf.rect(0, 0, 210, 297, "F")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(200, 200, 200)

    for line in report_text.split("\n"):
        line = clean(line.strip())
        if not line:
            pdf.ln(3)
            continue

        # Section headings (1. Title, 2. Title etc.)
        if len(line) > 2 and line[0].isdigit() and line[1] in ".)":
            pdf.ln(4)
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_text_color(124, 58, 237)
            pdf.multi_cell(170, 8, line)
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(200, 200, 200)
        # Bold markdown **text**
        elif line.startswith("**") and line.endswith("**"):
            pdf.set_font("Helvetica", "B", 11)
            pdf.set_text_color(180, 180, 255)
            pdf.multi_cell(170, 7, line.replace("**", "").strip())
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(200, 200, 200)
        # Bullet points
        elif line.startswith("- ") or line.startswith("* "):
            pdf.set_x(25)
            pdf.multi_cell(165, 6, clean("• " + line[2:]))
        else:
            pdf.multi_cell(170, 6, line)

    # ── Charts Pages ──────────────────────────────────────────────────────────
    if chart_paths:
        pdf.add_page()
        pdf.set_fill_color(15, 15, 19)
        pdf.rect(0, 0, 210, 297, "F")

        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(124, 58, 237)
        pdf.cell(170, 10, "Data Visualizations", ln=True, align="C")
        pdf.ln(4)

        for path in chart_paths:
            if os.path.exists(path):
                # Check if chart fits on current page
                if pdf.get_y() > 200:
                    pdf.add_page()
                    pdf.set_fill_color(15, 15, 19)
                    pdf.rect(0, 0, 210, 297, "F")
                pdf.image(path, x=20, w=170)
                pdf.ln(6)

    # ── Sources Page ──────────────────────────────────────────────────────────
    pdf.add_page()
    pdf.set_fill_color(15, 15, 19)
    pdf.rect(0, 0, 210, 297, "F")

    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(124, 58, 237)
    pdf.cell(170, 10, "References & Sources", ln=True)
    pdf.ln(4)

    pdf.set_draw_color(124, 58, 237)
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())
    pdf.ln(6)

    for i, s in enumerate(sources):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(180, 180, 255)
        pdf.multi_cell(170, 6, clean(f"[{i+1}] {s['title']}"))
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(100, 150, 255)
        pdf.multi_cell(170, 5, clean(s["url"]))
        if s.get("snippet"):
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(150, 150, 170)
            pdf.multi_cell(170, 5, clean(s["snippet"][:200] + "..."))
        pdf.ln(4)

    tmp_path = os.path.join(tempfile.gettempdir(), f"research_{topic[:20].replace(' ', '_')}.pdf")
    pdf.output(tmp_path)
    return tmp_path

# ── Email ─────────────────────────────────────────────────────────────────────

def send_email_with_pdf(topic: str, pdf_path: str, to_email: str, num_sources: int, num_charts: int):
    msg = MIMEMultipart()
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = f"📄 Research Report: {topic.title()}"

    body = f"""Hi,

Your research report on "{topic}" is ready!

Report Summary:
• Sources consulted: {num_sources}
• Charts generated: {num_charts}
• Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

Please find the full report attached as a PDF.

Best regards,
Your RAG Assistant 🤖"""

    msg.attach(MIMEText(body, "plain"))

    with open(pdf_path, "rb") as f:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(f.read())
    encoders.encode_base64(part)
    part.add_header("Content-Disposition", f"attachment; filename=Research_{topic[:25].replace(' ', '_')}.pdf")
    msg.attach(part)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())

# ── Main Pipeline ─────────────────────────────────────────────────────────────

def run_research(topic: str, to_email: str):
    try:
        print(f"🔬 Researching: {topic}")

        # 1. Search web
        print("🌐 Searching web...")
        search_results = search_web(topic, max_results=8)

        # 2. Scrape each result
        print("📥 Scraping sources...")
        sources = []
        for r in search_results:
            content = scrape_url(r["url"])
            sources.append({**r, "content": content})
            print(f"  ✓ {r['title'][:50]}")

        combined_text = "\n\n".join(
            f"Source [{i+1}]: {s['title']}\n{s['content']}"
            for i, s in enumerate(sources) if s["content"]
        )

        # 3. Extract chart data
        print("📊 Extracting chart data...")
        chart_data = extract_chart_data(topic, combined_text)
        print(f"  Found {len(chart_data)} chart(s)")

        # 4. Render charts
        chart_paths = []
        for i, chart in enumerate(chart_data):
            path = render_chart(chart, i)
            if path:
                chart_paths.append(path)
                print(f"  ✓ Chart {i+1}: {chart['title']}")

        # 5. Generate report
        print("✍️ Generating report...")
        report = generate_report(topic, sources)

        # 6. Create PDF
        print("📄 Creating PDF...")
        pdf_path = create_pdf(topic, report, sources, chart_paths)

        # 7. Send email
        print("📧 Sending email...")
        send_email_with_pdf(topic, pdf_path, to_email, len(sources), len(chart_paths))

        # 8. Cleanup chart images
        for p in chart_paths:
            try: os.remove(p)
            except: pass

        print(f"✅ Research on '{topic}' emailed to {to_email}")

    except Exception as e:
        print(f"❌ Research failed: {e}")
        import traceback
        traceback.print_exc()