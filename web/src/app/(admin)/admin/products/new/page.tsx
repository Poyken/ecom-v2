import { apiFetch } from "@/lib/api";
import NewProductForm from "./Form";

export default async function NewProductEntry() {
  const [categories, brands] = await Promise.all([
    apiFetch('/categories'),
    apiFetch('/brands')
  ]);

  return (
    <div className="space-y-4">
       <NewProductForm categories={categories} brands={brands} />
    </div>
  );
}
