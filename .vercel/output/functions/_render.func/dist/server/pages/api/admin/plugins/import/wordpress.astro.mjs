import { v as validateSession } from '../../../../../chunks/auth_-iIfON84.mjs';
import { XMLParser } from 'fast-xml-parser';
import { s as serializePost, p as postPath } from '../../../../../chunks/_adapter_jwTMXs1s.mjs';
import { w as writeFileToRepo, r as readFileFromRepo, c as writeBinaryToRepo } from '../../../../../chunks/_server_fsrvt-m8.mjs';
export { renderers } from '../../../../../renderers.mjs';

function getValue(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj.trim();
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "";
    const first = obj[0];
    if (typeof first === "string") return first.trim();
    if (first?.["#text"]) return String(first["#text"]).trim();
    return String(first).trim();
  }
  if (obj["#text"]) return String(obj["#text"]).trim();
  return String(obj).trim();
}
function generateSlug(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function htmlToText(html) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}
async function downloadImage(imageUrl) {
  try {
    if (!imageUrl || imageUrl.startsWith("data:") || imageUrl.startsWith("/")) return null;
    const response = await fetch(imageUrl, { signal: AbortSignal.timeout(15e3) });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    const extMap = { "jpeg": "jpg", "jpg": "jpg", "png": "png", "gif": "gif", "webp": "webp", "svg+xml": "svg" };
    const rawExt = contentType.split("/")[1]?.split(";")[0]?.trim() || "jpg";
    const ext = extMap[rawExt] || "jpg";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { base64, ext };
  } catch {
    return null;
  }
}
async function saveImage(imageUrl, postSlug) {
  const downloaded = await downloadImage(imageUrl);
  if (!downloaded) return null;
  try {
    const urlPath = new URL(imageUrl).pathname;
    const urlFilename = urlPath.split("/").pop() || "image";
    const cleanFilename = urlFilename.replace(/[^a-zA-Z0-9.-]/g, "-").replace(/\.[^.]+$/, "");
    const filename = `${Date.now()}-${postSlug}-${cleanFilename}.${downloaded.ext}`;
    const filePath = `public/uploads/${filename}`;
    const ok = await writeBinaryToRepo(filePath, downloaded.base64, { message: `CMS: Import imagem ${filename}` });
    if (!ok) return null;
    return `/uploads/${filename}`;
  } catch {
    return null;
  }
}
function extractImageUrls(html) {
  const urls = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    if (m[1] && !m[1].startsWith("data:")) urls.push(m[1]);
  }
  return [...new Set(urls)];
}
function replaceImageUrls(content, urlMap) {
  let result = content;
  urlMap.forEach((local, original) => {
    result = result.split(original).join(local);
  });
  return result;
}
async function loadCurrentCategories() {
  const raw = await readFileFromRepo("src/data/categories.json");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
async function loadCurrentAuthors() {
  const raw = await readFileFromRepo("src/data/authors.json");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
async function loadExistingPostSlugs() {
  try {
    const raw = await readFileFromRepo("src/data/post-slugs.json");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function importWordPressXML(xmlContent) {
  const result = {
    success: true,
    posts: { imported: 0, skipped: 0, errors: [], imagesImported: 0 },
    authors: { imported: 0, skipped: 0 },
    categories: { imported: 0, skipped: 0 },
    errors: []
  };
  try {
    if (!xmlContent?.trim()) throw new Error("XML vazio ou inválido");
    const hasGitHubCreds = !!(process.env.GITHUB_TOKEN?.trim() && process.env.GITHUB_OWNER?.trim() && process.env.GITHUB_REPO?.trim());
    const isServerless = !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless && !hasGitHubCreds) {
      result.success = false;
      result.errors.push(
        "Configuração necessária: as variáveis de ambiente GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO não estão configuradas. Acesse o painel do Vercel → Settings → Environment Variables e adicione as três variáveis para habilitar o importador em produção."
      );
      return result;
    }
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      parseAttributeValue: true,
      trimValues: true,
      cdataPropName: "#text",
      isArray: (name) => ["item", "wp:author", "wp:category", "category"].includes(name)
    });
    const xmlData = parser.parse(xmlContent);
    const channel = xmlData?.rss?.channel || xmlData?.channel;
    if (!channel) throw new Error("Formato XML inválido: elemento channel não encontrado");
    let currentCategories = await loadCurrentCategories();
    let currentAuthors = await loadCurrentAuthors();
    const authorLoginToId = /* @__PURE__ */ new Map();
    const wpCategories = Array.isArray(channel["wp:category"]) ? channel["wp:category"] : channel["wp:category"] ? [channel["wp:category"]] : [];
    for (const cat of wpCategories) {
      if (!cat) continue;
      const catName = getValue(cat["wp:cat_name"]);
      if (!catName) continue;
      if (currentCategories.includes(catName)) {
        result.categories.skipped++;
        continue;
      }
      currentCategories.push(catName);
      result.categories.imported++;
    }
    if (result.categories.imported > 0) {
      await writeFileToRepo("src/data/categories.json", JSON.stringify(currentCategories, null, 2), {
        message: "CMS: Import WordPress — categorias"
      });
    }
    const wpAuthors = Array.isArray(channel["wp:author"]) ? channel["wp:author"] : channel["wp:author"] ? [channel["wp:author"]] : [];
    for (const author of wpAuthors) {
      if (!author) continue;
      const login = getValue(author["wp:author_login"]);
      const displayName = getValue(author["wp:author_display_name"]) || login;
      if (!login || !displayName) continue;
      const authorId = generateSlug(login);
      authorLoginToId.set(login, authorId);
      const exists = currentAuthors.some((a) => a.id === authorId);
      if (exists) {
        result.authors.skipped++;
        continue;
      }
      const newAuthor = {
        id: authorId,
        name: displayName,
        role: "Autor",
        avatar: "",
        bio: `${getValue(author["wp:author_first_name"])} ${getValue(author["wp:author_last_name"])}`.trim() || displayName
      };
      currentAuthors.push(newAuthor);
      result.authors.imported++;
    }
    if (result.authors.imported > 0) {
      await writeFileToRepo("src/data/authors.json", JSON.stringify(currentAuthors, null, 2), {
        message: "CMS: Import WordPress — autores"
      });
    }
    const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];
    const existingSlugs = await loadExistingPostSlugs();
    const usedSlugs = new Set(existingSlugs);
    for (const item of items) {
      try {
        const postType = getValue(item["wp:post_type"]);
        if (postType !== "post") continue;
        const postStatus = getValue(item["wp:status"]);
        if (postStatus !== "publish" && postStatus !== "draft") continue;
        const title = getValue(item.title) || "Sem título";
        let slug = getValue(item["wp:post_name"]) || generateSlug(title);
        if (!slug) {
          result.posts.skipped++;
          continue;
        }
        let slugBase = slug;
        let counter = 1;
        while (usedSlugs.has(slug)) {
          slug = `${slugBase}-${counter++}`;
        }
        usedSlugs.add(slug);
        const creator = getValue(item["dc:creator"]);
        const content = getValue(item["content:encoded"]);
        const excerpt = getValue(item["excerpt:encoded"]);
        const postDate = getValue(item["wp:post_date"]);
        const authorId = creator ? authorLoginToId.get(creator) || generateSlug(creator) : void 0;
        let categoryName;
        const rawCats = Array.isArray(item.category) ? item.category : item.category ? [item.category] : [];
        for (const cat of rawCats) {
          const domain = cat?.["@_domain"] || "";
          if (domain !== "category") continue;
          const name = typeof cat === "string" ? cat : getValue(cat);
          if (name) {
            categoryName = name;
            break;
          }
        }
        let pubDate;
        if (postDate && postStatus === "publish") {
          try {
            const date = new Date(postDate.replace(" ", "T"));
            if (!isNaN(date.getTime())) pubDate = date.toISOString().split("T")[0];
          } catch {
          }
        }
        let heroImage;
        const postmeta = Array.isArray(item["wp:postmeta"]) ? item["wp:postmeta"] : item["wp:postmeta"] ? [item["wp:postmeta"]] : [];
        for (const meta of postmeta) {
          if (getValue(meta["wp:meta_key"]) === "_thumbnail_id") {
            const thumbId = getValue(meta["wp:meta_value"]);
            if (thumbId) {
              for (const attachItem of items) {
                if (getValue(attachItem["wp:post_id"]) === thumbId && getValue(attachItem["wp:post_type"]) === "attachment") {
                  const attachUrl = getValue(attachItem["wp:attachment_url"]) || getValue(attachItem["guid"]);
                  if (attachUrl) {
                    const localUrl = await saveImage(attachUrl, slug);
                    if (localUrl) {
                      heroImage = localUrl;
                      result.posts.imagesImported++;
                    }
                  }
                  break;
                }
              }
            }
            break;
          }
        }
        const imageUrls = extractImageUrls(content);
        const imageUrlMap = /* @__PURE__ */ new Map();
        for (const imgUrl of imageUrls) {
          const local = await saveImage(imgUrl, slug);
          if (local) {
            imageUrlMap.set(imgUrl, local);
            result.posts.imagesImported++;
          }
        }
        const finalContent = imageUrlMap.size > 0 ? replaceImageUrls(content, imageUrlMap) : content;
        let description = "";
        if (excerpt) {
          description = htmlToText(excerpt).substring(0, 160);
        }
        if (!description && content) {
          description = htmlToText(content).substring(0, 160);
        }
        const postFileContent = serializePost({
          title,
          slug,
          description,
          content: finalContent,
          heroImage: heroImage || "",
          category: categoryName || "",
          author: authorId || "",
          pubDate: pubDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          draft: postStatus === "draft"
        });
        const ok = await writeFileToRepo(postPath(slug), postFileContent, {
          message: `CMS: Import WordPress — post "${title.substring(0, 50)}"`
        });
        if (ok) {
          result.posts.imported++;
        } else {
          result.posts.errors.push(`Erro ao salvar post "${title}"`);
          result.posts.skipped++;
        }
      } catch (err) {
        const title = typeof item.title === "string" ? item.title : getValue(item.title);
        result.posts.errors.push(`Erro ao processar post "${title}": ${err.message}`);
        result.posts.skipped++;
      }
    }
    return result;
  } catch (err) {
    result.success = false;
    result.errors.push(`Erro fatal: ${err.message || String(err)}`);
    return result;
  }
}
async function importParsedData(data) {
  const result = {
    success: true,
    posts: { imported: 0, skipped: 0, errors: [], imagesImported: 0 },
    authors: { imported: 0, skipped: 0 },
    categories: { imported: 0, skipped: 0 },
    errors: []
  };
  try {
    const hasGitHubCreds = !!(process.env.GITHUB_TOKEN?.trim() && process.env.GITHUB_OWNER?.trim() && process.env.GITHUB_REPO?.trim());
    const isServerless = !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless && !hasGitHubCreds) {
      result.success = false;
      result.errors.push(
        "Configuração necessária: GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO não estão configuradas."
      );
      return result;
    }
    let currentCategories = await loadCurrentCategories();
    for (const catName of data.categories) {
      if (!catName || currentCategories.includes(catName)) {
        result.categories.skipped++;
        continue;
      }
      currentCategories.push(catName);
      result.categories.imported++;
    }
    if (result.categories.imported > 0) {
      await writeFileToRepo("src/data/categories.json", JSON.stringify(currentCategories, null, 2), {
        message: "CMS: Import WordPress — categorias"
      });
    }
    let currentAuthors = await loadCurrentAuthors();
    const authorLoginToId = /* @__PURE__ */ new Map();
    for (const author of data.authors) {
      if (!author.login) continue;
      const authorId = generateSlug(author.login);
      authorLoginToId.set(author.login, authorId);
      if (currentAuthors.some((a) => a.id === authorId)) {
        result.authors.skipped++;
        continue;
      }
      currentAuthors.push({
        id: authorId,
        name: author.displayName,
        role: "Autor",
        avatar: "",
        bio: `${author.firstName} ${author.lastName}`.trim() || author.displayName
      });
      result.authors.imported++;
    }
    if (result.authors.imported > 0) {
      await writeFileToRepo("src/data/authors.json", JSON.stringify(currentAuthors, null, 2), {
        message: "CMS: Import WordPress — autores"
      });
    }
    const existingSlugs = await loadExistingPostSlugs();
    const usedSlugs = new Set(existingSlugs);
    for (const post of data.posts) {
      try {
        let slug = post.slug || generateSlug(post.title);
        if (!slug) {
          result.posts.skipped++;
          continue;
        }
        let slugBase = slug;
        let counter = 1;
        while (usedSlugs.has(slug)) {
          slug = `${slugBase}-${counter++}`;
        }
        usedSlugs.add(slug);
        const authorId = post.creator ? authorLoginToId.get(post.creator) || generateSlug(post.creator) : void 0;
        let pubDate;
        if (post.postDate && post.status === "publish") {
          try {
            const date = new Date(post.postDate.replace(" ", "T"));
            if (!isNaN(date.getTime())) pubDate = date.toISOString().split("T")[0];
          } catch {
          }
        }
        let heroImage;
        if (post.thumbnailUrl) {
          const localUrl = await saveImage(post.thumbnailUrl, slug);
          if (localUrl) {
            heroImage = localUrl;
            result.posts.imagesImported++;
          }
        }
        let finalContent = post.content;
        if (post.imageUrls.length > 0) {
          const imageUrlMap = /* @__PURE__ */ new Map();
          for (const imgUrl of post.imageUrls) {
            const local = await saveImage(imgUrl, slug);
            if (local) {
              imageUrlMap.set(imgUrl, local);
              result.posts.imagesImported++;
            }
          }
          if (imageUrlMap.size > 0) finalContent = replaceImageUrls(finalContent, imageUrlMap);
        }
        let description = "";
        if (post.excerpt) description = htmlToText(post.excerpt).substring(0, 160);
        if (!description && post.content) description = htmlToText(post.content).substring(0, 160);
        const postFileContent = serializePost({
          title: post.title,
          slug,
          description,
          content: finalContent,
          heroImage: heroImage || "",
          category: post.category || "",
          author: authorId || "",
          pubDate: pubDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          draft: post.status === "draft"
        });
        const ok = await writeFileToRepo(postPath(slug), postFileContent, {
          message: `CMS: Import WordPress — post "${post.title.substring(0, 50)}"`
        });
        if (ok) {
          result.posts.imported++;
        } else {
          result.posts.errors.push(`Erro ao salvar "${post.title}"`);
          result.posts.skipped++;
        }
      } catch (err) {
        result.posts.errors.push(`Erro ao processar "${post.title}": ${err.message}`);
        result.posts.skipped++;
      }
    }
    return result;
  } catch (err) {
    result.success = false;
    result.errors.push(`Erro fatal: ${err.message || String(err)}`);
    return result;
  }
}

