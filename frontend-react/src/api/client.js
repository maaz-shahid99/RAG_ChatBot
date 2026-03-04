import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const sendChat = (query, sessionId) => {
  const form = new FormData();
  form.append("query", query);
  form.append("session_id", sessionId);
  return api.post("/chat", form);
};

export const ingestFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/ingest/file", form);
};

export const ingestUrl = (url) => {
  const form = new FormData();
  form.append("url", url);
  return api.post("/ingest/url", form);
};

export const clearKnowledge = () => api.post("/clear");

export const getStatus = () => api.get("/status");