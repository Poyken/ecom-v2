
import { refreshAction } from '@/actions/auth'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiClientFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': process.env.NEXT_PUBLIC_TENANT_ID || 'poyken-main',
    ...options.headers,
  };

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
      // Try refresh
      const refresh = await refreshAction();
      if (refresh?.success) {
          // Retry original request
          // Note calling Server Action sets cookies in Browser.
          // Subsequent fetch *should* use them if we were calling Next.js API route.
          // But here we call Backend directly. 
          // Backend needs NEW Access Token in Bearer header preferably, 
          // BUT our System relies on Cookies? 
          // NO. `apiFetch` (Server) relies on Cookies.
          // `apiClientFetch` (Client) relies on... nothing currently? 
          // It sends `x-tenant-id`. 
          // If ChatWidget needs Auth, it fails.
          
          // If we want Client -> Backend Auth, we need to manually attach Token?
          // But Token is HttpOnly.
          
          // Conclusion: `apiClientFetch` is only good for Public APIs.
          // If Public API returns 401 (unlikely?), we retry.
          // If Auth API, it shouldn't be called by `apiClientFetch` directly.
          
          // However, to be safe and compatible:
          // However, to be safe and compatible:
          const retryRes = await fetch(`${API_URL}${path}`, {
              ...options,
              headers,
          });
          
          if (!retryRes.ok) {
            const error = await retryRes.json().catch(() => ({ message: 'API Retry Failed' }));
            throw new Error(error.message || 'API Retry Failed');
          }

          return retryRes.json() as Promise<T>;
      }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API Request Failed' }));
    throw new Error(error.message || 'API Request Failed');
  }

  return res.json();
}
