import { c as createSession } from '../../../chunks/auth_-iIfON84.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const COOKIE_NAME = "admin_session";
const EXPIRES_SEC = 7 * 24 * 60 * 60;
const POST = async ({ request }) => {
  try {
    const { password } = await request.json();
    if (!password) {
      return new Response(JSON.stringify({ error: "Senha obrigatória." }), { status: 400 });
    }
    const session = await createSession(password);
    if (!session) {
      return new Response(JSON.stringify({ error: "Senha incorreta." }), { status: 401 });
    }
    const cookieValue = `${COOKIE_NAME}=${encodeURIComponent(session)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${EXPIRES_SEC}`;
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieValue
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
