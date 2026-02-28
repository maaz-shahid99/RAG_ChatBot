# Simple in-memory conversation store per user/session
conversations = {}

def get_history(session_id: str) -> list:
    return conversations.get(session_id, [])

def add_to_history(session_id: str, role: str, content: str):
    if session_id not in conversations:
        conversations[session_id] = []
    conversations[session_id].append({"role": role, "content": content})
    # Keep last 10 messages only
    conversations[session_id] = conversations[session_id][-10:]