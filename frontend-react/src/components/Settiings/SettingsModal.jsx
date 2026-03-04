import styles from "./SettingsModal.module.css";

const THEMES = [
  { id: "dark", label: "🌙 Dark" },
  { id: "light", label: "☀️ Light" },
  { id: "system", label: "💻 System" },
];

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "Arabic", "German"];

export default function SettingsModal({ settings, onUpdate, onClearChats, onClose }) {
  function handleTheme(t) {
    const resolved = t === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t;
    onUpdate("theme", resolved);
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {/* Theme */}
        <div className={styles.group}>
          <div className={styles.label}>Theme</div>
          <div className={styles.themeRow}>
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`${styles.themeBtn} ${settings.theme === t.id ? styles.active : ""}`}
                onClick={() => handleTheme(t.id)}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className={styles.group}>
          <div className={styles.label}>Font Size — {settings.fontSize || 14}px</div>
          <div className={styles.row}>
            <span className={styles.hint}>Small</span>
            <input
              type="range" min="12" max="18"
              value={settings.fontSize || 14}
              onChange={e => {
                onUpdate("fontSize", Number(e.target.value));
                document.documentElement.style.setProperty("--font-size", e.target.value + "px");
              }}
            />
            <span className={styles.hint}>Large</span>
          </div>
        </div>

        {/* Language */}
        <div className={styles.group}>
          <div className={styles.label}>Response Language</div>
          <select
            value={settings.language || "English"}
            onChange={e => onUpdate("language", e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Toggles */}
        <div className={styles.group}>
          <div className={styles.label}>Features</div>
          {[
            { key: "followup", label: "Show follow-up question suggestions" },
            { key: "citations", label: "Show source citations" },
            { key: "memory", label: "Remember conversation history" },
          ].map(({ key, label }) => (
            <label key={key} className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings[key] !== false}
                onChange={e => onUpdate(key, e.target.checked)}
              />
              <span className={styles.slider} />
              <span className={styles.toggleLabel}>{label}</span>
            </label>
          ))}
        </div>

        {/* Results count */}
        <div className={styles.group}>
          <div className={styles.label}>Knowledge Base Results</div>
          <select
            value={settings.results || 5}
            onChange={e => onUpdate("results", Number(e.target.value))}
          >
            <option value={3}>3 chunks — faster</option>
            <option value={5}>5 chunks — balanced</option>
            <option value={8}>8 chunks — thorough</option>
          </select>
        </div>

        {/* Danger zone */}
        <div className={`${styles.group} ${styles.danger}`}>
          <div className={styles.label}>Danger Zone</div>
          <button className={styles.dangerBtn} onClick={() => { if(confirm("Clear all chat history?")) { onClearChats(); onClose(); } }}>
            🗑️ Clear All Chat History
          </button>
        </div>
      </div>
    </div>
  );
}