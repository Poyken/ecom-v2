'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle2, XCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const verifyPayment = async () => {
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      
      if (vnp_ResponseCode === '00') {
        try {
          await api.get('/orders/vnpay-ipn', { params: Object.fromEntries(searchParams.entries()) });
          setStatus('success');
        } catch (err) {
          console.error(err);
          setStatus('failed');
        }
      } else {
        setStatus('failed');
      }
    };

    if (searchParams.get('vnp_ResponseCode')) {
      verifyPayment();
    }
  }, [searchParams]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg w-full bg-card rounded-[3rem] p-10 shadow-2xl border text-center space-y-8"
    >
      {status === 'loading' && (
        <div className="space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Verifying Payment...</h2>
          <p className="text-muted-foreground text-sm">Please do not close this window.</p>
        </div>
      )}

      {status === 'success' && (
        <>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic">PAYMENT SUCCESSFUL</h2>
            <p className="text-muted-foreground">Your order is being processed by the merchant.</p>
          </div>
          <div className="p-6 bg-muted/50 rounded-3xl text-left border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference No:</span>
              <span className="font-bold">{searchParams.get('vnp_TxnRef')}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2"
            >
               <ArrowRight className="w-5 h-5" />
               Back to Storefront
            </button>
          </div>
        </>
      )}

      {status === 'failed' && (
        <>
           <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic text-destructive">PAYMENT FAILED</h2>
            </div>
            <button onClick={() => router.push('/')} className="w-full py-4 bg-foreground text-background font-bold rounded-2xl">
              Try Again
            </button>
        </>
      )}
    </motion.div>
  );
}

export default function CheckoutResult() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-6">
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin" />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
