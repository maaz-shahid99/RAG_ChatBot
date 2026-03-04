import { useState, useCallback } from "react";
import { sendChat } from "../api/client";

function genId() { return "chat_" + Date.now(); }

function loadChats() {
  try { return JSON.parse(localStorage.getItem("rag_chats") || "{}"); }
  catch { return {}; }
}

function saveChats(chats) {
  localStorage.setItem("rag_chats", JSON.stringify(chats));
}

export function useChat(settings) {
  const [chats, setChats] = useState(loadChats);
  const [currentChatId, setCurrentChatId] = useState(genId);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (query) => {
    if (!query.trim() || isLoading) return;

    const userMsg = { role: "user", text: query, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Save to chat history
    setChats(prev => {
      const updated = {
        ...prev,
        [currentChatId]: {
          title: prev[currentChatId]?.title || query.slice(0, 32),
          messages: [...(prev[currentChatId]?.messages || []), userMsg],
        }
      };
      saveChats(updated);
      return updated;
    });

    try {
      const res = await sendChat(query, currentChatId);
      const { answer, sources, followup } = res.data;

      const botMsg = {
        role: "bot",
        text: answer,
        id: Date.now() + 1,
        sources: settings.citations !== false ? (sources || []) : [],
        followup: settings.followup !== false ? (followup || []) : [],
      };

      setMessages(prev => [...prev, botMsg]);
      setChats(prev => {
        const updated = {
          ...prev,
          [currentChatId]: {
            ...prev[currentChatId],
            messages: [...(prev[currentChatId]?.messages || []), botMsg],
          }
        };
        saveChats(updated);
        return updated;
      });
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "⚠️ Could not connect to backend. Is the server running?",
        id: Date.now() + 1,
        sources: [], followup: [],
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, isLoading, settings]);

  const newChat = useCallback(() => {
    setCurrentChatId(genId());
    setMessages([]);
  }, []);

  const loadChat = useCallback((id) => {
    setCurrentChatId(id);
    setMessages(loadChats()[id]?.messages || []);
  }, []);

  const deleteChat = useCallback((id) => {
    setChats(prev => {
      const updated = { ...prev };
      delete updated[id];
      saveChats(updated);
      return updated;
    });
    if (id === currentChatId) {
      setCurrentChatId(genId());
      setMessages([]);
    }
  }, [currentChatId]);

  const clearAllChats = useCallback(() => {
    setChats({});
    saveChats({});
    setCurrentChatId(genId());
    setMessages([]);
  }, []);

  return { chats, currentChatId, messages, sendMessage, newChat, loadChat, deleteChat, clearAllChats, isLoading };
}