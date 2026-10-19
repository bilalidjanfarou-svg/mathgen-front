import { mockApi } from "./mock";

const BASE = import.meta.env.VITE_API_URL || "/api";
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") === "true";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

const realApi = {
  chapters: () => request("/chapters/"),
  generate: (chapter_id, difficulty) =>
    request("/exercises/generate/", {
      method: "POST",
      body: JSON.stringify({ chapter_id, difficulty }),
    }),
  answer: (id, answer) =>
    request(`/exercises/${id}/answer/`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),
  progress: () => request("/progress/"),
};

export const api = USE_MOCK ? mockApi : realApi;
