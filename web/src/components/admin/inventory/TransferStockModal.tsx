"use client";

import { useState } from 'react';
import { VibrantButton } from '@/components/ui/VibrantButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { transferStockAction } from '@/actions/inventory';

interface TransferStockModalProps {
  sku: any;
  warehouses: any[];
  onClose: () => void;
}

export const TransferStockModal = ({ sku, warehouses, onClose }: TransferStockModalProps) => {
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    if (!fromWarehouse || !toWarehouse || fromWarehouse === toWarehouse) {
      setError('Please select different source and destination warehouses');
      return;
    }

    setLoading(true);
    setError('');

    const res = await transferStockAction(sku.id, {
      fromWarehouseId: fromWarehouse,
      toWarehouseId: toWarehouse,
      quantity: Number(quantity),
      reason: 'Manual transfer'
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">

      <GlassCard className="w-full max-w-md p-8 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-accent-admin">Inventory Management</p>
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase">Transfer Stock</h2>
          <p className="text-xs text-zinc-500">{sku.skuCode} - {sku.product?.name}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">From Warehouse</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-accent-admin outline-none"
              value={fromWarehouse}
              onChange={(e) => setFromWarehouse(e.target.value)}
            >
              <option value="">Select Source</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">To Warehouse</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-accent-admin outline-none"
              value={toWarehouse}
              onChange={(e) => setToWarehouse(e.target.value)}
            >
              <option value="">Select Destination</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Quantity</label>
            <input 
              type="number"
              min="1"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-accent-admin outline-none"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

        <div className="flex gap-4">
          <VibrantButton 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </VibrantButton>
          <VibrantButton 
            variant="admin" 
            className="flex-1"
            isLoading={loading}
            onClick={handleTransfer}
          >
            Confirm
          </VibrantButton>
        </div>
      </GlassCard>
    </div>
  );
};
