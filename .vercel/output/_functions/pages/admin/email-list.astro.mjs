import { c as createComponent, b as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Users, Download, Search, Mail, EyeOff, Eye, CheckCircle, ToggleRight, ToggleLeft, Clock, ArrowDown, PanelRight, FileText, Save, Trash2, Calendar, Send, Plus } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
import { r as readData } from '../../chunks/readData_B59o9LcR.mjs';
export { renderers } from '../../renderers.mjs';

function LeadsPanel() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch("/api/admin/plugins/email-list/leads").then((r) => r.json()).then((data) => {
      if (data.error) throw new Error(data.error);
      setSubscribers(data.subscribers || []);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const filtered = subscribers.filter(
    (s) => s.email.toLowerCase().includes(search.toLowerCase()) || s.name?.toLowerCase().includes(search.toLowerCase())
  );
  function exportCsv() {
    const header = "Email,Nome,Data,Fonte,Tags";
    const rows = subscribers.map(
      (s) => [
        `"${s.email}"`,
        `"${s.name || ""}"`,
        `"${new Date(s.subscribedAt).toLocaleString("pt-BR")}"`,
        `"${s.source}"`,
        `"${(s.tags || []).join(", ")}"`
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const sourceLabel = {
    popup: "Popup",
    widget: "Widget",
    api: "API"
  };
  const sourceBadge = {
    popup: "bg-violet-100 text-violet-700",
    widget: "bg-blue-100 text-blue-700",
    api: "bg-slate-100 text-slate-600"
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-16 text-slate-400", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-7 h-7 animate-spin mb-3 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium animate-pulse", children: "Carregando leads..." })
  ] });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex gap-3 items-start", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm", children: error })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-violet-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-800", children: [
            subscribers.length,
            " inscritos"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "total na lista" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: exportCsv,
          disabled: subscribers.length === 0,
          className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
            "Exportar CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar por email ou nome...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16 text-slate-400", children: [
      /* @__PURE__ */ jsx(Users, { className: "w-10 h-10 mx-auto mb-3 opacity-40" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: subscribers.length === 0 ? "Nenhum inscrito ainda." : "Nenhum resultado para sua busca." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 bg-slate-50", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Email" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Nome" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Data" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Fonte" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filtered.map((sub, i) => /* @__PURE__ */ jsxs("tr", { className: `border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`, children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-slate-800", children: sub.email }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-600", children: sub.name || /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "—" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-500 text-xs whitespace-nowrap", children: new Date(sub.subscribedAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${sourceBadge[sub.source] || "bg-slate-100 text-slate-600"}`, children: sourceLabel[sub.source] || sub.source }) })
      ] }, sub.email)) })
    ] }) })
  ] });
}

const CONFIG_PATH$1 = "src/data/pluginsConfig.json";
function SettingsEmailList() {
  const [brevoApiKey, setBrevoApiKey] = useState("");
  const [brevoListId, setBrevoListId] = useState("");
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [headline, setHeadline] = useState("Não perca nenhum artigo!");
  const [subheadline, setSubheadline] = useState("Receba os melhores conteúdos direto no seu e-mail.");
  const [triggerType, setTriggerType] = useState("delay");
  const [triggerValue, setTriggerValue] = useState(5);
  const [showOnce, setShowOnce] = useState(true);
  const [sidebarEnabled, setSidebarEnabled] = useState(true);
  const [sidebarHeadline, setSidebarHeadline] = useState("Newsletter");
  const [sidebarSubheadline, setSidebarSubheadline] = useState("Junte-se a nossos leitores!");
  const [inlineEnabled, setInlineEnabled] = useState(false);
  const [inlineHeadline, setInlineHeadline] = useState("Gostando do conteúdo?");
  const [inlineSubheadline, setInlineSubheadline] = useState("Receba artigos como este direto no seu e-mail.");
  const [inlinePosition, setInlinePosition] = useState(3);
  const [showApiKey, setShowApiKey] = useState(false);
  const [fileSha, setFileSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    githubApi("read", CONFIG_PATH$1).then((data) => {
      const config = JSON.parse(data.content);
      setFullConfig(config);
      setFileSha(data.sha);
      const el = config?.emailList ?? {};
      setBrevoApiKey(el.brevoApiKey ?? "");
      setBrevoListId(el.brevoListId ?? "");
      const popup = el.popup ?? {};
      setPopupEnabled(popup.enabled ?? false);
      setHeadline(popup.headline ?? "Não perca nenhum artigo!");
      setSubheadline(popup.subheadline ?? "Receba os melhores conteúdos direto no seu e-mail.");
      setTriggerType(popup.triggerType ?? "delay");
      setTriggerValue(popup.triggerValue ?? 5);
      setShowOnce(popup.showOnce !== false);
      const sidebar = el.sidebar ?? {};
      setSidebarEnabled(sidebar.enabled !== false);
      setSidebarHeadline(sidebar.headline ?? "Newsletter");
      setSidebarSubheadline(sidebar.subheadline ?? "Junte-se a nossos leitores!");
      const inline = el.inline ?? {};
      setInlineEnabled(inline.enabled ?? false);
      setInlineHeadline(inline.headline ?? "Gostando do conteúdo?");
      setInlineSubheadline(inline.subheadline ?? "Receba artigos como este direto no seu e-mail.");
      setInlinePosition(inline.position ?? 3);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    triggerToast("Salvando configurações...", "progress", 30);
    try {
      const updated = {
        ...fullConfig,
        emailList: {
          brevoApiKey: brevoApiKey.trim(),
          brevoListId: brevoListId.trim(),
          popup: {
            enabled: popupEnabled,
            headline: headline.trim(),
            subheadline: subheadline.trim(),
            triggerType,
            triggerValue: Number(triggerValue),
            showOnce
          },
          sidebar: {
            enabled: sidebarEnabled,
            headline: sidebarHeadline.trim(),
            subheadline: sidebarSubheadline.trim()
          },
          inline: {
            enabled: inlineEnabled,
            headline: inlineHeadline.trim(),
            subheadline: inlineSubheadline.trim(),
            position: Number(inlinePosition)
          },
          sequences: fullConfig?.emailList?.sequences ?? []
        }
      };
      const res = await githubApi("write", CONFIG_PATH$1, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update Email List settings"
      });
      setFileSha(res.sha ?? fileSha);
      setFullConfig(updated);
      setSaved(true);
      triggerToast("Configurações salvas!", "success", 100);
      setTimeout(() => setSaved(false), 3e3);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleTestBrevo = async () => {
    if (!brevoApiKey.trim()) {
      setTestResult({ ok: false, message: "Informe a API Key do Brevo antes de testar." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/plugins/email-list/test-brevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: brevoApiKey.trim() })
      });
      const data = await res.json();
      setTestResult({ ok: data.success, message: data.message });
    } catch {
      setTestResult({ ok: false, message: "Erro de rede — verifique se o servidor está rodando." });
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
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
        /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-violet-600" }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Integração Brevo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "API Key" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: showApiKey ? "text" : "password",
                value: brevoApiKey,
                onChange: (e) => {
                  setBrevoApiKey(e.target.value);
                  setTestResult(null);
                },
                placeholder: "xkeysib-...",
                className: `${inputClass} pr-10 font-mono text-xs`
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowApiKey((v) => !v),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors",
                children: showApiKey ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: "Encontre em Brevo → Configurações → API Keys." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "ID da Lista" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: brevoListId,
              onChange: (e) => setBrevoListId(e.target.value),
              placeholder: "Ex: 3",
              className: inputClass
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: "Encontre em Brevo → Contatos → Listas → ID da lista." })
        ] })
      ] }),
      testResult && /* @__PURE__ */ jsxs("div", { className: `mt-4 p-3 rounded-xl border flex items-start gap-3 text-sm ${testResult.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`, children: [
        testResult.ok ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
        testResult.message
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleTestBrevo,
          disabled: testing || !brevoApiKey.trim(),
          className: "mt-4 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: [
            testing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "🔌",
            testing ? "Testando..." : "Testar Conexão"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Popup de Captura" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setPopupEnabled((v) => !v),
            className: "flex items-center gap-2 text-sm font-semibold transition-colors",
            children: popupEnabled ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ToggleRight, { className: "w-8 h-8 text-violet-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-violet-700", children: "Ativo" })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ToggleLeft, { className: "w-8 h-8 text-slate-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Inativo" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `space-y-4 transition-opacity ${popupEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: headline,
              onChange: (e) => setHeadline(e.target.value),
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Subtítulo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: subheadline,
              onChange: (e) => setSubheadline(e.target.value),
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Tipo de Trigger" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: triggerType,
                onChange: (e) => setTriggerType(e.target.value),
                className: inputClass,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "delay", children: "Após X segundos" }),
                  /* @__PURE__ */ jsx("option", { value: "scroll", children: "Ao rolar X%" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: triggerType === "delay" ? "Segundos" : "Porcentagem" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              triggerType === "delay" ? /* @__PURE__ */ jsx(Clock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: 1,
                  max: triggerType === "scroll" ? 100 : 300,
                  value: triggerValue,
                  onChange: (e) => setTriggerValue(Number(e.target.value)),
                  className: `${inputClass} pl-9`
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: showOnce,
              onChange: (e) => setShowOnce(e.target.checked),
              className: "w-4 h-4 accent-violet-600 rounded"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Mostrar apenas uma vez por visitante" })
        ] })
      ] }),
      popupEnabled && /* @__PURE__ */ jsxs("div", { className: "mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3", children: "Preview" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-5 shadow-sm max-w-xs mx-auto text-center border border-slate-100", children: [
          /* @__PURE__ */ jsx("div", { style: { width: 40, height: 40, background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }, children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm mb-1", children: headline || "..." }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-xs leading-relaxed mb-3", children: subheadline || "..." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-9 bg-slate-100 rounded-lg" }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-9 rounded-lg", style: { background: "linear-gradient(135deg,#7c3aed,#a855f7)" } })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: triggerType === "delay" ? `Aparece após ${triggerValue}s` : `Aparece ao rolar ${triggerValue}%` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(PanelRight, { className: "w-5 h-5 text-violet-600" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Widget da Sidebar" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setSidebarEnabled((v) => !v),
            className: "flex items-center gap-2 text-sm font-semibold transition-colors",
            children: sidebarEnabled ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ToggleRight, { className: "w-8 h-8 text-violet-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-violet-700", children: "Ativo" })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ToggleLeft, { className: "w-8 h-8 text-slate-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Inativo" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `space-y-4 transition-opacity ${sidebarEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: sidebarHeadline,
              onChange: (e) => setSidebarHeadline(e.target.value),
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Subtítulo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: sidebarSubheadline,
              onChange: (e) => setSidebarSubheadline(e.target.value),
              className: inputClass
            }
          )
        ] })
      ] }),
      sidebarEnabled && /* @__PURE__ */ jsxs("div", { className: "mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3", children: "Preview" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm max-w-xs mx-auto text-center border border-slate-100", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm mb-1", children: sidebarHeadline || "..." }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-xs mb-3", children: sidebarSubheadline || "..." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-8 bg-slate-100 rounded-lg" }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-8 rounded-lg", style: { background: "linear-gradient(135deg,#7c3aed,#a855f7)" } })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-violet-600" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Banner Inline nos Posts" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setInlineEnabled((v) => !v),
            className: "flex items-center gap-2 text-sm font-semibold transition-colors",
            children: inlineEnabled ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ToggleRight, { className: "w-8 h-8 text-violet-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-violet-700", children: "Ativo" })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ToggleLeft, { className: "w-8 h-8 text-slate-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Inativo" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `space-y-4 transition-opacity ${inlineEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Título" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: inlineHeadline,
              onChange: (e) => setInlineHeadline(e.target.value),
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Subtítulo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: inlineSubheadline,
              onChange: (e) => setInlineSubheadline(e.target.value),
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelClass, children: "Inserir após o parágrafo nº" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: 1,
              max: 20,
              value: inlinePosition,
              onChange: (e) => setInlinePosition(Number(e.target.value)),
              className: inputClass
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: [
            "O banner aparecerá após o ",
            inlinePosition,
            "º parágrafo do post."
          ] })
        ] })
      ] }),
      inlineEnabled && /* @__PURE__ */ jsxs("div", { className: "mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3", children: "Preview" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { style: { flexShrink: 0, width: 36, height: 36, background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm truncate", children: inlineHeadline || "..." }),
            /* @__PURE__ */ jsx("p", { className: "text-violet-700 text-xs truncate", children: inlineSubheadline || "..." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
            /* @__PURE__ */ jsx("div", { className: "h-8 w-28 bg-white border border-violet-200 rounded-lg" }),
            /* @__PURE__ */ jsx("div", { className: "h-8 w-20 rounded-lg", style: { background: "linear-gradient(135deg,#7c3aed,#a855f7)" } })
          ] })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] }),
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
  ] });
}