const prerender = false;
const POST = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );
    if (!await validateSession(cookies["admin_session"])) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401 });
    }
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await request.json();
      if (!data.posts || !Array.isArray(data.posts)) {
        return new Response(JSON.stringify({ error: "Dados inválidos." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      console.log(`[WP Import] JSON mode: ${data.posts.length} posts, ${data.categories?.length || 0} categorias, ${data.authors?.length || 0} autores`);
      const result2 = await importParsedData(data);
      console.log(`[WP Import] Concluído: ${result2.posts.imported} posts, ${result2.authors.imported} autores, ${result2.categories.imported} categorias`);
      return new Response(JSON.stringify(result2), {
        status: result2.success ? 200 : 422,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "Arquivo não enviado." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const filename = file.name || "";
    if (!filename.endsWith(".xml") && !file.type.includes("xml")) {
      return new Response(JSON.stringify({ error: "O arquivo deve ser um XML exportado do WordPress." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const xmlContent = await file.text();
    if (!xmlContent?.trim()) {
      return new Response(JSON.stringify({ error: "Arquivo XML vazio." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(`[WP Import] FormData mode: ${filename} (${xmlContent.length} chars)`);
    const result = await importWordPressXML(xmlContent);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 422,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[WP Import] Erro fatal:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro interno ao processar importação",
      posts: { imported: 0, skipped: 0, errors: [], imagesImported: 0 },
      authors: { imported: 0, skipped: 0 },
      categories: { imported: 0, skipped: 0 },
      errors: [error.message || "Erro desconhecido"]
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
