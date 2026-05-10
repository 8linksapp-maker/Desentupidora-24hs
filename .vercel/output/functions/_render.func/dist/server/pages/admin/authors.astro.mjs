import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, UserPlus, AlertCircle, Users, Plus, Image, Edit2, Trash2, X, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

function AuthorsEditor() {
  const [authors, setAuthors] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempAuthor, setTempAuthor] = useState(null);
  useEffect(() => {
    githubApi("read", "src/data/authors.json").then((data) => {
      const parsed = JSON.parse(data?.content || "{}");
      setAuthors(Array.isArray(parsed) ? parsed : []);
      setFileSha(data.sha);
    }).catch((err) => {
      if (err.message.includes("404")) setAuthors([]);
      else setError(err.message);
    }).finally(() => setLoading(false));
  }, []);
  const saveToGithub = async (list) => {
    setSaving(true);
    setError("");
    triggerToast("Sincronizando arquivo de autores...", "progress", 20);
    try {
      const data = await githubApi("write", "src/data/authors.json", {
        content: JSON.stringify(list, null, 2),
        sha: fileSha || void 0,
        message: "CMS: Update authors.json"
      });
      setFileSha(data.sha);
      triggerToast("Equipe sincronizada com sucesso!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setTempAuthor({ ...tempAuthor, avatar: reader.result });
    reader.readAsDataURL(file);
  };
  const saveModalAuthor = async () => {
    if (!tempAuthor?.name?.trim()) {
      alert("O nome do autor é obrigatório!");
      return;
    }
    const arr = [...authors];
    if (editingIndex === null) arr.unshift(tempAuthor);
    else arr[editingIndex] = tempAuthor;
    setAuthors(arr);
    setIsModalOpen(false);
    setTempAuthor(null);
    setEditingIndex(null);
    await saveToGithub(arr);
  };
  const removeAuthor = async (index) => {
    if (!confirm("Excluir este autor?")) return;
    const arr = [...authors];
    arr.splice(index, 1);
    setAuthors(arr);
    await saveToGithub(arr);
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-amber-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Lendo registros de autores..." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-5 px-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Sincronização de Equipe" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full border-2 border-amber-500" }),
          authors.length,
          " Perfis Cadastrados"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [
        saving && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-amber-600 bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold mr-2", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          " Sincronizando..."
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setTempAuthor({ id: `author-${Date.now()}`, name: "", role: "", avatar: "", bio: "" });
              setEditingIndex(null);
              setIsModalOpen(true);
            },
            disabled: saving,
            className: "w-full sm:w-auto bg-slate-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 transition-all",
            children: [
              /* @__PURE__ */ jsx(UserPlus, { className: "w-5 h-5" }),
              " Adicionar Perfil"
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
    authors.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-16 flex flex-col items-center justify-center text-center w-full mt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm", children: /* @__PURE__ */ jsx(Users, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-700 mb-2", children: "Sua equipe está vazia!" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-sm mx-auto mb-6", children: "Adicione membros da equipe para que eles possam assinar os artigos do blog." }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setTempAuthor({ id: `author-${Date.now()}`, name: "", role: "", avatar: "", bio: "" });
            setEditingIndex(null);
            setIsModalOpen(true);
          },
          className: "bg-slate-500 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-amber-600 transition-colors inline-flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
            " Adicionar Primeiro Autor"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-6", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-slate-200", children: [
        /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider w-24", children: "Foto" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider min-w-[250px]", children: "Dados Pessoais" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider min-w-[300px]", children: "Biografia" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider text-right w-20", children: "Ação" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: authors.map((author, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors group", children: [
        /* @__PURE__ */ jsx("td", { className: "py-4 px-6 align-middle", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full overflow-hidden shadow-sm flex items-center justify-center shrink-0 bg-white border-2 border-slate-100", children: author.avatar ? /* @__PURE__ */ jsx("img", { src: author.avatar, alt: "Avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-slate-300" }) }) }),
        /* @__PURE__ */ jsxs("td", { className: "py-4 px-6 align-middle", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm mb-1", children: author.name || "Sem nome" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-amber-600", children: author.role || "Sem cargo" })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "py-4 px-6 align-middle", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 line-clamp-2 leading-relaxed", children: author.bio || "Sem biografia cadastrada..." }) }),
        /* @__PURE__ */ jsx("td", { className: "py-4 px-6 align-middle text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setTempAuthor({ ...author });
                setEditingIndex(idx);
                setIsModalOpen(true);
              },
              className: "w-8 h-8 bg-slate-100 text-slate-500 rounded-lg inline-flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-colors",
              children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => removeAuthor(idx),
              className: "w-8 h-8 bg-red-50 text-red-500 rounded-lg inline-flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }) })
      ] }, author.id || idx)) })
    ] }) }) }),
    isModalOpen && tempAuthor && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: editingIndex !== null ? "Editar Autor" : "Novo Autor" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("label", { className: "w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex flex-col items-center justify-center mx-auto relative group cursor-pointer", children: [
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleImageUpload }),
          tempAuthor.avatar ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("img", { src: tempAuthor.avatar, alt: "Avatar", className: "absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Image, { className: "w-8 h-8 text-slate-800 drop-shadow-md" }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-slate-400 group-hover:text-amber-500 transition-colors", children: [
            /* @__PURE__ */ jsx(Image, { className: "w-8 h-8 mb-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-wider", children: "Upload PNG" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 w-full", children: [
          [
            { key: "name", label: "Nome Completo", placeholder: "Ex: João da Silva", type: "text" },
            { key: "role", label: "Cargo / Profissão", placeholder: "Ex: Editor Chefe", type: "text" }
          ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-400 mb-1 uppercase tracking-widest text-center", children: f.label }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: f.type,
                placeholder: f.placeholder,
                value: tempAuthor[f.key] || "",
                onChange: (e) => setTempAuthor({ ...tempAuthor, [f.key]: e.target.value }),
                className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-center"
              }
            )
          ] }, f.key)),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-400 mb-1 uppercase tracking-widest text-center", children: "Resumo Biográfico" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 4,
                placeholder: "Escreva sobre as especialidades do autor...",
                value: tempAuthor.bio || "",
                onChange: (e) => setTempAuthor({ ...tempAuthor, bio: e.target.value }),
                className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-center leading-relaxed"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end rounded-b-3xl", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors", children: "Cancelar" }),
        /* @__PURE__ */ jsxs("button", { onClick: saveModalAuthor, className: "px-6 py-2.5 text-sm font-bold bg-slate-500 hover:bg-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          " Confirmar"
        ] })
      ] })
    ] }) })
  ] });
}

const prerender = false;
const $$Authors = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Autores", "activeSection": "authors" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Autores</h1> <p class="text-slate-500 mt-1">Gerencie os membros da equipe que escrevem no blog.</p> </div> ${renderComponent($$result2, "AuthorsEditor", AuthorsEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/AuthorsEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/authors.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/authors.astro";
const $$url = "/admin/authors";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Authors,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