const CONFIG_PATH = "src/data/pluginsConfig.json";
function EmailSequenceEditor() {
  const [emails, setEmails] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [fullConfig, setFullConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [testEmail, setTestEmail] = useState("");
  const [sendResults, setSendResults] = useState({});
  const [sequenceStats, setSequenceStats] = useState([]);
  const [lastRunAt, setLastRunAt] = useState(null);
  useEffect(() => {
    Promise.all([
      githubApi("read", CONFIG_PATH),
      fetch("/api/admin/plugins/email-list/sequence-status").then((r) => r.ok ? r.json() : null).catch(() => null)
    ]).then(([data, stats]) => {
      const config = JSON.parse(data.content);
      setFullConfig(config);
      setFileSha(data.sha);
      const sequences = config?.emailList?.sequences ?? [];
      setEmails(sequences.map((s, i) => ({
        id: `seq_${i}_${Date.now()}`,
        subject: s.subject ?? "",
        body: s.body ?? "",
        delayDays: s.delayDays ?? 1
      })));
      if (stats) {
        setSequenceStats(stats.stats ?? []);
        setLastRunAt(stats.lastRunAt ?? null);
      }
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  function addEmail() {
    setEmails((prev) => [...prev, {
      id: `new_${Date.now()}`,
      subject: "",
      body: "",
      delayDays: prev.length === 0 ? 1 : prev[prev.length - 1].delayDays + 1
    }]);
  }
  function removeEmail(id) {
    setEmails((prev) => prev.filter((e) => e.id !== id));
  }
  function updateEmail(id, field, value) {
    setEmails((prev) => prev.map((e) => e.id === id ? { ...e, [field]: value } : e));
  }
  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    triggerToast("Salvando sequência...", "progress", 30);
    try {
      const sequences = emails.map((e) => ({
        subject: e.subject.trim(),
        body: e.body.trim(),
        delayDays: Number(e.delayDays)
      }));
      const updated = {
        ...fullConfig,
        emailList: {
          ...fullConfig?.emailList,
          sequences
        }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update email sequences"
      });
      setFileSha(res.sha ?? fileSha);
      setFullConfig(updated);
      setSaved(true);
      triggerToast("Sequência salva!", "success", 100);
      setTimeout(() => setSaved(false), 3e3);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  }
  async function sendTest(emailItem) {
    if (!testEmail.trim()) {
      setSendResults((prev) => ({
        ...prev,
        [emailItem.id]: { ok: false, msg: "Informe um email de destino acima." }
      }));
      return;
    }
    setSendingId(emailItem.id);
    setSendResults((prev) => ({ ...prev, [emailItem.id]: void 0 }));
    try {
      const htmlContent = emailItem.body.split("\n").map((line) => `<p>${line}</p>`).join("");
      const res = await fetch("/api/admin/plugins/email-list/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail.trim(),
          subject: emailItem.subject,
          htmlContent
        })
      });
      const data = await res.json();
      setSendResults((prev) => ({
        ...prev,
        [emailItem.id]: { ok: data.success, msg: data.message }
      }));
    } catch {
      setSendResults((prev) => ({
        ...prev,
        [emailItem.id]: { ok: false, msg: "Erro de rede." }
      }));
    } finally {
      setSendingId(null);
    }
  }
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5";
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-16 text-slate-400", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-7 h-7 animate-spin mb-3 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm animate-pulse", children: "Carregando sequências..." })
  ] });
  if (error && !fullConfig) return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex gap-3", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm", children: error })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-violet-50 border border-violet-200 rounded-2xl p-4 flex gap-3", children: [
      /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-violet-500 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-violet-800 text-sm", children: "Sequência automática" }),
        /* @__PURE__ */ jsxs("p", { className: "text-violet-700 text-xs mt-0.5 leading-relaxed", children: [
          "Emails processados diariamente às 08:00 UTC via Vercel Cron.",
          lastRunAt && /* @__PURE__ */ jsxs(Fragment, { children: [
            " Última execução: ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: new Date(lastRunAt).toLocaleString("pt-BR") }),
            "."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Email para testes" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          value: testEmail,
          onChange: (e) => setTestEmail(e.target.value),
          placeholder: "seu@email.com",
          className: inputClass
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: 'Usado pelo botão "Enviar teste" em cada email.' })
    ] }),
    emails.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300", children: [
      /* @__PURE__ */ jsx(Mail, { className: "w-10 h-10 mx-auto mb-3 opacity-40" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mb-1", children: "Nenhum email na sequência" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs", children: "Adicione o primeiro email abaixo." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: emails.map((emailItem, idx) => {
      const stat = sequenceStats.find((s) => s.sequenceIndex === idx);
      return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsx("span", { className: "w-7 h-7 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold", children: idx + 1 }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-700", children: [
              "Email #",
              idx + 1
            ] }),
            stat && /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700", children: [
              "Enviado para ",
              stat.sent,
              " inscritos",
              stat.failed > 0 ? ` (${stat.failed} falha${stat.failed > 1 ? "s" : ""})` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeEmail(emailItem.id),
              className: "p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: labelClass, children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 inline mr-1" }),
                "Dias após inscrição"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: 0,
                  value: emailItem.delayDays,
                  onChange: (e) => updateEmail(emailItem.id, "delayDays", Number(e.target.value)),
                  className: inputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: labelClass, children: "Assunto" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: emailItem.subject,
                  onChange: (e) => updateEmail(emailItem.id, "subject", e.target.value),
                  placeholder: "Assunto do email",
                  className: inputClass
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelClass, children: "Conteúdo (texto simples / markdown)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 5,
                value: emailItem.body,
                onChange: (e) => updateEmail(emailItem.id, "body", e.target.value),
                placeholder: "Olá {{nome}},\n\nEscreva aqui o conteúdo do email...",
                className: `${inputClass} resize-none font-mono text-xs`
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => sendTest(emailItem),
                disabled: sendingId === emailItem.id || !emailItem.subject || !emailItem.body,
                className: "flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: [
                  sendingId === emailItem.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }),
                  sendingId === emailItem.id ? "Enviando..." : "Enviar teste"
                ]
              }
            ),
            sendResults[emailItem.id] && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 text-xs font-semibold ${sendResults[emailItem.id].ok ? "text-green-600" : "text-red-600"}`, children: [
              sendResults[emailItem.id].ok ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }),
              sendResults[emailItem.id].msg
            ] })
          ] })
        ] })
      ] }, emailItem.id);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: addEmail,
          className: "flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50 transition-all",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            "Adicionar Email"
          ]
        }
      ),
      emails.length > 0 && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          className: "bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20",
          children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : saved ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            saving ? "Salvando..." : saved ? "Salvo!" : "Salvar Sequência"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-sm font-medium rounded-r-xl flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      error
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$EmailList = createComponent(($$result, $$props, $$slots) => {
  const pluginsConfig = readData("pluginsConfig.json", {});
  const isBrevoConfigured = !!pluginsConfig?.emailList?.brevoApiKey;
  return renderTemplate(_a || (_a = __template(["", " <script>\nfunction showTab(tab) {\n    var panels = {\n        leads: document.getElementById('panel-leads'),\n        settings: document.getElementById('panel-settings'),\n        sequences: document.getElementById('panel-sequences'),\n    };\n    var tabs = {\n        leads: document.getElementById('tab-leads'),\n        settings: document.getElementById('tab-settings'),\n        sequences: document.getElementById('tab-sequences'),\n    };\n\n    var activeClass   = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-violet-700 shadow-sm';\n    var inactiveClass = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-600 hover:text-slate-900';\n\n    Object.keys(panels).forEach(function(key) {\n        var isActive = key === tab;\n        if (panels[key]) panels[key].classList.toggle('hidden', !isActive);\n        if (tabs[key]) tabs[key].className = isActive ? activeClass : inactiveClass;\n    });\n}\n<\/script>"])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Lista de Emails", "activeSection": "email-list" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Lista de Emails</h1> <p class="text-slate-500 mt-1">Gerencie seus inscritos, popup de captura e sequências de email.</p> </div>  <div class="mb-6"> <div class="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit"> <button id="tab-leads" onclick="showTab('leads')" class="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-violet-700 shadow-sm">
👥 Leads
</button> <button id="tab-settings" onclick="showTab('settings')" class="px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-600 hover:text-slate-900">
⚙️ Configurações${!isBrevoConfigured && renderTemplate`<span class="ml-1.5 w-2 h-2 bg-amber-400 rounded-full inline-block align-middle"></span>`} </button> <button id="tab-sequences" onclick="showTab('sequences')" class="px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-600 hover:text-slate-900">
📧 Sequências
</button> </div> </div> <div id="panel-leads"> ${renderComponent($$result2, "LeadsPanel", LeadsPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/email-list/LeadsPanel", "client:component-export": "default" })} </div> <div id="panel-settings" class="hidden"> ${renderComponent($$result2, "SettingsEmailList", SettingsEmailList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/email-list/SettingsEmailList", "client:component-export": "default" })} </div> <div id="panel-sequences" class="hidden"> ${renderComponent($$result2, "EmailSequenceEditor", EmailSequenceEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/email-list/EmailSequenceEditor", "client:component-export": "default" })} </div> ` }));
}, "C:/Projects/desentupidora-temp/src/pages/admin/email-list.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/email-list.astro";
const $$url = "/admin/email-list";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$EmailList,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
