'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  TrendingUp, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    warehouses: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, o, w] = await Promise.all([
          api.get('/catalog/products'),
          api.get('/orders/tenant'),
          api.get('/inventory/warehouses')
        ]);
        setStats({
          products: p.data.length,
          orders: o.data.length,
          warehouses: w.data.length
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Warehouses', value: stats.warehouses, icon: Warehouse, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'B2B Customers', value: 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Strategic pulse of your multi-channel store.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className={`p-3 rounded-xl ${card.bg} w-fit mb-4`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <h3 className="text-3xl font-bold">{card.value}</h3>
            </div>
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h2 className="text-xl font-bold mb-6">Recent Sales</h2>
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Your sales trend will appear here as orders come in.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Active Warehouses</span>
                <span className="font-bold">{stats.warehouses}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Platform Status</span>
                <span className="text-emerald-500 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-xs">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
