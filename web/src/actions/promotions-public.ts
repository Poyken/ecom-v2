"use server";

import { apiFetch } from "@/lib/api";

export async function validateVoucherAction(data: { code?: string, items: any[], subTotal: number }) {
  try {
    const res = await apiFetch('/promotions/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { data: res };
  } catch (err: any) {
    return { error: err.message };
  }
}
