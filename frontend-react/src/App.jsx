import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatBox from "./components/Chat/ChatBox";
import InputBar from "./components/Input/InputBar";
import SettingsModal from "./components/Settings/SettingsModal";
import Toast from "./components/UI/Toast";
import { useSettings } from "./hooks/useSettings";
import { useChat } from "./hooks/useChat";
import { useSources } from "./hooks/useSources";
import styles from "./App.module.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", error: false });
  const { settings, updateSetting } = useSettings();
  const { sources, addSource, clearSources } = useSources();
  const {
    chats, currentChatId, messages,
    sendMessage, newChat, loadChat, deleteChat, clearAllChats, isLoading
  } = useChat(settings);

  function showToast(msg, error = false) {
    setToast({ msg, error });
    setTimeout(() => setToast({ msg: "", error: false }), 2800);
  }

  return (
    <div className={styles.app} data-theme={settings.theme || "dark"}>
      <Sidebar
        open={sidebarOpen}
        chats={chats}
        currentChatId={currentChatId}
        sources={sources}
        onNewChat={newChat}
        onLoadChat={loadChat}
        onDeleteChat={deleteChat}
        onAddSource={addSource}
        onClearSources={clearSources}
        onOpenSettings={() => setSettingsOpen(true)}
        showToast={showToast}
      />
      <div className={styles.main}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(o => !o)}>☰</button>
          <span className={styles.chatTitle}>
            {chats[currentChatId]?.title || "New Chat"}
          </span>
          <div className={styles.statusWrap}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Online</span>
          </div>
        </div>

        <ChatBox
          messages={messages}
          isLoading={isLoading}
          onSuggestion={sendMessage}
          settings={settings}
        />

        <InputBar
          onSend={sendMessage}
          onAddSource={addSource}
          showToast={showToast}
          isLoading={isLoading}
        />
      </div>

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSetting}
          onClearChats={() => { clearAllChats(); showToast("🗑️ All chats cleared!"); }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <Toast msg={toast.msg} error={toast.error} />
    </div>
  );
}