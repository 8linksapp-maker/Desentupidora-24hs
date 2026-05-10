import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Tag, Trash2, Plus, CheckCircle, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const CONFIG_PATH = "src/data/pluginsConfig.json";
const TAG_PREFIXES = ["G-", "AW-", "GTM-", "DC-"];
function getTagType(id) {
  if (id.startsWith("G-")) return { label: "Analytics", color: "text-green-700", bg: "bg-green-100" };
  if (id.startsWith("AW-")) return { label: "Google Ads", color: "text-amber-700", bg: "bg-amber-100" };
  if (id.startsWith("GTM-")) return { label: "Tag Manager", color: "text-blue-700", bg: "bg-blue-100" };
  if (id.startsWith("DC-")) return { label: "Display", color: "text-purple-700", bg: "bg-purple-100" };
  return { label: "Outro", color: "text-slate-700", bg: "bg-slate-100" };
}
function SettingsGoogleTag() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [fileSha, setFileSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [validationError, setValidationError] = useState("");
  useEffect(() => {
    githubApi("read", CONFIG_PATH).then((data) => {
      const config = JSON.parse(data.content);
      setFullConfig(config);
      const existing = config?.googleTag?.tags || [];
      const legacyGA = config?.googleAnalytics?.measurementId || "";
      const legacyGTM = config?.googleTagManager?.containerId || "";
      const merged = [.../* @__PURE__ */ new Set([...existing, ...legacyGA ? [legacyGA] : [], ...legacyGTM ? [legacyGTM] : []])];
      setTags(merged);
      setFileSha(data.sha);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const addTag = () => {
    const trimmed = newTag.trim().toUpperCase();
    setValidationError("");
    if (!trimmed) return;
    if (!TAG_PREFIXES.some((p) => trimmed.startsWith(p))) {
      setValidationError("O ID deve comecar com G-, AW-, GTM- ou DC-");
      return;
    }
    if (tags.includes(trimmed)) {
      setValidationError("Essa tag ja foi adicionada.");
      return;
    }
    setTags([...tags, trimmed]);
    setNewTag("");
  };
  const removeTag = (id) => {
    setTags(tags.filter((t) => t !== id));
  };
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    triggerToast("Salvando configuracao do Google Tag...", "progress", 30);
    try {
      const { googleAnalytics, googleTagManager, ...rest } = fullConfig || {};
      const updated = {
        ...rest,
        googleTag: { tags }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update Google Tag configuration"
      });
      setFileSha(res.sha || fileSha);
      setFullConfig(updated);
      setSaved(true);
      triggerToast("Google Tag configurado!", "success", 100);
      setTimeout(() => setSaved(false), 3e3);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const inputClass = "flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm font-mono";
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando configuracao..." })
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
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-1", children: "Tags Configuradas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Adicione todos os IDs de tags do Google que deseja carregar no site." }),
      tags.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-slate-400", children: [
        /* @__PURE__ */ jsx(Tag, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Nenhuma tag configurada" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-4", children: tags.map((id) => {
        const type = getTagType(id);
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-sm text-slate-800", children: id }),
            /* @__PURE__ */ jsx("span", { className: `text-xs font-bold px-2 py-0.5 rounded-full ${type.bg} ${type.color}`, children: type.label })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => removeTag(id),
              className: "p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all",
              title: "Remover tag",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }, id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: newTag,
            onChange: (e) => {
              setNewTag(e.target.value);
              setValidationError("");
            },
            onKeyDown: (e) => e.key === "Enter" && addTag(),
            placeholder: "G-XXXXXXXXXX, AW-XXXXXXXXXX ou GTM-XXXXXXX",
            className: inputClass
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: addTag,
            className: "bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20 shrink-0",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Adicionar"
            ]
          }
        )
      ] }),
      validationError && /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-2 ml-1", children: validationError })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-slate-50 rounded-2xl border border-slate-200 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Status" }),
      tags.length > 0 ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-green-600 font-semibold", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
        " ",
        tags.length,
        " tag",
        tags.length !== 1 ? "s" : "",
        " configurada",
        tags.length !== 1 ? "s" : ""
      ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Nenhuma tag configurada" })
    ] }) }),
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
          saving ? "Salvando..." : saved ? "Salvo!" : "Salvar Configuracao"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-2xl border border-blue-200 p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-blue-700 uppercase tracking-widest mb-3", children: "Tipos de tag aceitos" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [
        { prefix: "G-XXXXXXXXXX", label: "Google Analytics 4", desc: "Encontre em analytics.google.com > Admin > Data Streams" },
        { prefix: "AW-XXXXXXXXXX", label: "Google Ads", desc: "Encontre em ads.google.com > Ferramentas > Tag do Google" },
        { prefix: "GTM-XXXXXXX", label: "Google Tag Manager", desc: "Encontre em tagmanager.google.com > seu container" },
        { prefix: "DC-XXXXXXXX", label: "Display & Video 360", desc: "Tag de Floodlight para campanhas de display" }
      ].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-sm text-blue-800", children: [
        /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-blue-600 shrink-0 w-28", children: item.prefix }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: item.label }),
          /* @__PURE__ */ jsxs("span", { className: "text-blue-600", children: [
            " - ",
            item.desc
          ] })
        ] })
      ] }, i)) })
    ] })
  ] });
}

const prerender = false;
const $$GoogleTag = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Google Tag", "activeSection": "google-tag" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Google Tag</h1> <p class="text-slate-500 mt-1">Gerencie todas as tags do Google (Analytics, Ads, Tag Manager) em um so lugar.</p> </div> ${renderComponent($$result2, "SettingsGoogleTag", SettingsGoogleTag, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/google-tag/SettingsGoogleTag", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/google-tag.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/google-tag.astro";
const $$url = "/admin/google-tag";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$GoogleTag,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
