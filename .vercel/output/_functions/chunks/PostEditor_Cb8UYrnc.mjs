import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Edit3, Eye, Save, AlertCircle, Image } from 'lucide-react';
import { marked } from 'marked';
import { t as triggerToast } from './AdminLayout_BfyoGx6I.mjs';
import { g as githubApi } from './adminApi_DobXZoc4.mjs';

function yamlEscape(value) {
  if (value == null) return "";
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function countWords(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}
function SEOScoreWidget({ title, description, heroImage, content }) {
  const checks = useMemo(() => {
    const tLen = title.trim().length;
    const dLen = description.trim().length;
    const words = countWords(content);
    return [
      {
        label: "Título: 30–60 caracteres",
        pass: tLen >= 30 && tLen <= 60,
        hint: tLen < 30 ? `Muito curto (${tLen})` : tLen > 60 ? `Muito longo (${tLen})` : `${tLen} caracteres`
      },
      {
        label: "Descrição: 120–160 caracteres",
        pass: dLen >= 120 && dLen <= 160,
        hint: dLen === 0 ? "Não preenchida" : dLen < 120 ? `Muito curta (${dLen})` : dLen > 160 ? `Muito longa (${dLen})` : `${dLen} caracteres`
      },
      {
        label: "Imagem de capa definida",
        pass: !!heroImage.trim(),
        hint: heroImage.trim() ? "Imagem configurada" : "Sem imagem de capa"
      },
      {
        label: "Conteúdo > 300 palavras",
        pass: words > 300,
        hint: `${words} palavra${words !== 1 ? "s" : ""}`
      }
    ];
  }, [title, description, heroImage, content]);
  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round(passed / checks.length * 100);
  const scoreColor = score >= 75 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
  const scoreText = score >= 75 ? "text-green-700" : score >= 50 ? "text-amber-700" : "text-red-700";
  return /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3 mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-700 text-sm", children: "Score SEO" }),
      /* @__PURE__ */ jsxs("span", { className: `text-lg font-black ${scoreText}`, children: [
        score,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-2 bg-slate-100 rounded-full mb-4 overflow-hidden", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-full rounded-full transition-all duration-500 ${scoreColor}`,
        style: { width: `${score}%` }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: checks.map((check) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      check.pass ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 text-red-400 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: `text-xs font-semibold ${check.pass ? "text-slate-700" : "text-slate-500"}`, children: check.label }),
        /* @__PURE__ */ jsx("p", { className: `text-xs ${check.pass ? "text-green-600" : "text-slate-400"}`, children: check.hint })
      ] })
    ] }, check.label)) })
  ] });
}

