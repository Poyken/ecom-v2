"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createPromotionAction(data: any) {
  try {
    const res = await apiFetch('/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    revalidatePath('/admin/promotions');
    return { data: res };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updatePromotionAction(id: string, data: any) {
  try {
    const res = await apiFetch(`/promotions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    revalidatePath('/admin/promotions');
    return { data: res };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deletePromotionAction(id: string) {
  try {
    await apiFetch(`/promotions/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/admin/promotions');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
