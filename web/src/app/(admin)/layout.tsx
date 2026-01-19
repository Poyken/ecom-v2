import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col pt-4">
        <div className="h-16 flex items-center px-8">
          <div className="text-xl font-display font-black tracking-tighter uppercase">
            Poyken<span className="text-accent-admin">.</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <item.icon className="mr-4 h-4 w-4 transition-transform group-hover:scale-110" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="px-4 py-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Admin Mode</p>
              <p className="text-xs font-bold text-accent-admin">Enterprise v2.0</p>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-10">
          <div className="flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-2 w-96">
            <Search className="h-4 w-4 text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="QUICK SEARCH..." 
              className="bg-transparent border-none text-[10px] font-black tracking-widest outline-none w-full placeholder:text-zinc-600"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-zinc-500 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent-admin rounded-full border-2 border-black" />
            </button>
            <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black tracking-widest text-white leading-none">ADMIN USER</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">System Owner</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent-admin text-black font-black flex items-center justify-center text-xs shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                AD
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03)_0%,transparent_50%)]">
          {children}
        </main>
      </div>
    </div>
  );
}

