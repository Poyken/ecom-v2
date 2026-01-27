'use client';

import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Tổng quan (Dashboard)', icon: LayoutDashboard, href: '/merchant/dashboard' },
    { title: 'Sản phẩm', icon: Package, href: '/merchant/products' },
    { title: 'Đơn hàng', icon: ShoppingCart, href: '/merchant/orders' },
    { title: 'Kho hàng', icon: Warehouse, href: '/merchant/inventory' },
    { title: 'Cài đặt', icon: Settings, href: '/merchant/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">EcomV2</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.href 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b flex items-center justify-between px-8 bg-card/50 backdrop-blur-md sticky top-0 z-50">
          <div className="relative w-96 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              className="w-full bg-muted/50 border rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
              placeholder="Search anything..." 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin Account</p>
                <p className="text-xs text-muted-foreground">Store Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted border overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-auto bg-muted/20">
          {children}
        </section>
      </main>
    </div>
  );
}
