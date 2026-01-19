'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/lib/api';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const tenantId = formData.get('tenantId') as string;

  try {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'x-tenant-id': tenantId,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('accessToken', response.accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    cookieStore.set('tenantId', response.user.tenantId, { path: '/' });

    // Role-based redirect
    if (response.user.role === 'OWNER' || response.user.role === 'ADMIN') {
        redirect('/admin/dashboard');
    } else if (response.user.role === 'SUPER_ADMIN') {
        redirect('/superadmin/overview');
    } else {
        redirect('/');
    }

  } catch (error: any) {
    return { error: error.message || 'Login failed' };
  }
}

export async function getMeAction() {
  try {
    return await apiFetch('/auth/me');
  } catch (error) {
    return null;
  }
}

export async function refreshAction() {
    // This action is called by Client Components when they get 401
    // It triggers a call to backend /refresh using cookies (handled by browser automatically for same domain?
    // NO, Backend 8080 vs Frontend 3000. 
    // Credentials 'include' in Server Action `apiFetch`?
    // Wait, Server Action runs on Node server.
    // It has access to `cookies()`.
    
    // We need to call Backend Refresh, taking refresh_token from cookies(), and setting new cookies.
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) return { error: 'No refresh token' };

    try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/refresh`, {
             method: 'POST',
             headers: {
                 'Cookie': `refresh_token=${refreshToken}`
             }
         });

         if (res.ok) {
             const data = await res.json();
             // Set new cookies
             cookieStore.set('accessToken', data.accessToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/' 
             });
             
             // Backend set-cookie refresh_token?
             // We need to parse it manually from 'set-cookie' header and set it in Next.js response.
             const setCookieHeader = res.headers.get('set-cookie');
             if (setCookieHeader) {
                 const newRefreshToken = setCookieHeader.match(/refresh_token=([^;]+)/)?.[1];
                 if (newRefreshToken) {
                      cookieStore.set('refresh_token', newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000, 
                      });
                 }
             }
             return { success: true, accessToken: data.accessToken };
         }
         return { error: 'Refresh failed' };

    } catch (e) {
        return { error: 'Refresh error' };
    }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('tenantId');
  redirect('/');
}
