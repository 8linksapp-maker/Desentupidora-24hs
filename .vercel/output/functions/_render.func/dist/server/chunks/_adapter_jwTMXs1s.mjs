const config = {
  contentDir: "src/content/blog",
  contentExtension: ".md"};
function serializePost(post) {
  const title = post.title.replace(/"/g, '\\"');
  const description = (post.description || "").replace(/"/g, '\\"');
  const pubDate = post.pubDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const heroImage = post.heroImage || "";
  const category = post.category || "";
  const author = post.author || "";
  const draft = post.draft ?? false;
  return `---
title: "${title}"
description: "${description}"
pubDate: "${pubDate}"
heroImage: "${heroImage}"
category: "${category}"
author: "${author}"
draft: ${draft}
---
${post.content}`;
}
function postPath(slug) {
  return `${config.contentDir}/${slug}${config.contentExtension}`;
}

export { postPath as p, serializePost as s };
