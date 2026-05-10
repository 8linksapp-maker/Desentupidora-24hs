import { v as validateSession } from '../../../../../chunks/auth_-iIfON84.mjs';
import { a as readPluginsConfig, b as readDataFile } from '../../../../../chunks/_server_fsrvt-m8.mjs';
import { s as sendTransactionalEmail } from '../../../../../chunks/brevo-api_0AE_hAwD.mjs';
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
    const { to, subject, htmlContent } = await request.json();
    if (!to || !subject || !htmlContent) {
      return json({ success: false, message: "Campos obrigatórios: to, subject, htmlContent." }, 400);
    }
    const config = readPluginsConfig();
    const apiKey = config?.emailList?.brevoApiKey;
    if (!apiKey) {
      return json({ success: false, message: "API Key do Brevo não configurada." }, 400);
    }
    const siteConfig = readDataFile("siteConfig.json", {});
    const senderName = siteConfig?.name || "Newsletter";
    const senderEmail = siteConfig?.contact?.email;
    if (!senderEmail) {
      return json({ success: false, message: "Email do remetente não configurado em siteConfig.contact.email." }, 400);
    }
    const result = await sendTransactionalEmail(
      apiKey,
      to,
      subject,
      htmlContent,
      senderEmail,
      senderName
    );
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
