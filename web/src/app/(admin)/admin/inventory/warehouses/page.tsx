import { apiFetch } from "@/lib/api";

export default async function WarehousesPage() {
  let warehouses = [];
  try {
    warehouses = await apiFetch('/warehouses');
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Warehouses</h1>
        <button className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90">
          New Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((w: any) => (
          <div key={w.id} className="p-6 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
             <div className="flex items-center justify-between">
                <div className="text-lg font-bold">{w.name}</div>
                <div className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[10px] uppercase font-bold tracking-tighter">Active</div>
             </div>
             <div className="text-sm text-zinc-500">📍 {w.location || 'No location set'}</div>
             <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-between text-xs">
                <span className="text-zinc-500">Total Stock Items</span>
                <span className="font-bold">0</span>
             </div>
          </div>
        ))}
        {warehouses.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 italic border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-2xl">
            No warehouses registered.
          </div>
        )}
      </div>
    </div>
  );
}
