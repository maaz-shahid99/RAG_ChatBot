from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64, os, time
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from rag import ask

SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]

def get_gmail_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
        with open("token.json", "w") as f:
            f.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)

def build_reply(to: str, subject: str, body: str) -> dict:
    """Build a properly formatted reply email."""
    message = MIMEText(body)
    message["To"] = to
    message["Subject"] = f"Re: {subject}" if not subject.startswith("Re:") else subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {"raw": raw}

SKIP_SENDERS = [
    "no-reply", "noreply", "do-not-reply", "donotreply",
    "mailer-daemon", "postmaster", "newsletter", "notifications",
    "notify", "alert", "updates", "marketing", "promo",
    "support", "hello@", "info@", "service@", "mail@",
    "bounces", "automated", "system", "daemon", "sales@"
]

SKIP_DOMAINS = [
    "linkedin.com", "amazon.com", "bookmyshow.com", "adobe.com",
    "lenskart.com", "hm.com", "primevideo.com", "grammarly.com",
    "irctc.co.in", "railyatri.in", "naukri.com", "facebookmail.com",
    "accounts.google.com", "googlemail.com", "twitter.com",
    "instagram.com", "youtube.com", "netflix.com", "spotify.com", "altium.com"
]

def should_skip(sender: str) -> bool:
    sender_lower = sender.lower()
    # Skip if sender contains any skip keywords
    if any(skip in sender_lower for skip in SKIP_SENDERS):
        return True
    # Skip if sender is from a known promotional domain
    if any(domain in sender_lower for domain in SKIP_DOMAINS):
        return True
    return False

def check_and_reply(service):
    results = service.users().messages().list(
        userId="me", labelIds=["UNREAD"], maxResults=5
    ).execute()
    messages = results.get("messages", [])

    for msg in messages:
        try:
            msg_data = service.users().messages().get(
                userId="me", id=msg["id"], format="full"
            ).execute()
            headers = msg_data["payload"]["headers"]
            subject = next((h["value"] for h in headers if h["name"] == "Subject"), "No Subject")
            sender = next((h["value"] for h in headers if h["name"] == "From"), "")

            # Extract plain email address from "Name <email@example.com>" format
            if "<" in sender and ">" in sender:
                to_address = sender.split("<")[1].split(">")[0].strip()
            else:
                to_address = sender.strip()

            # ✅ Skip newsletters, bots, automated emails
            if should_skip(sender):
                print(f"⏭️ Skipped (automated): {sender}")
                service.users().messages().modify(
                    userId="me", id=msg["id"],
                    body={"removeLabelIds": ["UNREAD"]}
                ).execute()
                continue

            # Get email body
            body_data = msg_data["payload"].get("body", {}).get("data", "")
            body = base64.urlsafe_b64decode(body_data + "==").decode("utf-8", errors="ignore") if body_data else subject

            # Generate AI reply
            result = ask(f"Email received with subject '{subject}': {body[:500]}")
            reply_text = result["answer"]

            # Send reply using MIME format
            reply_msg = build_reply(to_address, subject, reply_text)
            service.users().messages().send(userId="me", body=reply_msg).execute()

            # Mark as read
            service.users().messages().modify(
                userId="me", id=msg["id"],
                body={"removeLabelIds": ["UNREAD"]}
            ).execute()
            print(f"✅ Replied to: {sender}")

        except Exception as e:
            print(f"⚠️ Skipped email due to error: {e}")
            # Mark as read anyway to avoid retrying bad emails
            service.users().messages().modify(
                userId="me", id=msg["id"],
                body={"removeLabelIds": ["UNREAD"]}
            ).execute()

if __name__ == "__main__":
    service = get_gmail_service()
    print("📧 Gmail bot running — checking every 60 seconds...")
    while True:
        check_and_reply(service)
        time.sleep(60)