'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

// --- CATEGORIES ---

export async function createCategoryAction(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const parentId = formData.get('parentId') as string || null;

  try {
    await apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description, parentId }),
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await apiFetch(`/categories/${id}`, { method: 'DELETE' });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- BRANDS ---

export async function createBrandAction(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  try {
    await apiFetch('/brands', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteBrandAction(id: string) {
  try {
    await apiFetch(`/brands/${id}`, { method: 'DELETE' });
    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
// --- PRODUCTS ---

export async function createProductAction(data: any) {
  try {
    await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
