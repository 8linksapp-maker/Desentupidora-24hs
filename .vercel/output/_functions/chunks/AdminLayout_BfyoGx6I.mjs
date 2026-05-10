import { f as createAstro, c as createComponent, r as renderHead, d as renderComponent, ak as renderSlot, b as renderTemplate } from './astro/server_DviA_9aL.mjs';
import 'piccolore';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Tag, Users, Navigation, Home, Info, Briefcase, Phone, Shield, Sparkles, Settings, ExternalLink, LogOut, ChevronRight, CheckCircle2, AlertCircle, Loader2, X, Clock, Rocket } from 'lucide-react';
/* empty css                           */
/* empty css                           */

const mainItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, section: "dashboard" },
  { label: "Artigos", href: "/admin/posts", icon: FileText, section: "posts" },
  { label: "Categorias", href: "/admin/categories", icon: Tag, section: "categories" },
  { label: "Autores", href: "/admin/authors", icon: Users, section: "authors" }
];
const pageItems = [
  { label: "Menu", href: "/admin/menu", icon: Navigation, section: "menu" },
  { label: "Home", href: "/admin/home", icon: Home, section: "home" },
  { label: "Sobre", href: "/admin/sobre", icon: Info, section: "sobre" },
  { label: "Serviços", href: "/admin/servicos", icon: Briefcase, section: "servicos" },
  { label: "Contato", href: "/admin/contato", icon: Phone, section: "contato" },
  { label: "Privacidade & Termos", href: "/admin/legal", icon: Shield, section: "legal" }
];
const pluginItems = [
  { label: "Plugins", href: "/admin/plugins", icon: Sparkles, section: "plugins" },
  { label: "Google Tag", href: "/admin/google-tag", icon: Tag, section: "google-tag" }
];
function AdminNav({ activeSection = "", extraItems = [] }) {
  const allMainItems = [...mainItems, ...extraItems];
  return /* @__PURE__ */ jsxs("aside", { className: "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-50 shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "h-16 flex items-center px-6 border-b border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-4 h-4 text-white" }) }),
      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: "Admin CMS" })
    ] }) }),
    /* @__PURE__ */ jsxs("nav", { className: "flex-1 overflow-y-auto py-4 px-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2", children: "Principal" }),
        allMainItems.map((item) => /* @__PURE__ */ jsx(NavLink, { item, active: activeSection === item.section }, item.href))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2", children: "Páginas" }),
        pageItems.map((item) => /* @__PURE__ */ jsx(NavLink, { item, active: activeSection === item.section }, item.href))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2", children: "Plugins" }),
        pluginItems.map((item) => /* @__PURE__ */ jsx(NavLink, { item, active: activeSection === item.section }, item.href))
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2", children: "Sistema" }),
        /* @__PURE__ */ jsx(NavLink, { item: { label: "Configurações", href: "/admin/config", icon: Settings, section: "config" }, active: activeSection === "config" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-slate-100 space-y-1", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-violet-700 hover:bg-violet-50 transition-all group",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 shrink-0 group-hover:text-violet-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Ver site" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/api/admin/logout",
          className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group",
          children: [
            /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 shrink-0 group-hover:text-red-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Sair" })
          ]
        }
      )
    ] })
  ] });
}
function NavLink({ item, active }) {
  const Icon = item.icon;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: item.href,
      className: `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all group ${active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 shrink-0 ${active ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"}` }),
        /* @__PURE__ */ jsx("span", { className: `text-sm font-medium flex-1 ${active ? "font-semibold" : ""}`, children: item.label }),
        active && /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-violet-400" })
      ]
    }
  );
}

