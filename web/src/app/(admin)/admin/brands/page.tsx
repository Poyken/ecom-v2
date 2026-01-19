import { apiFetch } from "@/lib/api";
import { deleteBrandAction } from "@/actions/catalog";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function BrandsPage() {
  let brands = [];
  try {
    brands = await apiFetch('/brands');
  } catch (err) {
    console.error(err);
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brands</h1>
        <a href="/admin/brands/new" className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90">
          New Brand
        </a>
      </div>

      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Description</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {brands.map((brand: any) => (
              <tr key={brand.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                <td className="px-6 py-4 font-medium">{brand.name}</td>
                <td className="px-6 py-4 text-zinc-500">{brand.description || '-'}</td>
                <td className="px-6 py-4 text-right space-x-3">
                   <DeleteButton id={brand.id} action={deleteBrandAction} label="Brand" />
                </td>


              </tr>
            ))}
             {brands.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 italic">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
