'use client';

import { useState } from 'react';
import { updateOrderStatusAction } from '@/actions/order';
import { VibrantButton } from '@/components/ui/VibrantButton';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderStatusControlsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusControls({ orderId, currentStatus }: OrderStatusControlsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    setLoading(newStatus);
    setError(null);
    
    const res = await updateOrderStatusAction(orderId, { 
      status: newStatus, 
      notes: `Trạng thái cập nhật bởi Admin: ${newStatus}` 
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.refresh();
    }
    setLoading(null);
  };

  const renderButtons = () => {
    switch (currentStatus) {
      case 'PENDING':
        return (
          <>
            <VibrantButton 
              variant="admin" 
              className="flex-1 gap-2"
              onClick={() => handleUpdate('PROCESSING')}
              disabled={!!loading}
            >
              {loading === 'PROCESSING' ? <Loader2 className="animate-spin" size={18} /> : <Package size={18} />}
              Xác nhận & Xử lý
            </VibrantButton>
            <VibrantButton 
              variant="outline" 
              className="flex-1 gap-2 text-red-400 border-red-400/20 hover:bg-red-400/10"
              onClick={() => handleUpdate('CANCELLED')}
              disabled={!!loading}
            >
              {loading === 'CANCELLED' ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
              Hủy Đơn
            </VibrantButton>
          </>
        );
      case 'PROCESSING':
        return (
          <>
            <VibrantButton 
              variant="admin" 
              className="flex-1 gap-2"
              onClick={() => handleUpdate('SHIPPED')}
              disabled={!!loading}
            >
              {loading === 'SHIPPED' ? <Loader2 className="animate-spin" size={18} /> : <Truck size={18} />}
              Giao cho DVVC
            </VibrantButton>
            <VibrantButton 
              variant="outline" 
              className="flex-1 gap-2 text-red-400 border-red-400/20 hover:bg-red-400/10"
              onClick={() => handleUpdate('CANCELLED')}
              disabled={!!loading}
            >
              {loading === 'CANCELLED' ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
              Hủy Đơn
            </VibrantButton>
          </>
        );
      case 'SHIPPED':
        return (
          <>
            <VibrantButton 
              variant="admin" 
              className="flex-1 gap-2"
              onClick={() => handleUpdate('DELIVERED')}
              disabled={!!loading}
            >
              {loading === 'DELIVERED' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Xác nhận Đã giao
            </VibrantButton>
          </>
        );
      case 'DELIVERED':
        return (
          <VibrantButton 
            variant="admin" 
            className="w-full gap-2"
            onClick={() => handleUpdate('COMPLETED')}
            disabled={!!loading}
          >
            {loading === 'COMPLETED' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            Hoàn tất Đơn hàng
          </VibrantButton>
        );
      default:
        return (
          <div className="w-full text-center py-2 text-zinc-500 text-sm italic border border-white/5 rounded-xl">
            Trạng thái cuối: {currentStatus}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {renderButtons()}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
