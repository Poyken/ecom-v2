import React from 'react';

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex selection:bg-accent-super/30">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-zinc-950 flex flex-col relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent-super to-transparent opacity-50" />

        
        <div className="h-24 flex items-center px-10">
          <div className="text-2xl font-display font-black tracking-tighter">
            POYKEN<span className="text-accent-super">.</span>OS
          </div>
        </div>

          <nav className="flex-1 space-y-4 px-4">
            {['Overview', 'Tenants', 'Subscriptions', 'System Logs', 'Settings'].map((item) => (
              <a
                key={item}
                href={`/superadmin/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="p-8 border-t border-white/5">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-accent-super/20 border border-accent-super/30 flex items-center justify-center font-black text-accent-super">
                S
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white">Superadmin</p>
                <p className="text-[10px] font-medium text-zinc-500">Root Access</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-12">
           {children}
        </main>
    </div>
  );
}

