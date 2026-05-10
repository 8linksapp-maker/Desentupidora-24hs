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
      return json({ success: false, message: "Não autorizado." }, 401);
    }
    const raw = await readFileFromRepo("src/data/emailsSent.json");
    const emailsSent = raw ? JSON.parse(raw) : [];
    const statsMap = /* @__PURE__ */ new Map();
    for (const record of emailsSent) {
      const idx = record.sequenceIndex;
      const existing = statsMap.get(idx) ?? { sent: 0, failed: 0, lastSentAt: "" };
      if (record.success) {
        existing.sent++;
      } else {
        existing.failed++;
      }
      if (!existing.lastSentAt || record.sentAt > existing.lastSentAt) {
        existing.lastSentAt = record.sentAt;
      }
      statsMap.set(idx, existing);
    }
    const stats = Array.from(statsMap.entries()).sort(([a], [b]) => a - b).map(([sequenceIndex, data]) => ({ sequenceIndex, ...data }));
    const lastRunAt = emailsSent.length > 0 ? emailsSent.reduce((max, r) => r.sentAt > max ? r.sentAt : max, "") : null;
    return json({ stats, lastRunAt });
  } catch (err) {
    return json({ success: false, message: err.message }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
