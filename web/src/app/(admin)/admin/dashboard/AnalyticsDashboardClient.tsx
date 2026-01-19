'use client';

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('./RevenueChart'), { ssr: false });

interface Props {
  stats: any;
  chartData: any[];
  topProducts: any[];
  range: string;
}

import { useMemo } from 'react';

// ... (imports)

export default function AnalyticsDashboardClient({ stats, chartData, topProducts, range }: Props) {
  const kpis = useMemo(() => {
    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const revenueChange = calculateChange(stats.revenue.current, stats.revenue.previous);
    const ordersChange = calculateChange(stats.orders.current, stats.orders.previous);
    const aovChange = calculateChange(stats.aov.current, stats.aov.previous);

    return [
        { 
        label: 'Revenue', 
        value: `$${stats.revenue.current.toLocaleString()}`, 
        change: revenueChange, 
        icon: DollarSign,
        color: 'text-emerald-500' 
        },
        { 
        label: 'Orders', 
        value: stats.orders.current.toString(), 
        change: ordersChange, 
        icon: ShoppingBag,
        color: 'text-blue-500' 
        },
        { 
        label: 'AOV', 
        value: `$${stats.aov.current.toFixed(2)}`, 
        change: aovChange, 
        icon: TrendingUp,
        color: 'text-purple-500' 
        },
        { 
        label: 'New Customers', 
        value: stats.customers.toString(), 
        change: 0, 
        icon: Users,
        color: 'text-orange-500',
        noChange: true
        },
    ];
  }, [stats]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">Real-time business insights and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-900/50 border border-white/5 rounded-xl">
           {['today', '7d', '30d', 'this_month'].map((r) => (
             <a
               key={r}
               href={`?range=${r}`}
               className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                 range === r 
                   ? 'bg-primary text-black' 
                   : 'text-zinc-400 hover:text-white'
               }`}
             >
               {r.replace('_', ' ').toUpperCase()}
             </a>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="group relative p-6 bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <kpi.icon size={48} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
                <kpi.icon size={14} className={kpi.color} />
                {kpi.label}
              </div>
              <div className="text-3xl font-black tracking-tighter mb-2">{kpi.value}</div>
              {!kpi.noChange && (
                <div className={`flex items-center gap-1 text-xs font-bold ${kpi.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(kpi.change).toFixed(1)}%
                  <span className="text-zinc-600 font-normal ml-1">vs prev period</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-zinc-950 border border-white/5 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">Revenue Growth</h2>
            <div className="text-xs text-zinc-500 font-medium">Daily revenue breakdown</div>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div className="p-8 bg-zinc-950 border border-white/5 rounded-3xl">
          <h2 className="text-xl font-bold tracking-tight mb-8">Top Products</h2>
          <div className="space-y-6">
            {topProducts.map((product: any, i: number) => (
              <div key={product.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:text-primary transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold truncate max-w-[120px]">{product.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">{product.variant}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black">${product.revenue.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-500 font-bold">{product.sales} sales</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
