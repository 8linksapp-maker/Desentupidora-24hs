import { v as validateSession } from '../../../../../chunks/auth_-iIfON84.mjs';
import { r as readFileFromRepo } from '../../../../../chunks/_server_fsrvt-m8.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
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
      return json({ error: "Não autorizado." }, 401);
    }
    const raw = await readFileFromRepo("src/data/subscribers.json");
    const subscribers = raw ? JSON.parse(raw) : [];
    return json({ subscribers });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
