'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
            <CheckCircle2 className="w-24 h-24 text-green-500" />
        </div>
        
        <div className="space-y-2">
            <h1 className="text-4xl font-black">Đặt hàng Thành công!</h1>
            <p className="text-lg text-muted-foreground">
                Cảm ơn bạn đã mua hàng. Chúng tôi đã nhận được đơn hàng và đang xử lý.
            </p>
        </div>

        <div className="pt-8">
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform">
                Tiếp tục mua sắm <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
