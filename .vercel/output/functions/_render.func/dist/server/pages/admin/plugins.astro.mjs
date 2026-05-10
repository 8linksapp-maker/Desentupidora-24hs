import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { Download, RefreshCw, Globe, Shield, BookOpen, ShoppingCart, ArrowRightLeft, DollarSign, SearchCheck, Cookie, Share2, Upload, Search, Sparkles, Target, Mail, BarChart3, Package, ChevronRight } from 'lucide-react';
import { r as readData } from '../../chunks/readData_B59o9LcR.mjs';
export { renderers } from '../../renderers.mjs';

const iconMap = {
  BarChart3,
  Mail,
  Target,
  Sparkles,
  Search,
  Upload,
  Share2,
  Cookie,
  SearchCheck,
  DollarSign,
  ArrowRightLeft,
  ShoppingCart,
  BookOpen,
  Shield,
  Globe,
  RefreshCw,
  Download
};
function PluginsHub({ registry }) {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: registry.map((p) => {
    const Icon = iconMap[p.icon] ?? Package;
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: p.href,
        className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-4 group",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsx("div", { className: `w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center shrink-0`, children: /* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${p.color}` }) }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-1" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 mb-1", children: p.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 leading-relaxed", children: p.description })
          ] })
        ]
      },
      p.name
    );
  }) }) });
}

const prerender = false;
const $$Plugins = createComponent(($$result, $$props, $$slots) => {
  const registry = readData("pluginRegistry.json", []);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Plugins", "activeSection": "plugins" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Plugins</h1> <p class="text-slate-500 mt-1">Configure as integrações e funcionalidades extras do seu site.</p> </div> ${renderComponent($$result2, "PluginsHub", PluginsHub, { "registry": registry, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/PluginsHub", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/plugins.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/plugins.astro";
const $$url = "/admin/plugins";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Plugins,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
