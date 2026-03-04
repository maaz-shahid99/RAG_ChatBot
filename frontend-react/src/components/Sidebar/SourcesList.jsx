import { clearKnowledge } from "../../api/client";
import styles from "./SourcesList.module.css";

export default function SourcesList({ sources, onClear, showToast }) {
  async function handleClear() {
    if (!confirm("Clear all ingested documents and URLs?")) return;
    try {
      await clearKnowledge();
      onClear();
      showToast("🗑️ Knowledge base cleared!");
    } catch {
      showToast("❌ Failed to clear", true);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Sources</span>
        {sources.length > 0 && (
          <button className={styles.clearBtn} onClick={handleClear}>🗑️ Clear</button>
        )}
      </div>
      <div className={styles.list}>
        {sources.length === 0
          ? <span className={styles.empty}>No sources yet</span>
          : sources.map((s, i) => (
            <div key={i} className={styles.tag}>
              <span>{s.startsWith("http") ? "🌐" : "📄"}</span>
              <span className={styles.tagText}>{s}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}