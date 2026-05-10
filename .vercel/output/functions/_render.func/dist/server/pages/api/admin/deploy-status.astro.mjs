export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    const token = "".trim();
    const owner = "".trim();
    const repo = "".trim();
    if (!token || !owner || !repo) {
      return new Response(JSON.stringify({ state: "idle" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json"
    };
    const deploymentsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/deployments?per_page=1&environment=Production`,
      { headers }
    );
    if (!deploymentsRes.ok) {
      return new Response(JSON.stringify({ state: "idle" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deployments = await deploymentsRes.json();
    if (deployments.length === 0) {
      return new Response(JSON.stringify({ state: "idle" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deployment = deployments[0];
    const statusRes = await fetch(deployment.statuses_url, { headers });
    if (!statusRes.ok) {
      return new Response(JSON.stringify({ state: "idle" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const statuses = await statusRes.json();
    const latest = statuses[0];
    if (!latest) {
      return new Response(JSON.stringify({
        state: "building",
        updatedAt: deployment.created_at
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    let state = "idle";
    if (latest.state === "pending" || latest.state === "in_progress" || latest.state === "queued") {
      state = "building";
    } else if (latest.state === "success") {
      const deployedAt = new Date(latest.created_at).getTime();
      const fiveMinAgo = Date.now() - 5 * 60 * 1e3;
      state = deployedAt > fiveMinAgo ? "ready" : "idle";
    } else if (latest.state === "failure" || latest.state === "error") {
      const deployedAt = new Date(latest.created_at).getTime();
      const fiveMinAgo = Date.now() - 5 * 60 * 1e3;
      state = deployedAt > fiveMinAgo ? "error" : "idle";
    }
    return new Response(JSON.stringify({
      state,
      url: latest.target_url || latest.log_url || "",
      updatedAt: latest.created_at,
      environment: deployment.environment
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ state: "idle" }), {
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
