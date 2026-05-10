import { c as createComponent, d as renderComponent, b as renderTemplate } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useState, useEffect } from 'react';
import { Loader2, Plus, AlertCircle, Search, FileText, Check, Edit3, Trash2, X, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [authors, setAuthors] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [editingSha, setEditingSha] = useState(null);
  const [quickEditData, setQuickEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("pubDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedPosts, setSelectedPosts] = useState([]);
  const itemsPerPage = 20;
  useEffect(() => {
    fetchInitialData();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter, sortField, sortOrder]);
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      let allCategories = /* @__PURE__ */ new Set();
      const [authRes, catRes, postsRes] = await Promise.allSettled([
        githubApi("read", "src/data/authors.json"),
        githubApi("read", "src/data/categories.json"),
        githubApi("list", "src/content/blog")
      ]);
      if (authRes.status === "fulfilled" && authRes.value?.content) {
        try {
          const parsed = JSON.parse(authRes.value?.content || "{}");
          if (Array.isArray(parsed)) setAuthors(parsed);
        } catch {
        }
      }
      if (catRes.status === "fulfilled" && catRes.value?.content) {
        try {
          const parsedCats = JSON.parse(catRes.value?.content || "{}");
          if (Array.isArray(parsedCats)) parsedCats.forEach((c) => allCategories.add(c));
        } catch {
        }
      }
      if (postsRes.status === "fulfilled") {
        const data = postsRes.value;
        const mdFiles = Array.isArray(data.data) ? data.data.filter((f) => f.name.endsWith(".md")) : [];
        const enriched = [];
        await Promise.all(mdFiles.map(async (f) => {
          const fileData = await githubApi("read", f.path).catch(() => null);
          if (!fileData) return;
          const text = fileData.content || "";
          const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          let title = f.name, category = "Geral", author = "", pubDate = "", draft = false, description = "", heroImage = "";
          const slug = f.name.replace(".md", "");
          if (match) {
            const fm = match[1];
            const extract = (key) => {
              const m = fm.match(new RegExp(`${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n\\r]+))`));
              return m ? (m[1] || m[2] || m[3] || "").trim() : "";
            };
            title = extract("title") || f.name;
            category = extract("category") || "Geral";
            author = extract("author");
            pubDate = extract("pubDate");
            draft = extract("draft") === "true";
            description = extract("description");
            heroImage = extract("heroImage");
            if (category) allCategories.add(category);
          }
          enriched.push({ ...f, sha: fileData.sha || f.sha, title, category, author, pubDate, draft, description, heroImage, slug, rawBody: match ? match[2] : text });
        }));
        setPosts(enriched);
        if (allCategories.size > 0) setDynamicCategories(Array.from(allCategories));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (path, sha, name) => {
    if (!confirm(`Excluir o post "${name}"?`)) return;
    try {
      await githubApi("delete", path, { sha, message: `CMS: Excluindo post ${name}` });
      setPosts(posts.filter((f) => f.sha !== sha));
      triggerToast(`Artigo "${name}" excluído!`, "success");
    } catch (err) {
      triggerToast(`Erro: ${err.message}`, "error");
    }
  };
  const handleQuickAction = (post) => {
    setEditingSha(post.sha);
    setQuickEditData({ title: post.title, slug: post.slug, pubDate: post.pubDate ? new Date(post.pubDate).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0], author: post.author, category: post.category, draft: post.draft, _oldSlug: post.slug, _oldPath: post.path, _sha: post.sha, description: post.description, heroImage: post.heroImage, rawBody: post.rawBody });
  };
  const saveQuickEdit = async () => {
    if (!quickEditData.title || !quickEditData.slug) return alert("Título e Slug não podem ser vazios.");
    setSaving(true);
    try {
      const targetPath = `src/content/blog/${quickEditData.slug}.md`;
      const markdown = `---
title: "${quickEditData.title.replace(/"/g, '\\"')}"
description: "${(quickEditData.description || "").replace(/"/g, '\\"')}"
pubDate: "${quickEditData.pubDate}"
heroImage: "${quickEditData.heroImage || ""}"
category: "${quickEditData.category}"
author: "${quickEditData.author}"
draft: ${quickEditData.draft}
---
${quickEditData.rawBody}`;
      if (quickEditData.slug !== quickEditData._oldSlug) {
        await githubApi("write", targetPath, { content: markdown, message: `CMS: Renomeando ${quickEditData.slug}` });
        await githubApi("delete", quickEditData._oldPath, { sha: quickEditData._sha, message: "CMS: Apagando slug antigo" });
      } else {
        await githubApi("write", targetPath, { content: markdown, sha: quickEditData._sha, message: `CMS: Edição Rápida ${quickEditData.slug}` });
      }
      triggerToast("Artigo atualizado com sucesso!", "success");
      setEditingSha(null);
      fetchInitialData();
    } catch (e) {
      triggerToast(`Erro: ${e.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  let filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === "published" && p.draft) return false;
    if (statusFilter === "draft" && !p.draft) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    return true;
  });
  filtered = [...filtered].sort((a, b) => {
    const aVal = sortField === "pubDate" ? new Date(a.pubDate || 0).getTime() : (a.title || "").toLowerCase();
    const bVal = sortField === "pubDate" ? new Date(b.pubDate || 0).getTime() : (b.title || "").toLowerCase();
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const toggleSort = (field) => {
    if (sortField === field) setSortOrder((o) => o === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-3 h-3 inline ml-1" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3 inline ml-1" });
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando artigos..." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 px-6 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Artigos do Blog" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1", children: [
          posts.length,
          " artigos no total"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: "/admin/posts/new", className: "bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-violet-600/25 hover:-translate-y-0.5 transition-all", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        " Novo Artigo"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-5 bg-red-100/50 text-red-700 rounded-2xl font-bold border border-red-200", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 inline mr-2 -mt-1" }),
      " ",
      error
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Buscar artigos...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" })
      ] }),
      /* @__PURE__ */ jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-violet-500", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
        /* @__PURE__ */ jsx("option", { value: "published", children: "Publicados" }),
        /* @__PURE__ */ jsx("option", { value: "draft", children: "Rascunhos" })
      ] }),
      dynamicCategories.length > 0 && /* @__PURE__ */ jsxs("select", { value: categoryFilter, onChange: (e) => setCategoryFilter(e.target.value), className: "bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-violet-500", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "Todas as categorias" }),
        dynamicCategories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
      ] })
    ] }),
    paginated.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-16 flex flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 text-slate-300 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-700 mb-2", children: "Nenhum artigo encontrado" }),
      /* @__PURE__ */ jsx("a", { href: "/admin/posts/new", className: "mt-4 bg-violet-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-violet-700 transition-colors", children: "Criar primeiro artigo" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsx("thead", { className: "border-b border-slate-200 bg-slate-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 w-8", children: /* @__PURE__ */ jsx("input", { type: "checkbox", className: "rounded", onChange: (e) => setSelectedPosts(e.target.checked ? paginated.map((p) => p.sha) : []), checked: selectedPosts.length === paginated.length && paginated.length > 0 }) }),
        /* @__PURE__ */ jsxs("th", { className: "py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700", onClick: () => toggleSort("title"), children: [
          "Título ",
          /* @__PURE__ */ jsx(SortIcon, { field: "title" })
        ] }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell", children: "Categoria" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell", children: "Autor" }),
        /* @__PURE__ */ jsxs("th", { className: "py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 hidden md:table-cell", onClick: () => toggleSort("pubDate"), children: [
          "Data ",
          /* @__PURE__ */ jsx(SortIcon, { field: "pubDate" })
        ] }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: paginated.map((post) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4", children: /* @__PURE__ */ jsx("input", { type: "checkbox", className: "rounded", checked: selectedPosts.includes(post.sha), onChange: (e) => setSelectedPosts(e.target.checked ? [...selectedPosts, post.sha] : selectedPosts.filter((s) => s !== post.sha)) }) }),
          /* @__PURE__ */ jsxs("td", { className: "py-4 px-4", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm line-clamp-1", children: post.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 font-mono mt-0.5", children: [
              "/",
              post.slug
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 hidden sm:table-cell", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full", children: post.category }) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 hidden md:table-cell text-sm text-slate-500", children: post.author || "—" }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 hidden md:table-cell text-xs text-slate-400 font-mono", children: post.pubDate || "—" }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4", children: post.draft ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-full", children: "Rascunho" }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full", children: [
            /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
            "Publicado"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "py-4 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleQuickAction(post), title: "Edição Rápida", className: "p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("a", { href: `/admin/posts/edit?file=${encodeURIComponent(post.path)}`, title: "Editar Completo", className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(post.path, post.sha, post.title), title: "Excluir", className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] }) })
        ] }),
        editingSha === post.sha && quickEditData && /* @__PURE__ */ jsx("tr", { className: "bg-violet-50", children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "px-4 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Título" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: quickEditData.title, onChange: (e) => setQuickEditData({ ...quickEditData, title: e.target.value }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Slug (URL)" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: quickEditData.slug, onChange: (e) => setQuickEditData({ ...quickEditData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-violet-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Data" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: quickEditData.pubDate, onChange: (e) => setQuickEditData({ ...quickEditData, pubDate: e.target.value }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Categoria" }),
              /* @__PURE__ */ jsx("input", { type: "text", list: "cats-list", value: quickEditData.category, onChange: (e) => setQuickEditData({ ...quickEditData, category: e.target.value }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" }),
              /* @__PURE__ */ jsx("datalist", { id: "cats-list", children: dynamicCategories.map((c) => /* @__PURE__ */ jsx("option", { value: c }, c)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Autor" }),
              /* @__PURE__ */ jsx("input", { type: "text", list: "authors-list", value: quickEditData.author, onChange: (e) => setQuickEditData({ ...quickEditData, author: e.target.value }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" }),
              /* @__PURE__ */ jsx("datalist", { id: "authors-list", children: authors.map((a) => /* @__PURE__ */ jsx("option", { value: a.name }, a.id)) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-end gap-3", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: quickEditData.draft, onChange: (e) => setQuickEditData({ ...quickEditData, draft: e.target.checked }), className: "rounded" }),
              "Rascunho"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4 justify-end", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingSha(null), className: "flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors", children: [
              /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
              "Cancelar"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: saveQuickEdit, disabled: saving, className: "flex items-center gap-1.5 px-5 py-2 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-60", children: [
              saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              saving ? "Salvando..." : "Salvar"
            ] })
          ] })
        ] }) })
      ] }, post.sha)) })
    ] }) }) }),
    totalPages > 1 && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage(p), className: `w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === p ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300"}`, children: p }, p)) })
  ] });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Artigos", "activeSection": "posts" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PostsManager", PostsManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/PostsManager", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/posts/index.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/posts/index.astro";
const $$url = "/admin/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
