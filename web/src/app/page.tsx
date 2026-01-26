'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Star, 
  Zap, 
  ShieldCheck, 
  Truck,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/catalog/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Navbar */}
      <nav className="sticky top-0 z-50 glass h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black italic premium-gradient bg-clip-text text-transparent">GALAXY STORE</h1>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-primary transition-colors">Categories</a>
            <a href="#" className="hover:text-primary transition-colors">Deals</a>
            <a href="#" className="hover:text-primary transition-colors">B2B Wholesale</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input className="pl-10 pr-4 py-2 rounded-full bg-muted/30 border-none w-64 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search tech..." />
          </div>
          <button className="relative p-2 hover:bg-muted/50 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">3</span>
          </button>
          <button className="px-5 py-2 secondary premium-gradient text-white rounded-full font-semibold text-sm shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center px-12 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-60 scale-105" 
            alt="Hero Tech" 
          />
        </div>

        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 max-w-2xl space-y-8"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur w-fit border border-primary/30 text-primary-foreground text-xs font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            New Season Launch
          </div>
          <h2 className="text-7xl font-bold leading-tight">
            Next Generation <br /> 
            <span className="premium-gradient bg-clip-text text-transparent italic">Smart Living.</span>
          </h2>
          <p className="text-xl text-zinc-300 leading-relaxed max-w-lg">
            Experience the future of commerce with our B2B2C integrated catalog. High efficiency, matrix variants, and secure payments.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-2 group hover:gap-4 transition-all shadow-xl shadow-primary/40">
              Shop Now
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <div className="py-12 px-12 grid grid-cols-2 md:grid-cols-4 gap-8 bg-card border-b">
        {[
          { icon: Truck, label: 'Free Logistics' },
          { icon: ShieldCheck, label: 'Secured VNPay' },
          { icon: Star, label: 'Premium Quality' },
          { icon: Zap, label: 'Matrix Variants' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 group cursor-default">
            <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/20 transition-colors">
              <item.icon className="w-6 h-6 group-hover:text-primary transition-colors" />
            </div>
            <span className="font-bold text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <main className="py-20 px-12 space-y-12">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold">Featured Catalog</h3>
          <a href="#" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All Collection <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] bg-muted animate-pulse rounded-3xl" />
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
               <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-10" />
               <p className="text-xl">No products available in this tenant yet.</p>
               <p className="text-sm">Storefront correctly configured for tenant isolation.</p>
            </div>
          ) : (
            products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-card rounded-[2.5rem] border hover:shadow-2xl transition-all p-6 overflow-hidden cursor-pointer"
              >
                <div className="aspect-square rounded-3xl overflow-hidden bg-muted mb-6">
                  <img 
                    src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999`} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{product.name}</h4>
                    <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase">TECH</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description || 'Modern high-performance device for next-gen enterprises.'}</p>
                  <div className="pt-4 flex items-center justify-between border-t border-dashed">
                    <span className="text-2xl font-black">${product.basePrice}</span>
                    <button className="w-12 h-12 rounded-2xl premium-gradient text-white flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-90 transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
