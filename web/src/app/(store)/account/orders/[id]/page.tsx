import { getOrderByIdAction } from '@/actions/order';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibrantButton } from '@/components/ui/VibrantButton';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function CustomerOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const order = await getOrderByIdAction(id);

  if (!order) {
    notFound();
  }

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
      case 'PENDING': return <Clock size={20} />;
      case 'PROCESSING': return <Package size={20} />;
      case 'SHIPPED': return <Truck size={20} />;
      case 'DELIVERED':
      case 'COMPLETED': return <CheckCircle size={20} />;
      case 'CANCELLED': return <XCircle size={20} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/account/orders">
          <VibrantButton variant="outline" className="h-10 w-10 !p-0">
            <ArrowLeft size={18} />
          </VibrantButton>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Chi tiết đơn hàng #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Đặt xon {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
      </div>

      {/* Status Progress Bar */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between relative px-2">
            <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.status === 'PENDING' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                    <Clock size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">Đặt hàng</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-800 mx-2 -mt-6"></div>
            <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.status === 'PROCESSING' ? 'bg-blue-400/20 border-blue-400 text-blue-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                    <Package size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">Xử lý</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-800 mx-2 -mt-6"></div>
            <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.status === 'SHIPPED' ? 'bg-purple-400/20 border-purple-400 text-purple-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                    <Truck size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">Đang giao</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-800 mx-2 -mt-6"></div>
            <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${['DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                    <CheckCircle size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">Hoàn tất</span>
            </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            {/* Items */}
            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 font-bold text-sm uppercase text-white tracking-widest">
                    Sản phẩm trong đơn
                </div>
                <div className="divide-y divide-white/5">
                    {order.items?.map((item: any) => (
                        <div key={item.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-700">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{item.productName}</p>
                                    <p className="text-xs text-zinc-500">Số lượng: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="text-white text-sm font-semibold">{Number(item.total).toLocaleString('vi-VN')} đ</p>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-black/20 flex flex-col items-end gap-2">
                    <div className="flex justify-between w-48 text-zinc-400 text-xs uppercase tracking-tighter">
                        <span>Tạm tính</span>
                        <span>{Number(order.totalAmount).toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between w-48 text-white text-sm font-bold pt-2 border-t border-white/10 uppercase tracking-widest">
                        <span>Tổng tiền</span>
                        <span className="text-primary">{Number(order.totalAmount).toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
            </GlassCard>

            {/* Timeline for Customer */}
            <h2 className="text-lg font-bold text-white uppercase italic pl-1 border-l-2 border-primary">Nhật ký hoạt động</h2>
            <div className="space-y-4">
                {order.logs?.map((log: any) => (
                    <div key={log.id} className="flex gap-4">
                        <div className="text-[10px] text-zinc-600 w-24 pt-1 shrink-0">
                            {format(new Date(log.createdAt), 'dd/MM, HH:mm')}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className={`text-sm font-bold ${getStatusColor(log.status)}`}>{log.status}</p>
                            <p className="text-xs text-zinc-500">{log.notes || 'Trạng thái đơn hàng đã được cập nhật.'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-6">
            <GlassCard className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
                    <MapPin size={16} /> Địa chỉ nhận hàng
                </div>
                <div className="text-sm text-zinc-400 space-y-1">
                    <p className="text-white font-bold">{order.recipientName}</p>
                    <p>{order.phoneNumber}</p>
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingWard}, {order.shippingDistrict}</p>
                    <p>{order.shippingCity}</p>
                </div>
            </GlassCard>

            <GlassCard className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase">
                    <CreditCard size={16} /> Thanh toán
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Hình thức</span>
                        <span className="text-white font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Trạng thái</span>
                        <span className="text-emerald-400">{order.paymentStatus}</span>
                    </div>
                </div>
            </GlassCard>

            <VibrantButton variant="outline" className="w-full text-xs">
                Liên hệ hỗ trợ
            </VibrantButton>
        </div>
      </div>
    </div>
  );
}
