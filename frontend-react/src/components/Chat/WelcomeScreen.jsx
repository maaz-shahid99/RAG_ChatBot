// ── WelcomeScreen.jsx ────────────────────────────────
// Save as: src/components/Chat/WelcomeScreen.jsx

import styles from "./WelcomeScreen.module.css";

const SUGGESTIONS = [
  { icon: "📄", text: "Summarize my uploaded document" },
  { icon: "🔑", text: "What are the key points?" },
  { icon: "🔬", text: "Research: artificial intelligence" },
  { icon: "❓", text: "What questions can I ask about this?" },
];

export default function WelcomeScreen({ onSuggestion }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🧠</div>
      <h2 className={styles.title}>How can I help you today?</h2>
      <p className={styles.sub}>
        Upload a document or paste a URL using the <strong>+</strong> button,<br />
        then start chatting with your knowledge base.
      </p>
      <div className={styles.chips}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className={styles.chip} onClick={() => onSuggestion(s.text)}>
            {s.icon} {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}