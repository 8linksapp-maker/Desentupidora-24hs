import { b as readDataFile } from '../../../../../chunks/_server_fsrvt-m8.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  try {
    const path = url.searchParams.get("path");
    if (!path) {
      return new Response(JSON.stringify({ error: "path obrigatório" }), { status: 400 });
    }
    const siteConfig = readDataFile("siteConfig.json", { url: "" });
    const siteUrl = siteConfig.url?.replace(/\/$/, "") || url.origin;
    const testUrl = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const res = await fetch(testUrl, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": "RedirectTester/1.0" }
    });
    const location = res.headers.get("location") || "";
    const isRedirect = res.status >= 300 && res.status < 400;
    return new Response(JSON.stringify({
      ok: isRedirect,
      status: res.status,
      location,
      tested: testUrl
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, status: 0, error: err.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
