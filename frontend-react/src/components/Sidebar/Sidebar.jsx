import ChatHistory from "./ChatHistory";
import SourcesList from "./SourcesList";
import styles from "./Sidebar.module.css";

export default function Sidebar({
  open, chats, currentChatId, sources,
  onNewChat, onLoadChat, onDeleteChat,
  onAddSource, onClearSources,
  onOpenSettings, showToast
}) {
  return (
    <div className={`${styles.sidebar} ${open ? "" : styles.collapsed}`}>
      <div className={styles.top}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>🤖</div>
          <span className={styles.brandName}>RAG Assistant</span>
        </div>

        {/* New Chat */}
        <button className={styles.newChatBtn} onClick={onNewChat}>
          ✏️ New Chat
        </button>

        {/* Sources */}
        <SourcesList
          sources={sources}
          onClear={onClearSources}
          showToast={showToast}
        />

        {/* Chat History */}
        <ChatHistory
          chats={chats}
          currentChatId={currentChatId}
          onLoad={onLoadChat}
          onDelete={onDeleteChat}
        />
      </div>

      {/* Bottom settings */}
      <div className={styles.bottom}>
        <button className={styles.settingsBtn} onClick={onOpenSettings}>
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}