// /src/api/http.js
import { getToken, getApiKey } from "../ui/state.js";

export const API_BASE = "https://v2.api.noroff.dev";

/**
 * Fetch wrapper that automatically handles:
 * - Base URL prefix
 * - JSON headers
 * - Bearer auth token
 * - Noroff API key
 * - Error extraction from API
 *
 * @param {string} path - API path starting with `/`
 * @param {RequestInit} [options]
 * @returns {Promise<any>} Parsed JSON (or text if not JSON)
 * @throws {Error} When response is not ok, message from API or status text
 */
export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  // Bearer token from login
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Noroff API key (must be generated once after login)
  const apiKey = getApiKey();
  if (apiKey) headers.set("X-Noroff-API-Key", apiKey);

  const res = await fetch(API_BASE + path, { ...options, headers });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || res.statusText;
    throw new Error(msg);
  }

  return data;
}
