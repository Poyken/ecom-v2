import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': process.env.NEXT_PUBLIC_TENANT_ID || 'poyken-main',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
        // Token expired and not caught by middleware?
        // Or Middleware didn't refresh?
        // In Server Actions, we can try to refresh manually or redirect.
        // For simplicity, verify if we can refresh here.
        // BUT, setting cookies in Server Action for the NEXT request is fine, 
        // but for current request execution flow updates, it's tricky.
        
        // Let's rely on Middleware for Rotation. 
        // If 401 here, likely Refresh Token also invalid.
        // Throw specific error so caller knows?
        // Or just redirect.
    }
    const error = await res.json().catch(() => ({ message: 'API Request Failed' }));
    throw new Error(error.message || 'API Request Failed');
  }

  return res.json();
}
