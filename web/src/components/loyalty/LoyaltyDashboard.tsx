'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Gift, History, ChevronRight, Star, Lock } from 'lucide-react';
import { redeemRewardAction } from '@/actions/loyalty';
import { useTransition } from 'react';

// Fallback utility
const formatCurrency = (price: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function LoyaltyDashboard({ program, history, user }: { program: any, history: any[], user: any }) {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const [isPending, startTransition] = useTransition();

  const currentPoints = user?.loyaltyPoints || 0;
  const currentTier = user?.loyaltyTier;
  
  // Calculate Progress
  const nextTier = program?.tiers?.find((t: any) => Number(t.minSpend) > 0 && (!currentTier || Number(t.minSpend) > Number(currentTier.minSpend || 0)));
  // Wait, minSpend is total spend based, but tier upgrade logic in backend uses total spend.
  // Frontend doesn't have total spend info easily unless user object has it. 
  // For now show Tier Name.

  const handleRedeem = async (rewardId: string) => {
    if (confirm('Are you sure you want to redeem this reward?')) {
      startTransition(async () => {
         const res = await redeemRewardAction(rewardId);
         if (res.error) {
             alert(res.error);
         } else {
             alert('Redemption successful! Your voucher code is in history.');
         }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Award size={120} />
             </div>
             <div className="relative z-10">
                 <p className="text-indigo-100 font-medium mb-1">Available Points</p>
                 <h2 className="text-5xl font-bold mb-4">{currentPoints.toLocaleString()}</h2>
                 <div className="flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span>Rate: {formatCurrency(program?.ratePerUnitCurrency || 1000)} = 1 Point</span>
                 </div>
             </div>
        </div>

        {/* Tier Card */}
        <div className="bg-white border rounded-3xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                     <p className="text-gray-500 font-medium mb-1">Current Tier</p>
                     <h2 className="text-3xl font-bold text-gray-900">{currentTier?.name || 'Member'}</h2>
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                    <Award size={32} className="text-indigo-600" />
                </div>
            </div>
            
            {currentTier?.benefits && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Your Benefits:</p>
                    <ul className="space-y-1">
                        {currentTier.benefits.map((b: string, i: number) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b">
         <button 
            onClick={() => setActiveTab('rewards')}
            className={`pb-4 text-sm font-medium relative ${activeTab === 'rewards' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
         >
            Rewards Catalog
            {activeTab === 'rewards' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
         </button>
         <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 text-sm font-medium relative ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
         >
            Point History
            {activeTab === 'history' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
         </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'rewards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {program?.rewards?.map((reward: any) => {
                    const canRedeem = currentPoints >= reward.pointsCost;
                    return (
                        <div key={reward.id} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                                    <Gift size={24} />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{reward.description}</p>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                <div className="text-indigo-600 font-bold">
                                    {reward.pointsCost} Points
                                </div>
                                <button 
                                    onClick={() => handleRedeem(reward.id)}
                                    disabled={!canRedeem || isPending}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                        canRedeem 
                                        ? 'bg-gray-900 text-white hover:bg-gray-800' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {canRedeem ? (isPending ? 'Redeeming...' : 'Redeem') : 'Not Enough Points'}
                                </button>
                            </div>
                        </div>
                    );
                })}
                {(!program?.rewards || program.rewards.length === 0) && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No rewards available at the moment.
                    </div>
                )}
            </div>
        )}

        {activeTab === 'history' && (
            <div className="bg-white border rounded-3xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {history.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(tx.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {tx.description || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        tx.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {tx.type === 'EARN_ORDER' ? 'Earned' : 'Redeemed'}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </td>
                            </tr>
                        ))}
                         {history.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No transaction history yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
