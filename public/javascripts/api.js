// public/javascripts/api.js

export function saveAuth(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("userEmail", data.user.email);
  localStorage.setItem("username", data.user.username);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("username");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserInfo() {
  return {
    email: localStorage.getItem("userEmail"),
    username: localStorage.getItem("username"),
  };
}

/**
 * fetch avec header Authorization automatiquement
 */
export async function authFetch(url, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("Token manquant (utilisateur non connecté)");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg || `Erreur HTTP ${resp.status}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}
