import { PromotionForm } from "./PromotionForm";

export default function NewPromotionPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
          New Promotion
        </h1>
        <p className="text-zinc-500 mt-1">Configure your marketing rule and benefits.</p>
      </div>

      <PromotionForm />
    </div>
  );
}
