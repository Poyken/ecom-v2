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

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('tenantId');
  redirect('/');
}
