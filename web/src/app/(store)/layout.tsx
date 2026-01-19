import Link from 'next/link';
import CartCounter from '@/components/store/CartCounter';
import { VibrantButton } from '@/components/ui/VibrantButton';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-black tracking-tighter hover:opacity-80 transition-opacity">
            POYKEN<span className="text-primary">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="/" className="hover:text-primary transition-colors">Discover</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          </nav>
          <div className="flex items-center gap-6">
            <CartCounter />
            <Link href="/login">
              <VibrantButton size="sm" variant="outline" className="rounded-full border-zinc-800">
                Sign In
              </VibrantButton>
            </Link>
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-white dark:bg-black">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Poyken. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