function PostEditor({ filePath }) {
  const isEditing = !!filePath;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authors, setAuthors] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [pendingUploads, setPendingUploads] = useState({});
  const [QuillEditor, setQuillEditor] = useState(null);
  const formatDateForInput = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return d.toISOString().split("T")[0];
    } catch {
      return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    }
  };
  const [originalPubDateISO, setOriginalPubDateISO] = useState("");
  const [post, setPost] = useState({
    title: "",
    slug: "",
    description: "",
    pubDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    heroImage: "",
    category: "",
    author: "",
    draft: false,
    content: ""
  });
  useEffect(() => {
    import('react-quill-new').then((mod) => setQuillEditor(() => mod.default));
    Promise.resolve({                   });
  }, []);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authRes, catRes] = await Promise.allSettled([
          githubApi("read", "src/data/authors.json"),
          githubApi("read", "src/data/categories.json")
        ]);
        if (authRes.status === "fulfilled") {
          const p = JSON.parse(authRes.value?.content || "{}");
          if (Array.isArray(p)) setAuthors(p);
        }
        if (catRes.status === "fulfilled") {
          const p = JSON.parse(catRes.value?.content || "{}");
          if (Array.isArray(p)) setDynamicCategories(p);
        }
        if (isEditing && filePath) {
          const fileData = await githubApi("read", filePath);
          setFileSha(fileData.sha);
          const text = fileData.content;
          const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (match) {
            const fm = match[1];
            const body = match[2].trim();
            const extract = (key) => {
              const m = fm.match(new RegExp(`${key}:\\s*(?:"([^"]*)"|'([^']*)'|(.*))`));
              return m ? (m[1] || m[2] || m[3] || "").trim() : "";
            };
            const parsedHtml = await marked.parse(body);
            const rawPubDate = extract("pubDate");
            if (rawPubDate) setOriginalPubDateISO(rawPubDate);
            setPost({
              title: extract("title"),
              slug: filePath.split("/").pop()?.replace(".md", "") || "",
              description: extract("description"),
              pubDate: rawPubDate ? formatDateForInput(rawPubDate) : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              heroImage: extract("heroImage"),
              category: extract("category") || "Geral",
              author: extract("author"),
              draft: extract("draft") === "true",
              content: parsedHtml
            });
          } else {
            setPost((p) => ({ ...p, content: String(marked.parse(text)), slug: filePath.split("/").pop()?.replace(".md", "") || "" }));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filePath, isEditing]);
  const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const handleTitleChange = (val) => {
    setPost((p) => ({ ...p, title: val, slug: isEditing ? p.slug : slugify(val) }));
  };
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error2) => reject(error2);
    reader.readAsDataURL(file);
  });
  const handleFileSelect = (e, uiKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingUploads((prev) => ({ ...prev, [uiKey]: file }));
    setPost((p) => ({ ...p, heroImage: URL.createObjectURL(file) }));
    e.target.value = "";
  };
  const extractAndUploadInlineImages = async (html) => {
    const imgRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g;
    let modifiedHtml = html;
    const matches = [...html.matchAll(imgRegex)];
    for (const m of matches) {
      const ext = m[1];
      const base64Content = m[2];
      const ghPath = `public/uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      await githubApi("write", ghPath, { content: base64Content, isBase64: true, message: `Upload imagem inline ${ghPath}` });
      modifiedHtml = modifiedHtml.replace(`data:image/${ext};base64,${base64Content}`, ghPath.replace("public", ""));
    }
    return modifiedHtml;
  };
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!post.title || !post.slug) {
      setError("Título e Slug (URL) são obrigatórios.");
      return;
    }
    setSaving(true);
    setError("");
    triggerToast("Processando e salvando artigo...", "progress", 20);
    try {
      let finalHeroImage = post.heroImage;
      if (pendingUploads["heroImage"]) {
        const fileObj = pendingUploads["heroImage"];
        const base64Content = await fileToBase64(fileObj);
        const fileExt = fileObj.name.split(".").pop() || "jpg";
        const ghPath = `public/uploads/${Date.now()}-blog-cover.${fileExt}`;
        await githubApi("write", ghPath, { content: base64Content, isBase64: true, message: `Upload capa blog ${ghPath}` });
        finalHeroImage = ghPath.replace("public", "");
      }
      const cleanedContent = post.content.replace(/&nbsp;/g, " ").replace(/\u00A0/g, " ");
      const finalHtmlContent = await extractAndUploadInlineImages(cleanedContent);
      let finalPubDate = post.pubDate;
      if (originalPubDateISO && originalPubDateISO.split("T")[0] === post.pubDate) {
        finalPubDate = originalPubDateISO;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(post.pubDate)) {
        finalPubDate = `${post.pubDate}T${(/* @__PURE__ */ new Date()).toISOString().slice(11, 19)}.000Z`;
      }
      const markdown = `---
title: "${yamlEscape(post.title)}"
description: "${yamlEscape(post.description)}"
pubDate: "${finalPubDate}"
heroImage: "${yamlEscape(finalHeroImage)}"
category: "${yamlEscape(post.category)}"
author: "${yamlEscape(post.author)}"
draft: ${post.draft}
---
${finalHtmlContent}`;
      const targetPath = `src/content/blog/${post.slug}.md`;
      const res = await githubApi("write", targetPath, { content: markdown, sha: fileSha || void 0, message: `CMS: ${isEditing ? "Edição" : "Criação"} do artigo ${post.slug}` });
      if (res.sha) setFileSha(res.sha);
      setPendingUploads({});
      triggerToast("Artigo salvo com sucesso!", "success", 100);
      if (!isEditing) setTimeout(() => {
        window.location.href = "/admin/posts";
      }, 1500);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando editor..." })
  ] });
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("a", { href: "/admin/posts", className: "text-slate-400 hover:text-violet-600 transition-colors p-1.5 rounded-lg hover:bg-violet-50", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: isEditing ? "Editar Artigo" : "Novo Artigo" }),
          post.slug && /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-slate-400", children: [
            "/blog/",
            post.slug
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setIsPreview(!isPreview), className: "flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors", children: [
          isPreview ? /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
          isPreview ? "Editor" : "Preview"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: handleSave, disabled: saving, className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20", children: [
          saving && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          saving ? "Salvando..." : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            " ",
            isEditing ? "Salvar" : "Publicar"
          ] })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium mb-6 rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-6 items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título do Artigo *" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: post.title, onChange: (e) => handleTitleChange(e.target.value), className: inputClass, placeholder: "Título do artigo..." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Slug (URL) *" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: post.slug, onChange: (e) => setPost((p) => ({ ...p, slug: slugify(e.target.value) })), className: `${inputClass} font-mono text-xs`, placeholder: "url-do-artigo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descrição / Meta Description" }),
            /* @__PURE__ */ jsx("textarea", { rows: 2, value: post.description, onChange: (e) => setPost((p) => ({ ...p, description: e.target.value })), className: `${inputClass} resize-none`, placeholder: "Breve descrição do artigo..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Conteúdo do Artigo" }),
          isPreview ? /* @__PURE__ */ jsx("div", { className: "prose prose-slate max-w-none border border-slate-200 rounded-xl p-6 min-h-[300px]", dangerouslySetInnerHTML: { __html: post.content } }) : QuillEditor ? /* @__PURE__ */ jsx(
            QuillEditor,
            {
              theme: "snow",
              value: post.content,
              onChange: (val) => setPost((p) => ({ ...p, content: val })),
              style: { minHeight: "300px" }
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center p-12 text-slate-400", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin mr-2" }),
            "Carregando editor..."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-72 shrink-0 space-y-4 sticky top-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-700 text-sm border-b border-slate-100 pb-3 mb-4", children: "Publicação" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Status" }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-violet-50 transition-colors", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: post.draft, onChange: (e) => setPost((p) => ({ ...p, draft: e.target.checked })), className: "rounded border-slate-300 text-violet-600 focus:ring-violet-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Salvar como rascunho" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Data de Publicação" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: post.pubDate, onChange: (e) => setPost((p) => ({ ...p, pubDate: e.target.value })), className: inputClass })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-700 text-sm border-b border-slate-100 pb-3 mb-4", children: "Metadados" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Categoria" }),
              dynamicCategories.length > 0 ? /* @__PURE__ */ jsxs("select", { value: post.category, onChange: (e) => setPost((p) => ({ ...p, category: e.target.value })), className: inputClass, children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecionar categoria..." }),
                dynamicCategories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
              ] }) : /* @__PURE__ */ jsx("input", { type: "text", value: post.category, onChange: (e) => setPost((p) => ({ ...p, category: e.target.value })), className: inputClass, placeholder: "Ex: Tecnologia" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Autor" }),
              authors.length > 0 ? /* @__PURE__ */ jsxs("select", { value: post.author, onChange: (e) => setPost((p) => ({ ...p, author: e.target.value })), className: inputClass, children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecionar autor..." }),
                authors.map((a) => /* @__PURE__ */ jsx("option", { value: a.name, children: a.name }, a.id))
              ] }) : /* @__PURE__ */ jsx("input", { type: "text", value: post.author, onChange: (e) => setPost((p) => ({ ...p, author: e.target.value })), className: inputClass, placeholder: "Nome do autor" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-700 text-sm border-b border-slate-100 pb-3 mb-4", children: "Imagem de Capa" }),
          /* @__PURE__ */ jsxs("label", { className: "group relative border-2 border-dashed border-slate-200 hover:border-violet-400 bg-slate-50 hover:bg-violet-50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-center overflow-hidden", style: { minHeight: "120px" }, children: [
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => handleFileSelect(e, "heroImage") }),
            post.heroImage ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("img", { src: post.heroImage, alt: "Capa", className: "absolute inset-0 w-full h-full object-cover group-hover:opacity-60 transition-opacity" }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20", children: [
                /* @__PURE__ */ jsx(Image, { className: "w-8 h-8 text-slate-800" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-900 mt-1", children: "Trocar imagem" })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "py-6 flex flex-col items-center text-slate-400 group-hover:text-violet-500 transition-colors", children: [
              /* @__PURE__ */ jsx(Image, { className: "w-8 h-8 mb-2" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Enviar imagem de capa" })
            ] })
          ] }),
          pendingUploads["heroImage"] && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-amber-600 font-bold block mt-2", children: "Upload pendente — será enviado ao salvar" })
        ] }),
        /* @__PURE__ */ jsx(
          SEOScoreWidget,
          {
            title: post.title,
            description: post.description,
            heroImage: post.heroImage,
            content: post.content
          }
        )
      ] })
    ] })
  ] });
}

export { PostEditor as P };
