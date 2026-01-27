'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.accessToken);
      
      // Fetch user profile or assume role based on context (simplified)
      // For B2B2C, check if admin or customer
      const decoded: any = JSON.parse(atob(res.data.accessToken.split('.')[1]));
      if (decoded.role === 'admin' || decoded.role === 'manager') {
        router.push('/merchant/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl shadow-xl border space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
        </Link>
        
        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-black italic premium-gradient bg-clip-text text-transparent">GALAXY STORE</h1>
            <p className="font-bold text-xl">Chào mừng trở lại</p>
            <p className="text-muted-foreground text-sm">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input name="email" type="email" required className="w-full pl-10 p-3 bg-muted/30 rounded-xl border outline-none focus:ring-2 focus:ring-primary" placeholder="Email của bạn" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input name="password" type="password" required className="w-full pl-10 p-3 bg-muted/30 rounded-xl border outline-none focus:ring-2 focus:ring-primary" placeholder="Mật khẩu" />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                <ArrowRight className="w-4 h-4" />
            </button>
        </form>

        <div className="text-center text-sm">
            Chưa có tài khoản? <Link href="/auth/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
