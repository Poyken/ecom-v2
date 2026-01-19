import { apiFetch } from "@/lib/api";
import ProductDetailContent from "./ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: any }) {
  const slug = (await params).slug;
  
  let product;
  try {
     product = await apiFetch(`/products/slug/${slug}`);
  } catch (err) {
      console.error(err);
      return notFound();
  }

  if (!product) return notFound();

  return (
    <div className="py-12">
        <ProductDetailContent product={product} />
        
        {/* Related Products Section */}
        <div className="mt-40 space-y-12">
           <h2 className="text-3xl font-black tracking-tighter">You might also like</h2>
           <div className="grid grid-cols-4 gap-8 opacity-40 grayscale pointer-events-none">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
              ))}
           </div>
        </div>
    </div>
  );
}
