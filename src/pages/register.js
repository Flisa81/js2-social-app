import { register } from "../api/auth.js";
import { getUser } from "../ui/state.js";
import { initNav } from "../ui/nav.js";

initNav();

// If already logged in, skip registration
if (getUser()) {
  location.href = "/feed.html";
}

const form = document.getElementById("registerForm");
const msg = document.getElementById("registerMsg");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Creating account…";

  const fd = new FormData(form);
  const name = fd.get("name");
  const email = fd.get("email");
  const password = fd.get("password");

  try {
    await register({ name, email, password });
    msg.textContent = "✅ Account created. Redirecting to login…";
    setTimeout(() => {
      location.href = "/login.html";
    }, 1000);
  } catch (err) {
    msg.textContent = err.message || "Registration failed";
  }
});
