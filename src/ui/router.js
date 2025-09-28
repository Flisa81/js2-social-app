import { getUser, clearUser } from "./state.js";

/**
 * Redirect to login.html if there is no logged-in user.
 */
export function requireAuth() {
  if (!getUser()) {
    // relative path (works when deployed in a subfolder)
    location.href = "login.html";
  }
}

/**
 * Clear user session and go to login page.
 */
export function logout() {
  clearUser();
  location.href = "login.html";
}

/**
 * Read a query parameter from the current URL.
 * @param {string} key
 * @returns {string|null}
 */
export function qp(key) {
  return new URL(location.href).searchParams.get(key);
}
