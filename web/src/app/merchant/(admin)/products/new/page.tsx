'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Package, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);

    const payload = {
      name,
      slug,
      basePrice: price,
      description: formData.get('description') as string,
      options: [
        {
          name: 'Standard',
          values: [{ value: 'Default', displayName: 'Default' }]
        }
      ],
      skus: [
        {
          sku: `${slug}-std`,
          price: price,
          stock: 999,
          optionValues: [{ optionName: 'Standard', value: 'Default' }]
        }
      ]
    };

    try {
      await api.post('/catalog/products', payload);
      router.push('/merchant/products');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/merchant/products" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Thêm Sản phẩm</h1>
          <p className="text-muted-foreground">Thêm một mặt hàng mới vào danh mục của bạn.</p>
        </div>
      </header>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl border shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên Sản phẩm</label>
            <input name="name" required className="w-full px-4 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="Tai nghe Cao cấp" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug (đường dẫn)</label>
            <input name="slug" required className="w-full px-4 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="tai-nghe-cao-cap" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Giá gốc ($)</label>
            <input name="price" type="number" step="0.01" required className="w-full px-4 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="299.99" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <textarea name="description" rows={4} className="w-full px-4 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="Chi tiết sản phẩm..." />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Đang tạo...' : 'Lưu Sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
