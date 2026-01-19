'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function getLoyaltyProgramAction() {
  try {
    return await apiFetch('/loyalty/program');
  } catch (error) {
    console.error('Failed to fetch loyalty program:', error);
    return null;
  }
}

export async function getLoyaltyHistoryAction() {
  try {
    return await apiFetch('/loyalty/history');
  } catch (error) {
    console.error('Failed to fetch loyalty history:', error);
    return [];
  }
}

export async function redeemRewardAction(rewardId: string) {
  try {
    await apiFetch('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId }),
    });
    revalidatePath('/account/loyalty');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Redemption failed' };
  }
}
