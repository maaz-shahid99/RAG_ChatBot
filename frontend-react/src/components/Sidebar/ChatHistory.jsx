import styles from "./ChatHistory.module.css";

export default function ChatHistory({ chats, currentChatId, onLoad, onDelete }) {
  const keys = Object.keys(chats).reverse();

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Chat History</div>
      <div className={styles.list}>
        {keys.length === 0
          ? <span className={styles.empty}>No previous chats</span>
          : keys.map(id => (
            <div
              key={id}
              className={`${styles.item} ${id === currentChatId ? styles.active : ""}`}
              onClick={() => onLoad(id)}
            >
              <span className={styles.icon}>💬</span>
              <span className={styles.label}>{chats[id]?.title || "New Chat"}</span>
              <button
                className={styles.del}
                onClick={e => { e.stopPropagation(); onDelete(id); }}
              >✕</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}