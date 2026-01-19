'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createWarehouseAction(formData: FormData) {
  const name = formData.get('name') as string;
  const location = formData.get('location') as string;

  try {
    await apiFetch('/warehouses', {
      method: 'POST',
      body: JSON.stringify({ name, location }),
    });
    revalidatePath('/admin/inventory/warehouses');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function adjustStockAction(skuId: string, formData: FormData) {
  const warehouseId = formData.get('warehouseId') as string;
  const changeAmount = Number(formData.get('changeAmount'));
  const reason = formData.get('reason') as string;

  try {
    await apiFetch(`/inventory/adjust/${skuId}`, {
      method: 'POST',
      body: JSON.stringify({ warehouseId, changeAmount, reason }),
    });
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
