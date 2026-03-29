import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { orderApi } from '../../features/order/orderApi';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { QUERY_KEYS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: orderApi.getMyOrders,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-6 h-6 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
      </div>

      {!orders?.length ? (
        <EmptyState
          icon={<Package className="w-10 h-10" />}
          title="No orders yet"
          description="Your purchase history will appear here."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-400">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{formatCurrency(order.total)}</p>
                  <Badge variant={order.status === 'completed' ? 'success' : order.status === 'failed' ? 'danger' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {order.courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-2 bg-slate-900/60 rounded-xl px-3 py-2">
                    <img
                      src={course.thumbnail || `https://picsum.photos/seed/${course.id}/40/30`}
                      alt={course.title}
                      className="w-8 h-6 rounded object-cover"
                    />
                    <span className="text-xs text-slate-300 max-w-[150px] truncate">{course.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}