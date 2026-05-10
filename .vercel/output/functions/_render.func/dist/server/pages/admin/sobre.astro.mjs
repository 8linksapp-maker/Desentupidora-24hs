import { c as createComponent, d as renderComponent, b as renderTemplate } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { LayoutTemplate, Loader2, Save, X, Plus } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const FILE_PATH = "src/data/sobre.json";
const DEFAULT = {
  hero: { title: "Sobre Nós", subtitle: "", bgImage: "" },
  about: { image: "", title: "", content: "", signatureImage: "", authorName: "", authorRole: "" },
  services: { title: "", description: "", items: [] },
  funFacts: { backgroundImage: "", items: [] },
  testimonials: { title: "", subtitle: "", description: "", items: [] }
};
function SobreEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [fileSha, setFileSha] = useState("");
  const [pendingUploads, setPendingUploads] = useState({});
  useEffect(() => {
    githubApi("read", FILE_PATH).then((d) => {
      const parsed = JSON.parse(d?.content || "{}");
      const merged = {};
      Object.keys(DEFAULT).forEach((k) => {
        merged[k] = { ...DEFAULT[k], ...parsed[k] || {} };
      });
      setData(merged);
      setFileSha(d.sha);
    }).catch((err) => {
      setError(err.message);
      setData(DEFAULT);
    }).finally(() => setLoading(false));
  }, []);
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    triggerToast("Salvando Sobre...", "progress", 20);
    try {
      const final = JSON.parse(JSON.stringify(data));
      for (const [key, file] of Object.entries(pendingUploads)) {
        const b64 = await fileToBase64(file);
        const ghPath = `public/uploads/${Date.now()}-${key.replace(/\./g, "-")}.${file.name.split(".").pop() || "jpg"}`;
        await githubApi("write", ghPath, { content: b64, isBase64: true, message: `Upload ${key}` });
        const url = ghPath.replace("public", "");
        const [section, field] = key.split(".");
        if (final[section]) final[section][field] = url;
      }
      const res = await githubApi("write", FILE_PATH, { content: JSON.stringify(final, null, 2), sha: fileSha, message: "CMS: Pagina Sobre atualizada" });
      setFileSha(res.sha);
      setData(final);
      setPendingUploads({});
      triggerToast("Pagina Sobre atualizada!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-32 text-slate-400 bg-white rounded-2xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(LayoutTemplate, { className: "w-10 h-10 animate-pulse mb-6 text-slate-300" }),
    /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm animate-pulse text-slate-500", children: "Buscando sobre.json..." })
  ] });
  const cardClass = "p-8 mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const subInputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500";
  const setF = (sec, key, value) => setData((d) => ({ ...d, [sec]: { ...d[sec], [key]: value } }));
  const setArr = (sec, idx, field, value) => setData((d) => {
    const arr = [...d[sec].items || []];
    arr[idx] = { ...arr[idx] || {}, [field]: value };
    return { ...d, [sec]: { ...d[sec], items: arr } };
  });
  const addItem = (sec, item) => setData((d) => ({ ...d, [sec]: { ...d[sec], items: [...d[sec].items || [], item] } }));
  const rmItem = (sec, idx) => setData((d) => ({ ...d, [sec]: { ...d[sec], items: d[sec].items.filter((_, i) => i !== idx) } }));
  const onFile = (key) => (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingUploads((p) => ({ ...p, [key]: f }));
    const [sec, field] = key.split(".");
    setF(sec, field, URL.createObjectURL(f));
    e.target.value = "";
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl space-y-0 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm mb-6 sticky top-4 z-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Editar Pagina: Sobre Nos" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
          "Edita o arquivo ",
          /* @__PURE__ */ jsx("code", { className: "bg-slate-100 px-1 rounded", children: FILE_PATH })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: handleSave, disabled: saving, className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all", children: [
        saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
        saving ? "Salvando..." : "Salvar"
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "p-3 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium mb-4", children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "1. Banner do Topo (Hero)" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Titulo" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data?.hero?.title || "", onChange: (e) => setF("hero", "title", e.target.value), className: inputClass })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Subtitulo" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data?.hero?.subtitle || "", onChange: (e) => setF("hero", "subtitle", e.target.value), className: inputClass })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Imagem de fundo" }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: onFile("hero.bgImage"), className: "text-sm" }),
            data?.hero?.bgImage && /* @__PURE__ */ jsx("div", { className: "mt-3 w-full h-[200px] border border-slate-300 rounded overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: data.hero.bgImage, className: "w-full h-full object-cover" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "2. Sobre a Empresa" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Titulo" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data?.about?.title || "", onChange: (e) => setF("about", "title", e.target.value), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descricao (HTML permitido)" }),
            /* @__PURE__ */ jsx("textarea", { rows: 6, value: data?.about?.content || "", onChange: (e) => setF("about", "content", e.target.value), className: `${inputClass} resize-y` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Imagem da empresa" }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: onFile("about.image"), className: "text-sm" }),
            data?.about?.image && /* @__PURE__ */ jsx("div", { className: "mt-3 w-full h-[200px] border border-slate-300 rounded overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: data.about.image, className: "w-full h-full object-cover" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Nome do responsavel" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data?.about?.authorName || "", onChange: (e) => setF("about", "authorName", e.target.value), className: inputClass })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Cargo" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data?.about?.authorRole || "", onChange: (e) => setF("about", "authorRole", e.target.value), className: inputClass })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "3. Diferenciais (Services)" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Titulo" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data?.services?.title || "", onChange: (e) => setF("services", "title", e.target.value), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descricao" }),
            /* @__PURE__ */ jsx("textarea", { rows: 3, value: data?.services?.description || "", onChange: (e) => setF("services", "description", e.target.value), className: `${inputClass} resize-y` })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Items" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              (data?.services?.items || []).map((it, i) => /* @__PURE__ */ jsxs("div", { className: "border border-slate-200 rounded-lg p-3 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs("strong", { className: "text-xs text-slate-500", children: [
                    "Item ",
                    i + 1
                  ] }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => rmItem("services", i), className: "text-red-500", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Titulo", value: it.title || "", onChange: (e) => setArr("services", i, "title", e.target.value), className: subInputClass }),
                /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "Descricao", value: it.description || "", onChange: (e) => setArr("services", i, "description", e.target.value), className: `${subInputClass} resize-y` }),
                /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Icon (ex: Clock, Users, Verified)", value: it.icon || "", onChange: (e) => setArr("services", i, "icon", e.target.value), className: `${subInputClass} font-mono` })
              ] }, i)),
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addItem("services", { title: "", description: "", icon: "Clock" }), className: "text-sm font-bold text-violet-600 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                " Adicionar"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "4. Numeros (Fun Facts)" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 border border-slate-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Imagem de fundo" }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: onFile("funFacts.backgroundImage"), className: "text-sm" }),
            data?.funFacts?.backgroundImage && /* @__PURE__ */ jsx("div", { className: "mt-3 w-full h-[120px] border border-slate-300 rounded overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: data.funFacts.backgroundImage, className: "w-full h-full object-cover" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Estatisticas" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              (data?.funFacts?.items || []).map((it, i) => /* @__PURE__ */ jsxs("div", { className: "border border-slate-200 rounded-lg p-3 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs("strong", { className: "text-xs text-slate-500", children: [
                    "Item ",
                    i + 1
                  ] }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => rmItem("funFacts", i), className: "text-red-500", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Numero", value: it.count || "", onChange: (e) => setArr("funFacts", i, "count", e.target.value), className: `${subInputClass} w-32` }),
                  /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Sufixo (+, /7, %)", value: it.suffix || "", onChange: (e) => setArr("funFacts", i, "suffix", e.target.value), className: `${subInputClass} w-32` }),
                  /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Texto", value: it.label || "", onChange: (e) => setArr("funFacts", i, "label", e.target.value), className: `${subInputClass} flex-1` })
                ] })
              ] }, i)),
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addItem("funFacts", { count: "", label: "", icon: "/assets/images/icon/9.png" }), className: "text-sm font-bold text-violet-600 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                " Adicionar"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "5. Depoimentos" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Titulo" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data?.testimonials?.title || "", onChange: (e) => setF("testimonials", "title", e.target.value), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Subtitulo" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data?.testimonials?.subtitle || "", onChange: (e) => setF("testimonials", "subtitle", e.target.value), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descricao" }),
            /* @__PURE__ */ jsx("textarea", { rows: 2, value: data?.testimonials?.description || "", onChange: (e) => setF("testimonials", "description", e.target.value), className: `${inputClass} resize-y` })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Depoimentos" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              (data?.testimonials?.items || []).map((it, i) => /* @__PURE__ */ jsxs("div", { className: "border border-slate-200 rounded-lg p-3 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs("strong", { className: "text-xs text-slate-500", children: [
                    "Depoimento ",
                    i + 1
                  ] }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => rmItem("testimonials", i), className: "text-red-500", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Nome", value: it.name || "", onChange: (e) => setArr("testimonials", i, "name", e.target.value), className: subInputClass }),
                /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Cargo / Cidade", value: it.role || "", onChange: (e) => setArr("testimonials", i, "role", e.target.value), className: subInputClass }),
                /* @__PURE__ */ jsx("textarea", { rows: 3, placeholder: "Texto", value: it.text || "", onChange: (e) => setArr("testimonials", i, "text", e.target.value), className: `${subInputClass} resize-y` })
              ] }, i)),
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addItem("testimonials", { name: "", role: "", text: "", image: "" }), className: "text-sm font-bold text-violet-600 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                " Adicionar"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Sobre = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Sobre N\xF3s", "activeSection": "sobre" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SobreEditor", SobreEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/SobreEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/sobre.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/sobre.astro";
const $$url = "/admin/sobre";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Sobre,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
