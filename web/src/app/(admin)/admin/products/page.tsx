import { apiFetch } from "@/lib/api";

export default async function ProductsAdminPage() {
  let products = [];
  try {
    products = await apiFetch('/products');
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <a href="/admin/products/new" className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90">
          New Product
        </a>
      </div>

      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold">Brand</th>
              <th className="px-6 py-4 font-bold">Categories</th>
              <th className="px-6 py-4 font-bold">Stock (Total)</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {products.map((prod: any) => (
              <tr key={prod.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                <td className="px-6 py-4">
                   <div className="font-medium">{prod.name}</div>
                   <div className="text-xs text-zinc-500">{prod.slug}</div>
                </td>
                <td className="px-6 py-4 text-zinc-500">{prod.brand?.name || '-'}</td>
                <td className="px-6 py-4">
                   <div className="flex flex-wrap gap-1">
                      {prod.categories?.map((cat: any) => (
                        <span key={cat.categoryId} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] uppercase font-bold">
                           {cat.category?.name || 'Cat'}
                        </span>
                      ))}
                   </div>
                </td>
                <td className="px-6 py-4 font-medium">0</td>
                <td className="px-6 py-4 text-right space-x-3">
                   <button className="text-zinc-400 hover:text-primary transition-colors">Edit</button>
                   <button className="text-zinc-400 hover:text-red-500 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
             {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
