import { apiFetch } from "@/lib/api";

export default async function AdminDashboardPage() {
  // Fetch stats or summary
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-zinc-500">Updated just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Sales', value: '$12,450.00', change: '+12%', color: 'text-green-500' },
          { label: 'Active Orders', value: '45', change: '+5', color: 'text-blue-500' },
          { label: 'Low Stock Items', value: '12', change: '-2', color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="text-sm font-medium text-zinc-500 mb-2">{stat.label}</div>
            <div className="text-4xl font-bold mb-4 tracking-tight">{stat.value}</div>
            <div className={`text-xs font-bold ${stat.color}`}>{stat.change} from last month</div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">📦</div>
                 <div>
                    <div className="text-sm font-bold">Order #123{i} placed</div>
                    <div className="text-xs text-zinc-500">2 minutes ago</div>
                 </div>
               </div>
               <div className="text-sm font-bold">$120.00</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
