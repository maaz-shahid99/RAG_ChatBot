from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from rag import ask
from ingest import ingest_pdf, ingest_docx, ingest_url
from memory import get_history, add_to_history
from integrations.whatsapp_bot import router as whatsapp_router
import shutil, os, tempfile

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(whatsapp_router)

@app.post("/chat")
async def chat(query: str = Form(...), session_id: str = Form("default")):
    history = get_history(session_id)
    result = ask(query, history)
    add_to_history(session_id, "user", query)
    add_to_history(session_id, "assistant", result["answer"])
    return result

@app.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    # ✅ Use system temp folder — works on both Windows and Mac/Linux
    tmp_dir = tempfile.gettempdir()
    safe_filename = file.filename.replace(" ", "_")
    path = os.path.join(tmp_dir, safe_filename)

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

@app.post("/clear")
async def clear_knowledge():
    import chromadb
    # ✅ Delete and recreate collection without touching files
    db = chromadb.PersistentClient(path="./chroma_db")
    try:
        db.delete_collection("knowledge_base")
    except Exception:
        pass
    db.get_or_create_collection("knowledge_base")
    return {"status": "cleared"}