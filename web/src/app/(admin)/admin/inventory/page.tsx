import { apiFetch } from "@/lib/api";
import InventoryTable from "./InventoryTable";
import { VibrantButton } from "@/components/ui/VibrantButton";
import Link from 'next/link';

export default async function InventoryPage() {
  const [skus, warehouses] = await Promise.all([
    apiFetch('/skus'),
    apiFetch('/warehouses')
  ]);

  return (
    <div className="space-y-12 py-10">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-admin">Warehouse OS</p>
          <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic">Global Inventory</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/inventory/warehouses">
             <VibrantButton variant="outline" size="sm">Hub Management</VibrantButton>
          </Link>
        </div>
      </div>

      <InventoryTable skus={skus} warehouses={warehouses} />
    </div>
  );
}

