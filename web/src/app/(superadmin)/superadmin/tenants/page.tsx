import { apiFetch } from "@/lib/api";

export default async function TenantsPage() {
  // Note: This requires SUPERADMIN role. Backend should have /tenants endpoint for superadmins.
  let tenants = [];
  try {
    tenants = await apiFetch('/tenants'); // Hypothetical superadmin endpoint
  } catch (err) {
    console.error(err);
    // Mock for demonstration if endpoint doesn't exist yet
    tenants = [
       { id: '1', name: 'Global Tech Store', domain: 'tech.poyken.com', status: 'ACTIVE', createdAt: new Date() },
       { id: '2', name: 'Fashion Hub', domain: 'fashion.poyken.com', status: 'ACTIVE', createdAt: new Date() },
       { id: '3', name: 'Organic Foods', domain: 'organic.poyken.com', status: 'PENDING', createdAt: new Date() },
    ];
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter">Tenant Intelligence</h1>
        <button className="px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-full text-xs font-black uppercase tracking-widest">
          Onboard New Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tenants.map((t: any) => (
          <div key={t.id} className="group relative p-8 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] hover:border-primary/50 transition-all">
             <div className="absolute top-8 right-8">
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${t.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                   {t.status}
                </div>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{t.name}</h3>
                   <p className="text-xs font-mono text-zinc-500">{t.domain}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Avg. Revenue</p>
                      <p className="font-bold text-sm">$4,250.00</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Uptime</p>
                      <p className="font-bold text-sm text-green-500">99.99%</p>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <div className="text-[10px] text-zinc-400 font-medium">Created: {new Date(t.createdAt).toLocaleDateString()}</div>
                   <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white">Configure →</button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
