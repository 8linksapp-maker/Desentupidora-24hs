const BREVO_BASE = "https://api.brevo.com/v3";
async function addContact(apiKey, email, listId, name) {
  const body = {
    email,
    listIds: [listId],
    updateEnabled: true
  };
  if (name) {
    body.attributes = { FIRSTNAME: name };
  }
  const res = await fetch(`${BREVO_BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });
  if (res.ok || res.status === 204) {
    return { success: true, message: "Contato adicionado com sucesso." };
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 400 && data?.code === "DUPLICATE_PARAMETER") {
    return { success: true, message: "Contato já existia na lista." };
  }
  return { success: false, message: data?.message || `Brevo error ${res.status}` };
}
async function sendTransactionalEmail(apiKey, to, subject, htmlContent, senderEmail, senderName) {
  const body = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject,
    htmlContent
  };
  const res = await fetch(`${BREVO_BASE}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });
  if (res.ok) return { success: true, message: "Email enviado com sucesso." };
  const data = await res.json().catch(() => ({}));
  return { success: false, message: data?.message || `Brevo error ${res.status}` };
}
async function testConnection(apiKey) {
  const res = await fetch(`${BREVO_BASE}/account`, {
    headers: {
      "api-key": apiKey,
      Accept: "application/json"
    }
  });
  if (res.ok) {
    const data = await res.json().catch(() => ({}));
    const name = data?.companyName || data?.firstName || "conta";
    return { success: true, message: `Conectado: ${name}`, accountName: name };
  }
  if (res.status === 401) {
    return { success: false, message: "API Key inválida ou sem permissão." };
  }
  return { success: false, message: `Brevo error ${res.status}` };
}

export { addContact as a, sendTransactionalEmail as s, testConnection as t };
