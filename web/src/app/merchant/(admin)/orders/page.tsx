'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/tenant');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-50';
      case 'processing': return 'text-blue-500 bg-blue-50';
      case 'pending': return 'text-yellow-500 bg-yellow-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và xử lý đơn đặt hàng từ khách hàng.</p>
        </div>
      </header>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-sm">Mã Đơn hàng</th>
              <th className="px-6 py-4 font-bold text-sm">Ngày đặt</th>
              <th className="px-6 py-4 font-bold text-sm">Khách hàng</th>
              <th className="px-6 py-4 font-bold text-sm">Tổng tiền</th>
              <th className="px-6 py-4 font-bold text-sm">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">Đang tải đơn hàng...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="p-20 text-center text-muted-foreground italic">Chưa có đơn hàng nào.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-primary">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{order.shippingAddress?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 font-bold">${Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
