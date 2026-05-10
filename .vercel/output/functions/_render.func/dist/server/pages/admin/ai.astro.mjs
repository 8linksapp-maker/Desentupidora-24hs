import { c as createComponent, b as renderTemplate, d as renderComponent, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Sparkles, ChevronUp, ChevronDown, Trash2, Plus, AlertCircle, EyeOff, Eye, CheckCircle, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
import { r as readData } from '../../chunks/readData_B59o9LcR.mjs';
export { renderers } from '../../renderers.mjs';

function AIPostGenerator({ authors, categories }) {
  const [isMounted, setIsMounted] = useState(false);
  const [postType, setPostType] = useState("informational");
  const [commercialSubType, setCommercialSubType] = useState("guia-melhores");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [outlines, setOutlines] = useState([]);
  const [commercialItems, setCommercialItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (title && !slug) {
      setSlug(title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  }, [title, slug]);
  if (!isMounted) return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center p-20 text-slate-400", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin mr-3" }),
    "Carregando gerador..."
  ] });
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const addOutline = (level) => setOutlines([...outlines, { level, text: "" }]);
  const updateOutline = (i, updates) => {
    const next = [...outlines];
    Object.assign(next[i], updates);
    setOutlines(next);
  };
  const removeOutline = (i) => setOutlines(outlines.filter((_, idx) => idx !== i));
  const moveOutline = (i, dir) => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === outlines.length - 1) return;
    const next = [...outlines];
    const t = dir === "up" ? i - 1 : i + 1;
    [next[i], next[t]] = [next[t], next[i]];
    setOutlines(next);
  };
  const addCommercialItem = (type, level) => {
    if (type === "outline" && level) setCommercialItems([...commercialItems, { type: "outline", level, text: "" }]);
    else setCommercialItems([...commercialItems, { type: "product", name: "", imageUrl: "" }]);
  };
  const updateCommercialItem = (i, updates) => {
    const next = [...commercialItems];
    Object.assign(next[i], updates);
    setCommercialItems(next);
  };
  const removeCommercialItem = (i) => setCommercialItems(commercialItems.filter((_, idx) => idx !== i));
  const moveCommercialItem = (i, dir) => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === commercialItems.length - 1) return;
    const next = [...commercialItems];
    const t = dir === "up" ? i - 1 : i + 1;
    [next[i], next[t]] = [next[t], next[i]];
    setCommercialItems(next);
  };
  const handleGenerate = async () => {
    if (!title || !slug) {
      setError("Título e slug são obrigatórios.");
      return;
    }
    if (!author) {
      setError("Selecione um autor.");
      return;
    }
    if (!category) {
      setError("Selecione uma categoria.");
      return;
    }
    if (postType === "commercial") {
      const hasValid = commercialItems.some((i) => i.type === "outline" ? i.text?.trim() : i.name?.trim());
      if (!hasValid) {
        setError("Adicione pelo menos um produto ou outline.");
        return;
      }
    } else {
      if (!outlines.length || outlines.some((o) => !o.text.trim())) {
        setError("Adicione pelo menos uma outline preenchida.");
        return;
      }
    }
    setError("");
    setIsGenerating(true);
    setProgress("Conectando ao servidor...");
    try {
      const response = await fetch("/api/admin/plugins/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postType,
          commercialSubType: postType === "commercial" ? commercialSubType : void 0,
          title,
          slug,
          author,
          category,
          outlines: postType === "informational" ? outlines : void 0,
          commercialItems: postType === "commercial" ? commercialItems : void 0
        })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${response.status}`);
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.step === "progress") setProgress(data.message);
                if (data.step === "done") {
                  setProgress("Post publicado com sucesso!");
                  triggerToast(`Post "${data.title}" publicado!`, "success");
                  setTimeout(() => {
                    window.location.href = "/admin/posts";
                  }, 2e3);
                  return;
                }
                if (data.step === "error") throw new Error(data.error);
              } catch (e) {
                if (e instanceof Error && e.message !== "Unexpected end of JSON input") throw e;
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || "Erro ao gerar post");
      setProgress("");
    } finally {
      setIsGenerating(false);
    }
  };
  const levelColors = {
    h1: "bg-violet-100 text-violet-700",
    h2: "bg-blue-100 text-blue-700",
    h3: "bg-green-100 text-green-700",
    h4: "bg-amber-100 text-amber-700"
  };
  const canGenerate = title && slug && author && category && (postType === "informational" ? outlines.length > 0 && outlines.every((o) => o.text.trim()) : commercialItems.some((i) => i.type === "outline" ? i.text?.trim() : i.name?.trim()));
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl pb-16 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("a", { href: "/admin/posts", className: "text-slate-400 hover:text-violet-600 transition-colors p-1.5 rounded-lg hover:bg-violet-50", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-800", children: "Gerar Post com IA" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Conteúdo criado automaticamente por inteligência artificial" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6 text-violet-500" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("p", { className: labelClass, children: "Tipo de Post" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        { id: "informational", label: "Post Informacional", desc: "Artigos educativos e informativos", icon: "📚" },
        { id: "commercial", label: "Post Comercial", desc: "Guias e reviews focados em conversão", icon: "💼" }
      ].map((t) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setPostType(t.id),
          className: `p-4 rounded-xl border-2 text-left transition-all ${postType === t.id ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl mb-1", children: t.icon }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-800 text-sm", children: t.label }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: t.desc })
          ]
        },
        t.id
      )) }),
      postType === "commercial" && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("p", { className: labelClass, children: "Sub-tipo Comercial" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
          { id: "guia-melhores", label: "Guia dos melhores", desc: "Listas ranqueadas (ex: Os 10 melhores X)", icon: "📋" },
          { id: "spr", label: "SPR — Single Product Review", desc: "Review de um único produto/serviço", icon: "⭐" }
        ].map((s) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setCommercialSubType(s.id),
            className: `p-3 rounded-xl border-2 text-left transition-all ${commercialSubType === s.id ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-xl mb-1", children: s.icon }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-800 text-xs", children: s.label }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: s.desc })
            ]
          },
          s.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: labelClass, children: "Informações Básicas" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1.5", children: "Título *" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: inputClass, placeholder: "Ex: Como Cuidar da Sua Saúde Mental" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1.5", children: "Slug *" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: slug, onChange: (e) => setSlug(e.target.value), className: `${inputClass} font-mono`, placeholder: "como-cuidar-da-sua-saude-mental" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: "Gerado automaticamente do título — pode editar." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1.5", children: "Autor *" }),
          /* @__PURE__ */ jsxs("select", { value: author, onChange: (e) => setAuthor(e.target.value), className: inputClass, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Selecione um autor" }),
            authors.map((a) => /* @__PURE__ */ jsx("option", { value: a.slug, children: a.name }, a.slug))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1.5", children: "Categoria *" }),
          /* @__PURE__ */ jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: inputClass, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Selecione uma categoria" }),
            categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.slug, children: c.name }, c.slug))
          ] })
        ] })
      ] })
    ] }),
    postType === "informational" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: labelClass, children: "Estrutura do Post (Outlines)" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 ml-1", children: "Introdução e conclusão são geradas automaticamente." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1.5", children: ["h1", "h2", "h3", "h4"].map((l) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addOutline(l), className: `px-2.5 py-1 rounded-lg text-xs font-bold ${levelColors[l]} hover:opacity-80 transition-opacity`, children: [
          "+",
          l.toUpperCase()
        ] }, l)) })
      ] }),
      outlines.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: outlines.map((o, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs font-bold shrink-0 ${levelColors[o.level]}`, children: o.level.toUpperCase() }),
        /* @__PURE__ */ jsx("input", { type: "text", value: o.text, onChange: (e) => updateOutline(i, { text: e.target.value }), className: "flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500", placeholder: `Título do ${o.level.toUpperCase()}...` }),
        /* @__PURE__ */ jsx("input", { type: "number", min: 50, max: 2e3, value: o.minWords ?? "", onChange: (e) => {
          const v = parseInt(e.target.value);
          updateOutline(i, { minWords: isNaN(v) ? void 0 : Math.max(50, Math.min(2e3, v)) });
        }, className: "w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-violet-500", placeholder: "100-150", title: "Palavras alvo" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => moveOutline(i, "up"), disabled: i === 0, className: "text-slate-300 hover:text-slate-600 disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => moveOutline(i, "down"), disabled: i === outlines.length - 1, className: "text-slate-300 hover:text-slate-600 disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5" }) })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeOutline(i), className: "text-red-400 hover:text-red-600 transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
      ] }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 border-2 border-dashed border-slate-200 rounded-xl", children: [
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mb-1", children: "Nenhuma outline adicionada" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-300 text-xs", children: "Clique nos botões acima para adicionar títulos" })
      ] })
    ] }),
    postType === "commercial" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: labelClass, children: "Estrutura do Post" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 ml-1", children: "Adicione outlines e produtos na ordem desejada." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 flex-wrap justify-end", children: [
          ["h1", "h2", "h3", "h4"].map((l) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addCommercialItem("outline", l), className: `px-2.5 py-1 rounded-lg text-xs font-bold ${levelColors[l]} hover:opacity-80 transition-opacity`, children: [
            "+",
            l.toUpperCase()
          ] }, l)),
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => addCommercialItem("product"), className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 hover:opacity-80 transition-opacity flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
            " Produto"
          ] })
        ] })
      ] }),
      commercialItems.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: commercialItems.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          item.type === "outline" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("select", { value: item.level, onChange: (e) => updateCommercialItem(i, { level: e.target.value }), className: "w-16 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-violet-500 shrink-0", children: ["h1", "h2", "h3", "h4"].map((l) => /* @__PURE__ */ jsx("option", { value: l, children: l.toUpperCase() }, l)) }),
            /* @__PURE__ */ jsx("input", { type: "text", value: item.text, onChange: (e) => updateCommercialItem(i, { text: e.target.value }), className: "flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500", placeholder: "Título da seção..." }),
            /* @__PURE__ */ jsx("input", { type: "number", min: 50, max: 2e3, value: item.minWords ?? "", onChange: (e) => {
              const v = parseInt(e.target.value);
              updateCommercialItem(i, { minWords: isNaN(v) ? void 0 : Math.max(50, Math.min(2e3, v)) });
            }, className: "w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-violet-500", placeholder: "100-150" })
          ] }) : /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded text-xs font-bold shrink-0 bg-amber-100 text-amber-700", children: "Produto" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 shrink-0", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => moveCommercialItem(i, "up"), disabled: i === 0, className: "text-slate-300 hover:text-slate-600 disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => moveCommercialItem(i, "down"), disabled: i === commercialItems.length - 1, className: "text-slate-300 hover:text-slate-600 disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5" }) })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeCommercialItem(i), className: "text-red-400 hover:text-red-600 transition-colors shrink-0", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
        ] }),
        item.type === "product" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mt-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Nome do produto *" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: item.name, onChange: (e) => updateCommercialItem(i, { name: e.target.value }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500", placeholder: "Ex: Produto X Pro" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "URL da imagem" }),
            /* @__PURE__ */ jsx("input", { type: "url", value: item.imageUrl, onChange: (e) => updateCommercialItem(i, { imageUrl: e.target.value }), className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500", placeholder: "https://exemplo.com/img.jpg" })
          ] })
        ] })
      ] }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 border-2 border-dashed border-slate-200 rounded-xl", children: [
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm", children: "Nenhum item adicionado" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-300 text-xs mt-1", children: "Use os botões acima para adicionar outlines ou produtos" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
    progress && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border-2 border-violet-200 shadow-sm p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center shrink-0", children: isGenerating ? /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-violet-600 animate-pulse" }) : /* @__PURE__ */ jsx("span", { children: "✅" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800", children: isGenerating ? "Criando seu post..." : "Concluído!" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: progress }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1.5", children: isGenerating ? "Aguarde enquanto a IA escreve cada seção. Isso pode levar alguns minutos." : "Redirecionando para a lista de posts..." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
      /* @__PURE__ */ jsx("a", { href: "/admin/posts", className: "px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors", children: "Cancelar" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleGenerate,
          disabled: isGenerating || !canGenerate,
          className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20",
          children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            " Gerando..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
            " Gerar e Publicar Post"
          ] })
        }
      )
    ] })
  ] });
}