const triggerToast = (message, type = "info", progress, link) => {
  window.dispatchEvent(new CustomEvent("cms-toast", { detail: { message, type, progress, link } }));
};
function CmsToaster() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handleToast = (e) => {
      const newToast = { id: Date.now().toString() + Math.random(), ...e.detail };
      if (newToast.type === "progress") {
        setToasts((prev) => {
          const exists = prev.find((t) => t.type === "progress");
          if (exists) {
            return prev.map((t) => t.type === "progress" ? { ...t, ...newToast } : t);
          }
          return [...prev, newToast];
        });
      } else {
        setToasts((prev) => {
          const withoutProgress = prev.filter((t) => t.type !== "progress");
          return [...withoutProgress, newToast];
        });
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 6e3);
      }
    };
    window.addEventListener("cms-toast", handleToast);
    return () => window.removeEventListener("cms-toast", handleToast);
  }, []);
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none", children: toasts.map((toast) => /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto bg-white border border-violet-100 shadow-2xl shadow-violet-500/10 rounded-2xl w-80 overflow-hidden transform transition-all duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "shrink-0 mt-0.5", children: [
        toast.type === "success" && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-violet-600" }),
        toast.type === "error" && /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-500" }),
        toast.type === "info" && /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-violet-400" }),
        toast.type === "progress" && /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-violet-600 animate-spin" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800 leading-snug", children: toast.message }),
        toast.link && /* @__PURE__ */ jsxs("a", { href: toast.link, target: "_blank", className: "mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white rounded-lg text-xs font-bold transition-colors", children: [
          "Ver alteração ao vivo ",
          /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
        ] })
      ] }),
      toast.type !== "progress" && /* @__PURE__ */ jsx("button", { onClick: () => removeToast(toast.id), className: "shrink-0 text-slate-400 hover:text-violet-600 transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    toast.type === "progress" && toast.progress !== void 0 && /* @__PURE__ */ jsx("div", { className: "w-full h-1.5 bg-slate-100", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-violet-600 transition-all duration-700 ease-out", style: { width: `${toast.progress}%` } }) })
  ] }, toast.id)) });
}

