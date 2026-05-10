import { a as readPluginsConfig, b as readDataFile, r as readFileFromRepo, w as writeFileToRepo } from '../../../chunks/_server_fsrvt-m8.mjs';
import { s as sendTransactionalEmail } from '../../../chunks/brevo-api_0AE_hAwD.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const MAX_SENDS_PER_RUN = 250;
const GET = async ({ request }) => {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") || "";
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return json({ success: false, message: "Não autorizado." }, 401);
  }
  try {
    const config = readPluginsConfig();
    const sequences = config?.emailList?.sequences ?? [];
    const apiKey = config?.emailList?.brevoApiKey ?? "";
    if (sequences.length === 0) return json({ processed: 0, sent: 0, failed: 0, reason: "no_sequences" });
    if (!apiKey) return json({ processed: 0, sent: 0, failed: 0, reason: "no_api_key" });
    const siteConfig = readDataFile("siteConfig.json", {});
    const senderEmail = siteConfig?.contact?.email ?? "";
    const senderName = siteConfig?.name ?? "Newsletter";
    if (!senderEmail) return json({ processed: 0, sent: 0, failed: 0, reason: "no_sender_email" });
    const subsRaw = await readFileFromRepo("src/data/subscribers.json");
    const subscribers = subsRaw ? JSON.parse(subsRaw) : [];
    if (subscribers.length === 0) return json({ processed: 0, sent: 0, failed: 0, reason: "no_subscribers" });
    const sentRaw = await readFileFromRepo("src/data/emailsSent.json");
    const emailsSent = sentRaw ? JSON.parse(sentRaw) : [];
    const sentSet = new Set(
      emailsSent.filter((r) => r.success).map((r) => `${r.email}::${r.sequenceIndex}`)
    );
    const now = Date.now();
    const MS_PER_DAY = 24 * 60 * 60 * 1e3;
    const newRecords = [];
    let sent = 0;
    let failed = 0;
    let processed = 0;
    outer: for (const sub of subscribers) {
      const subscribedAt = new Date(sub.subscribedAt).getTime();
      if (isNaN(subscribedAt)) continue;
      const daysSince = (now - subscribedAt) / MS_PER_DAY;
      for (let idx = 0; idx < sequences.length; idx++) {
        if (idx >= sequences.length) continue;
        const seq = sequences[idx];
        const key = `${sub.email}::${idx}`;
        if (daysSince < seq.delayDays) continue;
        if (sentSet.has(key)) continue;
        processed++;
        if (sent >= MAX_SENDS_PER_RUN) break outer;
        const htmlContent = seq.body.split("\n").map((line) => `<p>${line}</p>`).join("");
        const result = await sendTransactionalEmail(
          apiKey,
          sub.email,
          seq.subject,
          htmlContent,
          senderEmail,
          senderName
        );
        const record = {
          email: sub.email,
          sequenceIndex: idx,
          sentAt: (/* @__PURE__ */ new Date()).toISOString(),
          success: result.success
        };
        newRecords.push(record);
        sentSet.add(key);
        if (result.success) {
          sent++;
        } else {
          failed++;
        }
      }
    }
    if (newRecords.length > 0) {
      const updated = [...emailsSent, ...newRecords];
      await writeFileToRepo(
        "src/data/emailsSent.json",
        JSON.stringify(updated, null, 2),
        { message: `Cron: email sequences — ${sent} sent, ${failed} failed` }
      );
    }
    return json({ processed, sent, failed });
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
