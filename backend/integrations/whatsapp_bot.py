from fastapi import APIRouter, Form
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client as TwilioClient
import sys, os, tempfile, requests
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from rag import ask
from ingest import ingest_pdf, ingest_docx, ingest_url
from memory import get_history, add_to_history
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

def download_twilio_file(media_url: str, filename: str) -> str:
    """Download a file from Twilio media URL using auth."""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    tmp_dir = tempfile.gettempdir()
    safe_name = filename.replace(" ", "_")
    path = os.path.join(tmp_dir, safe_name)
    r = requests.get(media_url, auth=(account_sid, auth_token))
    with open(path, "wb") as f:
        f.write(r.content)
    return path

@router.post("/whatsapp")
async def whatsapp_webhook(
    Body: str = Form(""),
    From: str = Form(...),
    NumMedia: str = Form("0"),
    MediaUrl0: str = Form(None),
    MediaContentType0: str = Form(None)
):
    resp = MessagingResponse()
    user_id = From

    # ✅ Handle file upload
    if int(NumMedia) > 0 and MediaUrl0:
        content_type = MediaContentType0 or ""
        if "pdf" in content_type:
            filename = "whatsapp_upload.pdf"
        elif "docx" in content_type or "word" in content_type:
            filename = "whatsapp_upload.docx"
        else:
            resp.message("⚠️ Only PDF and DOCX files are supported.")
            return Response(content=str(resp), media_type="text/xml")

        try:
            path = download_twilio_file(MediaUrl0, filename)
            if filename.endswith(".pdf"):
                ingest_pdf(path)
            else:
                ingest_docx(path)
            resp.message(f"✅ File ingested! You can now ask questions about it.")
        except Exception as e:
            resp.message(f"❌ Failed to ingest file: {str(e)}")

        return Response(content=str(resp), media_type="text/xml")

    # ✅ Handle URL ingestion
    if Body.startswith("http://") or Body.startswith("https://"):
        try:
            ingest_url(Body)
            resp.message("✅ URL ingested! You can now ask questions about it.")
        except Exception as e:
            resp.message(f"❌ Failed to ingest URL: {str(e)}")
        return Response(content=str(resp), media_type="text/xml")

    # ✅ Handle regular chat
    history = get_history(user_id)
    result = ask(Body, history)
    add_to_history(user_id, "user", Body)
    add_to_history(user_id, "assistant", result["answer"])
    sources = "\n📎 " + ", ".join(result["sources"]) if result["sources"] else ""
    resp.message(result["answer"] + sources)
    return Response(content=str(resp), media_type="text/xml")