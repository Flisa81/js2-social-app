import { login } from "../api/auth.js";
import { getUser } from "../ui/state.js";
import { initNav } from "../ui/nav.js";

initNav();

// If already logged in, send to feed
if (getUser()) {
  location.href = "/feed.html";
}

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Logging in…";

  const fd = new FormData(form);
  const email = fd.get("email");
  const password = fd.get("password");

  try {
    await login({ email, password });
    location.href = "/feed.html";
  } catch (err) {
    msg.textContent = err.message || "Login failed";
  }
});
