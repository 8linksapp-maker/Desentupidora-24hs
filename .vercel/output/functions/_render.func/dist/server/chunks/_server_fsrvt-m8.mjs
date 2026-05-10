import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

function readPluginsConfig() {
  try {
    const raw = readFileSync(resolve(process.cwd(), "src/data/pluginsConfig.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function readDataFile(filename, fallback = {}) {
  try {
    const raw = readFileSync(resolve(process.cwd(), "src/data", filename), "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
async function writeFileToRepo(filePath, content, options = {}) {
  const token = options.token || process.env.GITHUB_TOKEN || "";
  const owner = options.owner || process.env.GITHUB_OWNER || "";
  const repo = options.repo || process.env.GITHUB_REPO || "";
  const isDevMode = !token || !owner || !repo;
  if (isDevMode) {
    const absPath = resolve(process.cwd(), filePath);
    mkdirSync(dirname(absPath), { recursive: true });
    writeFileSync(absPath, content, "utf-8");
    return true;
  }
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json"
  };
  let sha;
  const existing = await fetch(apiUrl, { headers });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }
  const body = {
    message: options.message || `CMS: ${filePath}`,
    content: Buffer.from(content).toString("base64")
  };
  if (sha) body.sha = sha;
  const res = await fetch(apiUrl, { method: "PUT", headers, body: JSON.stringify(body) });
  return res.ok;
}
async function writeBinaryToRepo(filePath, base64Content, options = {}) {
  const token = options.token || process.env.GITHUB_TOKEN || "";
  const owner = options.owner || process.env.GITHUB_OWNER || "";
  const repo = options.repo || process.env.GITHUB_REPO || "";
  const isDevMode = !token || !owner || !repo;
  if (isDevMode) {
    const absPath = resolve(process.cwd(), filePath);
    mkdirSync(dirname(absPath), { recursive: true });
    writeFileSync(absPath, Buffer.from(base64Content, "base64"));
    return true;
  }
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json"
  };
  let sha;
  const existing = await fetch(apiUrl, { headers });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }
  const body = {
    message: options.message || `CMS: upload ${filePath}`,
    content: base64Content
  };
  if (sha) body.sha = sha;
  const res = await fetch(apiUrl, { method: "PUT", headers, body: JSON.stringify(body) });
  return res.ok;
}
async function readFileFromRepo(filePath, options = {}) {
  const token = options.token || process.env.GITHUB_TOKEN || "";
  const owner = options.owner || process.env.GITHUB_OWNER || "";
  const repo = options.repo || process.env.GITHUB_REPO || "";
  const isDevMode = !token || !owner || !repo;
  if (isDevMode) {
    try {
      return readFileSync(resolve(process.cwd(), filePath), "utf-8");
    } catch {
      return null;
    }
  }
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json"
  };
  const res = await fetch(apiUrl, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.content) return Buffer.from(data.content, "base64").toString("utf-8");
  return null;
}
async function fileExistsInRepo(filePath, options = {}) {
  const content = await readFileFromRepo(filePath, options);
  return content !== null;
}

export { readPluginsConfig as a, readDataFile as b, writeBinaryToRepo as c, fileExistsInRepo as f, readFileFromRepo as r, writeFileToRepo as w };
