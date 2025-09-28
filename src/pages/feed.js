import { requireAuth } from "../ui/router.js";
import { initNav } from "../ui/nav.js";
import { postCard } from "../ui/templates.js";
import { createPost, getPosts } from "../api/posts.js";

requireAuth();
initNav();

const feedEl = document.getElementById("feed");
const feedMsg = document.getElementById("feedMsg"); // optional status <output>
const skel = document.getElementById("feedSkeleton"); // optional skeleton section
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let state = { page: 1, limit: 10, q: "", sort: "newest", loading: false, end: false };

async function load(reset = false) {
  if (state.loading || (state.end && !reset)) return;

  state.loading = true;
  loadMoreBtn.disabled = true;
  feedMsg && (feedMsg.textContent = reset ? "Loading…" : "");
  skel && skel.classList.remove("hidden");

  if (reset) {
    state.page = 1;
    state.end = false;
    feedEl.innerHTML = "";
  }

  try {
    const res = await getPosts({
      page: state.page,
      limit: state.limit,
      q: state.q,
      sort: state.sort === "oldest" ? "asc" : "desc",
    });

    const items = Array.isArray(res.data) ? res.data : res;
    if (!items.length) {
      if (state.page === 1) {
        feedEl.innerHTML = `<div class="card muted">No posts found. Try another search or create the first post!</div>`;
      }
      state.end = true;
    } else {
      for (const post of items) {
        feedEl.insertAdjacentHTML("beforeend", postCard(post));
      }
      state.page += 1;
    }
  } catch (err) {
    if (feedMsg) feedMsg.textContent = err.message || "Failed to load posts";
  } finally {
    state.loading = false;
    loadMoreBtn.disabled = state.end;
    skel && skel.classList.add("hidden");
  }
}

// initial load
load();

loadMoreBtn?.addEventListener("click", () => load());

let t;
searchInput?.addEventListener("input", () => {
  clearTimeout(t);
  t = setTimeout(() => {
    state.q = searchInput.value.trim();
    load(true);
  }, 300);
});

sortSelect?.addEventListener("change", () => {
  state.sort = sortSelect.value;
  load(true);
});

// Create post
const createForm = document.getElementById("createPostForm");
const createMsg = document.getElementById("createMsg");

createForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(createForm);
  createMsg.textContent = "Posting…";
  try {
    await createPost({
      title: fd.get("title"),
      body: fd.get("body"),
      media: fd.get("media") || undefined,
    });
    createForm.reset();
    createMsg.textContent = "Posted!";
    load(true);
  } catch (err) {
    createMsg.textContent = err.message || "Failed to post";
  }
});
