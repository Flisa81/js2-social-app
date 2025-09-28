// /src/api/profiles.js
import { apiFetch } from "./http.js";

const BASE = "/social/profiles";

/**
 * Get a profile by name.
 * @param {string} name
 * @returns {Promise<any>}
 */
export async function getProfile(name) {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(name)}`);
  return res.data ?? res;
}

/**
 * Get posts for a profile (with author included).
 * @param {string} name
 * @param {{page?:number, limit?:number}} [opts]
 * @returns {Promise<any[]>}
 */
export async function getProfilePosts(name, opts = {}) {
  const { page = 1, limit = 10 } = opts;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    _author: "true",
  });
  const res = await apiFetch(`${BASE}/${encodeURIComponent(name)}/posts?${params.toString()}`);
  return res.data ?? res;
}

/**
 * Follow a user.
 * @param {string} name
 * @returns {Promise<any>}
 */
export async function follow(name) {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(name)}/follow`, { method: "PUT" });
  return res.data ?? res;
}

/**
 * Unfollow a user.
 * @param {string} name
 * @returns {Promise<any>}
 */
export async function unfollow(name) {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(name)}/unfollow`, { method: "PUT" });
  return res.data ?? res;
}

/**
 * Update profile fields (e.g., avatar, bio).
 * @param {string} name
 * @param {{avatar?:string, bio?:string}} [body]
 * @returns {Promise<any>}
 */
export async function updateProfile(name, body = {}) {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.data ?? res;
}
