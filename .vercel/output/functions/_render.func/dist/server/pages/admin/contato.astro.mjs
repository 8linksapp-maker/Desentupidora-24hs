import { c as createComponent, d as renderComponent, b as renderTemplate } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { LayoutTemplate, Loader2, Save, X, Plus } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const FILE_PATH = "src/data/contato.json";
const DEFAULT = {
  hero: { title: "Contato", subtitle: "Fale Conosco", bgImage: "" },
  info: { address: "", email: "", phone: "", title: "", description: "", mapUrl: "", formServices: [] },
  seo: { title: "", description: "" }
};
function ContatoEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [fileSha, setFileSha] = useState("");
  const [pendingUpload, setPendingUpload] = useState(null);
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
    triggerToast("Salvando Contato...", "progress", 20);
    try {
      const final = JSON.parse(JSON.stringify(data));
      if (pendingUpload) {
        const b64 = await fileToBase64(pendingUpload);
        const ghPath = `public/uploads/${Date.now()}-contato-bg.${pendingUpload.name.split(".").pop() || "jpg"}`;
        await githubApi("write", ghPath, { content: b64, isBase64: true, message: "Upload contato bg" });
        final.hero.bgImage = ghPath.replace("public", "");
      }
      const res = await githubApi("write", FILE_PATH, { content: JSON.stringify(final, null, 2), sha: fileSha, message: "CMS: Pagina Contato atualizada" });
      setFileSha(res.sha);
      setData(final);
      setPendingUpload(null);
      triggerToast("Pagina Contato atualizada!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-32 text-slate-400 bg-white rounded-2xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(LayoutTemplate, { className: "w-10 h-10 animate-pulse mb-6 text-slate-300" }),
    /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm animate-pulse text-slate-500", children: "Buscando contato.json..." })
  ] });
  const cardClass = "p-8 mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const subInputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500";
  const setF = (sec, key, value) => setData((d) => ({ ...d, [sec]: { ...d[sec], [key]: value } }));
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl space-y-0 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm mb-6 sticky top-4 z-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Editar Pagina: Contato" }),
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
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "text-sm", onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) {
                setPendingUpload(f);
                setF("hero", "bgImage", URL.createObjectURL(f));
              }
              e.target.value = "";
            } }),
            data?.hero?.bgImage && /* @__PURE__ */ jsx("div", { className: "mt-3 w-full h-[200px] border border-slate-300 rounded overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: data.hero.bgImage, className: "w-full h-full object-cover" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "2. Informacoes de Contato" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mb-4", children: [
          "Aceitam HTML ",
          /* @__PURE__ */ jsx("code", { children: "<br/>" }),
          " para quebrar linha. Se ficarem vazios, sao usados os valores de Configuracoes."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Endereco" }),
            /* @__PURE__ */ jsx("textarea", { rows: 2, value: data?.info?.address || "", onChange: (e) => setF("info", "address", e.target.value), className: `${inputClass} resize-y` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "E-mail" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data?.info?.email || "", onChange: (e) => setF("info", "email", e.target.value), className: inputClass })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Telefone / WhatsApp" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data?.info?.phone || "", onChange: (e) => setF("info", "phone", e.target.value), className: inputClass })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "3. Bloco do Formulario" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Titulo do bloco" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data?.info?.title || "", onChange: (e) => setF("info", "title", e.target.value), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descricao" }),
            /* @__PURE__ */ jsx("textarea", { rows: 3, value: data?.info?.description || "", onChange: (e) => setF("info", "description", e.target.value), className: `${inputClass} resize-y` })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Servicos no select do formulario" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              (data?.info?.formServices || []).map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("input", { type: "text", value: s, onChange: (e) => {
                  const arr = [...data.info.formServices];
                  arr[i] = e.target.value;
                  setF("info", "formServices", arr);
                }, className: subInputClass }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setF("info", "formServices", data.info.formServices.filter((_, j) => j !== i)), className: "px-2 py-1 text-red-500", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
              ] }, i)),
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setF("info", "formServices", [...data?.info?.formServices || [], ""]), className: "text-sm font-bold text-violet-600 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                " Adicionar"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "4. Mapa do Google" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "URL do iframe (Google Maps Embed)" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "https://www.google.com/maps/embed?pb=...", value: data?.info?.mapUrl || "", onChange: (e) => setF("info", "mapUrl", e.target.value), className: `${inputClass} font-mono text-xs` }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1", children: [
            "Google Maps → Compartilhar → Incorporar mapa → copie a URL do ",
            /* @__PURE__ */ jsx("code", { children: 'src=""' })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cardClass, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4", children: "SEO" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Titulo SEO" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data?.seo?.title || "", onChange: (e) => setF("seo", "title", e.target.value), className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Meta descricao" }),
            /* @__PURE__ */ jsx("textarea", { rows: 3, value: data?.seo?.description || "", onChange: (e) => setF("seo", "description", e.target.value), className: `${inputClass} resize-y` })
          ] })
        ] })
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Contato = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Contato", "activeSection": "contato" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ContatoEditor", ContatoEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/ContatoEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/contato.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/contato.astro";
const $$url = "/admin/contato";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Contato,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
