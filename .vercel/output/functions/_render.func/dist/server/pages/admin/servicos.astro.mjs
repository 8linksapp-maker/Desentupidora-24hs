import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, Briefcase, Plus, Save, Search, ChevronRight, LayoutGrid, Trash2, FileText, HelpCircle, X } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
import { a as IconPicker, I as ImageUpload } from '../../chunks/IconPicker_fyjIskcR.mjs';
export { renderers } from '../../renderers.mjs';

function ServicesEditor() {
  const [services, setServices] = useState([]);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const data = await githubApi("read", "src/data/services.json");
        if (data) {
          const parsed = JSON.parse(data.content);
          if (parsed.items) {
            setServices(parsed.items);
          } else {
            setServices(parsed);
          }
          setFileSha(data.sha);
          if ((parsed.items || parsed).length > 0) setSelectedIndex(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  const updateService = (updated) => {
    if (selectedIndex === null) return;
    const newServices = [...services];
    newServices[selectedIndex] = updated;
    setServices(newServices);
  };
  const generateSlug = (text) => {
    return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
  };
  const addService = () => {
    const newItem = {
      title: "Novo Serviço",
      description: "Descrição curta do serviço...",
      icon: "Briefcase",
      image: "/assets/images/service/1.jpg",
      slug: "novo-servico",
      link: "/servicos/novo-servico",
      fullContent: "",
      faqs: [],
      sidebar: {
        title: "Como Podemos <br> Ajudar Você?",
        description: "Atendimento emergencial 24 horas por dia em toda a região.",
        buttonText: "Fale Conosco",
        link: "/contato"
      }
    };
    setServices([...services, newItem]);
    setSelectedIndex(services.length);
  };
  const deleteService = (idx) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      const newServices = services.filter((_, i) => i !== idx);
      setServices(newServices);
      setSelectedIndex(newServices.length > 0 ? 0 : null);
    }
  };
  async function save() {
    setSaving(true);
    try {
      const payload = {
        items: services
      };
      await githubApi("write", "src/data/services.json", {
        content: JSON.stringify(payload, null, 4),
        sha: fileSha
      });
      const fresh = await githubApi("read", "src/data/services.json");
      setFileSha(fresh.sha);
      triggerToast("Base de Serviços atualizada!", "success");
    } catch (err) {
      triggerToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center h-64 gap-3 text-slate-500", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-blue-500" }),
    /* @__PURE__ */ jsx("span", { className: "text-sm tracking-widest uppercase font-bold", children: "Carregando Serviços..." })
  ] });
  const filteredServices = services.filter(
    (s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const current = selectedIndex !== null ? services[selectedIndex] : null;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl space-y-6 pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-md z-30 py-4 -mt-4 border-b border-slate-200 shadow-sm px-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200", children: /* @__PURE__ */ jsx(Briefcase, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-bold text-slate-800 text-lg", children: "Editor de Serviços" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium", children: "Gerencie a listagem e páginas internas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: addService,
            className: "flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              " Novo Serviço"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: save,
            disabled: saving,
            className: "flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-all shadow-md active:scale-95",
            children: [
              saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              saving ? "Gravando..." : "Publicar Alterações"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Filtrar serviços...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[70vh]", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: [
            "Lista de Serviços (",
            services.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-y-auto custom-scrollbar", children: filteredServices.map((s, i) => {
            const realIndex = services.indexOf(s);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => setSelectedIndex(realIndex),
                className: `w-full text-left p-4 flex items-center gap-3 border-b border-slate-50 transition-all group cursor-pointer ${selectedIndex === realIndex ? "bg-blue-50/50 border-l-4 border-l-blue-600" : "hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedIndex === realIndex ? "bg-white shadow-sm" : "bg-slate-100"}`, children: /* @__PURE__ */ jsx(IconPicker, { value: s.icon, disabled: true }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: `text-sm font-bold truncate ${selectedIndex === realIndex ? "text-blue-700" : "text-slate-700"}`, children: s.title }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-mono truncate", children: [
                      "/",
                      s.slug
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: `w-4 h-4 transition-transform ${selectedIndex === realIndex ? "text-blue-400 translate-x-1" : "text-slate-200 group-hover:translate-x-1"}` })
                ]
              },
              realIndex
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-8", children: current ? /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-4 mb-2", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider", children: [
              /* @__PURE__ */ jsx(LayoutGrid, { className: "w-4 h-4 text-blue-500" }),
              " Informações Básicas (Card)"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => deleteService(selectedIndex),
                className: "text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all",
                title: "Excluir Serviço",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Nome do Serviço" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: current.title,
                  onChange: (e) => {
                    const title = e.target.value;
                    updateService({ ...current, title, slug: generateSlug(title), link: `/servicos/${generateSlug(title)}` });
                  },
                  className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "URL (Slug)" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 rounded-xl px-4 border border-slate-200", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 font-mono", children: "/servicos/" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: current.slug,
                    onChange: (e) => updateService({ ...current, slug: e.target.value, link: `/servicos/${e.target.value}` }),
                    className: "flex-1 bg-transparent border-none focus:ring-0 text-xs font-mono py-2.5"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Descrição Curta (para listagem)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: current.description,
                  onChange: (e) => updateService({ ...current, description: e.target.value }),
                  rows: 2,
                  className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 md:col-span-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Ícone" }),
                /* @__PURE__ */ jsx(
                  IconPicker,
                  {
                    value: current.icon,
                    onChange: (val) => updateService({ ...current, icon: val })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                ImageUpload,
                {
                  label: "Imagem de Capa",
                  value: current.image,
                  onChange: (val) => updateService({ ...current, image: val })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-4 mb-2 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-emerald-500" }),
            " Conteúdo Detalhado (Página Interna)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Texto Completo do Serviço" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: current.fullContent || "",
                onChange: (e) => updateService({ ...current, fullContent: e.target.value }),
                rows: 8,
                placeholder: "Conteúdo detalhado que aparecerá na página individual deste serviço...",
                className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              ImageUpload,
              {
                label: "Imagem Interna 02",
                value: current.image2 || "",
                onChange: (val) => updateService({ ...current, image2: val })
              }
            ),
            /* @__PURE__ */ jsx(
              ImageUpload,
              {
                label: "Imagem Interna 03",
                value: current.image3 || "",
                onChange: (val) => updateService({ ...current, image3: val })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-4 mb-2 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(HelpCircle, { className: "w-4 h-4 text-orange-500" }),
            " Sidebar de Atendimento (Card)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Título do Card (Aceita HTML)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: current.sidebar?.title || "",
                  placeholder: "Ex: Como podemos <br> ajudar você?",
                  onChange: (e) => updateService({
                    ...current,
                    sidebar: { ...current.sidebar || { title: "", description: "", buttonText: "", link: "" }, title: e.target.value }
                  }),
                  className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Descrição" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: current.sidebar?.description || "",
                  onChange: (e) => updateService({
                    ...current,
                    sidebar: { ...current.sidebar || { title: "", description: "", buttonText: "", link: "" }, description: e.target.value }
                  }),
                  rows: 3,
                  className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Texto do Botão" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: current.sidebar?.buttonText || "",
                    onChange: (e) => updateService({
                      ...current,
                      sidebar: { ...current.sidebar || { title: "", description: "", buttonText: "", link: "" }, buttonText: e.target.value }
                    }),
                    className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest", children: "Link (URL ou WhatsApp)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: current.sidebar?.link || "",
                    placeholder: "/contato ou https://wa.me/...",
                    onChange: (e) => updateService({
                      ...current,
                      sidebar: { ...current.sidebar || { title: "", description: "", buttonText: "", link: "" }, link: e.target.value }
                    }),
                    className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-4 mb-2", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider", children: [
              /* @__PURE__ */ jsx(HelpCircle, { className: "w-4 h-4 text-orange-500" }),
              " Perguntas Frequentes (FAQ)"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => updateService({ ...current, faqs: [...current.faqs || [], { question: "", answer: "" }] }),
                className: "text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all uppercase tracking-widest",
                children: "+ Adicionar FAQ"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            current.faqs?.map((faq, fIdx) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 relative group", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateService({ ...current, faqs: current.faqs?.filter((_, i) => i !== fIdx) }),
                  className: "absolute top-2 right-2 text-red-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all",
                  children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Pergunta?",
                  value: faq.question,
                  onChange: (e) => {
                    const nFaqs = [...current.faqs || []];
                    nFaqs[fIdx].question = e.target.value;
                    updateService({ ...current, faqs: nFaqs });
                  },
                  className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                }
              ),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  placeholder: "Resposta técnica...",
                  value: faq.answer,
                  onChange: (e) => {
                    const nFaqs = [...current.faqs || []];
                    nFaqs[fIdx].answer = e.target.value;
                    updateService({ ...current, faqs: nFaqs });
                  },
                  rows: 2,
                  className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs leading-relaxed"
                }
              )
            ] }, fIdx)),
            (!current.faqs || current.faqs.length === 0) && /* @__PURE__ */ jsx("div", { className: "text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Nenhum FAQ personalizado para este serviço." }) })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400", children: [
        /* @__PURE__ */ jsx(Briefcase, { className: "w-12 h-12 mb-4 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-sm uppercase tracking-widest", children: "Selecione um serviço para editar" })
      ] }) })
    ] })
  ] });
}

const prerender = false;
const $$Servicos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Gerenciar Servi\xE7os", "activeSection": "servicos" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Gerenciar Serviços</h1> <p class="text-slate-500 mt-1">Adicione, edite ou remova os serviços oferecidos pela empresa.</p> </div> ${renderComponent($$result2, "ServicesEditor", ServicesEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/ServicesEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/servicos.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/servicos.astro";
const $$url = "/admin/servicos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Servicos,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