const SNOOZE_KEY = "cms_deploy_snooze_until";
const SNOOZE_HOURS = 4;
const PENDING_BUILD_GRACE_MS = 4 * 60 * 1e3;
const PENDING_DEPLOY_KEY = "cms_pending_deploy";
function readPendingDeploy() {
  try {
    const raw = sessionStorage.getItem(PENDING_DEPLOY_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj?.sha || !obj?.startedAt) return null;
    return obj;
  } catch {
    return null;
  }
}
function writePendingDeploy(sha) {
  try {
    sessionStorage.setItem(PENDING_DEPLOY_KEY, JSON.stringify({ sha, startedAt: Date.now() }));
  } catch {
  }
}
function clearPendingDeploy() {
  try {
    sessionStorage.removeItem(PENDING_DEPLOY_KEY);
  } catch {
  }
}
function readSnooze() {
  try {
    const raw = sessionStorage.getItem(SNOOZE_KEY);
    if (!raw) return 0;
    const ts = parseInt(raw, 10);
    return Number.isFinite(ts) ? ts : 0;
  } catch {
    return 0;
  }
}
function writeSnooze(until) {
  try {
    sessionStorage.setItem(SNOOZE_KEY, String(until));
  } catch {
  }
}
function clearSnooze() {
  try {
    sessionStorage.removeItem(SNOOZE_KEY);
  } catch {
  }
}
function DeployManager() {
  const [status, setStatus] = useState(null);
  const [ui, setUi] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [deployingNow, setDeployingNow] = useState(false);
  const [snoozedUntil, setSnoozedUntil] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  async function fetchStatus() {
    try {
      const r = await fetch("/api/admin/deploy", { credentials: "include" });
      if (!r.ok) {
        if (r.status === 401) return;
        setUi("error");
        setErrorMsg("Não foi possível verificar status do deploy.");
        return;
      }
      const data = await r.json();
      setStatus(data);
      if (!data.hookConfigured) {
        setUi("not_configured");
        return;
      }
      const pending = readPendingDeploy();
      if (pending) {
        const elapsed = Date.now() - pending.startedAt;
        const buildCompleted = data.lastDeployedSha && data.lastDeployedSha === pending.sha;
        const expired = elapsed > PENDING_BUILD_GRACE_MS;
        if (buildCompleted) {
          clearPendingDeploy();
          setDeployingNow(false);
          if (data.pendingCommits > 0) {
            setUi("pending");
            return;
          }
          setUi("up_to_date");
          return;
        }
        if (expired) {
          clearPendingDeploy();
          setDeployingNow(false);
        } else {
          setUi("deploying");
          return;
        }
      }
      const snoozeTs = readSnooze();
      if (snoozeTs > Date.now() && data.pendingCommits > 0 && !data.building) {
        setSnoozedUntil(snoozeTs);
        setUi("snoozed");
        return;
      }
      if (data.building) {
        setUi("deploying");
        return;
      }
      if (data.pendingCommits > 0) {
        setUi("pending");
        return;
      }
      setUi("up_to_date");
    } catch (e) {
      setUi("error");
      setErrorMsg(e?.message || "Erro de conexão");
    }
  }
  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 15e3);
    return () => clearInterval(id);
  }, []);
  async function triggerDeploy() {
    const targetSha = status?.lastCommitSha || "";
    if (targetSha) writePendingDeploy(targetSha);
    setDeployingNow(true);
    setUi("deploying");
    clearSnooze();
    setSnoozedUntil(0);
    try {
      const r = await fetch("/api/admin/deploy", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } });
      const data = await r.json();
      if (!r.ok) {
        clearPendingDeploy();
        setUi("error");
        setErrorMsg(data.error || "Falha ao iniciar deploy.");
        setDeployingNow(false);
        return;
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        fetchStatus();
      }, 4e3);
    } catch (e) {
      clearPendingDeploy();
      setUi("error");
      setErrorMsg(e?.message || "Erro de conexão");
      setDeployingNow(false);
    }
  }
  function snooze() {
    const until = Date.now() + SNOOZE_HOURS * 60 * 60 * 1e3;
    writeSnooze(until);
    setSnoozedUntil(until);
    setUi("snoozed");
  }
  function unsnooze() {
    clearSnooze();
    setSnoozedUntil(0);
    fetchStatus();
  }
  if (ui === "loading" || ui === "up_to_date") return null;
  if (showSuccess) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 shrink-0" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-800 font-medium", children: "Deploy iniciado! O site será atualizado em ~1 minuto." })
    ] });
  }
  if (ui === "not_configured") {
    return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-slate-500 shrink-0" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700", children: "Deploy manual ainda não está configurado neste site. Contate o suporte para ativar." })
    ] });
  }
  if (ui === "error") {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-600 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-red-800", children: "Erro ao verificar deploy" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-red-700 mt-0.5", children: errorMsg })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: fetchStatus, className: "text-xs font-medium text-red-700 underline hover:text-red-900", children: "Tentar novamente" })
    ] });
  }
  if (ui === "deploying") {
    return /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-blue-600 shrink-0 animate-spin" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-blue-900", children: "Publicando no ar..." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-700 mt-0.5", children: "As alterações estarão visíveis em ~1 a 2 minutos. Você não precisa clicar de novo." })
      ] })
    ] });
  }
  if (ui === "snoozed") {
    const minsLeft = Math.max(1, Math.round((snoozedUntil - Date.now()) / 6e4));
    return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-500 shrink-0" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600", children: [
          "Aviso de deploy oculto por ~",
          minsLeft >= 60 ? `${Math.round(minsLeft / 60)}h` : `${minsLeft}min`,
          ". Suas alterações ainda não estão no ar."
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: unsnooze, className: "text-xs font-medium text-violet-700 hover:text-violet-900 underline", children: "Mostrar agora" })
    ] });
  }
  const count = status?.pendingCommits ?? 0;
  const lastMsg = status?.lastCommitMessage ?? "";
  return /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-4 flex-wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-amber-900", children: count === 1 ? "Você tem 1 alteração não publicada" : `Você tem ${count} alterações não publicadas` }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-800 mt-0.5", children: [
          "Para que apareçam no site, clique em ",
          /* @__PURE__ */ jsx("strong", { children: "Fazer Deploy" }),
          ".",
          lastMsg ? /* @__PURE__ */ jsxs("span", { className: "text-amber-700", children: [
            ' Última: "',
            lastMsg,
            '"'
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: snooze,
          className: "text-xs font-medium text-amber-700 hover:text-amber-900 px-3 py-2",
          title: `Esconder por ${SNOOZE_HOURS}h`,
          children: "Lembrar depois"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: triggerDeploy,
          className: "inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors",
          children: [
            /* @__PURE__ */ jsx(Rocket, { className: "w-4 h-4" }),
            "Fazer Deploy"
          ]
        }
      )
    ] })
  ] });
}

const $$Astro = createAstro("https://desentupidorapro.com.br");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Admin", activeSection = "" } = Astro2.props;
  return renderTemplate`<html lang="pt-BR" data-astro-cid-2kanml4j> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Admin</title>${renderHead()}</head> <body class="bg-slate-50 min-h-screen" data-astro-cid-2kanml4j> <div class="flex min-h-screen" data-astro-cid-2kanml4j> <!-- Sidebar --> ${renderComponent($$result, "AdminNav", AdminNav, { "client:load": true, "activeSection": activeSection, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/AdminNav", "client:component-export": "default", "data-astro-cid-2kanml4j": true })} <!-- Main Content --> <main class="flex-1 min-w-0 ml-64" data-astro-cid-2kanml4j> <div class="p-8" data-astro-cid-2kanml4j> ${renderComponent($$result, "DeployManager", DeployManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/DeployManager", "client:component-export": "default", "data-astro-cid-2kanml4j": true })} ${renderSlot($$result, $$slots["default"])} </div> </main> </div> ${renderComponent($$result, "CmsToaster", CmsToaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/CmsToaster", "client:component-export": "default", "data-astro-cid-2kanml4j": true })} </body></html>`;
}, "C:/Projects/desentupidora-temp/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $, triggerToast as t };
