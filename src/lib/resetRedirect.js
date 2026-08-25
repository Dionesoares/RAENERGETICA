// Remembers which login page (admin site vs. technician area) should receive
// the user after they finish the password reset flow. The reset email link
// itself can't carry app-specific params, so we stash the intended
// destination locally before requesting the reset and read it back on
// ResetPassword.jsx after success.
const KEY = "auth_reset_redirect";

export function setResetRedirect(path) {
  localStorage.setItem(KEY, path);
}

export function consumeResetRedirect() {
  const path = localStorage.getItem(KEY) || "/login";
  localStorage.removeItem(KEY);
  return path;
}