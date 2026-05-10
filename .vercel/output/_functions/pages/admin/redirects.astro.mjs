import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Save, AlertCircle, ArrowRight, ToggleRight, ToggleLeft, ExternalLink, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

const emptyRedirect = () => ({
  from: "",
  to: "",
  type: 301,
  enabled: true,
  note: ""
});
function RedirectsManager() {
  const [redirects, setRedirects] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRedirect());
  const [showForm, setShowForm] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [testResult, setTestResult] = useState({});
  const handleTest = async (r) => {
    setTestingId(r.id);
    setTestResult((prev) => ({ ...prev, [r.id]: void 0 }));
    try {
      const siteUrl = window.location.origin;
      const testUrl = r.from.startsWith("http") ? r.from : `${siteUrl}${r.from.startsWith("/") ? "" : "/"}${r.from}`;
      const res = await fetch(testUrl, { method: "HEAD", redirect: "manual" });
      const location = res.headers.get("location") || "";
      const isRedirect = res.status >= 300 && res.status < 400;
      setTestResult((prev) => ({ ...prev, [r.id]: { ok: isRedirect, status: res.status, location } }));
    } catch {
      try {
        const res = await fetch(`/api/admin/plugins/redirects/test?path=${encodeURIComponent(r.from)}`);
        if (res.ok) {
          const data = await res.json();
          setTestResult((prev) => ({ ...prev, [r.id]: data }));
        } else {
          setTestResult((prev) => ({ ...prev, [r.id]: { ok: false, status: 0 } }));
        }
      } catch {
        setTestResult((prev) => ({ ...prev, [r.id]: { ok: false, status: 0 } }));
      }
    } finally {
      setTestingId(null);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/plugins/redirects");
        if (res.ok) {
          const arr = await res.json();
          setRedirects(Array.isArray(arr) ? arr : []);
        }
      } catch {
      }
      setLoading(false);
    })();
  }, []);
  const saveRedirects = async (newList) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/plugins/redirects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao salvar");
      }
      setRedirects(newList);
      const ativos = newList.filter((r) => r.enabled).length;
      triggerToast(`${ativos} redirect${ativos !== 1 ? "s" : ""} ativo${ativos !== 1 ? "s" : ""} — sincronizado com Vercel!`, "success", 100);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyRedirect());
    setShowForm(true);
  };
  const handleEdit = (r) => {
    setEditingId(r.id);
    setForm({ from: r.from, to: r.to, type: r.type, enabled: r.enabled, note: r.note });
    setShowForm(true);
  };
  const handleFormSave = () => {
    if (!form.from.trim() || !form.to.trim()) {
      triggerToast('Preencha os campos "De" e "Para"', "error");
      return;
    }
    let newList;
    if (editingId) {
      newList = redirects.map((r) => r.id === editingId ? { ...form, id: editingId } : r);
    } else {
      newList = [...redirects, { ...form, id: `r_${Date.now()}` }];
    }
    setShowForm(false);
    setEditingId(null);
    saveRedirects(newList);
  };
  const handleDelete = (id) => {
    if (!confirm("Remover este redirect?")) return;
    saveRedirects(redirects.filter((r) => r.id !== id));
  };
  const handleToggle = (id) => {
    saveRedirects(redirects.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm font-mono";
  const labelClass = "block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 text-slate-400 bg-white rounded-3xl border border-slate-200", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Carregando redirects..." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
        redirects.length,
        " redirect",
        redirects.length !== 1 ? "s" : "",
        " configurado",
        redirects.length !== 1 ? "s" : ""
      ] }) }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAdd,
          className: "bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Novo Redirect"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-violet-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-4", children: editingId ? "Editar Redirect" : "Novo Redirect" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "De (origem)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.from,
                onChange: (e) => setForm((f) => ({ ...f, from: e.target.value })),
                className: inputClass,
                placeholder: "/artigo-antigo"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Para (destino)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.to,
                onChange: (e) => setForm((f) => ({ ...f, to: e.target.value })),
                className: inputClass,
                placeholder: "/blog/artigo-novo ou https://..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Tipo" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: form.type,
                onChange: (e) => setForm((f) => ({ ...f, type: Number(e.target.value) })),
                className: inputClass.replace("font-mono", ""),
                children: [
                  /* @__PURE__ */ jsx("option", { value: 301, children: "301 — Permanente" }),
                  /* @__PURE__ */ jsx("option", { value: 302, children: "302 — Temporário" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Nota (opcional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.note,
                onChange: (e) => setForm((f) => ({ ...f, note: e.target.value })),
                className: inputClass.replace("font-mono", ""),
                placeholder: "Ex: migração do WordPress"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-violet-50 transition-colors w-fit", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: form.enabled,
              onChange: (e) => setForm((f) => ({ ...f, enabled: e.target.checked })),
              className: "rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Ativo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleFormSave,
              disabled: saving,
              className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all",
              children: [
                saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                saving ? "Salvando..." : "Salvar"
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
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
    redirects.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 p-12 text-center", children: [
      /* @__PURE__ */ jsx(ArrowRight, { className: "w-12 h-12 text-slate-200 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium", children: "Nenhum redirect configurado" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mt-1", children: 'Clique em "Novo Redirect" para começar' })
    ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "De → Para" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-20", children: "Tipo" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Nota" }),
        /* @__PURE__ */ jsx("th", { className: "text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24", children: "Ativo" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-20" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: redirects.map((r) => /* @__PURE__ */ jsxs("tr", { className: `${!r.enabled ? "opacity-40" : ""} hover:bg-slate-50 transition-colors`, children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("code", { className: "text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700", children: r.from }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsx("code", { className: "text-xs bg-violet-50 px-2 py-0.5 rounded text-violet-700 truncate max-w-48", children: r.to })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `text-xs font-bold px-2 py-0.5 rounded-full ${r.type === 301 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`, children: r.type }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-500 text-xs truncate max-w-40", children: r.note || "—" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx("button", { onClick: () => handleToggle(r.id), className: "text-slate-400 hover:text-violet-600 transition-colors", children: r.enabled ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-5 h-5 text-violet-600" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-5 h-5" }) }) }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleTest(r),
                disabled: testingId === r.id || !r.enabled,
                className: "p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30",
                title: "Testar redirect",
                children: testingId === r.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(r), className: "p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(r.id), className: "p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
          ] }),
          testResult[r.id] && /* @__PURE__ */ jsxs("div", { className: `mt-1 flex items-center gap-1 text-[10px] font-bold ${testResult[r.id].ok ? "text-emerald-600" : "text-red-500"}`, children: [
            testResult[r.id].ok ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3" }),
            testResult[r.id].ok ? `${testResult[r.id].status} → OK` : testResult[r.id].status ? `${testResult[r.id].status} — Falhou` : "Erro de rede"
          ] })
        ] })
      ] }, r.id)) })
    ] }) }),
    redirects.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-emerald-700", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-emerald-800", children: [
          redirects.filter((r) => r.enabled).length,
          " redirect",
          redirects.filter((r) => r.enabled).length !== 1 ? "s" : "",
          " ativo",
          redirects.filter((r) => r.enabled).length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600", children: "Sincronizado automaticamente com a Vercel. Funciona assim que o deploy terminar (~2 min)." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-2xl border border-blue-200 p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-blue-700 uppercase tracking-widest mb-2", children: "Como funciona" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-sm text-blue-800", children: [
        /* @__PURE__ */ jsx("li", { children: "• Use quando renomear ou mover uma página — quem acessar o endereço antigo chega ao novo automaticamente" }),
        /* @__PURE__ */ jsxs("li", { children: [
          "• Escolha ",
          /* @__PURE__ */ jsx("strong", { children: "301" }),
          " quando a mudança for definitiva (ex: renomeou um artigo)"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "• Escolha ",
          /* @__PURE__ */ jsx("strong", { children: "302" }),
          " quando for temporário (ex: página em manutenção ou promoção por tempo limitado)"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "• No campo ",
          /* @__PURE__ */ jsx("strong", { children: "De" }),
          ", coloque o caminho antigo (ex: ",
          /* @__PURE__ */ jsx("code", { children: "/artigo-antigo" }),
          "). No campo ",
          /* @__PURE__ */ jsx("strong", { children: "Para" }),
          ", o novo"
        ] }),
        /* @__PURE__ */ jsx("li", { children: "• Os redirects são aplicados automaticamente na Vercel após o deploy" })
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Redirects = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Gerenciar Redirects", "activeSection": "redirects" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Gerenciar Redirects</h1> <p class="text-slate-500 mt-1">Configure redirects 301/302 para migração de URLs e SEO.</p> </div> ${renderComponent($$result2, "RedirectsManager", RedirectsManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/redirects/RedirectsManager", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/redirects.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/redirects.astro";
const $$url = "/admin/redirects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Redirects,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
