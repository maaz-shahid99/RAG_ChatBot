import chromadb
from sentence_transformers import SentenceTransformer
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

# ✅ Initialize embedder and ChromaDB
embedder = SentenceTransformer("all-MiniLM-L6-v2")
client_db = chromadb.PersistentClient(path="./chroma_db")

def get_collection():
    # Always fetch fresh — handles post-clear reconnection
    return client_db.get_or_create_collection("knowledge_base")

# ✅ Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask(query: str, history: list = []) -> dict:
    # 1. Embed the query
    query_embedding = embedder.encode(query).tolist()

    # 2. Always get a fresh collection reference
    try:
        collection = get_collection()
        results = collection.query(query_embeddings=[query_embedding], n_results=3)
    except Exception:
        # Collection empty or cleared — answer without context
        return {"answer": "I don't have any documents ingested yet. Please upload a PDF or URL first.", "sources": []}
    chunks = results["documents"][0]
    sources = [m["source"] for m in results["metadatas"][0]]

    # 3. Build prompt
    context = "\n\n".join(chunks)
    prompt = f"""You are a helpful personal assistant. Use the context below to answer the question.
If the answer is not in the context, say so honestly.

Context:
{context}

Question: {query}
Answer:"""

    # 4. Generate response via Groq
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "sources": list(set(sources))
    }