import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const CONFIG_PATH = "src/data/pluginsConfig.json";
const PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "twitter", label: "Twitter/X", icon: "🐦" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "telegram", label: "Telegram", icon: "✈️" },
  { id: "pinterest", label: "Pinterest", icon: "📌" },
  { id: "copy", label: "Copiar Link", icon: "🔗" }
];
const STYLES = [
  { id: "icon", label: "Apenas ícones" },
  { id: "label", label: "Apenas texto" },
  { id: "both", label: "Ícone + texto" }
];
function SettingsSocialShare() {
  const [enabled, setEnabled] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("Compartilhe nas redes sociais");
  const [platforms, setPlatforms] = useState(["facebook", "twitter", "whatsapp", "linkedin", "telegram", "copy"]);
  const [style, setStyle] = useState("icon");
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
      const sc = config?.socialShare;
      if (sc) {
        setEnabled(sc.enabled !== false);
        setSectionTitle(sc.sectionTitle ?? "Compartilhe nas redes sociais");
        setPlatforms(sc.platforms || ["facebook", "twitter", "whatsapp", "linkedin", "telegram", "copy"]);
        setStyle(sc.style || "icon");
      }
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const togglePlatform = (id) => {
    setPlatforms(
      (prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
  const handleSave = async () => {
    setSaving(true);
    setError("");
    triggerToast("Salvando configuração de compartilhamento...", "progress", 30);
    try {
      const updated = {
        ...fullConfig,
        socialShare: { enabled, sectionTitle, platforms, style }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update Social Share settings"
      });
      setFileSha(res.sha || fileSha);
      setFullConfig(updated);
      triggerToast("Compartilhamento configurado!", "success", 100);
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
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Ativar Compartilhamento" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Exibe botões de share nos artigos" })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => setEnabled(!enabled),
          className: `relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-violet-600" : "bg-slate-200"}`,
          children: /* @__PURE__ */ jsx("div", { className: `absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? "left-7" : "left-1"}` })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-1", children: "Título da Seção" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Texto exibido acima dos botões de compartilhamento nos artigos" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: sectionTitle,
          onChange: (e) => setSectionTitle(e.target.value),
          placeholder: "Compartilhe nas redes sociais",
          className: inputClass
        }
      ),
      sectionTitle && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-2 ml-1", children: [
        "Preview: ",
        /* @__PURE__ */ jsx("span", { className: "font-bold uppercase tracking-widest text-slate-500", style: { fontSize: "0.7rem" }, children: sectionTitle })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-1", children: "Plataformas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Selecione quais redes exibir nos artigos" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: PLATFORMS.map((p) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${platforms.includes(p.id) ? "border-violet-300 bg-violet-50" : "border-slate-200 hover:bg-slate-50"}`, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: platforms.includes(p.id),
            onChange: () => togglePlatform(p.id),
            className: "rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: p.icon }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: p.label })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-1", children: "Estilo dos Botões" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Como os botões aparecem nos artigos" }),
      /* @__PURE__ */ jsx("label", { className: labelClass, children: "Estilo" }),
      /* @__PURE__ */ jsx("select", { value: style, onChange: (e) => setStyle(e.target.value), className: inputClass, children: STYLES.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.label }, s.id)) })
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
const $$SocialShare = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Compartilhamento Social", "activeSection": "social-share" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Compartilhamento Social</h1> <p class="text-slate-500 mt-1">Configure os botões de compartilhamento exibidos nos artigos.</p> </div> ${renderComponent($$result2, "SettingsSocialShare", SettingsSocialShare, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/social-share/SettingsSocialShare", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/social-share.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/social-share.astro";
const $$url = "/admin/social-share";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SocialShare,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
