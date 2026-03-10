import sys, os
sys.path.insert(0, os.path.dirname(__file__))  # ensures backend/ is on sys.path

from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from rag import ask
from ingest import ingest_pdf, ingest_docx, ingest_url
from memory import get_history, add_to_history
from integrations.whatsapp_bot import router as whatsapp_router
from research_agent import run_research, run_research_no_email
import shutil, os, tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(whatsapp_router)


# ── Chat ──────────────────────────────────────────────────────────────────────

@app.post("/chat")
async def chat(query: str = Form(...), session_id: str = Form("default")):
    history = get_history(session_id)
    result = ask(query, history)
    add_to_history(session_id, "user", query)
    add_to_history(session_id, "assistant", result["answer"])
    return result


# ── Research ──────────────────────────────────────────────────────────────────

@app.post("/research")
async def research(
    topic: str = Form(...),
    email: str = Form(""),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    """
    - email provided  → pipeline runs in background, DOCX emailed, returns JSON
    - email omitted   → pipeline runs synchronously, returns DOCX download
    """
    if email:
        background_tasks.add_task(run_research, topic, email)
        return {
            "status": "started",
            "message": f"Research on '{topic}' is running. DOCX will be emailed to {email}.",
        }
    else:
        docx_path = run_research_no_email(topic)
        return FileResponse(
            path=docx_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=os.path.basename(docx_path),
        )


# ── Ingest ────────────────────────────────────────────────────────────────────

@app.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    tmp_dir     = tempfile.gettempdir()
    safe_name   = file.filename.replace(" ", "_")
    path        = os.path.join(tmp_dir, safe_name)

    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    if file.filename.lower().endswith(".pdf"):
        ingest_pdf(path)
    elif file.filename.lower().endswith(".docx"):
        ingest_docx(path)
    else:
        return {"status": "error", "message": "Only PDF and DOCX files are supported"}

    return {"status": "ingested", "file": file.filename}


@app.post("/ingest/url")
async def ingest_url_endpoint(url: str = Form(...)):
    ingest_url(url)
    return {"status": "ingested", "url": url}


# ── Knowledge Base ────────────────────────────────────────────────────────────

@app.post("/clear")
async def clear_knowledge():
    import chromadb
    db = chromadb.PersistentClient(path="./chroma_db")
    try:
        db.delete_collection("knowledge_base")
    except Exception:
        pass
    db.get_or_create_collection("knowledge_base")
    return {"status": "cleared"}