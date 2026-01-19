import { apiFetch } from "@/lib/api";
import { PromotionForm } from "../new/PromotionForm";
import { notFound } from "next/navigation";

export default async function EditPromotionPage({ params }: { params: { id: string } }) {
  let promotion = null;
  try {
    promotion = await apiFetch(`/promotions/${params.id}`);
  } catch (err) {
    console.error(err);
  }

  if (!promotion) {
    notFound();
  }

  // Parse rules values (they are stored as strings in promo service but we need them as objects/values for form)
  const parsedPromotion = {
    ...promotion,
    rules: promotion.rules.map((r: any) => ({ ...r, value: JSON.parse(r.value) })),
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
          Edit Promotion
        </h1>
        <p className="text-zinc-500 mt-1">Update your marketing rule and benefits.</p>
      </div>

      <PromotionForm initialData={parsedPromotion} />
    </div>
  );
}
