// /src/api/auth.js
import { apiFetch } from "./http.js";
import { setUser, getUser, setApiKey } from "../ui/state.js";

/** @typedef {{name:string,email:string,password:string}} RegisterDto */
/** @typedef {{email:string,password:string}} LoginDto */

/**
 * Register a new user.
 * @param {RegisterDto} dto
 */
export async function register(dto) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Ensure we have a Noroff API key stored.
 * If already present in localStorage, returns it.
 * Otherwise creates one and stores it.
 */
export async function ensureApiKey() {
  const u = getUser();
  if (u?.apiKey) return u.apiKey;

  const res = await apiFetch("/auth/create-api-key", {
    method: "POST",
    body: JSON.stringify({ name: "course-assignment" }),
  });

  // Handle both shapes {data:{key}} or {key}
  const key = res?.data?.key || res?.key;
  if (key) setApiKey(key);
  return key;
}

/**
 * Login with credentials, persist session, and ensure API key exists.
 * @param {LoginDto} dto
 */
export async function login(dto) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });

  const user = data.data || data;

  setUser({
    name: user.name,
    email: user.email,
    accessToken: user.accessToken,
    // apiKey set right after
  });

  // Create/store API key right after login (non-fatal if it fails)
  try {
    await ensureApiKey();
  } catch {
    /* page can attempt again */
  }

  return user;
}
