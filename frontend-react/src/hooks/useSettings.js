import { useState } from "react";

const DEFAULTS = {
  theme: "dark",
  fontSize: 14,
  language: "english",
  followup: true,
  memory: true,
  citations: true,
  results: 5,
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("rag_settings") || "{}");
      return { ...DEFAULTS, ...saved };
    } catch { return DEFAULTS; }
  });

  function updateSetting(key, value) {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("rag_settings", JSON.stringify(next));
      return next;
    });
  }

  return { settings, updateSetting };
}