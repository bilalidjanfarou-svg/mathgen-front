import { mockApi } from "./mock";

const BASE = import.meta.env.VITE_API_URL || "/api";
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") === "true";

/* ───────────── Jetons JWT (gardés dans le navigateur) ───────────── */
const tokens = {
  get: () => ({
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
  }),
  set: ({ access, refresh }) => {
    if (access) localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },
};

// App.jsx s'y abonne pour revenir à l'écran de connexion quand la session expire.
let onSessionExpired = () => {};
export const setSessionExpiredHandler = (fn) => {
  onSessionExpired = fn;
};

// Extrait un message lisible d'une erreur DRF ({detail} ou {champ: [messages]}).
function errorMessage(data, status) {
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const first = Object.values(data).flat()[0];
    if (typeof first === "string") return first;
  }
  return `Erreur ${status}`;
}

function send(path, options = {}, access) {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(access && { Authorization: `Bearer ${access}` }),
    },
  });
}

// Le jeton d'accès dure 30 minutes : on en demande un nouveau avec le jeton de renouvellement.
async function refreshAccess() {
  const { refresh } = tokens.get();
  if (!refresh) return false;
  const res = await send("/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return false;
  tokens.set(await res.json());
  return true;
}

async function request(path, options = {}, retry = true) {
  const res = await send(path, options, tokens.get().access);
  if (res.status === 401 && retry && (await refreshAccess())) {
    return request(path, options, false);
  }
  if (res.status === 401) {
    tokens.clear();
    onSessionExpired();
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(errorMessage(data, res.status));
  return data;
}

// Inscription et connexion : requêtes sans jeton.
async function authPost(path, body) {
  const res = await send(path, { method: "POST", body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  if (res.status === 401) throw new Error("Nom d’utilisateur ou mot de passe incorrect.");
  if (!res.ok) throw new Error(errorMessage(data, res.status));
  return data;
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

  register: async (username, password) => {
    tokens.set(await authPost("/auth/register/", { username, password }));
    return request("/auth/me/");
  },
  login: async (username, password) => {
    tokens.set(await authPost("/auth/login/", { username, password }));
    return request("/auth/me/");
  },
  me: () => request("/auth/me/"),
  hasSession: () => !!tokens.get().refresh,
  logout: () => tokens.clear(),
};

export const api = USE_MOCK ? mockApi : realApi;
