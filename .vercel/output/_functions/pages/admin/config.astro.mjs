import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Save, Image } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

function ConfigEditor() {
  const [config, setConfig] = useState(null);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingLogo, setPendingLogo] = useState(null);
  const [pendingFavicon, setPendingFavicon] = useState(null);
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result?.toString() || "").split(",")[1]);
    reader.onerror = (error2) => reject(error2);
  });
  useEffect(() => {
    githubApi("read", "src/data/siteConfig.json").then((data) => {
      const cfg = JSON.parse(data?.content || "{}");
      if (typeof cfg.logo === "string" && cfg.logo.startsWith("blob:")) cfg.logo = "";
      if (typeof cfg.favicon === "string" && cfg.favicon.startsWith("blob:")) cfg.favicon = "";
      setConfig(cfg);
      setFileSha(data.sha);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    triggerToast("Sincronizando configurações...", "progress", 20);
    try {
      let configCopy = { ...config };
      if (pendingLogo) {
        triggerToast("Enviando novo logo...", "progress", 30);
        const base64Content = await fileToBase64(pendingLogo);
        const fileExt = pendingLogo.name.split(".").pop() || "png";
        const ghPath = `public/uploads/${Date.now()}-logo.${fileExt}`;
        await githubApi("write", ghPath, { content: base64Content, isBase64: true, message: "CMS: Upload Logo" });
        configCopy.logo = ghPath.replace("public", "");
      }
      if (pendingFavicon) {
        triggerToast("Enviando favicon...", "progress", 50);
        const base64Content = await fileToBase64(pendingFavicon);
        const fileExt = pendingFavicon.name.split(".").pop() || "png";
        const ghPath = `public/favicon.${fileExt}`;
        let faviconSha;
        try {
          const existing = await githubApi("read", ghPath);
          if (existing?.sha) faviconSha = existing.sha;
        } catch {
        }
        await githubApi("write", ghPath, { content: base64Content, isBase64: true, sha: faviconSha, message: "CMS: Upload Favicon" });
        configCopy.favicon = `/favicon.${fileExt}`;
      }
      if (typeof configCopy.logo === "string" && configCopy.logo.startsWith("blob:")) configCopy.logo = "";
      if (typeof configCopy.favicon === "string" && configCopy.favicon.startsWith("blob:")) configCopy.favicon = "";
      const res = await githubApi("write", "src/data/siteConfig.json", { content: JSON.stringify(configCopy, null, 2), sha: fileSha, message: "CMS: Update siteConfig.json" });
      setFileSha(res.sha);
      setConfig(configCopy);
      setPendingLogo(null);
      setPendingFavicon(null);
      triggerToast("Configurações salvas com sucesso!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Conectando ao Repositório..." })
  ] });
  if (error && !config) return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 text-red-700 p-8 rounded-3xl border border-red-200 flex gap-4 items-start", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 shrink-0" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: "Erro de Leitura" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] })
  ] });
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm text-slate-800 font-medium";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const presetThemes = [
    { name: "Rosa Original", primary: "#FE4F70", accent: "#FFA387", dark: "#203656" },
    { name: "Oceano", primary: "#2196F3", accent: "#64B5F6", dark: "#0D2137" },
    { name: "Floresta", primary: "#4CAF50", accent: "#81C784", dark: "#1B3A2A" },
    { name: "Sunset", primary: "#FF5722", accent: "#FFAB91", dark: "#4A1A0A" },
    { name: "Roxo Elegante", primary: "#7C3AED", accent: "#A78BFA", dark: "#2D1060" },
    { name: "Dourado", primary: "#D4A017", accent: "#F0D060", dark: "#3D2A00" }
  ];
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-8 pb-32 max-w-3xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Configurações Gerais" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
          "Edita o arquivo ",
          /* @__PURE__ */ jsx("code", { className: "bg-slate-100 px-1 rounded", children: "src/data/siteConfig.json" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: saving, className: "bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm shadow-violet-600/20 transition-all", children: [
        saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-5 h-5" }),
        saving ? "Salvando..." : "Salvar Alterações"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-5 bg-red-100/50 text-red-700 rounded-2xl font-bold border border-red-200 flex gap-3", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 shrink-0" }),
      " ",
      error
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Identidade Base" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 flex flex-col sm:flex-row gap-8 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-1/3", children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Logo Principal" }),
          /* @__PURE__ */ jsxs("label", { className: "group relative border-2 border-dashed border-slate-300 hover:border-violet-500 bg-slate-50 hover:bg-violet-50/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center h-48", children: [
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPendingLogo(file);
                setConfig({ ...config, logo: URL.createObjectURL(file) });
              }
            } }),
            config?.logo ? /* @__PURE__ */ jsx("img", { src: config.logo, alt: "Logo", className: "max-h-24 w-auto object-contain mb-4 group-hover:scale-105 transition-transform" }) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-3 group-hover:text-violet-500 transition-colors", children: /* @__PURE__ */ jsx(Image, { className: "w-8 h-8" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-700 group-hover:text-violet-700 transition-colors", children: config?.logo ? "Trocar Logo" : "Enviar Logo (PNG/SVG)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-slate-600 flex justify-between mb-1", children: [
              /* @__PURE__ */ jsx("span", { children: "Tamanho da logo (header)" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-violet-600", children: [
                config?.logoHeight ?? 60,
                "px"
              ] })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "range", min: 24, max: 120, step: 2, value: config?.logoHeight ?? 60, onChange: (e) => setConfig({ ...config, logoHeight: Number(e.target.value) }), className: "w-full accent-violet-500" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Favicon" }),
          /* @__PURE__ */ jsxs("label", { className: "group relative border-2 border-dashed border-slate-300 hover:border-violet-500 bg-slate-50 hover:bg-violet-50/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center h-32", children: [
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/png,image/svg+xml,image/x-icon", className: "hidden", onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPendingFavicon(file);
                setConfig({ ...config, favicon: URL.createObjectURL(file) });
              }
            } }),
            config?.favicon ? /* @__PURE__ */ jsx("img", { src: config.favicon, alt: "Favicon", className: "max-h-12 w-auto object-contain mb-2 group-hover:scale-105 transition-transform" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-300 shadow-sm mb-2 group-hover:text-violet-500 transition-colors", children: /* @__PURE__ */ jsx(Image, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-700 group-hover:text-violet-700 transition-colors", children: config?.favicon ? "Trocar" : "Enviar Favicon" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-2/3 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Nome do Site / Empresa" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: config?.name || "", onChange: (e) => setConfig({ ...config, name: e.target.value }), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Temas Prontos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: presetThemes.map((preset) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setConfig({ ...config, theme: { ...config.theme, primary: preset.primary, accent: preset.accent, dark: preset.dark } }),
                className: "flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-violet-400 hover:bg-violet-50 transition-all text-sm font-semibold text-slate-700",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full border border-white shadow-sm", style: { background: preset.primary } }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full border border-white shadow-sm", style: { background: preset.accent } }),
                  preset.name
                ]
              },
              preset.name
            )) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
            { key: "primary", label: "Cor Primária" },
            { key: "accent", label: "Cor de Destaque" },
            { key: "text", label: "Cor do Texto" },
            { key: "heading", label: "Cor dos Títulos" }
          ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: f.label }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 p-2 bg-slate-50 border border-slate-200 rounded-xl", children: [
              /* @__PURE__ */ jsx("input", { type: "color", value: config?.theme?.[f.key] || "#000000", onChange: (e) => setConfig({ ...config, theme: { ...config.theme, [f.key]: e.target.value } }), className: "h-10 w-16 p-0 border-0 rounded-lg cursor-pointer bg-transparent" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: config?.theme?.[f.key] || "", onChange: (e) => setConfig({ ...config, theme: { ...config.theme, [f.key]: e.target.value } }), className: "flex-1 bg-transparent border-none focus:outline-none font-mono text-slate-700 font-bold" })
            ] })
          ] }, f.key)) }),
          (config?.theme?.primary || config?.theme?.accent) && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Preview" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-14 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm",
                style: { background: `linear-gradient(to right, ${config?.theme?.primary || "#FE4F70"} 0%, ${config?.theme?.accent || "#FFA387"} 100%)` },
                children: "Botões · Destaques · Categorias"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Combinação de Fontes" }),
            /* @__PURE__ */ jsxs("select", { value: config?.theme?.font || "outfit", onChange: (e) => setConfig({ ...config, theme: { ...config.theme, font: e.target.value } }), className: inputClass, children: [
              /* @__PURE__ */ jsx("option", { value: "inter", children: "Inter & Roboto Mono (Moderno / Tech)" }),
              /* @__PURE__ */ jsx("option", { value: "outfit", children: "Outfit & Inter (Clean / SaaS)" }),
              /* @__PURE__ */ jsx("option", { value: "roboto", children: "Roboto & Open Sans (Corporativo / Neutro)" }),
              /* @__PURE__ */ jsx("option", { value: "poppins", children: "Poppins & Lora (Criativo / Boutique)" }),
              /* @__PURE__ */ jsx("option", { value: "montserrat", children: "Montserrat & Merriweather (Profissional / Textual)" }),
              /* @__PURE__ */ jsx("option", { value: "playfair", children: "Playfair Display & Source Sans (Elegante / Editorial)" }),
              /* @__PURE__ */ jsx("option", { value: "lora", children: "Lora & Merriweather (Revista / Narrativa)" })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Prefixo da URL dos Posts" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [
        { value: "blog", label: "/blog/titulo-do-post", desc: "Padrao" },
        { value: "", label: "/titulo-do-post", desc: "URL limpa (sem /blog)" }
      ].map((opt) => /* @__PURE__ */ jsxs("label", { className: `flex-1 p-3 border rounded-xl cursor-pointer transition-all text-center ${(config?.postUrlPrefix ?? "blog") === opt.value ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`, children: [
        /* @__PURE__ */ jsx("input", { type: "radio", name: "postUrlPrefix", value: opt.value, checked: (config?.postUrlPrefix ?? "blog") === opt.value, onChange: (e) => setConfig({ ...config, postUrlPrefix: e.target.value }), className: "hidden" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800", children: opt.label }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: opt.desc })
      ] }, opt.value)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Exibição dos Posts" }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-violet-400 transition-all", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800", children: "Ocultar data de publicação" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Esconde a data nos cards e na página dos artigos" })
        ] }),
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!config?.hidePostDate, onChange: (e) => setConfig({ ...config, hidePostDate: e.target.checked }), className: "w-5 h-5 accent-violet-500" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Informações de Contato" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "URL do Site" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "https://seusite.com.br", value: config?.url || "", onChange: (e) => setConfig({ ...config, url: e.target.value }), className: inputClass })
        ] }),
        [
          { key: "email", label: "E-mail", placeholder: "contato@seusite.com" },
          { key: "phone", label: "Telefone / WhatsApp", placeholder: "(11) 99999-9999" },
          { key: "address", label: "Endereço", placeholder: "Rua X, 123 — Cidade/UF" }
        ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: f.label }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: f.placeholder,
              value: config?.contact?.[f.key] || "",
              onChange: (e) => setConfig({ ...config, contact: { ...config.contact, [f.key]: e.target.value } }),
              className: inputClass
            }
          )
        ] }, f.key))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Redes Sociais (Rodapé)" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: ["instagram", "twitter", "linkedin", "github", "youtube", "facebook", "pinterest"].map((social) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: social }),
        /* @__PURE__ */ jsx("input", { type: "url", placeholder: `https://${social}.com/seuperfil`, value: config?.social?.[social] || "", onChange: (e) => setConfig({ ...config, social: { ...config.social, [social]: e.target.value } }), className: `${inputClass} font-mono` })
      ] }, social)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Rodape (Footer)" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descricao do Footer" }),
          /* @__PURE__ */ jsx("textarea", { rows: 3, placeholder: "Texto que aparece no rodape do site", value: config?.footer?.description || "", onChange: (e) => setConfig({ ...config, footer: { ...config.footer, description: e.target.value } }), className: `${inputClass} resize-y` })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Texto de Copyright" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Nome da empresa ou site", value: config?.footer?.copyright || "", onChange: (e) => setConfig({ ...config, footer: { ...config.footer, copyright: e.target.value } }), className: inputClass })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "SEO Global" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título Padrão (SEO)" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: config?.seo?.title || "", onChange: (e) => setConfig({ ...config, seo: { ...config.seo, title: e.target.value } }), className: inputClass })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descrição Padrão" }),
          /* @__PURE__ */ jsx("textarea", { rows: 3, value: config?.seo?.description || "", onChange: (e) => setConfig({ ...config, seo: { ...config.seo, description: e.target.value } }), className: `${inputClass} resize-y` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4", children: "Sitemap" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-emerald-700 mb-1", children: "Sitemap XML gerado automaticamente" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600 mb-3", children: "O sitemap é atualizado a cada build/deploy com todas as páginas e posts do site." }),
        config?.url ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("a", { href: `${config.url.replace(/\/$/, "")}/sitemap-index.xml`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-white px-4 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
            config.url.replace(/\/$/, ""),
            "/sitemap-index.xml"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Use esta URL no Google Search Console para enviar seu sitemap." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-3", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700 font-medium", children: "Configure a URL do Site acima para ver o link do sitemap." }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2 flex items-center gap-2", children: "🤖 Robots.txt" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4", children: [
        "Controla quais páginas os buscadores (Google, Bing) podem indexar. ",
        /* @__PURE__ */ jsx("code", { className: "bg-slate-100 px-1 rounded", children: "/admin" }),
        " e ",
        /* @__PURE__ */ jsx("code", { className: "bg-slate-100 px-1 rounded", children: "/api" }),
        " já são bloqueados por padrão. O sitemap é linkado automaticamente."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-700", children: "Bloquear todos os buscadores" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Use no modo desenvolvimento — impede Google/Bing de indexar o site enquanto você ajusta. Desligue antes de divulgar." })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": !!config?.robots?.noindex,
              onClick: () => setConfig({ ...config, robots: { ...config?.robots || {}, noindex: !config?.robots?.noindex } }),
              className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-4 ${config?.robots?.noindex ? "bg-red-600" : "bg-slate-300"}`,
              children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config?.robots?.noindex ? "translate-x-6" : "translate-x-1"}` })
            }
          )
        ] }),
        !config?.robots?.noindex && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Bloquear páginas extras (1 por linha)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 4,
              value: (config?.robots?.extraDisallow || []).join("\n"),
              onChange: (e) => setConfig({
                ...config,
                robots: {
                  ...config?.robots || {},
                  extraDisallow: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                }
              }),
              placeholder: "/promocao-secreta\n/area-restrita",
              className: `${inputClass} font-mono resize-y`
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Outras páginas que você quer esconder dos buscadores (ex: páginas de promoção temporária)." })
        ] }),
        config?.url ? /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-500 mb-2", children: "Preview / Verificar:" }),
          /* @__PURE__ */ jsxs("a", { href: `${config.url.replace(/\/$/, "")}/robots.txt`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-violet-600 transition-colors", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
            config.url.replace(/\/$/, ""),
            "/robots.txt"
          ] })
        ] }) : null
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Config = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Configura\xE7\xF5es", "activeSection": "config" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Configurações</h1> <p class="text-slate-500 mt-1">Nome, logo, cores, fontes e redes sociais do site.</p> </div> ${renderComponent($$result2, "ConfigEditor", ConfigEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/ConfigEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/config.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/config.astro";
const $$url = "/admin/config";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Config,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
