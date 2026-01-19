'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getOrdersAction() {
  return apiFetch('/orders');
}

export async function getAdminOrdersAction() {
  return apiFetch('/orders/admin/all');
}

export async function getOrderByIdAction(id: string) {
  return apiFetch(`/orders/${id}`);
}

export async function updateOrderStatusAction(orderId: string, data: { status: string; notes?: string }) {
  try {
    const res = await apiFetch(`/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');
    return { success: true, data: res };
  } catch (error: any) {
    return { error: error.message };
  }
}
