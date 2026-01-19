import { apiFetch } from "@/lib/api";

export default async function StoreProductsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const categoryId = params.category;
  const brandId = params.brand;

  const [products, categories, brands] = await Promise.all([
    apiFetch('/products'),
    apiFetch('/categories'),
    apiFetch('/brands')
  ]);

  // Client-side filtering logic could be moved here if API doesn't support params yet
  const filteredProducts = products.filter((p: any) => {
    if (categoryId && !p.categories.some((c: any) => c.categoryId === categoryId)) return false;
    if (brandId && p.brandId !== brandId) return false;
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-10">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Categories</h3>
          <ul className="space-y-3">
            <li>
              <a href="/products" className={`text-sm ${!categoryId ? 'font-bold underline' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>All Products</a>
            </li>
            {categories.map((cat: any) => (
              <li key={cat.id}>
                <a href={`/products?category=${cat.id}${brandId ? `&brand=${brandId}` : ''}`} className={`text-sm ${categoryId === cat.id ? 'font-bold underline' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Brands</h3>
          <ul className="space-y-3">
            {brands.map((brand: any) => (
              <li key={brand.id}>
                <a href={`/products?brand=${brand.id}${categoryId ? `&category=${categoryId}` : ''}`} className={`text-sm ${brandId === brand.id ? 'font-bold underline' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>
                  {brand.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Showing {filteredProducts.length} items</h2>
          <select className="bg-transparent text-sm font-bold border-none outline-none">
            <option>Recently Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((prod: any) => (
            <a key={prod.id} href={`/products/${prod.slug}`} className="group space-y-4">
              <div className="aspect-[4/5] rounded-3xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all">
                {/* Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">
                   📦
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">
                   {prod.brand?.name}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg group-hover:underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700">{prod.name}</h3>
                <div className="flex items-center justify-between">
                   <p className="text-zinc-500 text-sm font-medium">
                      {prod.categories?.[0]?.category?.name}
                   </p>
                   {/* Get price from first SKU since Product model doesn't have base price anymore */}
                   <p className="font-black text-sm">$--.--</p>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
           <div className="py-24 text-center space-y-4">
              <div className="text-6xl">🔍</div>
              <p className="text-zinc-500 font-medium">No products match your filters.</p>
              <a href="/products" className="inline-block px-8 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-full text-sm font-bold">Clear All Filters</a>
           </div>
        )}
      </div>
    </div>
  );
}
