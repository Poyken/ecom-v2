import { getAdminOrdersAction } from '@/actions/order';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibrantButton } from '@/components/ui/VibrantButton';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AdminOrdersPage() {
  const orders = await getAdminOrdersAction();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={14} />;
      case 'PROCESSING': return <Package size={14} />;
      case 'SHIPPED': return <Truck size={14} />;
      case 'DELIVERED':
      case 'COMPLETED': return <CheckCircle size={14} />;
      case 'CANCELLED': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShoppingCart className="text-primary" />
            Quản lý Đơn hàng
          </h1>
          <p className="text-zinc-400 mt-1">Theo dõi và xử lý đơn hàng của hệ thống.</p>
        </div>
      </div>

      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn, Tên khách..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <VibrantButton variant="outline" className="flex-1 md:flex-none">
            <Filter size={18} /> Lọc
          </VibrantButton>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mã Đơn / Ngày</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">#{order.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-xs text-zinc-500">{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{order.recipientName}</div>
                    <div className="text-xs text-zinc-500">{order.user?.email || order.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {Number(order.totalAmount).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <VibrantButton variant="outline" className="h-8 w-8 !p-0 inline-flex items-center justify-center">
                        <Eye size={16} />
                      </VibrantButton>
                    </Link>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
