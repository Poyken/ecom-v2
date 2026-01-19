"use client";

import { createBrandAction } from "@/actions/catalog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBrandPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createBrandAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/admin/brands');
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">New Brand</h1>
        <p className="text-sm text-zinc-500">Register a new brand for your products.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl">
        <div className="space-y-2">
          <label className="text-sm font-bold">Brand Name</label>
          <input 
            name="name" 
            required 
            placeholder="e.g. Apple" 
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 ring-primary/20 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Description</label>
          <textarea 
            name="description" 
            rows={3} 
            placeholder="Brand mission, etc..." 
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 ring-primary/20 outline-none"
          />
        </div>

        {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20">{error}</div>}

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Brand'}
        </button>
      </form>
    </div>
  );
}
