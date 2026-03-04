import { useRef, useState } from "react";
import { ingestFile, ingestUrl } from "../../api/client";
import styles from "./InputBar.module.css";

export default function InputBar({ onSend, onAddSource, showToast, isLoading }) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
    textareaRef.current.style.height = "auto";
  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setMenuOpen(false);
    showToast("⏳ Ingesting file...");
    try {
      const res = await ingestFile(file);
      if (res.data.status === "ingested") {
        onAddSource(file.name);
        showToast("✅ File ingested!");
      } else {
        showToast(res.data.message || "Error ingesting file", true);
      }
    } catch {
      showToast("❌ Backend not reachable", true);
    }
    e.target.value = "";
  }

  async function handleUrlPrompt() {
    setMenuOpen(false);
    const url = prompt("Enter a URL to ingest:");
    if (!url?.trim()) return;
    showToast("⏳ Ingesting URL...");
    try {
      await ingestUrl(url.trim());
      onAddSource(url.trim());
      showToast("✅ URL ingested!");
    } catch {
      showToast("❌ Backend not reachable", true);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>

        {/* + button */}
        <div className={styles.plusWrap}>
          <button
            className={styles.plusBtn}
            onClick={() => setMenuOpen(o => !o)}
            title="Add file or URL"
          >+</button>

          {menuOpen && (
            <div className={styles.menu}>
              <button className={styles.menuItem} onClick={() => { fileRef.current.click(); }}>
                📄 Upload PDF / DOCX
              </button>
              <button className={styles.menuItem} onClick={handleUrlPrompt}>
                🌐 Add URL
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileRef}
          accept=".pdf,.docx"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className={styles.input}
          placeholder="Message RAG Assistant..."
          rows={1}
          value={text}
          onChange={e => { setText(e.target.value); autoResize(e); }}
          onKeyDown={handleKey}
          disabled={isLoading}
        />

        {/* Send button */}
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <p className={styles.hint}>RAG Assistant can make mistakes. Verify important information.</p>
    </div>
  );
}