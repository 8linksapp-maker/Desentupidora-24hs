export { renderers } from '../../../renderers.mjs';

const prerender = false;
const COOKIE_NAME = "admin_session";
function buildClearCookieHeaders() {
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  return [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=${expired}`
  ];
}
function redirectResponse() {
  const headers = new Headers();
  headers.set("Location", "/admin/login");
  for (const cookie of buildClearCookieHeaders()) {
    headers.append("Set-Cookie", cookie);
  }
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Clear-Site-Data", '"cookies", "storage"');
  return new Response(null, { status: 302, headers });
}
const GET = async () => redirectResponse();
const POST = async () => redirectResponse();

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
