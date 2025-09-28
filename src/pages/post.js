import { requireAuth } from "../ui/router.js";
import { initNav } from "../ui/nav.js";
import { getPost, updatePost, deletePost } from "../api/posts.js";
import { getUser } from "../ui/state.js";

requireAuth();
initNav();

const id = new URL(location.href).searchParams.get("id");
const postEl = document.getElementById("post");
const ownerActions = document.getElementById("ownerActions");
const postMsg = document.getElementById("postMsg"); // optional <output> in HTML

if (!id) {
  postMsg && (postMsg.textContent = "Missing post id.");
  throw new Error("Missing post id");
}

async function render() {
  postMsg && (postMsg.textContent = "Loading…");
  try {
    const data = await getPost(id);
    const post = data.data || data;

    const authorName = post.author?.name ?? "Unknown";
    const authorHtml =
      authorName !== "Unknown"
        ? `<a href="/profile.html?name=${encodeURIComponent(authorName)}">${authorName}</a>`
        : "Unknown";

    // ✅ Handle both string and object for media
    const mediaUrl =
      typeof post.media === "string"
        ? post.media
        : post.media?.url;

    const mediaHtml = mediaUrl
      ? `<img class="post-media" src="${mediaUrl}" alt="${post.media?.alt || "Post image"}"
             onerror="this.onerror=null;this.src='https://placehold.co/800x450?text=Image+not+available';">`
      : "";

    postEl.innerHTML = `
      <h2>${post.title ?? "Untitled"}</h2>
      <div class="post-meta">by ${authorHtml} • ${new Date(post.created).toLocaleString()}</div>
      ${mediaHtml}
      <p>${post.body ?? ""}</p>
    `;

    // Owner-only actions
    if (post.author?.name === getUser()?.name) {
      ownerActions.classList.remove("hidden");

      document.getElementById("editBtn").onclick = async () => {
        const title = prompt("New title", post.title ?? "");
        const body = prompt("New body", post.body ?? "");
        const currentMedia =
          typeof post.media === "string" ? post.media : (post.media?.url || "");
        const media = prompt("New media URL", currentMedia ?? "");
        if (title !== null && body !== null) {
          try {
            await updatePost(id, { title, body, media: media || undefined });
            render();
          } catch (err) {
            postMsg && (postMsg.textContent = err.message || "Failed to update post");
          }
        }
      };

      document.getElementById("deleteBtn").onclick = async () => {
        if (confirm("Delete this post?")) {
          try {
            await deletePost(id);
            location.href = "/feed.html";
          } catch (err) {
            postMsg && (postMsg.textContent = err.message || "Failed to delete post");
          }
        }
      };
    } else {
      ownerActions.classList.add("hidden");
    }

    postMsg && (postMsg.textContent = "");
  } catch (err) {
    postMsg && (postMsg.textContent = err.message || "Failed to load post");
    postEl.innerHTML = `<div class="card muted">Couldn’t load this post.</div>`;
  }
}

render();
