import { getOrdersAction } from '@/actions/order';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibrantButton } from '@/components/ui/VibrantButton';
import { 
  Package, 
  ChevronRight, 
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function CustomerOrdersPage() {
  const orders = await getOrdersAction();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400';
      case 'PROCESSING': return 'text-blue-400';
      case 'SHIPPED': return 'text-purple-400';
      case 'DELIVERED':
      case 'COMPLETED': return 'text-emerald-400';
      case 'CANCELLED': return 'text-red-400';
      default: return 'text-zinc-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} />;
      case 'PROCESSING': return <Package size={16} />;
      case 'SHIPPED': return <Truck size={16} />;
      case 'DELIVERED':
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShoppingBag className="text-primary" />
          Đơn hàng của bạn
        </h1>
        <p className="text-zinc-400 mt-2">Theo dõi trạng thái và lịch sử mua sắm của bạn.</p>
      </div>

      <div className="space-y-4">
        {orders?.map((order: any) => (
          <Link key={order.id} href={`/account/orders/${order.id}`} className="block group">
            <GlassCard className="p-5 hover:border-primary/30 transition-all group-hover:bg-white/[0.03]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">#{order.id.slice(0, 8).toUpperCase()}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {order.items?.length || 0} sản phẩm • {Number(order.totalAmount).toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">
                      {format(new Date(order.createdAt), 'dd MMMM, yyyy', {  })} 
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                  <div className="bg-white/5 p-2 rounded-full text-zinc-500 group-hover:text-primary transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}

        {(!orders || orders.length === 0) && (
          <GlassCard className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
               <ShoppingBag size={32} />
            </div>
            <p className="text-zinc-400">Bạn chưa có đơn hàng nào.</p>
            <Link href="/products">
              <VibrantButton variant="primary">Tiếp tục mua sắm</VibrantButton>
            </Link>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
