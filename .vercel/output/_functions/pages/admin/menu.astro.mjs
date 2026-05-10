import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Navigation, Save, MousePointerClick, LayoutList, ChevronUp, ChevronDown, Trash2, Plus, ExternalLink } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
export { renderers } from '../../renderers.mjs';

function MenuEditor() {
  const [items, setItems] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [siteConfig, setSiteConfig] = useState(null);
  const [siteConfigSha, setSiteConfigSha] = useState("");
  const [menuHoverEnabled, setMenuHoverEnabled] = useState(true);
  useEffect(() => {
    Promise.all([
      githubApi("read", "src/data/menu.json").catch((err) => err.message.includes("404") ? null : Promise.reject(err)),
      githubApi("read", "src/data/siteConfig.json").catch(() => null)
    ]).then(([menuData, cfgData]) => {
      if (menuData) {
        const parsed = JSON.parse(menuData.content || "{}");
        setItems(Array.isArray(parsed.items) ? parsed.items : []);
        setFileSha(menuData.sha);
      }
      if (cfgData) {
        const cfg = JSON.parse(cfgData.content);
        setSiteConfig(cfg);
        setSiteConfigSha(cfgData.sha);
        setMenuHoverEnabled(cfg.menuHoverEnabled !== false);
      }
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  async function save() {
    setSaving(true);
    try {
      await githubApi("write", "src/data/menu.json", {
        content: JSON.stringify({ items }, null, 4),
        sha: fileSha
      });
      const fresh = await githubApi("read", "src/data/menu.json");
      setFileSha(fresh.sha);
      if (siteConfig && siteConfig.menuHoverEnabled !== menuHoverEnabled) {
        const newCfg = { ...siteConfig, menuHoverEnabled };
        await githubApi("write", "src/data/siteConfig.json", {
          content: JSON.stringify(newCfg, null, 4),
          sha: siteConfigSha
        });
        const freshCfg = await githubApi("read", "src/data/siteConfig.json");
        setSiteConfig(JSON.parse(freshCfg.content));
        setSiteConfigSha(freshCfg.sha);
      }
      triggerToast("success", "Menu atualizado!");
    } catch (err) {
      triggerToast("error", err.message);
    } finally {
      setSaving(false);
    }
  }
  function addItem() {
    setItems((prev) => [...prev, { label: "Novo Link", href: "/" }]);
  }
  function removeItem(i) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function moveUp(i) {
    if (i === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }
  function moveDown(i) {
    setItems((prev) => {
      if (i === prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }
  function updateItem(i, field, value) {
    setItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center h-64 gap-3 text-slate-500", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-violet-500" }),
    /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Carregando menu..." })
  ] });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200 max-w-lg", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-500 shrink-0" }),
    /* @__PURE__ */ jsx("span", { className: "text-red-700 text-sm", children: error })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Navigation, { className: "w-5 h-5 text-violet-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-bold text-slate-800 text-lg", children: "Menu de Navegação" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Itens do cabeçalho do site" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: save,
          disabled: saving,
          className: "flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-500 disabled:opacity-60 transition-all shadow-sm",
          children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            saving ? "Salvando..." : "Salvar"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(MousePointerClick, { className: "w-5 h-5 text-violet-600" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-800 text-sm", children: "Abrir submenu ao passar o mouse" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: menuHoverEnabled ? "O dropdown de categorias abre automaticamente quando o visitante passa o mouse." : "O dropdown só abre quando o visitante clica no item do menu." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setMenuHoverEnabled((v) => !v),
            className: `relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${menuHoverEnabled ? "bg-violet-600" : "bg-slate-200"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${menuHoverEnabled ? "translate-x-5" : "translate-x-0"}` })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-700", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold mb-1", children: "Dicas" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-0.5 text-violet-600 text-xs", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          "• Itens com ",
          /* @__PURE__ */ jsx("strong", { children: "Mostrar categorias" }),
          " exibem uma lista suspensa com todas as categorias do blog"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "• Para páginas do seu próprio site, escreva só o caminho (ex: ",
          /* @__PURE__ */ jsx("strong", { children: "/sobre" }),
          "). Para sites externos, cole o link completo"
        ] }),
        /* @__PURE__ */ jsx("li", { children: "• A ordem que aparece aqui é a ordem exibida no menu do site" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      items.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300", children: [
        /* @__PURE__ */ jsx(LayoutList, { className: "w-8 h-8 text-slate-300 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "Nenhum item no menu" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-xs mt-1", children: 'Clique em "Adicionar item" para começar' })
      ] }),
      items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 pt-0.5 shrink-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => moveUp(i),
                disabled: i === 0,
                className: "w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all",
                children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => moveDown(i),
                disabled: i === items.length - 1,
                className: "w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all",
                children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1", children: "Texto do link" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: item.label,
                  onChange: (e) => updateItem(i, "label", e.target.value),
                  placeholder: "Ex: Blog",
                  className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1", children: "URL / caminho" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: item.href,
                  onChange: (e) => updateItem(i, "href", e.target.value),
                  placeholder: "Ex: /blog",
                  className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => removeItem(i),
              className: "mt-5 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0",
              title: "Remover item",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 ml-10 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => updateItem(i, "showCategories", !item.showCategories),
              className: `relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none ${item.showCategories ? "bg-violet-600" : "bg-slate-200"}`,
              children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${item.showCategories ? "translate-x-4" : "translate-x-0"}` })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: "Mostrar dropdown de categorias" })
        ] })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: addItem,
        className: "w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-medium text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          "Adicionar item"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-400", children: [
      /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }),
      /* @__PURE__ */ jsx("span", { children: "As mudanças aparecem no site após salvar e recarregar a página." })
    ] })
  ] });
}

const prerender = false;
const $$Menu = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Menu", "activeSection": "menu" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Menu de Navegação</h1> <p class="text-slate-500 mt-1">Edite os itens do menu do cabeçalho do site.</p> </div> ${renderComponent($$result2, "MenuEditor", MenuEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/MenuEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/menu.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/menu.astro";
const $$url = "/admin/menu";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Menu,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
