import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, ShoppingCart, Package, Zap, Tag, Settings, Plus, AlertCircle, Trash2, Save, Copy, Edit2, ToggleRight, ToggleLeft, TrendingUp, KeyRound, EyeOff, Eye } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

const PRODUCTS_PATH = "src/data/affiliateProducts.json";
const CONFIG_PATH = "src/data/pluginsConfig.json";
const defaultConfig = {
  enabled: true,
  amazonTag: "",
  amazonAccessKey: "",
  amazonSecretKey: "",
  defaultButtonText: "Ver na Amazon",
  buttonColor: "#FF9900",
  showPrices: true,
  showRatings: true,
  showProscons: true,
  showBadges: true,
  disclaimer: "Este artigo contém links de afiliado. Podemos receber uma comissão por compras feitas através deles.",
  showDisclaimer: true
};
const emptyProduct = () => ({
  slug: "",
  title: "",
  description: "",
  image: "",
  amazonUrl: "",
  extraLinks: [],
  price: "",
  originalPrice: "",
  rating: 4.5,
  pros: [],
  cons: [],
  badge: "",
  buttonText: "",
  enabled: true
});
const BADGE_OPTIONS = [
  "",
  "Melhor Escolha",
  "Mais Vendido",
  "Melhor Custo-Benefício",
  "Recomendado",
  "Editor's Choice",
  "Premium",
  "Orçamento"
];
const BADGE_STYLES = {
  "Melhor Escolha": { bg: "bg-amber-100", text: "text-amber-800", icon: "🏆" },
  "Mais Vendido": { bg: "bg-green-100", text: "text-green-800", icon: "🔥" },
  "Melhor Custo-Benefício": { bg: "bg-blue-100", text: "text-blue-800", icon: "💡" },
  "Recomendado": { bg: "bg-violet-100", text: "text-violet-800", icon: "⭐" },
  "Editor's Choice": { bg: "bg-rose-100", text: "text-rose-800", icon: "✍️" },
  "Premium": { bg: "bg-purple-100", text: "text-purple-800", icon: "💎" },
  "Orçamento": { bg: "bg-slate-100", text: "text-slate-700", icon: "💰" }
};
function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
    [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx(
      "span",
      {
        className: i < full ? "text-amber-400" : i === full && half ? "text-amber-300" : "text-slate-200",
        style: { fontSize: "12px" },
        children: "★"
      },
      i
    )),
    /* @__PURE__ */ jsx("span", { className: "ml-1 text-slate-500 text-xs font-bold tabular-nums", children: Number(rating).toFixed(1) })
  ] });
}
function LivePreview({
  form,
  prosText,
  consText,
  buttonColor,
  defaultButtonText
}) {
  const pros = prosText.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const cons = consText.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const btnText = form.buttonText || defaultButtonText;
  const badgeInfo = form.badge ? BADGE_STYLES[form.badge] : null;
  const hasContent = !!(form.title || form.image || form.price);
  if (!hasContent) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-56 text-center px-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(Eye, { className: "w-6 h-6 text-amber-300" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-400", children: "Preencha os dados" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 mt-1", children: "A prévia do card aparece aqui" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm", children: [
    form.badge && badgeInfo && /* @__PURE__ */ jsxs("div", { className: `px-3 py-1.5 ${badgeInfo.bg} ${badgeInfo.text} font-bold uppercase tracking-wider flex items-center gap-1.5`, style: { fontSize: "10px" }, children: [
      /* @__PURE__ */ jsx("span", { children: badgeInfo.icon }),
      form.badge
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-3", children: [
      form.image && /* @__PURE__ */ jsx("div", { className: "w-16 h-16 shrink-0 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: form.image,
          alt: "",
          className: "w-full h-full object-contain",
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 leading-tight mb-1 line-clamp-2", style: { fontSize: "12px" }, children: form.title || /* @__PURE__ */ jsx("span", { className: "text-slate-300 font-normal", children: "Título do produto..." }) }),
        form.rating > 0 && /* @__PURE__ */ jsx(StarRating, { rating: form.rating }),
        form.price && /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5 mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-amber-700", style: { fontSize: "13px" }, children: form.price }),
          form.originalPrice && /* @__PURE__ */ jsx("span", { className: "text-slate-400 line-through", style: { fontSize: "10px" }, children: form.originalPrice })
        ] })
      ] })
    ] }),
    (pros.length > 0 || cons.length > 0) && /* @__PURE__ */ jsxs("div", { className: "px-3 pb-2 grid grid-cols-2 gap-x-2", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: pros.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1 text-slate-600", style: { fontSize: "11px" }, children: [
        /* @__PURE__ */ jsx("span", { className: "text-green-500 shrink-0 mt-0.5 font-bold", children: "✓" }),
        /* @__PURE__ */ jsx("span", { className: "leading-tight", children: p })
      ] }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: cons.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1 text-slate-600", style: { fontSize: "11px" }, children: [
        /* @__PURE__ */ jsx("span", { className: "text-red-400 shrink-0 mt-0.5 font-bold", children: "✗" }),
        /* @__PURE__ */ jsx("span", { className: "leading-tight", children: c })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-3 pb-3", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "text-white font-bold text-center py-2 rounded-lg",
        style: { background: buttonColor, fontSize: "11px" },
        children: [
          btnText,
          " →"
        ]
      }
    ) })
  ] });
}
const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-0.5";
function AffiliateManager() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [productsSha, setProductsSha] = useState("");
  const [configSha, setConfigSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct());
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");
  const [extraLinks, setExtraLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [asinInput, setAsinInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const activeCount = products.filter((p) => p.enabled !== false).length;
  useEffect(() => {
    Promise.all([
      githubApi("read", PRODUCTS_PATH).catch(() => null),
      githubApi("read", CONFIG_PATH).catch(() => null)
    ]).then(([prodData, cfgData]) => {
      if (prodData) {
        const arr = JSON.parse(prodData.content);
        setProducts(Array.isArray(arr) ? arr : []);
        setProductsSha(prodData.sha);
      }
      if (cfgData) {
        const cfg = JSON.parse(cfgData.content);
        setFullConfig(cfg);
        setConfigSha(cfgData.sha);
        if (cfg.affiliates) setConfig({ ...defaultConfig, ...cfg.affiliates });
      }
    }).finally(() => setLoading(false));
  }, []);
  const saveProducts = async (newList) => {
    setSaving(true);
    setError("");
    try {
      const res = await githubApi("write", PRODUCTS_PATH, {
        content: JSON.stringify(newList, null, 2),
        sha: productsSha || void 0,
        message: "CMS: Update affiliate products"
      });
      setProductsSha(res.sha || productsSha);
      setProducts(newList);
      triggerToast("Produtos salvos!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const saveConfig = async () => {
    if (!fullConfig) return;
    setSavingConfig(true);
    setError("");
    try {
      const newFullConfig = { ...fullConfig, affiliates: config };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(newFullConfig, null, 4),
        sha: configSha || void 0,
        message: "CMS: Update affiliates config"
      });
      setConfigSha(res.sha || configSha);
      setFullConfig(newFullConfig);
      triggerToast("Configurações salvas!", "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSavingConfig(false);
    }
  };
  const importFromAmazon = async () => {
    const asin = asinInput.trim();
    if (!asin) return;
    setImporting(true);
    try {
      const res = await fetch("/api/admin/amazon-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asin,
          accessKey: config.amazonAccessKey || void 0,
          secretKey: config.amazonSecretKey || void 0,
          partnerTag: config.amazonTag || void 0
        })
      });
      const data = await res.json();
      if (!res.ok) {
        triggerToast(data.error || "Erro ao buscar produto", "error");
        return;
      }
      const features = data.features ?? [];
      const pros = features.slice(0, 4).join("\n");
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        image: data.image || f.image,
        price: data.price || f.price,
        originalPrice: data.originalPrice || f.originalPrice,
        rating: data.rating || f.rating,
        amazonUrl: data.amazonUrl || f.amazonUrl,
        slug: f.slug || slugify(data.title)
      }));
      if (pros) setProsText(pros);
      triggerToast("Dados importados com sucesso!", "success");
      setAsinInput("");
    } catch (e) {
      triggerToast(e.message, "error");
    } finally {
      setImporting(false);
    }
  };
  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyProduct());
    setProsText("");
    setConsText("");
    setExtraLinks([]);
    setShowForm(true);
  };
  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      image: p.image,
      amazonUrl: p.amazonUrl,
      extraLinks: p.extraLinks || [],
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      pros: p.pros,
      cons: p.cons,
      badge: p.badge,
      buttonText: p.buttonText,
      enabled: p.enabled
    });
    setProsText((p.pros || []).join("\n"));
    setConsText((p.cons || []).join("\n"));
    setExtraLinks(p.extraLinks || []);
    setShowForm(true);
  };
  const handleFormSave = () => {
    if (!form.title.trim()) {
      triggerToast("Preencha o título do produto", "error");
      return;
    }
    const hasMainUrl = form.amazonUrl.trim().length > 0;
    const hasExtraUrl = extraLinks.some((l) => l.url.trim().length > 0);
    if (!hasMainUrl && !hasExtraUrl) {
      triggerToast("Adicione pelo menos um link (Amazon ou outra loja)", "error");
      return;
    }
    const finalSlug = form.slug.trim() || slugify(form.title);
    const finalPros = prosText.split("\n").map((s) => s.trim()).filter(Boolean);
    const finalCons = consText.split("\n").map((s) => s.trim()).filter(Boolean);
    const product = {
      ...form,
      slug: finalSlug,
      pros: finalPros,
      cons: finalCons,
      extraLinks: extraLinks.filter((l) => l.label.trim() && l.url.trim()),
      id: editingId || `p_${Date.now()}`
    };
    const newList = editingId ? products.map((p) => p.id === editingId ? product : p) : [...products, product];
    setShowForm(false);
    setEditingId(null);
    saveProducts(newList);
  };
  const handleDelete = (id) => {
    if (!confirm("Remover este produto?")) return;
    saveProducts(products.filter((p) => p.id !== id));
  };
  const handleToggle = (id) => {
    saveProducts(products.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };
  const copyShortcode = (slug) => {
    navigator.clipboard.writeText(`[affiliate:${slug}]`);
    triggerToast("Shortcode copiado!", "success", 100);
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-amber-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando produtos..." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl space-y-5", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-2xl overflow-hidden p-6 text-white",
        style: {
          background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)",
          boxShadow: "0 8px 32px -4px rgba(245, 158, 11, 0.35)"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsx("h2", { className: "font-black text-xl tracking-tight", children: "Afiliados" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-amber-100 text-sm font-medium ml-12", children: "Amazon, Mercado Livre, Magalu, Shopee — produtos com prós, contras e CTA via shortcode" })
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${config.enabled ? "bg-white/15 border-white/30 text-white" : "bg-black/20 border-black/20 text-white/50"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-1.5 h-1.5 rounded-full ${config.enabled ? "bg-green-300 animate-pulse" : "bg-white/30"}` }),
                  config.enabled ? "Plugin ativo" : "Desativado"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
            {
              icon: /* @__PURE__ */ jsx(Package, { className: "w-3.5 h-3.5 text-amber-200" }),
              value: products.length,
              label: "Produtos",
              mono: false
            },
            {
              icon: /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-green-300" }),
              value: activeCount,
              label: "Ativos",
              mono: false
            },
            {
              icon: /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5 text-amber-200" }),
              value: config.amazonTag || "—",
              label: "Associate Tag",
              mono: true
            },
            {
              icon: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-3.5 h-3.5 rounded-full border-2 border-white/40",
                  style: { background: config.buttonColor }
                }
              ),
              value: config.buttonColor,
              label: "Cor CTA",
              mono: true
            }
          ].map((stat, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20",
              children: [
                stat.icon,
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `font-black leading-none ${stat.mono ? "font-mono text-sm" : "text-lg tabular-nums"}`, children: stat.value }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-amber-200 uppercase tracking-wide font-bold mt-0.5", children: stat.label })
                ] })
              ]
            },
            i
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1 bg-slate-100 p-1 rounded-xl", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setTab("products"),
            className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === "products" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
            children: [
              /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
              " Produtos"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setTab("settings"),
            className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === "settings" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
            children: [
              /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
              " Configurações"
            ]
          }
        )
      ] }),
      tab === "products" && !showForm && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAdd,
          className: "text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95",
          style: {
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            boxShadow: "0 4px 12px -2px rgba(245, 158, 11, 0.4)"
          },
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Novo Produto"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
    tab === "products" && /* @__PURE__ */ jsxs(Fragment, { children: [
      showForm && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-t-2xl", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: editingId ? "✏️ Editar Produto" : "✨ Novo Produto" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Preencha os dados — a prévia ao vivo atualiza instantaneamente →" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setShowForm(false);
                setEditingId(null);
              },
              className: "text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors",
              children: "Cancelar"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1fr_300px] divide-y lg:divide-y-0 lg:divide-x divide-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: asinInput,
                  onChange: (e) => setAsinInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && importFromAmazon(),
                  className: "w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all",
                  placeholder: "ASIN (ex: B09XS7JWHH)"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: importFromAmazon,
                  disabled: importing || !asinInput.trim(),
                  className: "flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap",
                  children: importing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }),
                    " Buscando..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(ShoppingCart, { className: "w-3.5 h-3.5" }),
                    " Importar da Amazon"
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: form.title,
                    onChange: (e) => {
                      const title = e.target.value;
                      setForm((f) => ({ ...f, title, slug: f.slug || slugify(title) }));
                    },
                    className: inputClass,
                    placeholder: "Sony WH-1000XM5",
                    autoFocus: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Slug (auto)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: form.slug,
                    onChange: (e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) })),
                    className: `${inputClass} font-mono`,
                    placeholder: "sony-wh-1000xm5"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Descrição curta" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.description,
                  onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                  className: inputClass,
                  placeholder: "Fone com cancelamento de ruído líder de mercado."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_auto] gap-3 items-end", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "URL da Imagem" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: form.image,
                    onChange: (e) => setForm((f) => ({ ...f, image: e.target.value })),
                    className: inputClass,
                    placeholder: "https://m.media-amazon.com/images/..."
                  }
                )
              ] }),
              form.image && /* @__PURE__ */ jsx(
                "img",
                {
                  src: form.image,
                  alt: "preview",
                  className: "w-14 h-14 object-contain rounded-xl border border-slate-200 bg-slate-50 shadow-sm",
                  onError: (e) => {
                    e.target.style.opacity = "0";
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                "URL principal ",
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-normal normal-case tracking-normal", children: "— Amazon ou outra loja (opcional se houver lojas adicionais abaixo)" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "url",
                  value: form.amazonUrl,
                  onChange: (e) => setForm((f) => ({ ...f, amazonUrl: e.target.value })),
                  className: `${inputClass} font-mono text-xs`,
                  placeholder: "https://www.amazon.com.br/dp/... ou https://www.mercadolivre.com.br/..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("label", { className: `${labelClass} mb-0`, children: "Links adicionais" }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setExtraLinks((l) => [...l, { label: "", url: "" }]),
                    className: "flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                      " Adicionar loja"
                    ]
                  }
                )
              ] }),
              extraLinks.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Mercado Livre, Magalu, Shopee..." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: extraLinks.map((link, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-500 flex-1", children: [
                    "Loja ",
                    i + 1
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setExtraLinks((ls) => ls.filter((_, j) => j !== i)),
                      className: "p-1 text-slate-300 hover:text-red-500 rounded transition-colors",
                      children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: link.label,
                      onChange: (e) => setExtraLinks((ls) => ls.map((l, j) => j === i ? { ...l, label: e.target.value } : l)),
                      className: inputClass,
                      placeholder: "Nome da loja (ex: Mercado Livre)"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "url",
                      value: link.url,
                      onChange: (e) => setExtraLinks((ls) => ls.map((l, j) => j === i ? { ...l, url: e.target.value } : l)),
                      className: `${inputClass} font-mono text-xs`,
                      placeholder: "https://link-do-produto..."
                    }
                  )
                ] })
              ] }, i)) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Preço" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: form.price,
                    onChange: (e) => setForm((f) => ({ ...f, price: e.target.value })),
                    className: inputClass,
                    placeholder: "R$ 1.899"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Preço Original" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: form.originalPrice,
                    onChange: (e) => setForm((f) => ({ ...f, originalPrice: e.target.value })),
                    className: inputClass,
                    placeholder: "R$ 2.299"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Rating (1–5)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: 1,
                    max: 5,
                    step: 0.5,
                    value: form.rating,
                    onChange: (e) => setForm((f) => ({ ...f, rating: Number(e.target.value) })),
                    className: inputClass
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Prós (1 por linha)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: prosText,
                    onChange: (e) => setProsText(e.target.value),
                    rows: 4,
                    className: inputClass,
                    placeholder: "Cancelamento excepcional\nBateria 30h\nConforto premium"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Contras (1 por linha)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: consText,
                    onChange: (e) => setConsText(e.target.value),
                    rows: 4,
                    className: inputClass,
                    placeholder: "Preço alto\nSem case rígido\nNão dobrável"
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Badge" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: form.badge,
                    onChange: (e) => setForm((f) => ({ ...f, badge: e.target.value })),
                    className: inputClass,
                    children: BADGE_OPTIONS.map((b) => /* @__PURE__ */ jsx("option", { value: b, children: b || "— Sem badge —" }, b))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: labelClass, children: "Texto do Botão" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: form.buttonText,
                    onChange: (e) => setForm((f) => ({ ...f, buttonText: e.target.value })),
                    className: inputClass,
                    placeholder: config.defaultButtonText
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors w-fit", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form.enabled,
                  onChange: (e) => setForm((f) => ({ ...f, enabled: e.target.checked })),
                  className: "rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Produto ativo (visível nos posts)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2 border-t border-slate-100", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleFormSave,
                  disabled: saving,
                  className: "disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95",
                  style: { background: "linear-gradient(135deg, #f59e0b, #f97316)" },
                  children: [
                    saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                    saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar produto"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setShowForm(false);
                    setEditingId(null);
                  },
                  className: "px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all",
                  children: "Cancelar"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-5 bg-gradient-to-b from-slate-50/80 to-slate-100/40 rounded-br-2xl", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Prévia ao vivo" })
            ] }),
            /* @__PURE__ */ jsx(
              LivePreview,
              {
                form,
                prosText,
                consText,
                buttonColor: config.buttonColor,
                defaultButtonText: config.defaultButtonText
              }
            ),
            (form.slug || form.title) && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-2", children: "Shortcode para usar no post" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("code", { className: "text-xs bg-white border border-amber-200 rounded-lg px-2 py-1.5 font-mono text-amber-800 flex-1 truncate", children: [
                  "[affiliate:",
                  form.slug || slugify(form.title) || "seu-produto",
                  "]"
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      navigator.clipboard.writeText(`[affiliate:${form.slug || slugify(form.title)}]`);
                      triggerToast("Shortcode copiado!", "success", 100);
                    },
                    className: "p-1.5 text-amber-500 hover:text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors shrink-0",
                    children: /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ] })
          ] }) })
        ] })
      ] }),
      !showForm && products.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-7 h-7 text-amber-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-700 mb-2 text-lg", children: "Nenhum produto ainda" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed", children: "Cadastre produtos da Amazon e insira-os nos seus posts com um shortcode simples" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleAdd,
            className: "text-white px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-all active:scale-95",
            style: {
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              boxShadow: "0 4px 16px -2px rgba(245, 158, 11, 0.45)"
            },
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              " Cadastrar primeiro produto"
            ]
          }
        )
      ] }),
      !showForm && products.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: products.map((p) => {
        const badgeInfo = p.badge ? BADGE_STYLES[p.badge] : null;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `bg-white rounded-2xl border transition-all group ${!p.enabled ? "border-slate-100 opacity-60" : "border-slate-200 hover:border-amber-200 hover:shadow-sm hover:shadow-amber-50"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0", children: p.image ? /* @__PURE__ */ jsx("img", { src: p.image, alt: p.title, className: "w-full h-full object-contain" }) : /* @__PURE__ */ jsx(ShoppingCart, { className: "w-6 h-6 text-slate-200" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 leading-tight", children: p.title }),
                  p.badge && badgeInfo && /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeInfo.bg} ${badgeInfo.text}`, children: [
                    badgeInfo.icon,
                    " ",
                    p.badge
                  ] }),
                  !p.enabled && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400", children: "Inativo" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap mt-1", children: [
                  p.rating > 0 && /* @__PURE__ */ jsx(StarRating, { rating: p.rating }),
                  p.price && /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-amber-700", children: p.price }),
                  p.originalPrice && /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 line-through", children: p.originalPrice }),
                  p.extraLinks && p.extraLinks.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-400 font-medium", children: [
                    "+",
                    p.extraLinks.length,
                    " loja",
                    p.extraLinks.length > 1 ? "s" : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-1.5", children: [
                  /* @__PURE__ */ jsxs("code", { className: "text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-mono", children: [
                    "[affiliate:",
                    p.slug,
                    "]"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => copyShortcode(p.slug),
                      title: "Copiar shortcode",
                      className: "p-1 text-amber-400 hover:text-amber-600 transition-colors rounded",
                      children: /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleEdit(p),
                    title: "Editar",
                    className: "p-2 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors",
                    children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleToggle(p.id),
                    title: p.enabled ? "Desativar" : "Ativar",
                    className: "p-2 transition-colors",
                    children: p.enabled ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-5 h-5 text-amber-500" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-5 h-5 text-slate-300" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(p.id),
                    title: "Remover",
                    className: "p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] })
          },
          p.id
        );
      }) }),
      !showForm && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-100 p-5 bg-gradient-to-br from-amber-50 to-orange-50/60", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5" }),
          "Como usar nos artigos"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [
          { code: "[affiliate:slug]", desc: "Card completo com imagem, prós/contras e botão CTA" },
          { code: "[affiliate-compare:slug1,slug2]", desc: "Comparativo lado a lado entre dois ou mais produtos" }
        ].map((item) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-start gap-3 bg-white/70 rounded-xl p-3 border border-amber-100",
            children: [
              /* @__PURE__ */ jsx("code", { className: "text-xs bg-white border border-amber-200 rounded-lg px-2 py-1 font-mono text-amber-800 shrink-0 shadow-sm whitespace-nowrap", children: item.code }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-amber-800 font-medium pt-1", children: item.desc })
            ]
          },
          item.code
        )) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600/70 mt-3 ml-0.5", children: "O shortcode deve estar em uma linha isolada no markdown do post." })
      ] })
    ] }),
    tab === "settings" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Amazon Associate Tag ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: config.amazonTag,
              onChange: (e) => setConfig((c) => ({ ...c, amazonTag: e.target.value })),
              className: `${inputClass} font-mono`,
              placeholder: "meublog-20"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1.5 ml-1", children: [
            "Adicionado automaticamente em todos os links (",
            /* @__PURE__ */ jsx("code", { className: "font-mono", children: "?tag=..." }),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Texto padrão do botão" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: config.defaultButtonText,
              onChange: (e) => setConfig((c) => ({ ...c, defaultButtonText: e.target.value })),
              className: inputClass,
              placeholder: "Ver na Amazon"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "Cor do botão CTA" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              value: config.buttonColor,
              onChange: (e) => setConfig((c) => ({ ...c, buttonColor: e.target.value })),
              className: "w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1 shadow-sm"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: config.buttonColor,
              onChange: (e) => setConfig((c) => ({ ...c, buttonColor: e.target.value })),
              className: `${inputClass} font-mono flex-1`,
              placeholder: "#FF9900"
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "shrink-0 px-4 py-2.5 rounded-xl text-white text-sm font-bold whitespace-nowrap shadow-sm",
              style: { background: config.buttonColor },
              children: [
                config.defaultButtonText,
                " →"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "Texto do Disclaimer" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: config.disclaimer,
            onChange: (e) => setConfig((c) => ({ ...c, disclaimer: e.target.value })),
            rows: 2,
            className: inputClass,
            placeholder: "Este artigo contém links de afiliado..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-slate-200 rounded-2xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "w-4 h-4 text-amber-500" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: "Credenciais PA-API 5.0" }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-slate-400", children: 'Necessário para "Importar da Amazon"' })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Access Key" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: config.amazonAccessKey,
                onChange: (e) => setConfig((c) => ({ ...c, amazonAccessKey: e.target.value })),
                className: `${inputClass} font-mono`,
                placeholder: "AKIAIOSFODNN7EXAMPLE",
                autoComplete: "off"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Secret Key" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showSecretKey ? "text" : "password",
                  value: config.amazonSecretKey,
                  onChange: (e) => setConfig((c) => ({ ...c, amazonSecretKey: e.target.value })),
                  className: `${inputClass} font-mono pr-10`,
                  placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCY",
                  autoComplete: "new-password"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowSecretKey((v) => !v),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
                  children: showSecretKey ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1 ml-0.5", children: [
          "As chaves são salvas no ",
          /* @__PURE__ */ jsx("code", { className: "font-mono", children: "pluginsConfig.json" }),
          " do seu repositório. Mantenha-o privado."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 pt-5", children: [
        /* @__PURE__ */ jsx("p", { className: labelClass, children: "Visibilidade dos elementos" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: [
          ["showPrices", "Mostrar preços"],
          ["showRatings", "Mostrar avaliações (★)"],
          ["showProscons", "Mostrar prós e contras"],
          ["showBadges", "Mostrar badges"],
          ["showDisclaimer", "Disclaimer no topo do post"],
          ["enabled", "Plugin ativo"]
        ].map(([key, label]) => /* @__PURE__ */ jsxs(
          "label",
          {
            className: "flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors",
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!config[key],
                  onChange: (e) => setConfig((c) => ({ ...c, [key]: e.target.checked })),
                  className: "rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: label })
            ]
          },
          key
        )) })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: saveConfig,
          disabled: savingConfig,
          className: "disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95",
          style: { background: "linear-gradient(135deg, #f59e0b, #f97316)" },
          children: [
            savingConfig ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            savingConfig ? "Salvando..." : "Salvar Configurações"
          ]
        }
      )
    ] })
  ] });
}

const prerender = false;
const $$Affiliates = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Amazon Affiliates", "activeSection": "affiliates" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Amazon Affiliates</h1> <p class="text-slate-500 mt-1">Gerencie produtos e links de afiliado para seus artigos.</p> </div> ${renderComponent($$result2, "AffiliateManager", AffiliateManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/affiliates/AffiliateManager", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/affiliates.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/affiliates.astro";
const $$url = "/admin/affiliates";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Affiliates,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
