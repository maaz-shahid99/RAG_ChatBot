from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
import sys, os, tempfile, threading
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from rag import ask
from ingest import ingest_pdf, ingest_docx, ingest_url
from memory import get_history, add_to_history
from research_agent import run_research
from dotenv import load_dotenv
import whisper
load_dotenv()

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
whisper_model = whisper.load_model("base")  # loads once at startup

async def handle_voice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🎤 Transcribing your voice message...")
    try:
        voice = update.message.voice
        tg_file = await context.bot.get_file(voice.file_id)
        tmp_dir = tempfile.gettempdir()
        ogg_path = os.path.join(tmp_dir, f"voice_{voice.file_id}.ogg")
        await tg_file.download_to_drive(ogg_path)

        # Transcribe with Whisper
        result = whisper_model.transcribe(ogg_path)
        query = result["text"].strip()
        await update.message.reply_text(f"📝 You said: _{query}_", parse_mode="Markdown")

        # Pass through RAG
        user_id = str(update.effective_user.id)
        history = get_history(user_id)
        rag_result = ask(query, history)
        add_to_history(user_id, "user", query)
        add_to_history(user_id, "assistant", rag_result["answer"])

        sources = "\n📎 " + ", ".join(rag_result["sources"]) if rag_result["sources"] else ""
        reply = rag_result["answer"] + sources

        # Add follow-up questions
        if rag_result.get("followup"):
            reply += "\n\n💡 *Follow-up questions:*\n" + "\n".join(f"• {q}" for q in rag_result["followup"])

        await update.message.reply_text(reply, parse_mode="Markdown")
    except Exception as e:
        await update.message.reply_text(f"❌ Voice transcription failed: {str(e)}")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    query = update.message.text

    # Research command
    if query.lower().startswith("research:"):
        topic = query[9:].strip()
        await update.message.reply_text(f"🔬 Research started on *{topic}*! Results will be mailed to you shortly.", parse_mode="Markdown")
        thread = threading.Thread(target=run_research, args=(topic, GMAIL_ADDRESS))
        thread.daemon = True
        thread.start()
        return

    history = get_history(user_id)
    result = ask(query, history)
    add_to_history(user_id, "user", query)
    add_to_history(user_id, "assistant", result["answer"])

    sources = "\n📎 " + ", ".join(result["sources"]) if result["sources"] else ""
    reply = result["answer"] + sources

    # Add follow-up questions
    if result.get("followup"):
        reply += "\n\n💡 *Follow-up questions:*\n" + "\n".join(f"• {q}" for q in result["followup"])

    await update.message.reply_text(reply, parse_mode="Markdown")

async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE):
    doc = update.message.document
    file_name = doc.file_name
    mime = doc.mime_type

    # Only accept PDF and DOCX
    if not (file_name.endswith(".pdf") or file_name.endswith(".docx")):
        await update.message.reply_text("⚠️ Only PDF and DOCX files are supported.")
        return

    await update.message.reply_text(f"⏳ Ingesting *{file_name}*... please wait.", parse_mode="Markdown")

    try:
        # Download file from Telegram
        tg_file = await context.bot.get_file(doc.file_id)
        tmp_dir = tempfile.gettempdir()
        safe_name = file_name.replace(" ", "_")
        path = os.path.join(tmp_dir, safe_name)
        await tg_file.download_to_drive(path)

        # Ingest into ChromaDB
        if file_name.endswith(".pdf"):
            ingest_pdf(path)
        else:
            ingest_docx(path)

        await update.message.reply_text(f"✅ *{file_name}* ingested! You can now ask questions about it.", parse_mode="Markdown")
    except Exception as e:
        await update.message.reply_text(f"❌ Failed to ingest file: {str(e)}")

async def handle_url(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Auto-detect URLs in messages and ingest them."""
    text = update.message.text
    if text.startswith("http://") or text.startswith("https://"):
        await update.message.reply_text(f"⏳ Ingesting URL... please wait.")
        try:
            ingest_url(text)
            await update.message.reply_text(f"✅ URL ingested! You can now ask questions about it.")
        except Exception as e:
            await update.message.reply_text(f"❌ Failed to ingest URL: {str(e)}")
    else:
        await handle_message(update, context)

if __name__ == "__main__":
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    app = ApplicationBuilder().token(token).build()

    app.add_handler(MessageHandler(filters.VOICE, handle_voice))          # 🎤 Voice
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document)) # 📄 Files
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_url)) # 💬 Text

    print("🤖 Telegram bot running...")
    app.run_polling()