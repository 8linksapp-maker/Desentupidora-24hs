import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { Image, Loader2, Upload, X, Search } from 'lucide-react';
import { g as githubApi } from './adminApi_DobXZoc4.mjs';
import { t as triggerToast } from './AdminLayout_BfyoGx6I.mjs';

function ImageUpload({ value, onChange, label, folder = "public/assets/images/cms" }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      triggerToast("Por favor, selecione uma imagem válida.", "error");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => {
          const result = reader.result;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });
      const base64Content = await base64Promise;
      const timestamp = Date.now();
      const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
      const fileName = `${timestamp}-${cleanName}`;
      const fullPath = `${folder}/${fileName}`;
      await githubApi("write", fullPath, {
        content: base64Content,
        isBase64: true,
        message: `Upload image: ${fileName} via CMS`
      });
      const publicPath = fullPath.replace(/^public\//, "/");
      onChange(publicPath);
      triggerToast("Imagem enviada com sucesso!", "success");
    } catch (err) {
      console.error("Upload error:", err);
      triggerToast("Erro ao enviar imagem: " + err.message, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    label && /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 uppercase tracking-widest", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-xl transition-all hover:border-blue-300", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0", children: value ? /* @__PURE__ */ jsx("img", { src: value, alt: "Preview", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Image, { className: "w-6 h-6 text-slate-300" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value,
              onChange: (e) => onChange(e.target.value),
              placeholder: "/assets/images/...",
              className: "w-full bg-transparent text-xs text-slate-600 font-mono focus:outline-none mb-1 truncate"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => fileInputRef.current?.click(),
              disabled: uploading,
              className: "text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50",
              children: [
                uploading ? /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "w-3 h-3" }),
                uploading ? "Enviando..." : "Fazer Upload"
              ]
            }
          )
        ] }),
        value && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onChange(""),
            className: "p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all",
            children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          ref: fileInputRef,
          onChange: handleFileChange,
          className: "hidden",
          accept: "image/*"
        }
      )
    ] })
  ] });
}

const ICON_NAMES = [
  // Serviços e Hidráulica
  "Wrench",
  "Droplets",
  "Waves",
  "ShowerHead",
  "Bath",
  "Trash2",
  "Construction",
  "Hammer",
  "Filter",
  "GlassWater",
  "Pipette",
  "UtilityPole",
  "Thermometer",
  "ThermometerSnowflake",
  "Flame",
  "Sparkles",
  "Zap",
  "Lightbulb",
  // Casa e Construção
  "Home",
  "Warehouse",
  "HardHat",
  "Paintbrush",
  "Layers",
  "Grid",
  "Layout",
  "Container",
  "Box",
  "Package",
  // Segurança e Check
  "ShieldCheck",
  "Shield",
  "CheckCircle2",
  "Check",
  "Verified",
  "Award",
  "Trophy",
  "Medal",
  // Comunicação e Usuário
  "Phone",
  "PhoneCall",
  "MessageCircle",
  "Mail",
  "Users",
  "UserCheck",
  "UserPlus",
  "Headphones",
  // Diversos
  "Star",
  "Heart",
  "Smile",
  "Sun",
  "Moon",
  "Cloud",
  "Wind",
  "Umbrella",
  "MapPin",
  "Navigation",
  "Clock",
  "Calendar",
  "Bell",
  "Info",
  "Search",
  "Settings",
  "Camera",
  "Video",
  "Smartphone",
  "Monitor",
  "Laptop",
  "Server",
  "Cpu",
  "Database",
  "Briefcase",
  "ShoppingBag",
  "ShoppingCart",
  "CreditCard",
  "Wallet",
  "Handshake",
  "Rocket",
  "Activity",
  "TrendingUp",
  "BarChart",
  "Target",
  "Flag",
  "Gift",
  "Globe",
  "Compass"
];
function IconPicker({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredIcons = ICON_NAMES.filter(
    (name) => name.toLowerCase().includes(search.toLowerCase())
  );
  const CurrentIcon = LucideIcons[value] || LucideIcons.HelpCircle;
  if (disabled) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center text-blue-600", children: /* @__PURE__ */ jsx(CurrentIcon, { size: 18 }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-3 w-full px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm group",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(CurrentIcon, { size: 18 }) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: value || "Selecionar Ícone" }),
          /* @__PURE__ */ jsx(LucideIcons.ChevronDown, { size: 14, className: `ml-auto text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}` })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute z-[100] mt-2 w-[320px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-3 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white/80 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsx(Search, { size: 16, className: "text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar ícone...",
            className: "flex-1 bg-transparent border-none focus:ring-0 text-sm py-1",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-slate-100 rounded-lg text-slate-400", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-5 gap-1 p-2 max-h-[300px] overflow-y-auto custom-scrollbar", children: [
        filteredIcons.map((name) => {
          const Icon = LucideIcons[name];
          if (!Icon) return null;
          return /* @__PURE__ */ jsx(
            "button",
            {
              title: name,
              type: "button",
              onClick: () => {
                if (onChange) onChange(name);
                setIsOpen(false);
                setSearch("");
              },
              className: `p-2.5 rounded-lg flex items-center justify-center transition-all ${value === name ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`,
              children: /* @__PURE__ */ jsx(Icon, { size: 20, strokeWidth: value === name ? 2.5 : 2 })
            },
            name
          );
        }),
        filteredIcons.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-12 py-8 text-center text-xs text-slate-400", children: "Nenhum ícone encontrado" })
      ] })
    ] })
  ] });
}

export { ImageUpload as I, IconPicker as a };
