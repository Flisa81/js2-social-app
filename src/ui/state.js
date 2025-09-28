// /src/ui/state.js
const STORAGE_KEY = "socialUser";

/** @typedef {{name:string,email:string,accessToken:string,apiKey?:string}} User */

/** Get current user from localStorage. */
export function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Save user to localStorage. */
export function setUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

/** Clear user. */
export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Return bearer token or null. */
export function getToken() {
  return getUser()?.accessToken || null;
}

/** Return Noroff API key (if stored). */
export function getApiKey() {
  return getUser()?.apiKey || null;
}

/** Persist/merge the API key into the stored user. */
export function setApiKey(key) {
  const u = getUser();
  if (!u) return;
  setUser({ ...u, apiKey: key });
}
