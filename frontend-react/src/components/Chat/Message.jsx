import styles from "./Message.module.css";

export default function Message({ msg, onSuggestion }) {
  const isBot = msg.role === "bot";

  return (
    <div className={`${styles.msg} ${isBot ? styles.bot : styles.user}`}>
      <div className={`${styles.avatar} ${isBot ? styles.botAvatar : styles.userAvatar}`}>
        {isBot ? "🤖" : "👤"}
      </div>
      <div className={styles.content}>
        <div className={`${styles.bubble} ${isBot ? styles.botBubble : styles.userBubble}`}>
          {msg.text}
          {isBot && msg.sources?.length > 0 && (
            <div className={styles.sources}>
              📎 {msg.sources.map((s, i) => (
                <span key={i} className={styles.srcTag}>{s}</span>
              ))}
            </div>
          )}
        </div>
        {isBot && msg.followup?.length > 0 && (
          <div className={styles.followup}>
            {msg.followup.map((q, i) => (
              <button key={i} className={styles.chip} onClick={() => onSuggestion(q)}>
                💡 {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}