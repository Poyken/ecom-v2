import { getOrderByIdAction } from '@/actions/order';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibrantButton } from '@/components/ui/VibrantButton';
import { OrderStatusControls } from '@/components/admin/orders/OrderStatusControls';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  CreditCard, 
  Package, 
  FileText,
  Clock,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const order = await getOrderByIdAction(id);

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'PROCESSING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'SHIPPED': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'DELIVERED':
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <VibrantButton variant="outline" className="h-10 w-10 !p-0">
              <ArrowLeft size={18} />
            </VibrantButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">
              Đơn hàng <span className="text-primary">#{order.id.slice(0, 8)}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="text-xs text-zinc-500">
                Đặt vào {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
        <VibrantButton variant="outline" className="gap-2">
          <FileText size={18} /> Xuất Hóa đơn
        </VibrantButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Package className="text-primary" size={20} />
              <h2 className="font-semibold text-white uppercase">Sản phẩm ({order.items?.length})</h2>
            </div>
            <div className="divide-y divide-white/5">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/5 flex items-center justify-center overflow-hidden">
                       <Package className="text-zinc-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{item.productName}</h3>
                      <p className="text-xs text-zinc-500">SKU: {item.skuCode}</p>
                      <p className="text-xs text-primary mt-1">
                        {Number(item.price).toLocaleString('vi-VN')} đ x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {Number(item.total).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Tạm tính</span>
                  <span>{Number(order.totalAmount).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Phí ship</span>
                  <span>0 đ</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{Number(order.totalAmount).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Timeline / Logs */}
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Clock className="text-purple-400" size={20} />
              <h2 className="font-semibold text-white uppercase">Lịch sử Đơn hàng</h2>
            </div>
            <div className="p-6">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-zinc-800 before:to-transparent">
                {order.logs?.map((log: any, idx: number) => (
                  <div key={log.id} className="relative flex items-center gap-6">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-black z-10 shrink-0 ${idx === 0 ? 'bg-primary' : 'bg-zinc-800'}`}>
                      {idx === 0 ? <CheckCircle className="text-black" size={18} /> : <Clock className="text-zinc-500" size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">{log.status}</span>
                        <span className="text-[10px] text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-800">
                           {format(new Date(log.createdAt), 'dd/MM HH:mm')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{log.notes || 'Không có ghi chú'}</p>
                      {log.user && (
                        <p className="text-[10px] text-zinc-500 mt-1 italic">Tác giả: {log.user.firstName} {log.user.lastName}</p>
                      )}
                    </div>
                  </div>
                ))}
                {(!order.logs || order.logs.length === 0) && (
                  <div className="text-zinc-500 text-sm italic pl-12 py-4">Chưa có nhật ký hoạt động.</div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status Actions */}
          <GlassCard className="p-5 border-primary/20 bg-primary/5">
             <h2 className="text-sm font-bold text-white uppercase tracking-tight mb-4 text-primary">Xử lý ngay</h2>
             <OrderStatusControls orderId={order.id} currentStatus={order.status} />
          </GlassCard>

          {/* Customer Card */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-400" size={20} />
              <h2 className="font-bold text-white uppercase italic text-sm">Khách hàng</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
                   <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{order.recipientName}</p>
                  <p className="text-xs text-zinc-500">{order.phoneNumber}</p>
                </div>
              </div>
              <VibrantButton variant="outline" className="w-full text-xs h-8">
                Hồ sơ chi tiết
              </VibrantButton>
            </div>
          </GlassCard>

          {/* Shipping Address */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-orange-400" size={20} />
              <h2 className="font-bold text-white uppercase italic text-sm">Địa chỉ Giao hàng</h2>
            </div>
            <div className="space-y-2 text-sm text-zinc-400">
              <p className="text-white">{order.recipientName}</p>
              <p>{order.shippingAddress}, {order.shippingWard}</p>
              <p>{order.shippingDistrict}, {order.shippingCity}</p>
              <p className="text-zinc-500 text-xs mt-2 border-t border-white/5 pt-2 flex items-center gap-1">
                <ExternalLink size={12} /> Google Maps
              </p>
            </div>
          </GlassCard>

          {/* Payment Info */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-emerald-400" size={20} />
              <h2 className="font-bold text-white uppercase italic text-sm">Thanh toán</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Phương thức:</span>
                <span className="text-sm text-white font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Trạng thái:</span>
                <span className={`text-xs px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
