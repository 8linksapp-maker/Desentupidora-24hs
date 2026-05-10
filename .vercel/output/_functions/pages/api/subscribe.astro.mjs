import { r as readFileFromRepo, w as writeFileToRepo, a as readPluginsConfig } from '../../chunks/_server_fsrvt-m8.mjs';
import { a as addContact } from '../../chunks/brevo-api_0AE_hAwD.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const rateLimitMap = /* @__PURE__ */ new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1e3;
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
const POST = async ({ request }) => {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return json({ error: "Muitas tentativas. Tente novamente mais tarde." }, 429);
    }
    const body = await request.json().catch(() => null);
    if (!body) return json({ error: "Body inválido." }, 400);
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim();
    const source = body.source || "widget";
    if (!email) return json({ error: "Email é obrigatório." }, 400);
    if (!isValidEmail(email)) return json({ error: "Email inválido." }, 400);
    const raw = await readFileFromRepo("src/data/subscribers.json");
    let subscribers = [];
    try {
      subscribers = raw ? JSON.parse(raw) : [];
    } catch {
      subscribers = [];
    }
    const exists = subscribers.some((s) => s.email === email);
    if (exists) {
      return json({ success: true, message: "Você já está inscrito!" });
    }
    const newSub = {
      email,
      name,
      subscribedAt: (/* @__PURE__ */ new Date()).toISOString(),
      source,
      tags: []
    };
    subscribers.push(newSub);
    await writeFileToRepo(
      "src/data/subscribers.json",
      JSON.stringify(subscribers, null, 2),
      { message: `Newsletter: new subscriber ${email}` }
    );
    const config = readPluginsConfig();
    const emailListConfig = config?.emailList;
    if (emailListConfig?.brevoApiKey && emailListConfig?.brevoListId) {
      await addContact(
        emailListConfig.brevoApiKey,
        email,
        Number(emailListConfig.brevoListId),
        name || void 0
      ).catch(() => null);
    }
    return json({ success: true, message: "Inscrito com sucesso!" });
  } catch (err) {
    return json({ error: err.message || "Erro interno." }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
