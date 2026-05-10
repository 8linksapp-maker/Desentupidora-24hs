import { createSign } from 'node:crypto';

function createJWT(credentials) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1e3);
  const payload = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  })).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(credentials.private_key, "base64url");
  return `${signingInput}.${signature}`;
}
async function getAccessToken(credentials) {
  const jwt = createJWT(credentials);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Falha ao obter token OAuth2: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}
async function querySearchAnalytics(siteUrl, credentials, options) {
  const token = await getAccessToken(credentials);
  const encodedUrl = encodeURIComponent(siteUrl);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startDate: options.startDate,
        endDate: options.endDate,
        dimensions: options.dimensions,
        rowLimit: options.rowLimit ?? 10,
        dataState: "final"
      })
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erro GSC API (${res.status}): ${err}`);
  }
  const data = await res.json();
  return (data.rows ?? []).map((row) => {
    const result = {
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0
    };
    options.dimensions.forEach((dim, i) => {
      if (dim === "query") result.query = row.keys?.[i] ?? "";
      if (dim === "page") result.page = row.keys?.[i] ?? "";
    });
    return result;
  });
}
async function verifySiteAccess(siteUrl, token) {
  const encodedUrl = encodeURIComponent(siteUrl);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedUrl}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error(`Sem acesso ao site "${siteUrl}" no Search Console. Certifique-se de que o service account tem permissão de leitura.`);
  }
  const data = await res.json();
  return data.permissionLevel ?? "siteOwner";
}
function parseServiceAccountJson(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("JSON inválido. Cole o conteúdo completo do arquivo baixado do Google Cloud.");
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('JSON incompleto: os campos "client_email" e "private_key" são obrigatórios.');
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

export { getAccessToken as g, parseServiceAccountJson as p, querySearchAnalytics as q, verifySiteAccess as v };
