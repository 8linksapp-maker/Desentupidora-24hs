import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Trash2, Plus, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const CONFIG_PATH = "src/data/pluginsConfig.json";
function SettingsSEO() {
  const [enabled, setEnabled] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [sameAs, setSameAs] = useState([""]);
  const [articleSchema, setArticleSchema] = useState(true);
  const [breadcrumbSchema, setBreadcrumbSchema] = useState(true);
  const [websiteSchema, setWebsiteSchema] = useState(true);
  const [fileSha, setFileSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    githubApi("read", CONFIG_PATH).then((data) => {
      const config = JSON.parse(data.content);
      setFullConfig(config);
      setFileSha(data.sha);
      const sc = config?.seo;
      if (sc) {
        setEnabled(sc.enabled !== false);
        setOrgName(sc.orgName || "");
        setOrgLogo(sc.orgLogo || "");
        setSameAs(sc.sameAs?.length ? sc.sameAs : [""]);
        setArticleSchema(sc.articleSchema !== false);
        setBreadcrumbSchema(sc.breadcrumbSchema !== false);
        setWebsiteSchema(sc.websiteSchema !== false);
      }
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const addSameAs = () => setSameAs((prev) => [...prev, ""]);
  const removeSameAs = (i) => setSameAs((prev) => prev.filter((_, idx) => idx !== i));
  const updateSameAs = (i, val) => setSameAs((prev) => prev.map((v, idx) => idx === i ? val : v));
  const handleSave = async () => {
    setSaving(true);
    setError("");
    triggerToast("Salvando configuração de SEO...", "progress", 30);
    try {
      const cleanSameAs = sameAs.filter((s) => s.trim());
      const updated = {
        ...fullConfig,
        seo: { enabled, orgName, orgLogo, sameAs: cleanSameAs, articleSchema, breadcrumbSchema, websiteSchema }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update SEO settings"
      });
      setFileSha(res.sha || fileSha);
      setFullConfig(updated);
      triggerToast("SEO Toolkit configurado!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando configuração..." })
  ] });
  if (error && !fullConfig) return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 text-red-700 p-8 rounded-3xl border border-red-200 flex gap-4 items-start", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 shrink-0" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: "Erro de Leitura" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between cursor-pointer", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Ativar SEO Toolkit" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Injeta JSON-LD structured data nos artigos" })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => setEnabled(!enabled),
          className: `relative w-12 h-6 rounded-full transition-colors cursor-pointer ${enabled ? "bg-violet-600" : "bg-slate-200"}`,
          children: /* @__PURE__ */ jsx("div", { className: `absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? "left-7" : "left-1"}` })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Dados da Organização" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 -mt-2", children: "Usados nos schemas Publisher e WebSite" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "Nome da Organização / Site" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: orgName, onChange: (e) => setOrgName(e.target.value), className: inputClass, placeholder: "Meu Blog" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "URL do Logo" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: orgLogo, onChange: (e) => setOrgLogo(e.target.value), className: inputClass, placeholder: "https://meusite.com/logo.png ou /logo.png" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "Perfis Sociais (sameAs)" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mb-3", children: "URLs dos perfis sociais da organização" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: sameAs.map((url, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              value: url,
              onChange: (e) => updateSameAs(i, e.target.value),
              className: inputClass,
              placeholder: "https://facebook.com/seuperfil"
            }
          ),
          sameAs.length > 1 && /* @__PURE__ */ jsx("button", { onClick: () => removeSameAs(i), className: "p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("button", { onClick: addSameAs, className: "mt-2 flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          " Adicionar perfil"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-4", children: "Tipos de Schema" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
        { label: "Article Schema", desc: "Dados do artigo, autor e editor", val: articleSchema, set: setArticleSchema },
        { label: "BreadcrumbList Schema", desc: "Trilha de navegação (Home > Categoria > Post)", val: breadcrumbSchema, set: setBreadcrumbSchema },
        { label: "WebSite Schema", desc: "Dados do site com SearchAction", val: websiteSchema, set: setWebsiteSchema }
      ].map(({ label, desc, val, set }) => /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer hover:bg-violet-50 transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: label }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: desc })
        ] }),
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: val, onChange: (e) => set(e.target.checked), className: "rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4" })
      ] }, label)) })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleSave,
        disabled: saving,
        className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20",
        children: [
          saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          saving ? "Salvando..." : "Salvar Configuração"
        ]
      }
    )
  ] });
}

const prerender = false;
const $$Seo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "SEO Toolkit", "activeSection": "seo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">SEO Toolkit</h1> <p class="text-slate-500 mt-1">Configure dados estruturados (JSON-LD) para melhorar o ranqueamento nos motores de busca.</p> </div> ${renderComponent($$result2, "SettingsSEO", SettingsSEO, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/seo/SettingsSEO", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/seo.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/seo.astro";
const $$url = "/admin/seo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Seo,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
