import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, Plus, AlertCircle, Tag, Edit2, Trash2, X } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

function CategoriesEditor() {
  const [categories, setCategories] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempCategory, setTempCategory] = useState("");
  useEffect(() => {
    githubApi("read", "src/data/categories.json").then((data) => {
      const parsed = JSON.parse(data?.content || "{}");
      setCategories(Array.isArray(parsed) ? parsed : []);
      setFileSha(data.sha);
    }).catch((err) => {
      if (err.message.includes("404")) setCategories([]);
      else setError(err.message);
    }).finally(() => setLoading(false));
  }, []);
  const saveToGithub = async (newList) => {
    setSaving(true);
    setError("");
    triggerToast("Sincronizando categorias...", "progress", 20);
    try {
      const data = await githubApi("write", "src/data/categories.json", {
        content: JSON.stringify(newList, null, 2),
        sha: fileSha || void 0,
        message: "CMS: Update categories.json"
      });
      setFileSha(data.sha);
      triggerToast("Categorias atualizadas!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const saveModalCategory = async () => {
    if (!tempCategory.trim()) {
      alert("O nome da categoria é obrigatório!");
      return;
    }
    const trimmed = tempCategory.trim();
    const arr = [...categories];
    if (editingIndex === null) {
      if (arr.includes(trimmed)) {
        alert("Esta categoria já existe!");
        return;
      }
      arr.push(trimmed);
    } else {
      arr[editingIndex] = trimmed;
    }
    setCategories(arr);
    setIsModalOpen(false);
    await saveToGithub(arr);
  };
  const removeCategory = async (index) => {
    if (!confirm("Excluir esta categoria?")) return;
    const arr = [...categories];
    arr.splice(index, 1);
    setCategories(arr);
    await saveToGithub(arr);
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-indigo-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Lendo categorias..." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-5 px-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Gerenciador de Categorias" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full border-2 border-indigo-500" }),
          categories.length,
          " Categorias Definidas"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [
        saving && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold mr-2", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          " Sincronizando..."
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setTempCategory("");
              setEditingIndex(null);
              setIsModalOpen(true);
            },
            disabled: saving,
            className: "w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5 transition-all",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
              " Nova Categoria"
            ]
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-5 bg-red-100/50 text-red-700 rounded-2xl font-bold border border-red-200", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 inline mr-2 -mt-1" }),
      " ",
      error
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: categories.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "col-span-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-16 flex flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsx(Tag, { className: "w-12 h-12 text-slate-300 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-700 mb-2", children: "Nenhuma categoria!" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-6", children: "Crie categorias para organizar seus artigos do blog." }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        setTempCategory("");
        setEditingIndex(null);
        setIsModalOpen(true);
      }, className: "bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors", children: "Criar minha primeira categoria" })
    ] }) : categories.map((cat, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold", children: /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: cat })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setTempCategory(cat);
          setEditingIndex(idx);
          setIsModalOpen(true);
        }, className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => removeCategory(idx), className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
      ] })
    ] }, idx)) }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-100", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: editingIndex !== null ? "Editar Categoria" : "Nova Categoria" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2", children: "Nome da Categoria" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: tempCategory,
            onChange: (e) => setTempCategory(e.target.value),
            className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none",
            placeholder: "Ex: Tecnologia, Saúde, etc...",
            autoFocus: true,
            onKeyDown: (e) => {
              if (e.key === "Enter") saveModalCategory();
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-t border-slate-100 flex gap-3 justify-end", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl", children: "Cancelar" }),
        /* @__PURE__ */ jsx("button", { onClick: saveModalCategory, className: "px-6 py-2.5 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all", children: "Salvar Categoria" })
      ] })
    ] }) })
  ] });
}

const prerender = false;
const $$Categories = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Categorias", "activeSection": "categories" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Categorias</h1> <p class="text-slate-500 mt-1">Organize seu blog com categorias bem definidas.</p> </div> ${renderComponent($$result2, "CategoriesEditor", CategoriesEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/CategoriesEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/categories.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/categories.astro";
const $$url = "/admin/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Categories,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
