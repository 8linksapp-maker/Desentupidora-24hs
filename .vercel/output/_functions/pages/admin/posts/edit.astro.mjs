import { f as createAstro, c as createComponent, d as renderComponent, b as renderTemplate } from '../../../chunks/astro/server_DviA_9aL.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_BfyoGx6I.mjs';
import { P as PostEditor } from '../../../chunks/PostEditor_Cb8UYrnc.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://desentupidorapro.com.br");
const prerender = false;
const $$Edit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const filePath = Astro2.url.searchParams.get("file");
  if (!filePath) return Astro2.redirect("/admin/posts");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Editar Artigo", "activeSection": "posts" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PostEditor", PostEditor, { "filePath": filePath, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/desentupidora-temp/src/components/admin/PostEditor", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/desentupidora-temp/src/pages/admin/posts/edit.astro", void 0);

const $$file = "C:/Projects/desentupidora-temp/src/pages/admin/posts/edit.astro";
const $$url = "/admin/posts/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Edit,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
