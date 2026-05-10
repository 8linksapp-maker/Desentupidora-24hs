import { c as createComponent, b as renderTemplate, d as renderComponent, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, MousePointerClick, Eye, TrendingUp, Hash, ExternalLink, EyeOff, CheckCircle, Save } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
import { r as readData } from '../../chunks/readData_B59o9LcR.mjs';
export { renderers } from '../../renderers.mjs';

const DAYS_OPTIONS = [
  { value: 7, label: "7 dias" },
  { value: 28, label: "28 dias" },
  { value: 90, label: "90 dias" }
];
function fmt(n) {
  return n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n);
}
function fmtCtr(n) {
  return `${(n * 100).toFixed(1)}%`;
}
function fmtPos(n) {
  return n.toFixed(1);
}
function fmtPage(url) {
  try {
    return new URL(url).pathname || "/";
  } catch {
    return url;
  }
}
function StatCard({ icon, label, value, sub }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600", children: icon }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: label })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-slate-800", children: value }),
    sub && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: sub })
  ] });
}
function DataTable({ rows, type }) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-slate-400", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Nenhum dado disponível para o período." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "Verifique se o site tem tráfego orgânico no Google." })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100", children: [
      /* @__PURE__ */ jsx("th", { className: "text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider", children: type === "query" ? "Consulta" : "Página" }),
      /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Cliques" }),
      /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Impressões" }),
      /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider", children: "CTR" }),
      /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Posição" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: rows.map((row, i) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-50 hover:bg-slate-50 transition-colors", children: [
      /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-medium text-slate-700 max-w-xs truncate", children: type === "query" ? row.query : /* @__PURE__ */ jsx("a", { href: row.page, target: "_blank", rel: "noopener noreferrer", className: "text-violet-600 hover:underline", children: fmtPage(row.page ?? "") }) }),
      /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right font-semibold text-slate-800", children: fmt(row.clicks) }),
      /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right text-slate-500", children: fmt(row.impressions) }),
      /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right text-slate-500", children: fmtCtr(row.ctr) }),
      /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxs("span", { className: `font-semibold ${row.position <= 3 ? "text-green-600" : row.position <= 10 ? "text-amber-600" : "text-slate-500"}`, children: [
        "#",
        fmtPos(row.position)
      ] }) })
    ] }, i)) })
  ] }) });
}
function SearchConsolePanel() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("query");
  const loadData = async (d) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/plugins/search-console/data?days=${d}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro desconhecido.");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData(days);
  }, []);
  const handleDaysChange = (d) => {
    setDays(d);
    loadData(d);
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-slate-400", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-violet-500" }),
    /* @__PURE__ */ jsx("p", { className: "font-medium animate-pulse", children: "Buscando dados do Search Console..." })
  ] });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 text-red-700 p-8 rounded-2xl border border-red-200 flex gap-4 items-start max-w-2xl", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold mb-1", children: "Não foi possível carregar os dados" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: error }),
      error.includes("não configurado") && /* @__PURE__ */ jsxs("p", { className: "text-sm mt-2", children: [
        "Configure o service account na aba ",
        /* @__PURE__ */ jsx("strong", { children: "Configurações" }),
        "."
      ] })
    ] })
  ] });
  if (!data) return null;
  const { summary, queries, pages, period } = data;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
        period.startDate,
        " → ",
        period.endDate
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 bg-slate-100 rounded-xl p-1", children: DAYS_OPTIONS.map((opt) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleDaysChange(opt.value),
          className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${days === opt.value ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
          children: opt.label
        },
        opt.value
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: /* @__PURE__ */ jsx(MousePointerClick, { className: "w-4 h-4" }), label: "Cliques", value: fmt(summary.totalClicks), sub: "total no período" }),
      /* @__PURE__ */ jsx(StatCard, { icon: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }), label: "Impressões", value: fmt(summary.totalImpressions), sub: "total no período" }),
      /* @__PURE__ */ jsx(StatCard, { icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" }), label: "CTR médio", value: fmtCtr(summary.avgCtr), sub: "cliques ÷ impressões" }),
      /* @__PURE__ */ jsx(StatCard, { icon: /* @__PURE__ */ jsx(Hash, { className: "w-4 h-4" }), label: "Posição média", value: `#${fmtPos(summary.avgPosition)}`, sub: "quanto menor, melhor" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1 p-3 border-b border-slate-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("query"),
            className: `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "query" ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,
            children: "🔍 Top Consultas"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("page"),
            className: `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "page" ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,
            children: "📄 Top Páginas"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(DataTable, { rows: activeTab === "query" ? queries : pages, type: activeTab })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 text-center", children: "Dados do Google Search Console com ~3 dias de defasagem. Atualiza a cada acesso." })
  ] });
}

