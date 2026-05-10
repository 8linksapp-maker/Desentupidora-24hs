const COOKIE_NAME = "admin_session";
const EXPIRES_MS = 7 * 24 * 60 * 60 * 1e3;
async function hmac(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function createSession(password) {
  const secret = "25939451";
  if (password !== secret) return null;
  const expires = Date.now() + EXPIRES_MS;
  const payload = `${expires}`;
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}
async function validateSession(cookieValue) {
  if (!cookieValue) return false;
  const secret = "25939451";
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;
  const [expStr, sig] = parts;
  const expires = parseInt(expStr, 10);
  if (isNaN(expires) || Date.now() > expires) return false;
  const expected = await hmac(secret, expStr);
  return expected === sig;
}
const COOKIE_NAME_EXPORT = COOKIE_NAME;

export { COOKIE_NAME_EXPORT as C, createSession as c, validateSession as v };
