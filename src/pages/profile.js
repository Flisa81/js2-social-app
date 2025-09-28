// /src/pages/profile.js
import { requireAuth } from "../ui/router.js";
import { initNav } from "../ui/nav.js";
import { getUser } from "../ui/state.js";
import {
  getProfile,
  getProfilePosts,
  follow,
  unfollow,
  updateProfile,
} from "../api/profiles.js";

requireAuth();
initNav();

// read ?name=... OR fallback to the logged-in user
const nameParam = new URL(location.href).searchParams.get("name");
const current = getUser();

if (!current || !current.accessToken) {
  location.href = "/login.html";
  throw new Error("No session/token");
}

const me = current.name;
const profileName = nameParam || me;

// cache DOM
const headerEl = document.getElementById("profileHeader");
const postsEl = document.getElementById("userPosts");
const loadMoreBtn = document.getElementById("loadMoreUserPosts");
const avatarUpdater = document.getElementById("avatarUpdater");
const avatarForm = document.getElementById("avatarForm");
const avatarMsg = document.getElementById("avatarMsg");

let page = 1;

// Only show avatar updater on your own profile
if (profileName !== me && avatarUpdater) {
  avatarUpdater.style.display = "none";
}

async function renderProfile() {
  headerEl.innerHTML = `<div class="muted">Loading profile…</div>`;
  try {
    const data = await getProfile(profileName);
    const p = data.data || data;

    const avatar =
      p.avatar ||
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(p.name);

    headerEl.innerHTML = `
      <div class="profile-header">
        <img class="avatar" src="${avatar}" alt="Avatar of ${p.name}"
             onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
               p.name
             )}'">
        <div>
          <h2>${p.name}</h2>
          <p class="muted">${p.bio || ""}</p>
          ${
            profileName !== me
              ? `<button id="followBtn" class="btn">Follow / Unfollow</button>`
              : ""
          }
        </div>
      </div>
    `;

    // Follow/Unfollow
    if (profileName !== me) {
      const btn = document.getElementById("followBtn");
      // best-effort label based on server data if present
      const iFollow =
        Array.isArray(p.following) && p.following.some((u) => u.name === me);
      btn.textContent = iFollow ? "Unfollow" : "Follow";
      btn.onclick = async () => {
        btn.disabled = true;
        try {
          if (iFollow) await unfollow(profileName);
          else await follow(profileName);
        } finally {
          btn.disabled = false;
          renderProfile(); // refresh header + button state
        }
      };
    }
  } catch (err) {
    headerEl.innerHTML = `<div class="card">Failed to load profile: <span class="muted">${
      err.message || "Unknown error"
    }</span></div>`;
  }
}

async function renderPosts(reset = false) {
  if (reset) {
    page = 1;
    postsEl.innerHTML = "";
    if (loadMoreBtn) loadMoreBtn.disabled = false;
  }

  // show loading placeholder
  const loadingCard = document.createElement("div");
  loadingCard.className = "card muted";
  loadingCard.textContent = "Loading posts…";
  postsEl.appendChild(loadingCard);

  try {
    const res = await getProfilePosts(profileName, { page, limit: 10 });
    const items = Array.isArray(res.data) ? res.data : res;

    loadingCard.remove();

    if (!items.length && page === 1) {
      postsEl.innerHTML = `<div class="card muted">No posts yet.</div>`;
      if (loadMoreBtn) loadMoreBtn.disabled = true;
      return;
    }

    for (const post of items) {
      const mediaUrl =
        typeof post.media === "string"
          ? post.media?.trim()
          : post.media?.url?.trim();
      const mediaHtml = mediaUrl
        ? `<img class="post-media" src="${mediaUrl}" alt="${
            post.media?.alt || "Post image"
          }"
             onerror="this.onerror=null;this.src='https://placehold.co/800x450?text=Image+not+available';">`
        : "";

      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `
        <a href="/post.html?id=${post.id}"><h3>${post.title ?? "Untitled"}</h3></a>
        ${mediaHtml}
        <p>${post.body ?? ""}</p>
      `;
      postsEl.appendChild(el);
    }

    if (!items.length) {
      if (loadMoreBtn) loadMoreBtn.disabled = true;
    } else {
      page += 1;
    }
  } catch (err) {
    loadingCard.remove();
    postsEl.insertAdjacentHTML(
      "beforeend",
      `<div class="card">Failed to load posts: <span class="muted">${
        err.message || "Unknown error"
      }</span></div>`
    );
    if (loadMoreBtn) loadMoreBtn.disabled = true;
  }
}

// Avatar updater
avatarForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(avatarForm);
  const url = String(fd.get("avatar") || "").trim();
  avatarMsg.textContent = "Saving…";
  try {
    await updateProfile(me, url ? { avatar: url } : { avatar: null });
    avatarMsg.textContent = "Updated ✅";
    await renderProfile();
  } catch (err) {
    avatarMsg.textContent = err.message || "Failed to update avatar";
  }
});

// initial render
await renderProfile();
await renderPosts(true);
loadMoreBtn?.addEventListener("click", () => renderPosts());
