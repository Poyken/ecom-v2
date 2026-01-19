import { apiFetch } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibrantButton } from "@/components/ui/VibrantButton";
import Link from "next/link";

export default async function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const warehouse = await apiFetch(`/warehouses/${params.id}`); // Need to ensure /warehouses/:id exists
  const [stock, logs] = await Promise.all([
    apiFetch(`/warehouses/${params.id}/stock`),
    apiFetch(`/warehouses/${params.id}/logs`)
  ]);

  return (
    <div className="space-y-12 py-10">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-admin">Warehouse Detail</p>
          <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic">{warehouse.name}</h1>
          <p className="text-xs text-zinc-500 max-w-md">{warehouse.location || 'Local fulfillment center'}</p>
        </div>
        <Link href="/admin/inventory/warehouses">
          <VibrantButton variant="outline" size="sm">Back to Hubs</VibrantButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Local Stock Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xl font-display font-black tracking-tighter uppercase italic">Local Inventory</h2>
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stock.length} SKUs Listed</span>
          </div>
          <GlassCard className="overflow-hidden border-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stock.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-8 py-12 text-center text-zinc-500 text-xs uppercase font-black tracking-widest">No stock records found</td>
                  </tr>
                )}
                {stock.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                       <div className="font-display font-black text-lg uppercase tracking-tight">{item.sku?.product?.name}</div>
                       <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{item.sku?.skuCode}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="font-display font-black text-xl italic">{item.quantity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Recent Movement Logs */}
        <div className="space-y-6">
          <div className="px-2">
            <h2 className="text-xl font-display font-black tracking-tighter uppercase italic">Terminal Logs</h2>
          </div>
          <GlassCard className="p-8 space-y-8">
             {logs.length === 0 && <p className="text-zinc-500 text-xs uppercase font-black tracking-widest">System idle</p>}
             {logs.map((log: any) => (
               <div key={log.id} className="space-y-2 border-l-2 border-accent-admin/20 pl-4 py-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-admin">{log.type}</span>
                    <span className="text-[9px] text-zinc-600 font-mono tracking-tighter">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-bold leading-tight">{log.sku?.product?.name}</p>
                  <p className="text-[10px] text-zinc-500 italic">Impact: {log.changeAmount > 0 ? '+' : ''}{log.changeAmount} → New Net: {log.newStock}</p>
               </div>
             ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
