"use client";

import { useState } from "react";
import { adjustStockAction } from "@/actions/inventory";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibrantButton } from "@/components/ui/VibrantButton";
import { TransferStockModal } from "./TransferStockModal";

export default function InventoryTable({ skus, warehouses }: { skus: any[], warehouses: any[] }) {
  const [selectedSku, setSelectedSku] = useState<any | null>(null);
  const [transferSku, setTransferSku] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdjust(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await adjustStockAction(selectedSku.id, formData);
    
    if (result.success) {
      setSelectedSku(null);
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <GlassCard className="overflow-hidden border-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className="px-8 py-6">Product / Identity</th>
              <th className="px-8 py-6">Configuration</th>
              <th className="px-8 py-6">Availability</th>
              <th className="px-8 py-6 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skus.map((sku: any) => (
              <tr key={sku.id} className="group hover:bg-white/2 transition-colors">

                <td className="px-8 py-6">
                   <div className="font-display font-black text-lg uppercase tracking-tight">{sku.product?.name}</div>
                   <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{sku.skuCode}</div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex gap-2">
                      {sku.optionValues?.map((ov: any) => (
                        <span key={ov.id} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] uppercase font-black tracking-widest text-zinc-400">
                          {ov.optionValue?.value}
                        </span>
                      ))}
                   </div>
                </td>

                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${sku.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-accent-admin'}`} />
                      <span className="font-display font-black text-xl italic">{sku.stock}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                      <VibrantButton 
                        size="sm"
                        variant="admin"
                        onClick={() => setSelectedSku(sku)}
                      >
                        Adjust
                      </VibrantButton>
                      <VibrantButton 
                        size="sm"
                        variant="outline"
                        onClick={() => setTransferSku(sku)}
                      >
                        Transfer
                      </VibrantButton>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Adjust Modal */}
      {selectedSku && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">

           <GlassCard className="p-10 max-w-md w-full space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-admin">Inventory Management</p>
                <h2 className="text-3xl font-display font-black tracking-tighter uppercase">Adjustment</h2>
                <p className="text-xs text-zinc-500">{selectedSku.product?.name}</p>
              </div>

              <form onSubmit={handleAdjust} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Warehouse Source</label>
                    <select name="warehouseId" required className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-accent-admin outline-none">
                       {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Delta Impact</label>
                        <input type="number" name="changeAmount" required placeholder="+10 or -5" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-accent-admin outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Current SKU Total</label>
                        <div className="px-5 py-4 bg-zinc-950 border border-white/5 rounded-2xl font-display font-black text-center text-xl italic">{selectedSku.stock}</div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Justification</label>
                    <input name="reason" placeholder="e.g. Regular Sale, Stock Check" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-accent-admin outline-none" />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <VibrantButton type="button" variant="outline" className="flex-1" onClick={() => setSelectedSku(null)}>Abort</VibrantButton>
                    <VibrantButton isLoading={loading} type="submit" variant="admin" className="flex-1 text-black">Apply</VibrantButton>
                 </div>
              </form>
           </GlassCard>
        </div>
      )}

      {/* Transfer Modal */}
      {transferSku && (
        <TransferStockModal 
          sku={transferSku} 
          warehouses={warehouses} 
          onClose={() => setTransferSku(null)} 
        />
      )}
    </div>
  );
}

  );
}
