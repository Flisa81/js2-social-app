// /src/api/posts.js
import { apiFetch } from "./http.js";
const BASE = "/social/posts";

/**
 * Get a paginated list of posts (with author included).
 * @param {{page?:number, limit?:number, sort?:'asc'|'desc'|'newest'|'oldest', q?:string}} [opts]
 * @returns {Promise<any[]>}
 */
export async function getPosts(opts = {}) {
  const { page = 1, limit = 10, sort = "desc", q = "" } = opts;

  // Preferred (full) request
  const full = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    _author: "true",
    sort: sort === "asc" || sort === "oldest" ? "created" : "-created",
  });
  if (q) full.set("q", q);

  try {
    const res = await apiFetch(`${BASE}?${full.toString()}`);
    return res.data ?? res;
  } catch (err) {
    // If the API hiccups (500 etc.), retry with minimal params
    if (/500/.test(err.message) || /Something went wrong/i.test(err.message)) {
      const minimal = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        _author: "true",
      });
      const res2 = await apiFetch(`${BASE}?${minimal.toString()}`);
      return res2.data ?? res2;
    }
    throw err;
  }
}

/**
 * Get a single post with author, comments and reactions.
 * @param {string|number} id
 * @returns {Promise<any>}
 */
export async function getPost(id) {
  const params = new URLSearchParams({
    _author: "true",
    _comments: "true",
    _reactions: "true",
  });
  const res = await apiFetch(`${BASE}/${encodeURIComponent(id)}?${params.toString()}`);
  return res.data ?? res;
}

/**
 * Create a post.
 * @param {{title:string, body:string, media?:string}} input
 * @returns {Promise<any>}
 */
export async function createPost(input) {
  const { title, body, media } = input;

  const payload = { title, body };
  if (media && String(media).trim()) {
    payload.media = { url: String(media).trim(), alt: "Post image" };
  }

  const res = await apiFetch(BASE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data ?? res;
}

/**
 * Update a post (only if you’re the owner).
 * @param {string|number} id
 * @param {{title?:string, body?:string, media?:string}} input
 * @returns {Promise<any>}
 */
export async function updatePost(id, input) {
  const { title, body, media } = input;

  const payload = {};
  if (typeof title === "string") payload.title = title;
  if (typeof body === "string") payload.body = body;
  if (media !== undefined) {
    if (media && String(media).trim()) {
      payload.media = { url: String(media).trim(), alt: "Post image" };
    } else {
      // explicit clear if user removes media
      payload.media = null;
    }
  }

  const res = await apiFetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data ?? res;
}
