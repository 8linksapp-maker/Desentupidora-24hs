import { v as validateSession } from '../../../../../chunks/auth_-iIfON84.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { p as postPath, s as serializePost } from '../../../../../chunks/_adapter_jwTMXs1s.mjs';
import { f as fileExistsInRepo, w as writeFileToRepo } from '../../../../../chunks/_server_fsrvt-m8.mjs';
export { renderers } from '../../../../../renderers.mjs';

function loadAISettings() {
  try {
    const raw = readFileSync(resolve(process.cwd(), "src/data/pluginsConfig.json"), "utf-8");
    const config = JSON.parse(raw);
    const ai = config?.ai || {};
    return {
      provider: ai.provider || "gemini",
      apiKey: ai.apiKey || "",
      pexelsApiKey: ai.pexelsApiKey || ""
    };
  } catch {
    return { provider: "gemini", apiKey: "" };
  }
}
function resolveApiKey(settings) {
  if (settings.apiKey?.trim()) return settings.apiKey.trim();
  if (settings.provider === "openai") return (process.env.OPENAI_API_KEY || "").trim();
  return (process.env.GEMINI_API_KEY || "").trim();
}
async function callOpenAI(prompt, apiKey, options) {
  const systemPrompt = options?.systemPrompt ?? "Você é um redator profissional especializado em criar conteúdo de alta qualidade para blogs.";
  const maxTokens = options?.maxTokens ?? 4096;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
  const orgId = (process.env.OPENAI_ORGANIZATION_ID || "").trim();
  const projId = (process.env.OPENAI_PROJECT_ID || "").trim();
  if (orgId) headers["OpenAI-Organization"] = orgId;
  if (projId) headers["OpenAI-Project"] = projId;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices[0]?.message?.content?.trim() || "";
}
async function callGemini(prompt, apiKey, options) {
  const systemPrompt = options?.systemPrompt ?? "Você é um redator profissional especializado em criar conteúdo de alta qualidade para blogs.";
  const maxTokens = options?.maxTokens ?? 4096;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${systemPrompt}

${prompt}` }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: maxTokens
      }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}
async function callAI(prompt, settings, apiKey, options) {
  if (settings.provider === "gemini") {
    return callGemini(prompt, apiKey, options);
  }
  return callOpenAI(prompt, apiKey, options);
}

const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";
async function searchPexelsPhotos(apiKey, query, perPage = 5, page = 1) {
  if (!apiKey?.trim() || !query?.trim()) return [];
  const params = new URLSearchParams({
    query: query.trim(),
    per_page: String(perPage),
    page: String(page)
  });
  const res = await fetch(`${PEXELS_SEARCH_URL}?${params}`, {
    headers: { Authorization: apiKey.trim() }
  });
  if (!res.ok) {
    console.error("\x1B[31m✗ Erro Pexels API:\x1B[0m", res.status, await res.text());
    return [];
  }
  const data = await res.json();
  return data.photos ?? [];
}
function getPhotoUrl(photo) {
  return photo.src?.medium || photo.src?.large || photo.src?.original || photo.url;
}
function getThumbnailUrl(photo) {
  return photo.src?.landscape || photo.src?.large || photo.src?.original || photo.url;
}

const DELAY_MS = 500;
const PARAGRAPH_RULE = "Parágrafos com no máximo 3 linhas. Quebre no primeiro ponto final (.) da segunda linha, inserindo linha em branco para novo parágrafo.";
function formatOutlines(outlines) {
  return outlines.map((o, i) => `${i + 1}. ${o.level.toUpperCase()}: ${o.text}`).join("\n");
}
function getHeadingTag(level) {
  const n = level === "h1" ? 1 : level === "h2" ? 2 : level === "h3" ? 3 : 4;
  return "#".repeat(n);
}
function formatParagraphsForReadability(content) {
  const blocks = content.split(/\n\n+/);
  return blocks.map((block) => {
    if (block.startsWith("#") && !block.includes("\n")) return block;
    if (block.startsWith("![")) return block;
    return processParagraph(block);
  }).join("\n\n");
}
function processParagraph(para) {
  const lines = para.split("\n");
  if (lines.length < 2) return para;
  const line2 = lines[1];
  const dotIdx = line2.indexOf(".");
  if (dotIdx >= 0) {
    const p1 = lines[0] + "\n" + line2.substring(0, dotIdx + 1);
    const rest = line2.substring(dotIdx + 1).trim() + (lines.length > 2 ? "\n" + lines.slice(2).join("\n") : "");
    if (rest.trim()) return p1 + "\n\n" + processParagraph(rest);
    return p1;
  }
  if (lines.length > 3) {
    const p1 = lines.slice(0, 2).join("\n");
    const rest = lines.slice(2).join("\n");
    return p1 + "\n\n" + processParagraph(rest);
  }
  return para;
}
function countWords(text) {
  return (text.trim().match(/\S+/g) || []).length;
}
async function insertImagesByWordCount(content, title, pexelsApiKey, searchQuery) {
  if (!pexelsApiKey?.trim() || !searchQuery?.trim()) return { content };
  const photos = await searchPexelsPhotos(pexelsApiKey, searchQuery, 5);
  if (!photos.length) return { content };
  const totalWords = countWords(content);
  const numImages = Math.min(5, Math.floor(totalWords / 400));
  const thumbnailUrl = photos[0] ? getThumbnailUrl(photos[0]) : void 0;
  if (numImages <= 0) return { content, thumbnailUrl };
  const blocks = content.split(/\n\n+/);
  const result = [];
  let wordCount = 0;
  let nextImageAt = 400;
  let photoIndex = 0;
  for (const block of blocks) {
    result.push(block);
    wordCount += countWords(block);
    while (wordCount >= nextImageAt && photoIndex < photos.length && photoIndex < numImages) {
      const photo = photos[photoIndex];
      const url = getPhotoUrl(photo);
      const alt = `${title} - imagem ${photoIndex + 1}`;
      result.push(`![${alt}](${url})`);
      photoIndex++;
      nextImageAt += 400;
    }
  }
  return { content: result.join("\n\n"), thumbnailUrl };
}
function buildVisionPrompt(title, outlines, postType, commercialSubType) {
  const outlineText = formatOutlines(outlines);
  if (postType === "informational") {
    return `Título do artigo: ${title}

Estrutura do artigo:
${outlineText}

Crie uma VISÃO GERAL (plano) deste artigo informacional em 2-4 parágrafos. Defina:
- O ângulo/abordagem principal
- O público-alvo
- Os principais pontos que serão cobertos
- O tom (educativo, acessível, baseado em evidências)

Responda APENAS com a visão geral, sem escrever o conteúdo do artigo.`;
  }
  if (commercialSubType === "guia-melhores") {
    return `Título do artigo: ${title}

Estrutura do artigo:
${outlineText}

Este é um GUIA DOS MELHORES (lista ranqueada). Crie uma VISÃO GERAL em 2-4 parágrafos definindo:
- Os critérios de ranqueamento que serão usados
- A metodologia de comparação
- O público-alvo e suas necessidades
- O tom (persuasivo mas informativo, foco em ajudar na decisão de compra)

Responda APENAS com a visão geral, sem escrever o conteúdo do artigo.`;
  }
  return `Título do artigo: ${title}

Estrutura do artigo:
${outlineText}

Este é um SPR (Single Product Review). Crie uma VISÃO GERAL em 2-4 parágrafos definindo:
- O produto/serviço em foco
- Os principais aspectos que serão avaliados
- O público-alvo
- O tom (analítico, honesto, com prós e contras, CTA natural)

Responda APENAS com a visão geral, sem escrever o conteúdo do artigo.`;
}
function buildIntroPrompt(title, outlines, vision, postType, commercialSubType) {
  const outlineText = formatOutlines(outlines);
  let instructions = "";
  if (postType === "informational") {
    instructions = "Escreva uma introdução que contextualize o tema, antecipe o que será abordado e engaje o leitor. Use # Introdução como título. Formato Markdown.";
  } else if (commercialSubType === "guia-melhores") {
    instructions = "Escreva uma introdução que apresente o guia, explique como a lista foi montada e prometa valor ao leitor. Use # Introdução como título. Formato Markdown.";
  } else {
    instructions = "Escreva uma introdução que apresente o produto/serviço e o contexto do review. Use # Introdução como título. Formato Markdown.";
  }
  return `Título: ${title}

Estrutura:
${outlineText}

Visão geral do artigo:
${vision}

${instructions}

Entre 50 e 100 palavras. NÃO inclua outras seções além da introdução.

${PARAGRAPH_RULE}`;
}
function buildSectionPrompt(title, outline, outlines, vision, intro, previousSections, postType, commercialSubType) {
  const outlineText = formatOutlines(outlines);
  const minWords = outline.minWords && outline.minWords >= 50 ? outline.minWords : 125;
  const wordInstruction = `RESPEITE RIGOROSAMENTE: escreva com aproximadamente ${minWords} palavras (entre ${Math.max(50, minWords - 25)} e ${minWords + 25}).`;
  let requirements = "";
  if (postType === "informational") {
    requirements = `- ${wordInstruction}
- ${PARAGRAPH_RULE}
- Conteúdo baseado em evidências
- Linguagem clara e acessível
- Formato Markdown
- Não inclua o título da seção (já será adicionado)
- Seja objetivo e educativo`;
  } else if (commercialSubType === "guia-melhores") {
    requirements = `- ${wordInstruction}
- ${PARAGRAPH_RULE}
- Análise detalhada do item
- Prós e contras quando fizer sentido
- Comparação com alternativas se aplicável
- Formato Markdown
- Não inclua o título da seção
- Foco em ajudar na decisão de compra`;
  } else {
    requirements = `- ${wordInstruction}
- ${PARAGRAPH_RULE}
- Análise detalhada do aspecto
- Prós e contras quando aplicável
- Formato Markdown
- Não inclua o título da seção
- Tom analítico e honesto`;
  }
  return `Título do artigo: ${title}

Estrutura completa:
${outlineText}

Visão geral:
${vision}

Introdução já escrita:
${intro.slice(0, 800)}${intro.length > 800 ? "..." : ""}

Conteúdo já escrito (seções anteriores):
${previousSections ? previousSections.slice(-2e3) : "(nenhuma)"}

---

Agora escreva APENAS o conteúdo da seção "${outline.text}" (${outline.level.toUpperCase()}).

Requisitos:
${requirements}

${PARAGRAPH_RULE}

Conteúdo da seção (sem o título):`;
}
function buildConclusionPrompt(title, vision, fullContent, postType, commercialSubType) {
  const contentPreview = fullContent.slice(-3e3);
  let instructions = "";
  if (postType === "informational") {
    instructions = "Escreva uma conclusão que resuma os principais pontos, reforce o valor do conteúdo e sugira próximos passos. Use ## Conclusão como título.";
  } else if (commercialSubType === "guia-melhores") {
    instructions = "Escreva uma conclusão que destaque a melhor opção ou resuma as recomendações, com CTA natural. Use ## Conclusão como título.";
  } else {
    instructions = "Escreva uma conclusão com veredicto final sobre o produto, prós e contras resumidos, e CTA. Use ## Conclusão como título.";
  }
  return `Título: ${title}

Visão geral:
${vision}

Conteúdo do artigo (últimas partes):
${contentPreview}

${instructions}

Formato Markdown. Entre 50 e 100 palavras. Apenas a seção de conclusão.

${PARAGRAPH_RULE}`;
}
function generatePlaceholderSection(outline, postType) {
  const heading = `${getHeadingTag(outline.level)} ${outline.text}

`;
  const img = outline.imageUrl ? `![${outline.text}](${outline.imageUrl})

` : "";
  const body = postType === "informational" ? `Conteúdo informacional sobre "${outline.text}". Configure a API Key em /admin/ai para gerar com IA.

` : `Conteúdo comercial sobre "${outline.text}". Configure a API Key em /admin/ai para gerar com IA.

`;
  return heading + img + body;
}
function generatePlaceholderIntro(title, postType) {
  return postType === "informational" ? `# Introdução

Neste artigo, vamos explorar: ${title}. Configure a API Key em /admin/ai para gerar conteúdo com inteligência artificial.

` : `# Introdução

Bem-vindo ao nosso guia sobre: ${title}. Configure a API Key em /admin/ai para gerar conteúdo com inteligência artificial.

`;
}
function generatePlaceholderConclusion(title) {
  return `
## Conclusão

Esperamos que este artigo sobre ${title} tenha sido útil. Configure a API Key em /admin/ai para gerar conclusões personalizadas.

`;
}
async function generatePostContent(title, outlines, postType, commercialSubType, callAIFn, onProgress) {
  let content = "";
  let vision = "";
  let intro = "";
  let previousSections = "";
  onProgress("📋 Criando visão geral do artigo...");
  try {
    vision = await callAIFn(buildVisionPrompt(title, outlines, postType, commercialSubType));
    if (!vision?.trim()) vision = `Artigo sobre ${title} seguindo a estrutura definida.`;
  } catch (e) {
    vision = `Artigo sobre ${title} seguindo a estrutura definida.`;
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
  onProgress("✍️ Gerando introdução...");
  try {
    intro = await callAIFn(buildIntroPrompt(title, outlines, vision, postType, commercialSubType));
    if (!intro?.trim()) intro = generatePlaceholderIntro(title, postType);
    else if (!intro.includes("#")) intro = `# Introdução

${intro}`;
    content += intro.trim() + "\n\n";
  } catch {
    content += generatePlaceholderIntro(title, postType);
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
  for (let i = 0; i < outlines.length; i++) {
    const outline = outlines[i];
    onProgress(`📝 Gerando seção ${i + 1}/${outlines.length}: ${outline.text}`);
    try {
      const sectionContent = await callAIFn(
        buildSectionPrompt(title, outline, outlines, vision, intro, previousSections, postType, commercialSubType)
      );
      const heading = `${getHeadingTag(outline.level)} ${outline.text}

`;
      const img = outline.imageUrl ? `![${outline.text}](${outline.imageUrl})

` : "";
      const section = heading + img + (sectionContent?.trim() || "") + "\n\n";
      content += section;
      previousSections += section;
    } catch {
      content += generatePlaceholderSection(outline, postType);
    }
    if (i < outlines.length - 1) await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  onProgress("🏁 Gerando conclusão...");
  try {
    const conclusion = await callAIFn(
      buildConclusionPrompt(title, vision, content, postType, commercialSubType)
    );
    if (conclusion?.trim()) {
      content += "\n" + conclusion.trim() + "\n\n";
    } else {
      content += generatePlaceholderConclusion(title);
    }
  } catch {
    content += generatePlaceholderConclusion(title);
  }
  return formatParagraphsForReadability(content.trim());
}
function resolveOutlines(body) {
  const { postType, outlines, products, commercialItems } = body;
  if (postType === "commercial" && Array.isArray(commercialItems) && commercialItems.length > 0) {
    return commercialItems.filter((item) => item?.type === "outline" || item?.type === "product").map((item) => {
      if (item.type === "outline" && item.text?.trim()) {
        const n = item.minWords != null ? Number(item.minWords) : void 0;
        return { level: item.level || "h2", text: item.text.trim(), minWords: n && n >= 50 ? n : void 0 };
      }
      if (item.type === "product" && item.name?.trim()) {
        return { level: "h2", text: item.name.trim(), imageUrl: item.imageUrl?.trim() || void 0 };
      }
      return null;
    }).filter((o) => o !== null);
  }
  if (postType === "commercial" && (products?.length || outlines?.length)) {
    const outlineItems = (outlines || []).filter((o) => o?.text?.trim()).map((o) => {
      const n = o.minWords != null ? Number(o.minWords) : void 0;
      return { level: o.level, text: o.text.trim(), minWords: n && n >= 50 ? n : void 0 };
    });
    const productItems = (products || []).filter((p) => p?.name?.trim()).map((p) => ({ level: "h2", text: p.name.trim(), imageUrl: p.imageUrl?.trim() || void 0 }));
    return [...outlineItems, ...productItems];
  }
  return (outlines || []).filter((o) => o?.text?.trim()).map((o) => {
    const n = o.minWords != null ? Number(o.minWords) : void 0;
    return { level: o.level, text: o.text.trim(), minWords: n && n >= 50 ? n : void 0 };
  });
}

const prerender = false;
const MAX_TOKENS_SECTION = 2048;
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
    const body = await request.json();
    const { postType = "informational", commercialSubType, title, slug, author, category } = body;
    if (!title || !slug) {
      return new Response(JSON.stringify({ success: false, error: "Título e slug são obrigatórios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!author || !category) {
      return new Response(JSON.stringify({ success: false, error: "Autor e categoria são obrigatórios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (postType === "commercial" && !["guia-melhores", "spr"].includes(commercialSubType)) {
      return new Response(JSON.stringify({ success: false, error: "Posts comerciais exigem sub-tipo: guia-melhores ou spr" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const effectiveOutlines = resolveOutlines(body);
    if (!effectiveOutlines || !effectiveOutlines.length) {
      return new Response(JSON.stringify({
        success: false,
        error: postType === "commercial" ? "Adicione pelo menos um produto ou uma outline" : "Adicione pelo menos uma outline"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const exists = await fileExistsInRepo(postPath(slug));
    if (exists) {
      return new Response(JSON.stringify({ success: false, error: "Um post com este slug já existe" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const aiSettings = loadAISettings();
    const apiKey = resolveApiKey(aiSettings);
    const encoder = new TextEncoder();
    const send = (data) => `data: ${JSON.stringify(data)}

`;
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(send({ step: "progress", message: "Conectando à inteligência artificial..." })));
          const onProgress = (msg) => {
            controller.enqueue(encoder.encode(send({ step: "progress", message: msg })));
          };
          let content;
          if (apiKey) {
            const callAIFn = (prompt) => callAI(prompt, aiSettings, apiKey, { maxTokens: MAX_TOKENS_SECTION });
            content = await generatePostContent(
              title,
              effectiveOutlines,
              postType,
              postType === "commercial" ? commercialSubType : void 0,
              callAIFn,
              onProgress
            );
          } else {
            controller.enqueue(encoder.encode(send({ step: "progress", message: "Nenhuma API Key configurada. Gerando placeholders..." })));
            content = await generatePostContent(
              title,
              effectiveOutlines,
              postType,
              postType === "commercial" ? commercialSubType : void 0,
              async () => {
                throw new Error("No API Key");
              },
              onProgress
            );
          }
          let heroImage;
          if (aiSettings.pexelsApiKey?.trim()) {
            onProgress("🖼️ Inserindo imagens do Pexels...");
            try {
              let searchQuery = title;
              if (apiKey) {
                try {
                  const translated = await callAI(
                    `Traduza para inglês APENAS o texto abaixo. Responda somente com a tradução, sem aspas nem explicações.

${title}`,
                    aiSettings,
                    apiKey,
                    { maxTokens: 64 }
                  );
                  if (translated?.trim().length > 2) searchQuery = translated.trim();
                } catch {
                }
              }
              const result = await insertImagesByWordCount(content, title, aiSettings.pexelsApiKey.trim(), searchQuery);
              content = result.content;
              heroImage = result.thumbnailUrl;
            } catch {
            }
          }
          controller.enqueue(encoder.encode(send({ step: "progress", message: "Salvando o post..." })));
          const description = title.length > 160 ? title.substring(0, 157) + "..." : title;
          const postContent = serializePost({
            title,
            slug,
            description,
            content,
            heroImage: heroImage || "",
            category,
            author,
            pubDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            draft: false
          });
          const success = await writeFileToRepo(postPath(slug), postContent, {
            message: `CMS: Criação do artigo ${slug} (IA)`
          });
          if (!success) {
            controller.enqueue(encoder.encode(send({ step: "error", error: "Erro ao salvar post" })));
          } else {
            controller.enqueue(encoder.encode(send({ step: "done", success: true, slug, title })));
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Erro desconhecido";
          controller.enqueue(encoder.encode(send({ step: "error", error: msg })));
          console.error("✗ Erro ao gerar post com IA:", err);
        } finally {
          controller.close();
        }
      }
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message || "Erro desconhecido" }), {
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
