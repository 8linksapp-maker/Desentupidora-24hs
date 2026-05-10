async function githubApi(action, path, extra) {
  const res = await fetch("/api/admin/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, path, ...extra })
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || `Erro ${res.status} na API`);
  }
  return res.json();
}

export { githubApi as g };
