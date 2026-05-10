import { d as defineMiddleware, s as sequence } from './chunks/index_BHTAEMrQ.mjs';
import { C as COOKIE_NAME_EXPORT, v as validateSession } from './chunks/auth_-iIfON84.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BDe6Vrzs.mjs';
import 'piccolore';
import './chunks/astro/server_DviA_9aL.mjs';
import 'clsx';

let redirectsCache = null;
let redirectsCacheAt = 0;
const CACHE_TTL = 6e4;
function getRedirects() {
  const now = Date.now();
  if (redirectsCache && now - redirectsCacheAt < CACHE_TTL) return redirectsCache;
  try {
    const raw = readFileSync(resolve(process.cwd(), "src/data/redirects.json"), "utf-8");
    redirectsCache = JSON.parse(raw);
    redirectsCacheAt = now;
    return redirectsCache;
  } catch {
    redirectsCache = [];
    redirectsCacheAt = now;
    return [];
  }
}
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    const redirects = getRedirects();
    for (const r of redirects) {
      const normFrom = r.from?.replace(/\/+$/, "") || "";
      const normPath = pathname.replace(/\/+$/, "") || "/";
      if (r.enabled && normFrom && r.to && (normFrom === normPath || r.from === pathname)) {
        return context.redirect(r.to, r.type || 301);
      }
    }
  }
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return next();
  }
  if (pathname === "/admin/login") {
    return next();
  }
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    return next();
  }
  const cookieHeader = context.request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
  const sessionCookie = cookies[COOKIE_NAME_EXPORT];
  const valid = await validateSession(sessionCookie);
  if (!valid) {
    if (pathname.startsWith("/api/admin/")) {
      return new Response(JSON.stringify({ error: "Não autorizado. Faça login." }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    return context.redirect("/admin/login");
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
