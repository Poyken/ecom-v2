"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StepProps {
    categories: any[];
    brands: any[];
    onNext: (data: any) => void;
    onBack: () => void;
    data: any;
}

export default function NewProductForm({ categories, brands }: { categories: any[], brands: any[] }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    brandId: '',
    categoryIds: [],
    options: [], // { name: 'Size', values: ['S', 'M'] }
    skus: []
  });

  const nextStep = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }));
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
       {/* Stepper */}
       <div className="flex items-center justify-between px-12 relative">
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2" />
          {[1, 2, 3].map(i => (
            <div key={i} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'}`}>
               {i}
            </div>
          ))}
       </div>

       {step === 1 && <BasicInfoStep categories={categories} brands={brands} onNext={nextStep} data={formData} />}
       {step === 2 && <OptionsStep onNext={nextStep} onBack={prevStep} data={formData} />}
       {step === 3 && <VariantsStep onBack={prevStep} data={formData} />}
    </div>
  );
}

function BasicInfoStep({ categories, brands, onNext, data }: any) {
    function handleContinue(e: any) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onNext({
            name: fd.get('name'),
            description: fd.get('description'),
            brandId: fd.get('brandId'),
            categoryIds: fd.getAll('categoryIds')
        });
    }

    return (
        <form onSubmit={handleContinue} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-10 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-xl shadow-black/5 space-y-8">
                <h2 className="text-2xl font-black tracking-tight">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Product Name</label>
                        <input name="name" defaultValue={data.name} required className="w-full px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 focus:border-primary transition-all outline-none" placeholder="e.g. iPhone 15 Pro" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Brand</label>
                        <select name="brandId" defaultValue={data.brandId} required className="w-full px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 focus:border-primary transition-all outline-none appearance-none">
                            <option value="">Select Brand</option>
                            {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Description</label>
                    <textarea name="description" defaultValue={data.description} rows={4} className="w-full px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 focus:border-primary transition-all outline-none" placeholder="Elaborate on the product features..." />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Categories (CMD/CTRL to select multiple)</label>
                    <select name="categoryIds" multiple defaultValue={data.categoryIds} required className="w-full px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 focus:border-primary transition-all outline-none min-h-[120px]">
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="px-10 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all">
                    Continue to Options
                </button>
            </div>
        </form>
    );
}

function OptionsStep({ onNext, onBack, data }: any) {
    const [options, setOptions] = useState(data.options.length > 0 ? data.options : [{ name: '', values: [''] }]);

    const addOption = () => setOptions([...options, { name: '', values: [''] }]);
    const addValue = (optIdx: number) => {
        const newOpts = [...options];
        newOpts[optIdx].values.push('');
        setOptions(newOpts);
    };

    const updateOptName = (idx: number, val: string) => {
        const newOpts = [...options];
        newOpts[idx].name = val;
        setOptions(newOpts);
    };

    const updateValue = (optIdx: number, valIdx: number, val: string) => {
        const newOpts = [...options];
        newOpts[optIdx].values[valIdx] = val;
        setOptions(newOpts);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-10 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-xl shadow-black/5 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight">Product Options</h2>
                    <button onClick={addOption} className="text-xs font-black uppercase tracking-widest py-2 px-4 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-zinc-200 transition-colors">+ Add Option</button>
                </div>

                <div className="space-y-12">
                   {options.map((opt: any, optIdx: number) => (
                      <div key={optIdx} className="space-y-6">
                         <div className="flex items-center gap-4">
                            <input 
                                value={opt.name} 
                                onChange={(e) => updateOptName(optIdx, e.target.value)}
                                className="text-lg font-bold bg-transparent border-b-2 border-zinc-100 dark:border-zinc-900 focus:border-primary outline-none py-1" 
                                placeholder="Option Title (e.g. Size)" 
                            />
                         </div>
                         <div className="flex flex-wrap gap-3">
                            {opt.values.map((val: string, valIdx: number) => (
                               <input 
                                  key={valIdx} 
                                  value={val} 
                                  onChange={(e) => updateValue(optIdx, valIdx, e.target.value)}
                                  className="px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-sm outline-none w-24" 
                                  placeholder="Value" 
                               />
                            ))}
                            <button onClick={() => addValue(optIdx)} className="w-10 h-10 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-primary hover:text-primary transition-all">+</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="flex justify-between">
                <button onClick={onBack} className="px-10 py-4 font-black transition-all">Back</button>
                <button onClick={() => onNext({ options })} className="px-10 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all">
                    Review Variants
                </button>
            </div>
        </div>
    );
}

import { createProductAction } from "@/actions/catalog";

function VariantsStep({ onBack, data }: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cartesian product of options to generate SKUs
    const generateSKUs = (options: any[]) => {
        if (options.length === 0) return [];
        let res: any[] = [[]];
        for (const opt of options) {
            if (!opt.name.trim()) continue;
            const next: any[] = [];
            for (const x of res) {
                for (const y of opt.values) {
                    if (y.trim()) next.push([...x, { optionName: opt.name, value: y }]);
                }
            }
            res = next;
        }
        return res;
    };

    const skuCombinations = generateSKUs(data.options);
    const [skuData, setSkuData] = useState<any[]>(skuCombinations.map(() => ({ price: 0, stock: 0 })));

    async function handlePublish() {
        setLoading(true);
        setError(null);

        const payload = {
            ...data,
            skus: skuCombinations.map((combo, idx) => ({
                price: Number(skuData[idx].price),
                stock: Number(skuData[idx].stock),
                optionValues: combo // Back-end needs to handle this Mapping
            }))
        };

        const result = await createProductAction(payload);
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/admin/products');
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-10 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-xl shadow-black/5 space-y-8">
                <h2 className="text-2xl font-black tracking-tight">Review & Finalize SKUs</h2>
                <p className="text-sm text-zinc-500">We've generated {skuCombinations.length} variants based on your options.</p>

                <div className="space-y-4">
                    {skuCombinations.map((combo: any, idx: number) => (
                        <div key={idx} className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {combo.map((c: any, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-black uppercase tracking-tight">
                                        {c.optionName}: {c.value}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-zinc-500">Price</span>
                                    <input 
                                        type="number"
                                        value={skuData[idx].price}
                                        onChange={(e) => {
                                            const newSkuData = [...skuData];
                                            newSkuData[idx].price = e.target.value;
                                            setSkuData(newSkuData);
                                        }}
                                        className="w-24 px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm" 
                                        placeholder="0.00" 
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-zinc-500">Stock</span>
                                    <input 
                                        type="number"
                                        value={skuData[idx].stock}
                                        onChange={(e) => {
                                            const newSkuData = [...skuData];
                                            newSkuData[idx].stock = e.target.value;
                                            setSkuData(newSkuData);
                                        }}
                                        className="w-20 px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm" 
                                        placeholder="0" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20">{error}</div>}
             </div>

             <div className="flex justify-between">
                <button disabled={loading} onClick={onBack} className="px-10 py-4 font-black transition-all">Back</button>
                <button 
                    disabled={loading}
                    onClick={handlePublish}
                    className="px-10 py-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-50 dark:to-zinc-200 text-white dark:text-black rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/20"
                >
                    {loading ? 'Publishing...' : 'Publish Product'}
                </button>
            </div>
        </div>
    );
}

