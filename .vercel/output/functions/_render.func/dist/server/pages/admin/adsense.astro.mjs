import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const CONFIG_PATH = "src/data/pluginsConfig.json";
function SettingsAdSense() {
  const [publisherId, setPublisherId] = useState("");
  const [fileSha, setFileSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    githubApi("read", CONFIG_PATH).then((data) => {
      const config = JSON.parse(data.content);
      setFullConfig(config);
      setFileSha(data.sha);
      setPublisherId(config?.adsense?.publisherId || "");
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    triggerToast("Salvando configuração do AdSense...", "progress", 30);
    try {
      const updated = {
        ...fullConfig,
        adsense: { publisherId: publisherId.trim() }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update AdSense publisher ID"
      });
      setFileSha(res.sha || fileSha);
      setFullConfig(updated);
      setSaved(true);
      triggerToast("AdSense configurado!", "success", 100);
      setTimeout(() => setSaved(false), 3e3);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm font-mono";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const isValid = publisherId.startsWith("ca-pub-");
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
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-1", children: "Publisher ID" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mb-4", children: [
        "Encontre seu Publisher ID no painel do AdSense em",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-mono text-violet-600", children: "Conta → Informações da conta" }),
        ". O formato é ",
        /* @__PURE__ */ jsx("span", { className: "font-mono font-bold", children: "ca-pub-XXXXXXXXXXXXXXXX" }),
        "."
      ] }),
      /* @__PURE__ */ jsx("label", { className: labelClass, children: "Google AdSense Publisher ID" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: publisherId,
          onChange: (e) => setPublisherId(e.target.value),
          placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
          className: inputClass
        }
      ),
      publisherId && !isValid && /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-2 ml-1", children: 'O Publisher ID deve começar com "ca-pub-".' })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-slate-200 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Status" }),
        isValid ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-green-600 font-semibold", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
          " Configurado"
        ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: publisherId ? "ID inválido" : "Não configurado" })
      ] }),
      isValid && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm mt-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "ID ativo" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-slate-700", children: publisherId })
      ] })
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
          saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : saved ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          saving ? "Salvando..." : saved ? "Salvo!" : "Salvar Configuração"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-2xl border border-blue-200 p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-blue-700 uppercase tracking-widest mb-3", children: "Como configurar" }),
      /* @__PURE__ */ jsx("ol", { className: "space-y-2", children: [
        "Acesse adsense.google.com e crie ou entre na sua conta",
        "No menu lateral, vá em Conta → Informações da conta",
        "Copie o Publisher ID (formato ca-pub-XXXXXXXXXXXXXXXX)",
        'Cole aqui e clique em "Salvar Configuração"',
        "O script AdSense auto-ads será inserido no <head> de todas as páginas",
        "O Google configurará automaticamente os locais dos anúncios"
      ].map((step, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5 text-sm text-blue-800", children: [
        /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5", children: i + 1 }),
        step
      ] }, i)) })
    ] })
  ] });
}

const prerender = false;
const $$Adsense = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Google AdSense", "activeSection": "adsense" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Google AdSense</h1> <p class="text-slate-500 mt-1">Configure a monetização com Google AdSense auto-ads.</p> </div> ${renderComponent($$result2, "SettingsAdSense", SettingsAdSense, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/adsense/SettingsAdSense", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/adsense.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/adsense.astro";
const $$url = "/admin/adsense";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Adsense,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
