import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

function LegalEditor() {
  const [activeTab, setActiveTab] = useState("privacy");
  const [privacyData, setPrivacyData] = useState(null);
  const [termsData, setTermsData] = useState(null);
  const [privacySha, setPrivacySha] = useState("");
  const [termsSha, setTermsSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetch = async () => {
      try {
        const [privRes, termsRes] = await Promise.allSettled([
          githubApi("read", "src/data/privacy.json"),
          githubApi("read", "src/data/terms.json")
        ]);
        if (privRes.status === "fulfilled") {
          setPrivacyData(JSON.parse(privRes.value?.content || "{}"));
          setPrivacySha(privRes.value.sha);
        }
        if (termsRes.status === "fulfilled") {
          setTermsData(JSON.parse(termsRes.value?.content || "{}"));
          setTermsSha(termsRes.value.sha);
        }
      } catch (err) {
        setError("Erro ao carregar dados. Verifique se os arquivos existem no repositório.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  const handleSave = async (type) => {
    setSaving(true);
    const data = type === "privacy" ? privacyData : termsData;
    const sha = type === "privacy" ? privacySha : termsSha;
    const path = type === "privacy" ? "src/data/privacy.json" : "src/data/terms.json";
    if (!data) return;
    const updatedData = { ...data, lastUpdated: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) };
    triggerToast(`Salvando ${type === "privacy" ? "Privacidade" : "Termos"}...`, "progress", 30);
    try {
      const res = await githubApi("write", path, { content: JSON.stringify(updatedData, null, 2), sha: sha || void 0, message: `CMS: Update ${path}` });
      if (type === "privacy") {
        setPrivacySha(res.sha);
        setPrivacyData(updatedData);
      } else {
        setTermsSha(res.sha);
        setTermsData(updatedData);
      }
      triggerToast("Alterações salvas com sucesso!", "success", 100);
    } catch (err) {
      triggerToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };
  const updateSection = (type, index, field, value) => {
    const setData = type === "privacy" ? setPrivacyData : setTermsData;
    const currentData2 = type === "privacy" ? privacyData : termsData;
    if (!currentData2) return;
    const newContent = [...currentData2.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setData({ ...currentData2, content: newContent });
  };
  const addSection = (type) => {
    const setData = type === "privacy" ? setPrivacyData : setTermsData;
    const currentData2 = type === "privacy" ? privacyData : termsData;
    if (!currentData2) return;
    setData({ ...currentData2, content: [...currentData2.content, { title: "Nova Seção", text: "Conteúdo aqui..." }] });
  };
  const removeSection = (type, index) => {
    if (!confirm("Excluir esta seção?")) return;
    const setData = type === "privacy" ? setPrivacyData : setTermsData;
    const currentData2 = type === "privacy" ? privacyData : termsData;
    if (!currentData2) return;
    setData({ ...currentData2, content: currentData2.content.filter((_, i) => i !== index) });
  };
  const moveSection = (type, index, direction) => {
    const setData = type === "privacy" ? setPrivacyData : setTermsData;
    const currentData2 = type === "privacy" ? privacyData : termsData;
    if (!currentData2) return;
    const newContent = [...currentData2.content];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newContent.length) return;
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    setData({ ...currentData2, content: newContent });
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-32 text-slate-400 bg-white rounded-md border border-slate-200", children: [
    /* @__PURE__ */ jsx(FileText, { className: "w-10 h-10 animate-pulse mb-6 text-slate-300" }),
    /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm animate-pulse text-slate-500", children: "Buscando dados do repositório Git..." })
  ] });
  const currentData = activeTab === "privacy" ? privacyData : termsData;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("privacy"), className: `px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "privacy" ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`, children: "Política de Privacidade" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("terms"), className: `px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "terms" ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`, children: "Termos de Uso" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSave(activeTab),
          disabled: saving,
          className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
          children: [
            saving && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            saving ? "Salvando..." : "Salvar"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-5 bg-red-100/50 text-red-700 rounded-2xl font-bold border border-red-200", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 inline mr-2 -mt-1" }),
      " ",
      error
    ] }),
    currentData ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      currentData.content.map((section, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 border-b border-slate-50 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs", children: [
              "#",
              idx + 1
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: section.title,
                onChange: (e) => updateSection(activeTab, idx, "title", e.target.value),
                className: "text-sm font-bold text-slate-800 bg-transparent border-none focus:ring-0 w-full md:w-96 focus:outline-none",
                placeholder: "Título da Seção"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => moveSection(activeTab, idx, "up"), disabled: idx === 0, className: "p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors disabled:opacity-30", children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => moveSection(activeTab, idx, "down"), disabled: idx === currentData.content.length - 1, className: "p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors disabled:opacity-30", children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => removeSection(activeTab, idx), className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded ml-2 transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: section.text,
            onChange: (e) => updateSection(activeTab, idx, "text", e.target.value),
            rows: 6,
            className: "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-base leading-relaxed focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none shadow-sm",
            placeholder: "Escreva o texto jurídico aqui..."
          }
        )
      ] }, idx)),
      /* @__PURE__ */ jsxs("button", { onClick: () => addSection(activeTab), className: "w-full py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-violet-600 hover:border-violet-600 hover:bg-violet-50 transition-all font-bold flex flex-col items-center justify-center gap-2 text-xs uppercase", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6" }),
        " Adicionar Nova Seção"
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "p-10 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-lg", children: "Arquivo não encontrado" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-80", children: "Não foi possível localizar o arquivo JSON no repositório." })
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Legal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Privacidade & Termos", "activeSection": "legal" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Privacidade & Termos</h1> <p class="text-slate-500 mt-1">Edite a Política de Privacidade e os Termos de Uso do site.</p> </div> ${renderComponent($$result2, "LegalEditor", LegalEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/LegalEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/legal.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/legal.astro";
const $$url = "/admin/legal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Legal,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
