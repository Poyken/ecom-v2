'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(data: any) {
  try {
    const result = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Process payment if order created successfully
    if (result.id) {
       try {
          await apiFetch(`/payments/process/${result.id}`, {
             method: 'POST',
             body: JSON.stringify({ method: data.paymentMethod })
          });
       } catch (payErr) {
          console.error('Payment processing failed but order was created:', payErr);
       }
    }

    revalidatePath('/admin/orders'); // For admin
    return { success: true, orderId: result.id };
  } catch (error: any) {
    return { error: error.message };
  }
}
