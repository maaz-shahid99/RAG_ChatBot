from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
import sys, os, tempfile
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from rag import ask
from ingest import ingest_pdf, ingest_docx, ingest_url
from memory import get_history, add_to_history
from dotenv import load_dotenv
load_dotenv()

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    query = update.message.text
    history = get_history(user_id)
    result = ask(query, history)
    add_to_history(user_id, "user", query)
    add_to_history(user_id, "assistant", result["answer"])
    sources = "\n📎 " + ", ".join(result["sources"]) if result["sources"] else ""
    await update.message.reply_text(result["answer"] + sources)

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

    # Handle documents (PDF/DOCX)
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    # Handle text messages and URLs
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_url))

    print("🤖 Telegram bot running...")
    app.run_polling()