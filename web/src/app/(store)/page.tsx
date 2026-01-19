import { apiFetch } from "@/lib/api";
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibrantButton } from '@/components/ui/VibrantButton';

export default async function Home() {
  let categories = [];
  try {
    categories = await apiFetch('/categories');
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30" />
        
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Season 2026 Live
          </div>
          
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter leading-[0.85] uppercase">
            Future of <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-primary bg-300% animate-gradient">Commerce</span>.
          </h1>

          
          <p className="text-xl text-zinc-400 max-w-xl font-medium leading-relaxed">
            Experience the next generation of digital shopping. High-performance, 
            multi-tenant, and architecturally superior.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/products">
              <VibrantButton size="lg" variant="primary">Explore Catalog</VibrantButton>
            </Link>
            <Link href="/about">
              <VibrantButton size="lg" variant="outline">Learn More</VibrantButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-12">
        <div className="flex items-end justify-between px-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Collections</p>
            <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">Shop by Category</h2>
          </div>
          <Link href="/categories" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {categories.map((category: any) => (
            <Link key={category.id} href={`/products?category=${category.id}`} className="group">
              <GlassCard className="h-[400px] p-8 flex flex-col justify-between hover:border-primary/50 hover:bg-white/[0.05] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-all" />
                
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Collection</p>
                   <h3 className="text-2xl font-display font-black tracking-tighter uppercase">{category.name}</h3>
                </div>

                <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-zinc-400">120+ Products</span>
                   <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                     →
                   </div>
                </div>
              </GlassCard>
            </Link>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                No categories found. Start by creating some in the Admin Dashboard.
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
