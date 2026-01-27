'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post('/auth/register', data);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      alert('Đăng ký thất bại.');
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
            <h1 className="text-3xl font-black italic premium-gradient bg-clip-text text-transparent">Tạo Tài khoản</h1>
            <p className="text-muted-foreground text-sm">Tham gia cộng đồng mua sắm của chúng tôi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input name="firstName" required className="w-full pl-10 p-3 bg-muted/30 rounded-xl border outline-none focus:ring-2 focus:ring-primary" placeholder="Tên" />
                </div>
                <div className="relative">
                    <input name="lastName" required className="w-full p-3 bg-muted/30 rounded-xl border outline-none focus:ring-2 focus:ring-primary" placeholder="Họ" />
                </div>
            </div>

            <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input name="email" type="email" required className="w-full pl-10 p-3 bg-muted/30 rounded-xl border outline-none focus:ring-2 focus:ring-primary" placeholder="Email của bạn" />
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input name="password" type="password" required className="w-full pl-10 p-3 bg-muted/30 rounded-xl border outline-none focus:ring-2 focus:ring-primary" placeholder="Mật khẩu" />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
                {loading ? 'Đang tạo...' : 'Đăng ký'}
                <ArrowRight className="w-4 h-4" />
            </button>
        </form>

        <div className="text-center text-sm">
            Đã có tài khoản? <Link href="/auth/login" className="text-primary font-bold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
