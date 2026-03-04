import { useState } from "react";

export function useSources() {
  const [sources, setSources] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rag_sources") || "[]"); }
    catch { return []; }
  });

  function addSource(name) {
    setSources(prev => {
      if (prev.includes(name)) return prev;
      const updated = [...prev, name];
      localStorage.setItem("rag_sources", JSON.stringify(updated));
      return updated;
    });
  }

  function clearSources() {
    setSources([]);
    localStorage.removeItem("rag_sources");
  }

  return { sources, addSource, clearSources };
}