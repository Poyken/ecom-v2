import { apiFetch } from "@/lib/api";
import { deleteCategoryAction } from "@/actions/catalog";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function CategoriesPage() {
  let categories = [];
  try {
    categories = await apiFetch('/categories');
  } catch (err) {
    console.error(err);
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <a href="/admin/categories/new" className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90">
          New Category
        </a>
      </div>

      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Description</th>
              <th className="px-6 py-4 font-bold">Parent</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {categories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-zinc-500">{cat.description || '-'}</td>
                <td className="px-6 py-4 text-zinc-500">{cat.parent?.name || 'Root'}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <DeleteButton id={cat.id} action={deleteCategoryAction} label="Category" />
                </td>


              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
