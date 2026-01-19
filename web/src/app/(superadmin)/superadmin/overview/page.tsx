export default function SuperadminOverviewPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter text-white">System Overview</h1>
          <p className="text-zinc-500">Global platform performance and health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Platform Revenue', value: '$840,200', trend: '+18%' },
          { label: 'Active Tenants', value: '1,240', trend: '+12%' },
          { label: 'System Uptime', value: '99.99%', trend: 'Stable' },
          { label: 'Support Tickets', value: '14', trend: '-2' },
        ].map((stat) => (
          <div key={stat.label} className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{stat.label}</div>
            <div className="text-3xl font-black mb-2 tracking-tighter text-white">{stat.value}</div>
            <div className="text-xs text-zinc-400 font-medium">{stat.trend} this week</div>
          </div>
        ))}
      </div>
    </div>
  );
}
