"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/store/useCart";

export default function ProductDetailContent({ product }: { product: any }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const addItem = useCart(state => state.addItem);

  // Auto-select first options if none selected
  useMemo(() => {
    if (Object.keys(selectedOptions).length === 0 && product.options?.length > 0) {
        const initial: Record<string, string> = {};
        product.options.forEach((opt: any) => {
            initial[opt.name] = opt.values[0].value;
        });
        setSelectedOptions(initial);
    }
  }, [product.options]);

  // Find the SKU that matches current selected options
  const currentSku = useMemo(() => {
    if (!product.skus) return null;
    return product.skus.find((sku: any) => {
      return sku.optionValues.every((ov: any) => {
        return selectedOptions[ov.optionValue.option.name] === ov.optionValue.value;
      });
    });
  }, [selectedOptions, product.skus]);


  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (!currentSku) return;
    
    addItem({
      id: currentSku.id,
      productId: product.id,
      name: product.name,
      price: currentSku.price,
      quantity: 1,
      options: Object.entries(selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')
    });
    alert('Added to cart!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Product Images */}
      <div className="space-y-6">
        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[3rem] overflow-hidden flex items-center justify-center text-8xl grayscale border border-zinc-200 dark:border-zinc-800">
          📦
        </div>
        <div className="grid grid-cols-4 gap-4">
           {[1,2,3,4].map(i => (
             <div key={i} className="aspect-square bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center justify-center grayscale text-2xl">🖼️</div>
           ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-10 py-4">
        <div className="space-y-4">
           <div className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
             {product.brand?.name}
           </div>
           <h1 className="text-5xl font-black tracking-tighter leading-tight">{product.name}</h1>
           <div className="flex items-center gap-4">
              <div className="text-3xl font-black tracking-tight text-primary">
                 ${currentSku?.price.toFixed(2) || '---'}
              </div>
              {currentSku?.stock > 0 ? (
                <div className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">In Stock</div>
              ) : (
                <div className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">Out of Stock</div>
              )}
           </div>
        </div>

        <p className="text-zinc-500 leading-relaxed max-w-md">
           {product.description || "The ultimate companion for your digital lifestyle. Crafted with precision and designed for the future."}
        </p>

        {/* Options */}
        <div className="space-y-8 border-t border-zinc-100 dark:border-zinc-900 pt-8">
           {product.options?.map((opt: any) => (
             <div key={opt.id} className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">{opt.name}</h3>
                <div className="flex flex-wrap gap-3">
                   {opt.values.map((v: any) => (
                     <button 
                        key={v.id}
                        onClick={() => handleOptionChange(opt.name, v.value)}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${selectedOptions[opt.name] === v.value ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black border-transparent scale-105 shadow-lg shadow-black/20' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'}`}
                     >
                       {v.value}
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
           <button 
             disabled={!currentSku || currentSku.stock <= 0}
             onClick={handleAddToCart}
             className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black h-16 rounded-[1.5rem] font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:scale-100"
           >
             {!currentSku ? 'Select Options' : (currentSku.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
           </button>
           <button className="w-16 h-16 rounded-[1.5rem] border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              🤍
           </button>
        </div>

        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 pt-4">
           <div className="flex items-center gap-2">🚚 Free Shipping</div>
           <div className="flex items-center gap-2">🔄 30-Day Returns</div>
           <div className="flex items-center gap-2">🛡️ 2-Year Warranty</div>
        </div>
      </div>
    </div>
  );
}
