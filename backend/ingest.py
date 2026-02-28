import chromadb
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from docx import Document
import requests
from bs4 import BeautifulSoup
import uuid

# Initialize
client = chromadb.PersistentClient(path="./chroma_db")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

def get_collection():
    return client.get_or_create_collection("knowledge_base")

def ingest_pdf(file_path: str):
    reader = PdfReader(file_path)
    text = " ".join(page.extract_text() for page in reader.pages if page.extract_text())
    _store_chunks(text, source=file_path)
    print(f"✅ Ingested PDF: {file_path}")

def ingest_docx(file_path: str):
    doc = Document(file_path)
    text = " ".join(p.text for p in doc.paragraphs if p.text)
    _store_chunks(text, source=file_path)
    print(f"✅ Ingested DOCX: {file_path}")

def ingest_url(url: str):
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    _store_chunks(text, source=url)
    print(f"✅ Ingested URL: {url}")

def _store_chunks(text: str, source: str, chunk_size: int = 500):
    words = text.split()
    chunks = [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    for chunk in chunks:
        embedding = embedder.encode(chunk).tolist()
        get_collection().add(
            documents=[chunk],
            embeddings=[embedding],
            metadatas=[{"source": source}],
            ids=[str(uuid.uuid4())]
        )