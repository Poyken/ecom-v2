import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950/50 flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="text-xl font-display font-black tracking-tighter">
            POYKEN<span className="text-accent-admin">.</span>ADMIN
          </div>
        </div>
        <nav className="space-y-2 p-6">
          {['Dashboard', 'Products', 'Orders', 'Inventory', 'Settings'].map((item) => (
            <a
              key={item}
              href={`/admin/${item.toLowerCase()}`}
              className="block px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center justify-between px-8">
          <div className="text-sm text-zinc-500">Welcome back, Admin</div>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">AD</div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
