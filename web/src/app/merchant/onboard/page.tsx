'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Rocket, Store, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await api.post('/tenants/onboard', {
        ...data,
        plan: 'starter',
      });
      localStorage.setItem('tenantId', res.data.tenant.id);
      setSuccess(true);
      setTimeout(() => router.push('/merchant/dashboard'), 2000);
    } catch (err) {
      alert('Onboarding failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Success!</h1>
          <p className="text-muted-foreground">Setting up your store workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 premium-gradient text-white">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Rocket className="w-16 h-16 mb-8 animate-float" />
          <h1 className="text-5xl font-bold mb-6">Launch your B2B2C Empire</h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-lg">
            Our multi-tenant platform provides isolated infrastructure, complex inventory matrix, 
            and integrated VNPay payments for your wholesale or retail business.
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold">Get Started</h2>
            <p className="text-muted-foreground mt-2">Create your unique store in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Name</label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input name="storeName" required className="w-full pl-10 pr-4 py-2 rounded-lg border bg-card focus:ring-2 focus:ring-primary outline-none" placeholder="Acme Gadgets" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Store Domain Slug</label>
                <div className="flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                  <span className="bg-muted px-3 flex items-center text-sm border-r">https://</span>
                  <input name="domain" required className="flex-1 px-4 py-2 bg-card outline-none" placeholder="acme-store" />
                  <span className="bg-muted px-3 flex items-center text-sm border-l">.ecom.v2</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input name="adminEmail" type="email" required className="w-full pl-10 pr-4 py-2 rounded-lg border bg-card focus:ring-2 focus:ring-primary outline-none" placeholder="admin@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input name="adminPassword" type="password" required className="w-full pl-10 pr-4 py-2 rounded-lg border bg-card focus:ring-2 focus:ring-primary outline-none" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (
                <>
                  <Rocket className="w-5 h-5" />
                  Create My Store
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
