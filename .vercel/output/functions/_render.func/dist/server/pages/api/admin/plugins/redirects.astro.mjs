import { b as readDataFile, w as writeFileToRepo, r as readFileFromRepo } from '../../../../chunks/_server_fsrvt-m8.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const REDIRECTS_PATH = "src/data/redirects.json";
const VERCEL_JSON_PATH = "vercel.json";
function toPath(input) {
  if (!input) return input;
  const v = String(input).trim();
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      return (u.pathname + u.search + u.hash).replace(/\/+$/, "") || "/";
    } catch {
      return v;
    }
  }
  return v.startsWith("/") ? v : "/" + v;
}
function sanitizeRedirects(list) {
  return (list || []).map((r) => ({
    ...r,
    from: r?.from ? toPath(r.from) : r?.from,
    to: r?.to ? toPath(r.to) : r?.to
  }));
}
async function syncVercelJson(redirects) {
  try {
    let vercelConfig = {};
    const existing = await readFileFromRepo(VERCEL_JSON_PATH);
    if (existing) {
      try {
        vercelConfig = JSON.parse(existing);
      } catch {
      }
    }
    const vercelRedirects = redirects.filter((r) => r.enabled && r.from && r.to).map((r) => ({
      source: toPath(r.from),
      destination: toPath(r.to),
      permanent: r.type === 301
    }));
    vercelConfig.redirects = vercelRedirects;
    await writeFileToRepo(VERCEL_JSON_PATH, JSON.stringify(vercelConfig, null, 2), {
      message: "CMS: Sync redirects to vercel.json"
    });
  } catch {
  }
}
const GET = async () => {
  try {
    const redirects = readDataFile(REDIRECTS_PATH.split("/").pop(), []);
    return new Response(JSON.stringify(redirects), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
const PUT = async ({ request }) => {
  try {
    const body = await request.json();
    const sanitized = sanitizeRedirects(Array.isArray(body) ? body : []);
    const ok = await writeFileToRepo(REDIRECTS_PATH, JSON.stringify(sanitized, null, 2), {
      message: "CMS: Update redirects"
    });
    if (!ok) return new Response(JSON.stringify({ error: "Falha ao salvar" }), { status: 500 });
    await syncVercelJson(sanitized);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    PUT,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
