'use client';

import { useCart } from '@/components/cart-provider';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState('vnpay');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      items: items.map(i => ({ skuId: i.skuId, quantity: i.quantity })),
      shippingAddress: {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
      },
      paymentGateway: gateway,
    };

    try {
      const res = await api.post('/orders', data);
      clearCart();
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        router.push('/checkout/success');
      }
    } catch (err) {
      console.error(err);
      alert('Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
        <Link href="/" className="text-primary hover:underline">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left: Cart Items & Form */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
            
            <div className="space-y-4">
               {items.map((item) => (
                 <div key={item.skuId} className="flex items-center justify-between bg-card p-4 rounded-xl shadow-sm border">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-muted rounded-lg" />
                     <div>
                       <h3 className="font-bold">{item.name}</h3>
                       <p className="text-sm text-muted-foreground">{item.sku}</p>
                       <p className="text-sm font-semibold">${item.price} x {item.quantity}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="font-bold">${item.price * item.quantity}</span>
                     <button onClick={() => removeFromCart(item.skuId)} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card p-6 rounded-2xl shadow-sm border space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" required className="p-3 bg-muted/30 rounded-lg border outline-none focus:ring-2 focus:ring-primary" placeholder="Tên" />
                <input name="lastName" required className="p-3 bg-muted/30 rounded-lg border outline-none focus:ring-2 focus:ring-primary" placeholder="Họ" />
              </div>
              <input name="email" type="email" required className="w-full p-3 bg-muted/30 rounded-lg border outline-none focus:ring-2 focus:ring-primary" placeholder="Email" />
              <input name="address" required className="w-full p-3 bg-muted/30 rounded-lg border outline-none focus:ring-2 focus:ring-primary" placeholder="Địa chỉ nhận hàng" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" required className="p-3 bg-muted/30 rounded-lg border outline-none focus:ring-2 focus:ring-primary" placeholder="Thành phố" />
                <input name="zip" className="p-3 bg-muted/30 rounded-lg border outline-none focus:ring-2 focus:ring-primary" placeholder="Mã bưu điện (Zip)" />
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm border space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setGateway('vnpay')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${gateway === 'vnpay' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                >
                  <img src="https://sandbox.vnpayment.vn/paymentv2/images/logo.png" className="h-8 object-contain" alt="VNPay" />
                  <span className="font-semibold text-sm">VNPay / QR-Code</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setGateway('cod')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${gateway === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                >
                  <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white font-bold">$</div>
                  <span className="font-semibold text-sm">Thanh toán khi nhận (COD)</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="md:sticky md:top-8 h-fit space-y-6">
          <div className="bg-card p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-bold">${total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span className="text-green-500 font-bold">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thuế</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-black">
                <span>Tổng cộng</span>
                <span>${total}</span>
              </div>
            </div>
            
            <button 
              form="checkout-form"
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Thanh toán được bảo mật bởi VNPay / Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
