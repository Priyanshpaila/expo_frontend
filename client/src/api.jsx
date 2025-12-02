const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';

export async function createLead(payload) {
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    const msg =
      data?.errors?.[0]?.msg ||
      data?.errors?.[0] ||
      data?.message ||
      'Request failed';
    throw new Error(msg);
  }
  return data; // includes whatsapp status
}

export async function fetchAllLeads() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leads`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leads');
  return data.data; // array of leads
}

