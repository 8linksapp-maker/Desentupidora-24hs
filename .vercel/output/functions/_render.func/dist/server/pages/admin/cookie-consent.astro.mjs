import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const CONFIG_PATH = "src/data/pluginsConfig.json";
function SettingsCookieConsent() {
  const [enabled, setEnabled] = useState(true);
  const [headline, setHeadline] = useState("Privacidade e Cookies");
  const [description, setDescription] = useState('Utilizamos cookies para melhorar sua experiência. Ao clicar em "Aceitar", você concorda com nossa política de privacidade.');
  const [buttonAccept, setButtonAccept] = useState("Aceitar");
  const [buttonReject, setButtonReject] = useState("Ler Política");
  const [rejectUrl, setRejectUrl] = useState("/privacidade");
  const [position, setPosition] = useState("bottom");
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
      const cc = config?.cookieConsent;
      if (cc) {
        setEnabled(cc.enabled !== false);
        setHeadline(cc.headline || "Privacidade e Cookies");
        setDescription(cc.description || 'Utilizamos cookies para melhorar sua experiência. Ao clicar em "Aceitar", você concorda com nossa política de privacidade.');
        setButtonAccept(cc.buttonAccept || "Aceitar");
        setButtonReject(cc.buttonReject || "Ler Política");
        setRejectUrl(cc.rejectUrl || "/privacidade");
        setPosition(cc.position || "bottom");
      }
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setError("");
    triggerToast("Salvando configuração de cookies...", "progress", 30);
    try {
      const updated = {
        ...fullConfig,
        cookieConsent: { enabled, headline, description, buttonAccept, buttonReject, rejectUrl, position }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update Cookie Consent settings"
      });
      setFileSha(res.sha || fileSha);
      setFullConfig(updated);
      triggerToast("Cookie Consent configurado!", "success", 100);
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
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Ativar Banner de Cookies" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Exibe o aviso de cookies para novos visitantes (LGPD)" })
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
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Textos do Banner" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: headline, onChange: (e) => setHeadline(e.target.value), className: inputClass, placeholder: "Privacidade e Cookies" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descrição" }),
        /* @__PURE__ */ jsx("textarea", { rows: 3, value: description, onChange: (e) => setDescription(e.target.value), className: `${inputClass} resize-none`, placeholder: "Utilizamos cookies..." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Botão Aceitar" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: buttonAccept, onChange: (e) => setButtonAccept(e.target.value), className: inputClass, placeholder: "Aceitar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Botão Recusar/Política" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: buttonReject, onChange: (e) => setButtonReject(e.target.value), className: inputClass, placeholder: "Ler Política" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "URL do Botão Recusar" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: rejectUrl, onChange: (e) => setRejectUrl(e.target.value), className: inputClass, placeholder: "/privacidade" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-4", children: "Posição do Banner" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: ["bottom", "top"].map((pos) => /* @__PURE__ */ jsxs("label", { className: `flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${position === pos ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`, children: [
        /* @__PURE__ */ jsx("input", { type: "radio", name: "position", value: pos, checked: position === pos, onChange: () => setPosition(pos), className: "sr-only" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold capitalize", children: pos === "bottom" ? "Rodapé" : "Topo" })
      ] }, pos)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-2xl border border-blue-200 p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-blue-700 uppercase tracking-widest mb-2", children: "Integração automática" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-800", children: "Quando ativado, o Google Analytics e Meta Pixel são bloqueados até o visitante aceitar os cookies. Isso garante conformidade com a LGPD." })
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
const $$CookieConsent = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Cookie Consent / LGPD", "activeSection": "cookie-consent" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Cookie Consent / LGPD</h1> <p class="text-slate-500 mt-1">Configure o banner de consentimento de cookies para conformidade com a LGPD.</p> </div> ${renderComponent($$result2, "SettingsCookieConsent", SettingsCookieConsent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/cookie-consent/SettingsCookieConsent", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/cookie-consent.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/cookie-consent.astro";
const $$url = "/admin/cookie-consent";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CookieConsent,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
