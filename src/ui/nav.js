// /src/ui/nav.js

import { getUser } from "./state.js";
import { logout } from "./router.js";

/**
 * Initialize the top nav visibility and handlers.
 * Call this on every page after the DOM exists.
 */
export function initNav() {
  const user = getUser();
  const login = document.getElementById("navLogin");
  const reg = document.getElementById("navRegister");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    login?.classList.add("hidden");
    reg?.classList.add("hidden");
    logoutBtn?.classList.remove("hidden");
    // avoid double-binding
    logoutBtn?.replaceWith(logoutBtn.cloneNode(true));
    const freshLogout = document.getElementById("logoutBtn");
    freshLogout?.addEventListener("click", logout);
  } else {
    login?.classList.remove("hidden");
    reg?.classList.remove("hidden");
    logoutBtn?.classList.add("hidden");
  }
}
