import { apiFetch } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibrantButton } from "@/components/ui/VibrantButton";
import { Plus, Ticket, Zap, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function PromotionsAdminPage() {
  let promotions = [];
  try {
    promotions = await apiFetch('/promotions');
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            Promotions & Marketing
          </h1>
          <p className="text-zinc-500 mt-1">Manage vouchers and automatic discounts for your store.</p>
        </div>
        <Link href="/admin/promotions/new">
          <VibrantButton>
            <Plus className="w-4 h-4 mr-2" /> Create Promotion
          </VibrantButton>
        </Link>
      </div>

      <div className="grid gap-6">
        {promotions.map((promo: any) => (
          <GlassCard key={promo.id} className="p-0 overflow-hidden group">
            <div className="flex items-stretch">
              <div className={`w-2 ${promo.isActive ? 'bg-primary' : 'bg-zinc-700'} transition-colors duration-500`} />
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${promo.code ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {promo.code ? <Ticket className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{promo.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          promo.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
                        }`}>
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                        {promo.code && (
                          <span className="flex items-center gap-1.5 font-mono text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded">
                            <Ticket className="w-3.5 h-3.5" /> {promo.code}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {format(new Date(promo.startDate), 'MMM dd')} - {format(new Date(promo.endDate), 'MMM dd, yyyy')}
                        </span>
                        <span className="bg-zinc-800 h-1 w-1 rounded-full" />
                        <span>Used: {promo.usedCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/promotions/${promo.id}`}>
                      <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {promo.rules.map((rule: any) => (
                    <div key={rule.id} className="px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-xl text-xs flex items-center gap-2">
                       <CheckCircle className="w-3.5 h-3.5 text-zinc-500" />
                       <span className="text-zinc-400 font-medium">Rule:</span>
                       <span>{rule.type.replace(/_/g, ' ')} ({rule.value})</span>
                    </div>
                  ))}
                  {promo.actions.map((action: any) => (
                    <div key={action.id} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs flex items-center gap-2">
                       <Zap className="w-3.5 h-3.5 text-primary" />
                       <span className="text-primary font-bold">Benefit:</span>
                       <span className="text-white font-medium">{action.type.replace(/_/g, ' ')}: {action.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}

        {promotions.length === 0 && (
          <GlassCard className="py-20 text-center flex flex-col items-center gap-4">
             <div className="p-4 bg-zinc-900 rounded-full">
                <Ticket className="w-12 h-12 text-zinc-700" />
             </div>
             <div>
                <h3 className="text-xl font-bold">No Promotions Yet</h3>
                <p className="text-zinc-500">Create your first voucher or automatic discount program.</p>
             </div>
             <Link href="/admin/promotions/new" className="mt-4">
                <VibrantButton>Get Started</VibrantButton>
             </Link>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
