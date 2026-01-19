const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiClientFetch(path: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': process.env.NEXT_PUBLIC_TENANT_ID || 'poyken-main',
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API Request Failed' }));
    throw new Error(error.message || 'API Request Failed');
  }

  return res.json();
}