const CONFIG_PATH = "src/data/pluginsConfig.json";
function SettingsGSC() {
  const [verificationTag, setVerificationTag] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [serviceAccountJson, setServiceAccountJson] = useState("");
  const [showJson, setShowJson] = useState(false);
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
      const gsc = config?.searchConsole ?? {};
      setVerificationTag(gsc.verificationTag ?? "");
      setSiteUrl(gsc.siteUrl ?? "");
      setServiceAccountJson(gsc.serviceAccountJson ?? "");
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    triggerToast("Salvando configurações do Search Console...", "progress", 30);
    try {
      const updated = {
        ...fullConfig,
        searchConsole: {
          verificationTag: verificationTag.trim(),
          siteUrl: siteUrl.trim(),
          serviceAccountJson: serviceAccountJson.trim()
        }
      };
      const res = await githubApi("write", CONFIG_PATH, {
        content: JSON.stringify(updated, null, 4),
        sha: fileSha,
        message: "CMS: Update Search Console settings"
      });
      setFileSha(res.sha ?? fileSha);
      setFullConfig(updated);
      setSaved(true);
      triggerToast("Search Console configurado!", "success", 100);
      setTimeout(() => setSaved(false), 3e3);
    } catch (err) {
      setError(err.message);
      triggerToast(`Erro: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleTest = async () => {
    if (!serviceAccountJson.trim()) {
      setTestResult({ ok: false, message: "Cole o JSON do service account antes de testar." });
      return;
    }
    if (!siteUrl.trim()) {
      setTestResult({ ok: false, message: "Informe a URL do site." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/plugins/search-console/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceAccountJson: serviceAccountJson.trim(), siteUrl: siteUrl.trim() })
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
    /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xl shrink-0", children: "⚠️" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-amber-800 text-sm", children: "Repositório Privado Obrigatório" }),
        /* @__PURE__ */ jsxs("p", { className: "text-amber-700 text-xs mt-0.5 leading-relaxed", children: [
          "O arquivo JSON do service account será salvo em ",
          /* @__PURE__ */ jsx("code", { className: "bg-amber-100 px-1 rounded font-mono", children: "pluginsConfig.json" }),
          ". Certifique-se de que o repositório é ",
          /* @__PURE__ */ jsx("strong", { children: "privado" }),
          " no GitHub."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0", children: "1" }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Verificação de Propriedade" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mb-4 leading-relaxed", children: [
        "No Search Console, vá em ",
        /* @__PURE__ */ jsx("strong", { children: "Configurações → Verificação de propriedade → Tag HTML" }),
        " e copie a tag ",
        /* @__PURE__ */ jsx("code", { className: "bg-slate-100 px-1 rounded font-mono text-xs", children: '<meta name="google-site-verification" ...>' }),
        "."
      ] }),
      /* @__PURE__ */ jsx("label", { className: labelClass, children: "Meta Tag de Verificação" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: verificationTag,
          onChange: (e) => setVerificationTag(e.target.value),
          placeholder: '<meta name="google-site-verification" content="XXXXX" />',
          className: `${inputClass} font-mono text-xs`
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: "Cole a tag inteira ou apenas o valor do atributo content." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0", children: "2" }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "URL da Propriedade" })
      ] }),
      /* @__PURE__ */ jsx("label", { className: labelClass, children: "URL do Site no Search Console" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          value: siteUrl,
          onChange: (e) => {
            setSiteUrl(e.target.value);
            setTestResult(null);
          },
          placeholder: "https://seusite.com.br",
          className: inputClass
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: "Deve ser exatamente como aparece no Search Console (com ou sem www, com ou sem barra final)." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0", children: "3" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Service Account (Google Cloud)" })
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://console.cloud.google.com/iam-admin/serviceaccounts",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-1 text-xs text-violet-600 hover:underline",
            children: [
              "Google Cloud Console ",
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-4 mb-4 text-xs text-slate-600 space-y-1.5 leading-relaxed", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-700 mb-2", children: "Como obter o JSON:" }),
        /* @__PURE__ */ jsx("p", { children: "① No Google Cloud, crie um projeto (ou use um existente)" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "② Ative a API ",
          /* @__PURE__ */ jsx("strong", { children: "Google Search Console API" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "③ Crie um Service Account → gere uma chave JSON → baixe o arquivo" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "④ No Search Console, adicione o e-mail do service account como usuário com permissão de ",
          /* @__PURE__ */ jsx("strong", { children: "leitura" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "⑤ Cole o conteúdo do arquivo JSON no campo abaixo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("label", { className: labelClass, children: "JSON do Service Account" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowJson((v) => !v),
            className: "flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors",
            children: [
              showJson ? /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
              showJson ? "Ocultar" : "Mostrar"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          rows: showJson ? 8 : 3,
          value: serviceAccountJson,
          onChange: (e) => {
            setServiceAccountJson(e.target.value);
            setTestResult(null);
          },
          placeholder: '{\n  "type": "service_account",\n  "project_id": "...",\n  "private_key": "...",\n  "client_email": "..."\n}',
          className: `${inputClass} font-mono text-xs resize-none`,
          style: { filter: showJson ? "none" : "blur(3px)" }
        }
      ),
      serviceAccountJson && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1 ml-1", children: [
        serviceAccountJson.length,
        " caracteres"
      ] })
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
        { label: "Verificação", value: verificationTag ? "● Configurada" : "○ Não configurada", ok: !!verificationTag },
        { label: "URL do site", value: siteUrl || "○ Não informada", ok: !!siteUrl },
        { label: "Service Account", value: serviceAccountJson ? "● JSON carregado" : "○ Não configurado", ok: !!serviceAccountJson }
      ].map((row) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: row.label }),
        /* @__PURE__ */ jsx("span", { className: row.ok ? "text-green-600 font-semibold" : "text-red-500 font-semibold", children: row.value })
      ] }, row.label)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleTest,
          disabled: testing || !serviceAccountJson.trim() || !siteUrl.trim(),
          className: "px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2",
          children: [
            testing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "🔌",
            testing ? "Testando..." : "Testar Conexão"
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
const $$SearchConsole = createComponent(($$result, $$props, $$slots) => {
  const pluginsConfig = readData("pluginsConfig.json", {});
  const isConfigured = !!(pluginsConfig?.searchConsole?.siteUrl && pluginsConfig?.searchConsole?.serviceAccountJson);
  const defaultTab = isConfigured ? "analytics" : "settings";
  return renderTemplate(_a || (_a = __template(["", " <script>\nfunction showTab(tab) {\n    var panels = { analytics: document.getElementById('panel-analytics'), settings: document.getElementById('panel-settings') };\n    var tabs    = { analytics: document.getElementById('tab-analytics'),  settings: document.getElementById('tab-settings') };\n\n    var activeClass   = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-violet-700 shadow-sm';\n    var inactiveClass = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-600 hover:text-slate-900';\n\n    Object.keys(panels).forEach(function(key) {\n        var isActive = key === tab;\n        if (panels[key]) panels[key].classList.toggle('hidden', !isActive);\n        if (tabs[key]) tabs[key].className = isActive ? activeClass : inactiveClass;\n    });\n}\n<\/script>"])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Search Console", "activeSection": "search-console" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Google Search Console</h1> <p class="text-slate-500 mt-1">Acompanhe cliques, impressões e posições do seu site no Google.</p> </div>  <div class="mb-6"> <div class="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit"> <button id="tab-analytics" onclick="showTab('analytics')"${addAttribute(`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${defaultTab === "analytics" ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`, "class")}>
📊 Analytics
</button> <button id="tab-settings" onclick="showTab('settings')"${addAttribute(`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${defaultTab === "settings" ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`, "class")}>
⚙️ Configurações${!isConfigured && renderTemplate`<span class="ml-1.5 w-2 h-2 bg-amber-400 rounded-full inline-block align-middle"></span>`} </button> </div> </div> <div id="panel-analytics"${addAttribute(defaultTab === "analytics" ? "" : "hidden", "class")}> ${renderComponent($$result2, "SearchConsolePanel", SearchConsolePanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/search-console/SearchConsolePanel", "client:component-export": "default" })} </div> <div id="panel-settings"${addAttribute(defaultTab === "settings" ? "" : "hidden", "class")}> ${renderComponent($$result2, "SettingsGSC", SettingsGSC, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/plugins/search-console/SettingsGSC", "client:component-export": "default" })} </div> ` }));
}, "C:/Projects/desentupidora-temp/src/pages/admin/search-console.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/search-console.astro";
const $$url = "/admin/search-console";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$SearchConsole,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
