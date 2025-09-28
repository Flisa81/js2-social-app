// /src/ui/templates.js

/** Escape for HTML output */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Render one post card used on the feed */
export function postCard(post) {
  const date = post.created ? new Date(post.created).toLocaleString() : "";
  const authorName = post.author?.name ?? "Unknown";
  const authorHtml =
    authorName !== "Unknown"
      ? `<a href="/profile.html?name=${encodeURIComponent(authorName)}">${escapeHtml(authorName)}</a>`
      : "Unknown";

  // Accept both the old string format and the new { url, alt } object
  const raw = post.media;
  const mediaUrl = typeof raw === "string" ? raw?.trim() : raw?.url?.trim();
  const mediaAlt = raw?.alt || "Post image";

  // If there’s a URL, render the <img>. If it 404s, swap to a placeholder.
  // If there’s no URL at all, show a neutral placeholder.
  const mediaHtml = mediaUrl
    ? `
      <img
        class="post-media"
        src="${mediaUrl}"
        alt="${escapeHtml(mediaAlt)}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/800x450?text=Image+not+available';"
      >`
    : `
      <img
        class="post-media"
        src="https://placehold.co/800x450?text=No+Image"
        alt="No image"
        loading="lazy"
      >`;

  return `
    <article class="card post-card">
      <a href="/post.html?id=${post.id}">
        <h3>${escapeHtml(post.title || "Untitled")}</h3>
      </a>
      <div class="post-meta">by ${authorHtml} • ${date}</div>
      ${mediaHtml}
      <p>${escapeHtml(post.body || "")}</p>
    </article>
  `;
}
