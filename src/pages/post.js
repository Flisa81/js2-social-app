// /src/pages/post.js
import { requireAuth } from "../ui/router.js";
import { initNav } from "../ui/nav.js";
import { getPost, updatePost, deletePost } from "../api/posts.js";
import { getUser } from "../ui/state.js";

requireAuth();
initNav();

const id = new URL(location.href).searchParams.get("id");
const postEl = document.getElementById("post");
const ownerActions = document.getElementById("ownerActions");
const postMsg = document.getElementById("postMsg");

if (!id) {
  if (postMsg) postMsg.textContent = "Missing post id.";
  throw new Error("Missing post id");
}

// Wire once; handlers call the latest state via closures.
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

let currentPost = null;

async function render() {
  if (postMsg) postMsg.textContent = "Loading…";

  try {
    const data = await getPost(id);
    const post = data?.data || data;
    currentPost = post;

    // author name (safe)
    const authorName = post.author?.name ?? "Unknown";
    const authorHtml =
      authorName !== "Unknown"
        ? `<a href="/profile.html?name=${encodeURIComponent(authorName)}">${authorName}</a>`
        : "Unknown";

    // media can be string or { url, alt }
    const mediaUrl =
      typeof post.media === "string" ? post.media?.trim() : post.media?.url?.trim();
    const mediaAlt = (post.media && post.media.alt) ? String(post.media.alt) : "Post image";
    const mediaHtml = mediaUrl
      ? `<img class="post-media" src="${mediaUrl}" alt="${mediaAlt}"
           onerror="this.onerror=null;this.src='https://placehold.co/800x450?text=Image+not+available';">`
      : "";

    postEl.innerHTML = `
      <h2>${post.title ?? "Untitled"}</h2>
      <div class="post-meta">by ${authorHtml} • ${new Date(post.created).toLocaleString()}</div>
      ${mediaHtml}
      <p>${post.body ?? ""}</p>
    `;

    // show or hide owner actions
    if (post.author?.name === getUser()?.name) {
      ownerActions?.classList.remove("hidden");
    } else {
      ownerActions?.classList.add("hidden");
    }

    if (postMsg) postMsg.textContent = "";
  } catch (err) {
    console.error(err);
    if (postMsg) postMsg.textContent = err?.message || "Failed to load post";
    postEl.innerHTML = `<div class="card muted">Couldn’t load this post.</div>`;
    ownerActions?.classList.add("hidden");
  }
}

// Edit
editBtn?.addEventListener("click", async () => {
  if (!currentPost) return;

  const title = prompt("New title", currentPost.title ?? "");
  if (title === null) return; // cancel

  const body = prompt("New body", currentPost.body ?? "");
  if (body === null) return; // cancel

  const currentMedia =
    typeof currentPost.media === "string"
      ? currentPost.media
      : (currentPost.media?.url ?? "");
  const media = prompt("New media URL (leave empty to remove)", currentMedia ?? "");

  if (postMsg) postMsg.textContent = "Saving…";
  try {
    // Build payload to match API expectation (string -> object with url/alt)
    const payload = { title, body };
    if (media !== null) {
      const trimmed = String(media).trim();
      if (trimmed) {
        payload.media = { url: trimmed, alt: "Post image" };
      } else {
        payload.media = null; // clear media explicitly
      }
    }
    await updatePost(id, payload);
    if (postMsg) postMsg.textContent = "Updated ✅";
    await render();
  } catch (err) {
    console.error(err);
    if (postMsg) postMsg.textContent = err?.message || "Failed to update post";
  }
});

// Delete
deleteBtn?.addEventListener("click", async () => {
  if (!currentPost) return;
  if (!confirm("Delete this post? This cannot be undone.")) return;

  if (postMsg) postMsg.textContent = "Deleting…";
  try {
    await deletePost(id);
    if (postMsg) postMsg.textContent = "Deleted ✅";
    location.href = "/feed.html";
  } catch (err) {
    console.error(err);
    if (postMsg) postMsg.textContent = err?.message || "Failed to delete post";
  }
});

render();
