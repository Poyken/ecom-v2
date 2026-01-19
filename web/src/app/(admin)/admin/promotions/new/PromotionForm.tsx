"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibrantButton } from "@/components/ui/VibrantButton";
import { Plus, Trash2, Calendar, ShieldCheck, Zap, Ticket } from "lucide-react";
import { createPromotionAction, updatePromotionAction } from "@/actions/promotions";

export function PromotionForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority || 0,
    usageLimit: initialData?.usageLimit || "",
  });

  const [rules, setRules] = useState<any[]>(initialData?.rules || [
    { type: "MIN_ORDER_VALUE", operator: "GTE", value: "0" }
  ]);

  const [actions, setActions] = useState<any[]>(initialData?.actions || [
    { type: "DISCOUNT_FIXED", value: "0", maxDiscountAmount: "" }
  ]);

  const addRule = () => setRules([...rules, { type: "MIN_ORDER_VALUE", operator: "GTE", value: "0" }]);
  const removeRule = (idx: number) => setRules(rules.filter((_, i) => i !== idx));
  const updateRule = (idx: number, field: string, val: any) => {
    const newRules = [...rules];
    newRules[idx][field] = val;
    setRules(newRules);
  };

  const addAction = () => setActions([...actions, { type: "DISCOUNT_FIXED", value: "0", maxDiscountAmount: "" }]);
  const removeAction = (idx: number) => setActions(actions.filter((_, i) => i !== idx));
  const updateAction = (idx: number, field: string, val: any) => {
    const newActions = [...actions];
    newActions[idx][field] = val;
    setActions(newActions);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
        ...formData,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        priority: Number(formData.priority),
        rules: rules.map(r => ({ ...r, value: JSON.stringify(r.value) })),
        actions: actions.map(a => ({ ...a, value: a.value.toString(), maxDiscountAmount: a.maxDiscountAmount ? Number(a.maxDiscountAmount) : undefined }))
    };

    const result = initialData 
        ? await updatePromotionAction(initialData.id, payload)
        : await createPromotionAction(payload);

    if (result.error) {
        setError(result.error);
        setLoading(false);
    } else {
        router.push("/admin/promotions");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GlassCard className="p-8 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Basic Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</label>
            <input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 focus:border-primary outline-none" 
                placeholder="e.g. Summer Sale 2024"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Ticket className="w-3 h-3" /> Voucher Code (Optional)
            </label>
            <input 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 focus:border-primary outline-none font-mono text-blue-400 uppercase" 
                placeholder="e.g. SUMMER50"
            />
          </div>
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</label>
            <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 focus:border-primary outline-none" 
                placeholder="Describe this promotion..."
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Start Date
             </label>
             <input 
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 focus:border-primary outline-none" 
             />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> End Date
             </label>
             <input 
                type="date"
                required
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 focus:border-primary outline-none" 
             />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Priority</label>
             <input 
                type="number"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 focus:border-primary outline-none" 
             />
           </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RULES */}
        <GlassCard className="p-8 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" /> Conditions (Rules)
              </h2>
              <button type="button" onClick={addRule} className="text-xs font-bold p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                + Add Rule
              </button>
           </div>
           <div className="space-y-4">
              {rules.map((rule, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-2xl relative group/item">
                   <button type="button" onClick={() => removeRule(idx)} className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                   </button>
                   <div className="grid gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Type</label>
                        <select 
                            value={rule.type}
                            onChange={e => updateRule(idx, 'type', e.target.value)}
                            className="w-full bg-zinc-900 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 ring-primary"
                        >
                           <option value="MIN_ORDER_VALUE">Min Spend</option>
                           <option value="SPECIFIC_PRODUCT">Specific Product ID</option>
                           <option value="SPECIFIC_CATEGORY">Specific Category ID</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Value</label>
                        <input 
                            value={rule.value}
                            onChange={e => updateRule(idx, 'value', e.target.value)}
                            className="w-full bg-zinc-900 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 ring-primary"
                            placeholder="e.g. 500000"
                        />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>

        {/* ACTIONS */}
        <GlassCard className="p-8 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Benefit (Actions)
              </h2>
              <button type="button" onClick={addAction} className="text-xs font-bold p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                + Add Action
              </button>
           </div>
           <div className="space-y-4">
              {actions.map((action, idx) => (
                <div key={idx} className="p-4 bg-primary/5 border border-primary/10 rounded-2xl relative group/item">
                   <button type="button" onClick={() => removeAction(idx)} className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                   </button>
                   <div className="grid gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Discount Type</label>
                        <select 
                            value={action.type}
                            onChange={e => updateAction(idx, 'type', e.target.value)}
                            className="w-full bg-zinc-900 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 ring-primary"
                        >
                           <option value="DISCOUNT_FIXED">Fixed Amount Off</option>
                           <option value="DISCOUNT_PERCENT">Percentage Off</option>
                           <option value="FREE_SHIPPING">Free Shipping</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Value</label>
                            <input 
                                value={action.value}
                                onChange={e => updateAction(idx, 'value', e.target.value)}
                                className="w-full bg-zinc-900 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 ring-primary"
                                placeholder="e.g. 10 or 50000"
                            />
                         </div>
                         {action.type === 'DISCOUNT_PERCENT' && (
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">Max Cap</label>
                                <input 
                                    value={action.maxDiscountAmount}
                                    onChange={e => updateAction(idx, 'maxDiscountAmount', e.target.value)}
                                    className="w-full bg-zinc-900 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 ring-primary"
                                    placeholder="Max discount"
                                />
                             </div>
                         )}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>

      <div className="flex flex-col items-center gap-4 py-8">
        {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20">{error}</div>}
        <VibrantButton size="lg" disabled={loading} className="px-12">
            {loading ? "Processing..." : initialData ? "Update Promotion" : "Launch Promotion"}
        </VibrantButton>
      </div>
    </form>
  );
}
