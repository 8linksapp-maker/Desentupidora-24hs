import { v as validateSession } from '../../../../../chunks/auth_-iIfON84.mjs';
import { t as testConnection } from '../../../../../chunks/brevo-api_0AE_hAwD.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );
    if (!await validateSession(cookies["admin_session"])) {
      return json({ success: false, message: "Não autorizado." }, 401);
    }
    const { apiKey } = await request.json();
    if (!apiKey?.trim()) {
      return json({ success: false, message: "Informe a API Key do Brevo." }, 400);
    }
    const result = await testConnection(apiKey.trim());
    return json(result, result.success ? 200 : 400);
  } catch (err) {
    return json({ success: false, message: err.message }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
