import { c as createComponent, d as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { t as triggerToast, $ as $$AdminLayout } from '../../chunks/AdminLayout_BfyoGx6I.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Home, Save, Image, List, Activity, Users, ToggleLeft, Plus, Trash2, TrendingUp, Calendar, Video, MessageSquare, Newspaper } from 'lucide-react';
import { g as githubApi } from '../../chunks/adminApi_DobXZoc4.mjs';
import { I as ImageUpload, a as IconPicker } from '../../chunks/IconPicker_fyjIskcR.mjs';
export { renderers } from '../../renderers.mjs';

const DEFAULT_CONFIG = {
  hero: { slides: [] },
  features: { items: [] },
  services: { title: "", description: "", items: [] },
  funFacts: { items: [], backgroundImage: "" },
  team: { title: "", subtitle: "", showSection: true, items: [] },
  booking: { subtitle: "", title: "", videoUrl: "", image: "", imageS2: "" },
  testimonials: { title: "", subtitle: "", description: "", items: [] },
  latestBlog: { title: "", subtitle: "", description: "" }
};
function HomeEditor() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [fileSha, setFileSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("hero");
  useEffect(() => {
    async function load() {
      try {
        const data = await githubApi("read", "src/data/home.json");
        if (data) {
          setConfig(JSON.parse(data.content));
          setFileSha(data.sha);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  async function save() {
    setSaving(true);
    try {
      await githubApi("write", "src/data/home.json", {
        content: JSON.stringify(config, null, 4),
        sha: fileSha
      });
      const fresh = await githubApi("read", "src/data/home.json");
      setFileSha(fresh.sha);
      triggerToast("Homepage atualizada!", "success");
    } catch (err) {
      triggerToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }
  const updateNested = (path, value) => {
    setConfig((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let curr = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = value;
      return { ...next };
    });
  };
  if (loading) return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center h-64 gap-3 text-slate-500", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-blue-500" }),
    /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Carregando configuração..." })
  ] });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200 max-w-lg", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-500 shrink-0" }),
    /* @__PURE__ */ jsx("span", { className: "text-red-700 text-sm", children: error })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl space-y-6 pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Home, { className: "w-5 h-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-bold text-slate-800 text-lg", children: "Editor da Homepage" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Gerencie todas as seções dinâmicas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: save,
          disabled: saving,
          className: "flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-all shadow-md active:scale-95",
          children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            saving ? "Gravando..." : "Salvar Alterações"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-1 bg-slate-200/50 p-1 rounded-2xl w-fit", children: ["hero", "features", "services_facts", "other", "sections"].map((t) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setTab(t),
        className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/50"}`,
        children: [
          t === "hero" && /* @__PURE__ */ jsx(Image, { className: "w-4 h-4" }),
          t === "features" && /* @__PURE__ */ jsx(List, { className: "w-4 h-4" }),
          t === "services_facts" && /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }),
          t === "other" && /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
          t === "sections" && /* @__PURE__ */ jsx(ToggleLeft, { className: "w-4 h-4" }),
          t === "hero" ? "Banner Hero" : t === "features" ? "Caracteristicas" : t === "services_facts" ? "Servicos & Numeros" : t === "sections" ? "Secoes" : "Agendamento & Outros"
        ]
      },
      t
    )) }),
    tab === "hero" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-blue-500" }),
          " Slides do Banner"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => updateNested("hero.slides", [...config.hero.slides, { title: "", subtitle: "", bgImage: "", btnText: "", btnLink: "" }]),
            className: "text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
              " Adicionar Slide"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6", children: config.hero.slides.map((slide, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest", children: [
            "Slide #",
            i + 1
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => updateNested("hero.slides", config.hero.slides.filter((_, idx) => idx !== i)),
              className: "text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título Principal" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: slide.title,
                  onChange: (e) => {
                    const s = [...config.hero.slides];
                    s[i].title = e.target.value;
                    updateNested("hero.slides", s);
                  },
                  className: "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Subtítulo / Descrição" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: slide.subtitle,
                  onChange: (e) => {
                    const s = [...config.hero.slides];
                    s[i].subtitle = e.target.value;
                    updateNested("hero.slides", s);
                  },
                  rows: 2,
                  className: "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(
              ImageUpload,
              {
                label: "Imagem de Fundo",
                value: slide.bgImage,
                onChange: (val) => {
                  const s = [...config.hero.slides];
                  s[i].bgImage = val;
                  updateNested("hero.slides", s);
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Texto do Botão" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: slide.btnText,
                    onChange: (e) => {
                      const s = [...config.hero.slides];
                      s[i].btnText = e.target.value;
                      updateNested("hero.slides", s);
                    },
                    className: "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Link do Botão" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: slide.btnLink,
                    onChange: (e) => {
                      const s = [...config.hero.slides];
                      s[i].btnLink = e.target.value;
                      updateNested("hero.slides", s);
                    },
                    className: "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }, i)) })
    ] }),
    tab === "features" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(List, { className: "w-5 h-5 text-blue-500" }),
        " Diferenciais da Seção Features"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: config.features.items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título do Item" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: item.title,
              onChange: (e) => {
                const items = [...config.features.items];
                items[i].title = e.target.value;
                updateNested("features.items", items);
              },
              className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Ícone Visual" }),
          /* @__PURE__ */ jsx(
            IconPicker,
            {
              value: item.icon,
              onChange: (val) => {
                const items = [...config.features.items];
                items[i].icon = val;
                updateNested("features.items", items);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: item.active,
              onChange: (e) => {
                const items = [...config.features.items];
                items[i].active = e.target.checked;
                updateNested("features.items", items);
              },
              className: "w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Destaque (Ativo)" })
        ] })
      ] }, i)) })
    ] }),
    tab === "services_facts" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4", children: [
          /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4 text-blue-500" }),
          " Títulos da Seção de Serviços"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título da Seção" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: config.services.title,
                onChange: (e) => updateNested("services.title", e.target.value),
                className: "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Descrição Curta" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: config.services.description,
                onChange: (e) => updateNested("services.description", e.target.value),
                rows: 2,
                className: "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4", children: [
          /* @__PURE__ */ jsx(List, { className: "w-4 h-4 text-blue-500" }),
          " Itens de Serviço na Home (Máx 6)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
          config.services.items?.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 group relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: [
                "Serviço #",
                i + 1
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    const items = config.services.items.filter((_, idx) => idx !== i);
                    updateNested("services.items", items);
                  },
                  className: "text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              IconPicker,
              {
                value: item.icon,
                onChange: (val) => {
                  const items = [...config.services.items];
                  items[i].icon = val;
                  updateNested("services.items", items);
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Título do Serviço",
                value: item.title,
                onChange: (e) => {
                  const items = [...config.services.items];
                  items[i].title = e.target.value;
                  updateNested("services.items", items);
                },
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-bold"
              }
            ),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                placeholder: "Descrição curta",
                value: item.description,
                onChange: (e) => {
                  const items = [...config.services.items];
                  items[i].description = e.target.value;
                  updateNested("services.items", items);
                },
                rows: 2,
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs resize-none"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Link (ex: /servicos/...)",
                value: item.link,
                onChange: (e) => {
                  const items = [...config.services.items];
                  items[i].link = e.target.value;
                  updateNested("services.items", items);
                },
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-mono"
              }
            )
          ] }, i)),
          config.services.items?.length < 6 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => updateNested("services.items", [...config.services.items, { title: "", description: "", icon: "Briefcase", link: "/servicos" }]),
              className: "border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all gap-2",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Novo Serviço" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-emerald-500" }),
          " Números e Estatísticas (FunFacts)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
          ImageUpload,
          {
            label: "Imagem de Fundo da Seção",
            value: config.funFacts.backgroundImage,
            onChange: (val) => updateNested("funFacts.backgroundImage", val)
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: config.funFacts.items.map((fact, i) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Número" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: fact.count,
                onChange: (e) => {
                  const items = [...config.funFacts.items];
                  items[i].count = e.target.value;
                  updateNested("funFacts.items", items);
                },
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Etiqueta" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: fact.label,
                onChange: (e) => {
                  const items = [...config.funFacts.items];
                  items[i].label = e.target.value;
                  updateNested("funFacts.items", items);
                },
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1", children: "Sufixo (ex: +, %)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: fact.suffix || "",
                onChange: (e) => {
                  const items = [...config.funFacts.items];
                  items[i].suffix = e.target.value;
                  updateNested("funFacts.items", items);
                },
                className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              }
            )
          ] })
        ] }, i)) })
      ] })
    ] }),
    tab === "other" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-orange-500" }),
          " Agendamento & Vídeo"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Subtítulo (Destaque)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.booking.subtitle,
                  onChange: (e) => updateNested("booking.subtitle", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título Chamativo" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.booking.title,
                  onChange: (e) => updateNested("booking.title", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Video, { className: "w-3.5 h-3.5" }),
                " URL do Vídeo (YouTube/Embed)"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.booking.videoUrl,
                  onChange: (e) => updateNested("booking.videoUrl", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-mono"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
              ImageUpload,
              {
                label: "Imagem de Fundo Lateral",
                value: config.booking.image,
                onChange: (val) => updateNested("booking.image", val)
              }
            ),
            /* @__PURE__ */ jsx(
              ImageUpload,
              {
                label: "Imagem Adicional (PNG)",
                value: config.booking.imageS2,
                onChange: (val) => updateNested("booking.imageS2", val)
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-blue-500" }),
              " Especialistas (Equipe)"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: config.team.showSection,
                  onChange: (e) => updateNested("team.showSection", e.target.checked),
                  className: "w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-700", children: "Mostrar Seção" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título Curto" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.team.title,
                  onChange: (e) => updateNested("team.title", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título Principal" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.team.subtitle,
                  onChange: (e) => updateNested("team.subtitle", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest", children: "Membros da Equipe" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => updateNested("team.items", [...config.team.items || [], { name: "", role: "", image: "" }]),
                  className: "text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " Adicionar Membro"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: config.team.items?.map((member, i) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200 relative group", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateNested("team.items", config.team.items.filter((_, idx) => idx !== i)),
                  className: "absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(
                  ImageUpload,
                  {
                    label: "Foto",
                    value: member.image,
                    onChange: (val) => {
                      const items = [...config.team.items];
                      items[i].image = val;
                      updateNested("team.items", items);
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Nome Completo",
                    value: member.name,
                    onChange: (e) => {
                      const items = [...config.team.items];
                      items[i].name = e.target.value;
                      updateNested("team.items", items);
                    },
                    className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Cargo / Especialidade",
                    value: member.role,
                    onChange: (e) => {
                      const items = [...config.team.items];
                      items[i].role = e.target.value;
                      updateNested("team.items", items);
                    },
                    className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  }
                )
              ] })
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3", children: [
            /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4 text-emerald-500" }),
            " Depoimentos de Clientes"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título Curto" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.testimonials.title,
                  onChange: (e) => updateNested("testimonials.title", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Título Principal" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.testimonials.subtitle,
                  onChange: (e) => updateNested("testimonials.subtitle", e.target.value),
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-full", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase mb-1.5", children: "Descrição da Seção" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: config.testimonials.description,
                  onChange: (e) => updateNested("testimonials.description", e.target.value),
                  rows: 2,
                  className: "w-full px-4 py-2 border border-slate-200 rounded-xl resize-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest", children: "Depoimentos" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => updateNested("testimonials.items", [...config.testimonials.items || [], { name: "", role: "", text: "", image: "" }]),
                  className: "text-xs font-bold text_emerald-600 hover:text-emerald-700 flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " Adicionar Depoimento"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: config.testimonials.items?.map((testi, i) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200 relative group", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateNested("testimonials.items", config.testimonials.items.filter((_, idx) => idx !== i)),
                  className: "absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(
                  ImageUpload,
                  {
                    label: "Foto do Cliente",
                    value: testi.image,
                    onChange: (val) => {
                      const items = [...config.testimonials.items];
                      items[i].image = val;
                      updateNested("testimonials.items", items);
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "Nome",
                      value: testi.name,
                      onChange: (e) => {
                        const items = [...config.testimonials.items];
                        items[i].name = e.target.value;
                        updateNested("testimonials.items", items);
                      },
                      className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "Cargo/Local",
                      value: testi.role,
                      onChange: (e) => {
                        const items = [...config.testimonials.items];
                        items[i].role = e.target.value;
                        updateNested("testimonials.items", items);
                      },
                      className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    placeholder: "O que o cliente disse...",
                    value: testi.text,
                    onChange: (e) => {
                      const items = [...config.testimonials.items];
                      items[i].text = e.target.value;
                      updateNested("testimonials.items", items);
                    },
                    rows: 3,
                    className: "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs resize-none"
                  }
                )
              ] })
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 col-span-full", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider text-slate-400", children: [
            /* @__PURE__ */ jsx(Newspaper, { className: "w-3.5 h-3.5" }),
            " Cabeçalho Blog"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.latestBlog.title,
                  onChange: (e) => updateNested("latestBlog.title", e.target.value),
                  placeholder: "Subtítulo",
                  className: "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: config.latestBlog.subtitle,
                  onChange: (e) => updateNested("latestBlog.subtitle", e.target.value),
                  placeholder: "Título",
                  className: "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: config.latestBlog.description,
                onChange: (e) => updateNested("latestBlog.description", e.target.value),
                placeholder: "Descrição",
                rows: 3,
                className: "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    tab === "sections" && /* @__PURE__ */ jsx("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4", children: [
        /* @__PURE__ */ jsx(ToggleLeft, { className: "w-4 h-4 text-violet-500" }),
        " Secoes da Home"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-4", children: "Escolha quais secoes ficam visiveis na homepage." }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
        { key: "showFeatures", label: "Caracteristicas / Diferenciais" },
        { key: "showServices", label: "Servicos" },
        { key: "showFunFacts", label: "Numeros / Estatisticas" },
        { key: "showTeam", label: "Especialistas (Equipe)" },
        { key: "showBooking", label: "Agendamento & Video" },
        { key: "showTestimonials", label: "Depoimentos" },
        { key: "showBlog", label: "Blog / Artigos Recentes" }
      ].map((s) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: config.sections?.[s.key] !== false,
            onChange: (e) => setConfig((prev) => ({ ...prev, sections: { ...prev.sections, [s.key]: e.target.checked } })),
            className: "w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: s.label })
      ] }, s.key)) })
    ] }) })
  ] });
}

const prerender = false;
const $$Home = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Home", "activeSection": "home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-2xl font-bold text-slate-900">Página Inicial</h1> <p class="text-slate-500 mt-1">Gerencie o conteúdo da homepage.</p> </div> ${renderComponent($$result2, "HomeEditor", HomeEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/HomeEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/home.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/home.astro";
const $$url = "/admin/home";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Home,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
