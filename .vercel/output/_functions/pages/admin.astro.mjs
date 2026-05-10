import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { FileText, CheckCircle, FileEdit, Users, Loader2 } from 'lucide-react';
import { g as githubApi } from '../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../renderers.mjs';

function CmsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalAuthors: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        let tPosts = 0, pubPosts = 0, drfPosts = 0;
        try {
          const postData = await githubApi("list", "src/content/blog");
          if (Array.isArray(postData.data)) {
            const mds = postData.data.filter((f) => f.name.endsWith(".md"));
            tPosts = mds.length;
            await Promise.all(mds.map(async (f) => {
              try {
                const fileData = await githubApi("read", f.path);
                const text = fileData.content;
                const draftMatch = text.match(/draft:\s*(true|false)/i);
                if (draftMatch && draftMatch[1].toLowerCase() === "true") drfPosts++;
                else pubPosts++;
              } catch {
                pubPosts++;
              }
            }));
          }
        } catch {
        }
        let tAuthors = 0;
        try {
          const data = await githubApi("read", "src/data/authors.json");
          const parsed = JSON.parse(data?.content || "{}");
          tAuthors = Array.isArray(parsed) ? parsed.length : 0;
        } catch {
        }
        setStats({ totalPosts: tPosts, publishedPosts: pubPosts, draftPosts: drfPosts, totalAuthors: tAuthors });
      } catch (e) {
        console.error("Erro ao puxar stats:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  const statItems = [
    { label: "Total de artigos", value: stats.totalPosts, icon: FileText },
    { label: "Publicados", value: stats.publishedPosts, icon: CheckCircle },
    { label: "Rascunhos", value: stats.draftPosts, icon: FileEdit },
    { label: "Equipe", value: stats.totalAuthors, icon: Users }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3", children: "Estatísticas" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: statItems.map(({ label, value, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-400", children: label }),
        /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-violet-400 shrink-0" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-slate-900 leading-none", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-slate-200 mt-1" }) : value })
    ] }, label)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      { label: "Novo Artigo", href: "/admin/posts/new", desc: "Escrever e publicar um novo post", color: "violet" },
      { label: "Ver Artigos", href: "/admin/posts", desc: "Gerenciar todos os artigos", color: "slate" },
      { label: "Configurações", href: "/admin/config", desc: "Nome do site, cores e fontes", color: "slate" }
    ].map((item) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: item.href,
        className: `p-5 rounded-xl border transition-all hover:-translate-y-0.5 ${item.color === "violet" ? "bg-violet-600 border-violet-500 text-white hover:bg-violet-700" : "bg-white border-slate-200 text-slate-700 hover:border-violet-200 hover:shadow-sm"}`,
        children: [
          /* @__PURE__ */ jsx("p", { className: `font-bold text-sm ${item.color === "violet" ? "text-white" : "text-slate-800"}`, children: item.label }),
          /* @__PURE__ */ jsx("p", { className: `text-xs mt-1 ${item.color === "violet" ? "text-violet-200" : "text-slate-500"}`, children: item.desc })
        ]
      },
      item.href
    )) })
  ] });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard", "activeSection": "dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1> <p class="text-slate-500 mt-1">Bem-vindo ao painel admin do seu blog.</p> </div> ${renderComponent($$result2, "CmsDashboard", CmsDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/CmsDashboard", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/index.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