const CONFIG_PATH = "src/data/pluginsConfig.json";
const PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    badge: "GRATUITO",
    badgeClass: "bg-green-100 text-green-700",
    description: "Gemini 1.5 Flash — generoso plano gratuito, ideal para começar.",
    icon: "🟢",
    docsUrl: "https://aistudio.google.com/app/apikey",
    docsLabel: "Obter chave gratuita no Google AI Studio",
    placeholder: "AIzaSy..."
  },
  {
    id: "openai",
    name: "OpenAI",
    badge: "PAGO",
    badgeClass: "bg-amber-100 text-amber-700",
    description: "GPT-4o Mini — alta qualidade, requer saldo na conta OpenAI.",
    icon: "⚡",
    docsUrl: "https://platform.openai.com/api-keys",
    docsLabel: "Obter chave na plataforma OpenAI",
    placeholder: "sk-..."
  }
];
function SettingsAI() {
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [pexelsApiKey, setPexelsApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showPexelsKey, setShowPexelsKey] = useState(false);
  const [fileSha, setFileSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    githubApi("read", CONFIG_PATH).then((data) => {
      const config = JSON.parse(data.content);
      setFullConfig(config);
      setFileSha(data.sha);
      const ai = config?.ai || {};
      setProvider(ai.provider || "gemini");
      setApiKey(ai.apiKey || "");
      setPexelsApiKey(ai.pexelsApiKey || "");
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    triggerToast("Salvando configurações de IA...", "progress", 30);
    try {
      const updated = {
        ...fullConfig,
        ai: { provider, apiKey: apiKey.trim(), pexelsApiKey: pexelsApiKey.trim() }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update AI settings"
      });
      setFileSha(res.sha || fileSha);
      setFullConfig(updated);
      setSaved(true);
      triggerToast("Configurações de IA salvas!", "success", 100);
      setTimeout(() => setSaved(false), 3e3);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ ok: false, message: "Insira uma API Key antes de testar." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/plugins/ai/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: apiKey.trim() })
      });
      const data = await res.json();
      setTestResult({ ok: data.success, message: data.message });
    } catch {
      setTestResult({ ok: false, message: "Erro ao testar — verifique se o servidor está rodando." });
    } finally {
      setTesting(false);
    }
  };
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando configurações..." })
  ] });
  if (error && !fullConfig) return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 text-red-700 p-8 rounded-3xl border border-red-200 flex gap-4 items-start", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 shrink-0" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: "Erro de Leitura" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] })
  ] });
  const currentProvider = PROVIDERS.find((p) => p.id === provider);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xl shrink-0", children: "⚠️" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-amber-800 text-sm", children: "Repositório Privado Obrigatório" }),
        /* @__PURE__ */ jsxs("p", { className: "text-amber-700 text-xs mt-0.5 leading-relaxed", children: [
          "Sua API Key será salva em ",
          /* @__PURE__ */ jsx("code", { className: "bg-amber-100 px-1 rounded font-mono", children: "pluginsConfig.json" }),
          " no repositório. Certifique-se de que o repositório é ",
          /* @__PURE__ */ jsx("strong", { children: "privado" }),
          " no GitHub antes de salvar."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("p", { className: labelClass, children: "Provedor de IA" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: PROVIDERS.map((p) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            setProvider(p.id);
            setTestResult(null);
          },
          className: `p-4 rounded-xl border-2 text-left transition-all ${provider === p.id ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg", children: p.icon }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-sm", children: p.name }),
              /* @__PURE__ */ jsx("span", { className: `ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${p.badgeClass}`, children: p.badge })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: p.description })
          ]
        },
        p.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("p", { className: labelClass, children: [
          "API Key — ",
          currentProvider.name
        ] }),
        /* @__PURE__ */ jsxs("a", { href: currentProvider.docsUrl, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-violet-600 hover:underline", children: [
          currentProvider.docsLabel,
          " ↗"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: showKey ? "text" : "password",
            value: apiKey,
            onChange: (e) => {
              setApiKey(e.target.value);
              setTestResult(null);
            },
            placeholder: currentProvider.placeholder,
            className: `${inputClass} font-mono pr-12`
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowKey((v) => !v),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors",
            children: showKey ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
          }
        )
      ] }),
      apiKey && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: [
        apiKey.length,
        " caracteres"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("p", { className: labelClass, children: "API Key — Pexels (imagens)" }),
        /* @__PURE__ */ jsx("a", { href: "https://www.pexels.com/api/", target: "_blank", rel: "noopener noreferrer", className: "text-xs text-emerald-600 hover:underline", children: "Obter chave gratuita no Pexels ↗" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: showPexelsKey ? "text" : "password",
            value: pexelsApiKey,
            onChange: (e) => setPexelsApiKey(e.target.value),
            placeholder: "Chave da API Pexels (opcional)",
            className: `${inputClass} font-mono pr-12`
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowPexelsKey((v) => !v),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors",
            children: showPexelsKey ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: "Usada para inserir fotos automaticamente nos posts (1 a cada ~400 palavras, máx. 5)." })
    ] }),
    testResult && /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-xl border flex items-start gap-3 text-sm ${testResult.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`, children: [
      testResult.ok ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      testResult.message
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl border border-slate-200 p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3", children: "Status atual" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 text-sm", children: [
        { label: "Provedor", value: currentProvider.name, color: "text-slate-700 font-semibold" },
        { label: "API Key IA", value: apiKey ? "● Configurada" : "○ Não configurada", color: apiKey ? "text-green-600 font-semibold" : "text-red-500 font-semibold" },
        { label: "Pexels (imagens)", value: pexelsApiKey ? "● Configurada" : "○ Opcional", color: pexelsApiKey ? "text-green-600 font-semibold" : "text-slate-400" }
      ].map((row) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: row.label }),
        /* @__PURE__ */ jsx("span", { className: row.color, children: row.value })
      ] }, row.label)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleTest,
          disabled: testing || !apiKey.trim(),
          className: "px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2",
          children: [
            testing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "🧪",
            testing ? "Testando..." : "Testar Chave"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20",
          children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : saved ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            saving ? "Salvando..." : saved ? "Salvo!" : "Salvar Configurações"
          ]
        }
      )
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Ai = createComponent(($$result, $$props, $$slots) => {
  const authorsRaw = readData("authors.json", []);
  const categoriesRaw = readData("categories.json", []);
  const pluginsConfig = readData("pluginsConfig.json", {});
  const authors = authorsRaw.map((a) => ({ slug: a.id || a.slug, name: a.name }));
  const categories = categoriesRaw.map((c) => ({ slug: c, name: c }));
  const hasApiKey = !!pluginsConfig?.ai?.apiKey;
  const defaultTab = hasApiKey ? "generate" : "settings";
  return renderTemplate(_a || (_a = __template(["", " <script>\nfunction showTab(tab) {\n    var generate = document.getElementById('panel-generate');\n    var settings = document.getElementById('panel-settings');\n    var tabGenerate = document.getElementById('tab-generate');\n    var tabSettings = document.getElementById('tab-settings');\n\n    if (tab === 'generate') {\n        generate.classList.remove('hidden');\n        settings.classList.add('hidden');\n        tabGenerate.className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-violet-700 shadow-sm';\n        tabSettings.className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-600 hover:text-slate-900';\n    } else {\n        generate.classList.add('hidden');\n        settings.classList.remove('hidden');\n        tabGenerate.className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-600 hover:text-slate-900';\n        tabSettings.className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-violet-700 shadow-sm';\n    }\n}\n<\/script>"])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Gerar posts com IA", "activeSection": "ai" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Gerar posts com IA</h1> <p class="text-slate-500 mt-1">Gere posts completos automaticamente e configure as chaves de API.</p> </div>  <div class="mb-6"> <div class="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit"> <button id="tab-generate" onclick="showTab('generate')"${addAttribute(`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${defaultTab === "generate" ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`, "class")}>
✨ Gerar Post
</button> <button id="tab-settings" onclick="showTab('settings')"${addAttribute(`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${defaultTab === "settings" ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`, "class")}>
⚙️ Configurações${!hasApiKey && renderTemplate`<span class="ml-1.5 w-2 h-2 bg-amber-400 rounded-full inline-block"></span>`} </button> </div> </div> <div id="panel-generate"${addAttribute(defaultTab === "generate" ? "" : "hidden", "class")}> ${renderComponent($$result2, "AIPostGenerator", AIPostGenerator, { "client:load": true, "authors": authors, "categories": categories, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/ai-generator/AIPostGenerator", "client:component-export": "default" })} </div> <div id="panel-settings"${addAttribute(defaultTab === "settings" ? "" : "hidden", "class")}> ${renderComponent($$result2, "SettingsAI", SettingsAI, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/ai-generator/SettingsAI", "client:component-export": "default" })} </div> ` }));
}, "C:/Projects/desentupidora-temp/src/pages/admin/ai.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/ai.astro";
const $$url = "/admin/ai";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Ai,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
