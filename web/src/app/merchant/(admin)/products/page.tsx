'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Package, Plus, MoreVertical, Tag } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/catalog/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your catalog and matrix variants.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Product
        </button>
      </header>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-sm">Product Name</th>
              <th className="px-6 py-4 font-bold text-sm">Slug</th>
              <th className="px-6 py-4 font-bold text-sm">Base Price</th>
              <th className="px-6 py-4 font-bold text-sm">SKUs</th>
              <th className="px-6 py-4 font-bold text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="p-20 text-center text-muted-foreground italic">No products yet. Start by creating one.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 opacity-40" />
                      </div>
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{p.slug}</td>
                  <td className="px-6 py-4 font-bold">${p.basePrice}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-black rounded">{p.skus?.length || 0} SKUs</span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    <button><MoreVertical className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
