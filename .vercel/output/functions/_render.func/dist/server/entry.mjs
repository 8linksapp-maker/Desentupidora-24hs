import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DR5VyEEH.mjs';
import { manifest } from './manifest_BIy5L2Qt.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/adsense.astro.mjs');
const _page3 = () => import('./pages/admin/affiliates.astro.mjs');
const _page4 = () => import('./pages/admin/ai.astro.mjs');
const _page5 = () => import('./pages/admin/authors.astro.mjs');
const _page6 = () => import('./pages/admin/categories.astro.mjs');
const _page7 = () => import('./pages/admin/config.astro.mjs');
const _page8 = () => import('./pages/admin/contato.astro.mjs');
const _page9 = () => import('./pages/admin/cookie-consent.astro.mjs');
const _page10 = () => import('./pages/admin/email-list.astro.mjs');
const _page11 = () => import('./pages/admin/google-tag.astro.mjs');
const _page12 = () => import('./pages/admin/home.astro.mjs');
const _page13 = () => import('./pages/admin/import-wp.astro.mjs');
const _page14 = () => import('./pages/admin/legal.astro.mjs');
const _page15 = () => import('./pages/admin/login.astro.mjs');
const _page16 = () => import('./pages/admin/menu.astro.mjs');
const _page17 = () => import('./pages/admin/meta-pixel.astro.mjs');
const _page18 = () => import('./pages/admin/plugins.astro.mjs');
const _page19 = () => import('./pages/admin/posts/edit.astro.mjs');
const _page20 = () => import('./pages/admin/posts/new.astro.mjs');
const _page21 = () => import('./pages/admin/posts.astro.mjs');
const _page22 = () => import('./pages/admin/redirects.astro.mjs');
const _page23 = () => import('./pages/admin/search-console.astro.mjs');
const _page24 = () => import('./pages/admin/seo.astro.mjs');
const _page25 = () => import('./pages/admin/servicos.astro.mjs');
const _page26 = () => import('./pages/admin/sobre.astro.mjs');
const _page27 = () => import('./pages/admin/social-share.astro.mjs');
const _page28 = () => import('./pages/admin.astro.mjs');
const _page29 = () => import('./pages/api/admin/deploy.astro.mjs');
const _page30 = () => import('./pages/api/admin/deploy-status.astro.mjs');
const _page31 = () => import('./pages/api/admin/github.astro.mjs');
const _page32 = () => import('./pages/api/admin/login.astro.mjs');
const _page33 = () => import('./pages/api/admin/logout.astro.mjs');
const _page34 = () => import('./pages/api/admin/plugins/ai/generate.astro.mjs');
const _page35 = () => import('./pages/api/admin/plugins/ai/test-key.astro.mjs');
const _page36 = () => import('./pages/api/admin/plugins/email-list/leads.astro.mjs');
const _page37 = () => import('./pages/api/admin/plugins/email-list/send-email.astro.mjs');
const _page38 = () => import('./pages/api/admin/plugins/email-list/sequence-status.astro.mjs');
const _page39 = () => import('./pages/api/admin/plugins/email-list/test-brevo.astro.mjs');
const _page40 = () => import('./pages/api/admin/plugins/import/wordpress.astro.mjs');
const _page41 = () => import('./pages/api/admin/plugins/redirects/test.astro.mjs');
const _page42 = () => import('./pages/api/admin/plugins/redirects.astro.mjs');
const _page43 = () => import('./pages/api/admin/plugins/search-console/data.astro.mjs');
const _page44 = () => import('./pages/api/admin/plugins/search-console/test-connection.astro.mjs');
const _page45 = () => import('./pages/api/cron/process-sequences.astro.mjs');
const _page46 = () => import('./pages/api/subscribe.astro.mjs');
const _page47 = () => import('./pages/blog/_slug_.astro.mjs');
const _page48 = () => import('./pages/blog.astro.mjs');
const _page49 = () => import('./pages/categoria/_categoria_.astro.mjs');
const _page50 = () => import('./pages/contato.astro.mjs');
const _page51 = () => import('./pages/privacidade.astro.mjs');
const _page52 = () => import('./pages/robots.txt.astro.mjs');
const _page53 = () => import('./pages/search.astro.mjs');
const _page54 = () => import('./pages/servicos/_slug_.astro.mjs');
const _page55 = () => import('./pages/servicos.astro.mjs');
const _page56 = () => import('./pages/sobre.astro.mjs');
const _page57 = () => import('./pages/termos.astro.mjs');
const _page58 = () => import('./pages/_slug_.astro.mjs');
const _page59 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/adsense.astro", _page2],
    ["src/pages/admin/affiliates.astro", _page3],
    ["src/pages/admin/ai.astro", _page4],
    ["src/pages/admin/authors.astro", _page5],
    ["src/pages/admin/categories.astro", _page6],
    ["src/pages/admin/config.astro", _page7],
    ["src/pages/admin/contato.astro", _page8],
    ["src/pages/admin/cookie-consent.astro", _page9],
    ["src/pages/admin/email-list.astro", _page10],
    ["src/pages/admin/google-tag.astro", _page11],
    ["src/pages/admin/home.astro", _page12],
    ["src/pages/admin/import-wp.astro", _page13],
    ["src/pages/admin/legal.astro", _page14],
    ["src/pages/admin/login.astro", _page15],
    ["src/pages/admin/menu.astro", _page16],
    ["src/pages/admin/meta-pixel.astro", _page17],
    ["src/pages/admin/plugins.astro", _page18],
    ["src/pages/admin/posts/edit.astro", _page19],
    ["src/pages/admin/posts/new.astro", _page20],
    ["src/pages/admin/posts/index.astro", _page21],
    ["src/pages/admin/redirects.astro", _page22],
    ["src/pages/admin/search-console.astro", _page23],
    ["src/pages/admin/seo.astro", _page24],
    ["src/pages/admin/servicos.astro", _page25],
    ["src/pages/admin/sobre.astro", _page26],
    ["src/pages/admin/social-share.astro", _page27],
    ["src/pages/admin/index.astro", _page28],
    ["src/pages/api/admin/deploy.ts", _page29],
    ["src/pages/api/admin/deploy-status.ts", _page30],
    ["src/pages/api/admin/github.ts", _page31],
    ["src/pages/api/admin/login.ts", _page32],
    ["src/pages/api/admin/logout.ts", _page33],
    ["src/pages/api/admin/plugins/ai/generate.ts", _page34],
    ["src/pages/api/admin/plugins/ai/test-key.ts", _page35],
    ["src/pages/api/admin/plugins/email-list/leads.ts", _page36],
    ["src/pages/api/admin/plugins/email-list/send-email.ts", _page37],
    ["src/pages/api/admin/plugins/email-list/sequence-status.ts", _page38],
    ["src/pages/api/admin/plugins/email-list/test-brevo.ts", _page39],
    ["src/pages/api/admin/plugins/import/wordpress.ts", _page40],
    ["src/pages/api/admin/plugins/redirects/test.ts", _page41],
    ["src/pages/api/admin/plugins/redirects/index.ts", _page42],
    ["src/pages/api/admin/plugins/search-console/data.ts", _page43],
    ["src/pages/api/admin/plugins/search-console/test-connection.ts", _page44],
    ["src/pages/api/cron/process-sequences.ts", _page45],
    ["src/pages/api/subscribe.ts", _page46],
    ["src/pages/blog/[slug].astro", _page47],
    ["src/pages/blog/index.astro", _page48],
    ["src/pages/categoria/[categoria].astro", _page49],
    ["src/pages/contato.astro", _page50],
    ["src/pages/privacidade.astro", _page51],
    ["src/pages/robots.txt.ts", _page52],
    ["src/pages/search.astro", _page53],
    ["src/pages/servicos/[slug].astro", _page54],
    ["src/pages/servicos/index.astro", _page55],
    ["src/pages/sobre.astro", _page56],
    ["src/pages/termos.astro", _page57],
    ["src/pages/[slug].astro", _page58],
    ["src/pages/index.astro", _page59]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "54c25188-0407-4b61-8f95-03e1a87ec1d1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
