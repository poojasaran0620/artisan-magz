import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ShieldCheck, RefreshCcw, WifiOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import type { OrderRecord } from '../../context/AuthContext';
import { AdminKPICards } from './AdminKPICards';
import {
  AdminOrderFilters,
  type OrderStatusFilter,
  type SortOrder,
} from './AdminOrderFilters';
import { AdminOrderCard } from './AdminOrderCard';
import { sendOrderEmail } from '../../services/emailService';

interface AdminDashboardProps {
  onBack: () => void;
}

const ORDERS_STORAGE_KEY = 'artisan_magz_orders_v1';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Guard: redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      onBack();
    }
  }, [isAdmin, onBack]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.warn('Supabase fetch error, falling back to localStorage:', fetchError);
          loadLocalOrders();
          return;
        }

        if (data && data.length > 0) {
          const mapped: OrderRecord[] = data.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number,
            createdAt: o.created_at,
            status: o.status || 'placed',
            items: o.items || [],
            totalAmount: Number(o.total_amount) || 0,
            deliveryAddress: o.delivery_address || {
              recipientName: '',
              phone: '',
              address: '',
              city: '',
              pincode: '',
            },
          }));
          setOrders(mapped);
        } else {
          // Supabase returned empty — merge with localStorage
          loadLocalOrders();
        }
      } else {
        loadLocalOrders();
      }
    } catch (err) {
      console.warn('Error fetching orders:', err);
      loadLocalOrders();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalOrders = () => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed: OrderRecord[] = JSON.parse(saved);
        setOrders(parsed);
      }
    } catch {
      setError('Failed to load orders from local storage.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Status Update Handler ──────────────────────────────────────
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderRecord['status'],
    trackingInfo?: string
  ) => {
    setUpdatingOrderId(orderId);

    const targetOrder = orders.find((o) => o.id === orderId);

    // Optimistic local update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      if (supabase && isSupabaseConfigured) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);

        if (updateError) {
          throw updateError;
        }
      }

      // Also update localStorage mirror
      try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (saved) {
          const local: OrderRecord[] = JSON.parse(saved);
          const updated = local.map((o) =>
            o.id === orderId || o.orderNumber === targetOrder?.orderNumber
              ? { ...o, status: newStatus }
              : o
          );
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
        }
      } catch {}

      // Send branded status update email to customer
      if (targetOrder) {
        const orderForEmail = { ...targetOrder, status: newStatus };
        sendOrderEmail(orderForEmail, newStatus, trackingInfo);
      }

      showToast(`Order updated to "${newStatus}" & customer notified ✓`);
    } catch (err: any) {
      // Revert optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: o.status } : o))
      );
      showToast(`Failed to update: ${err.message || 'Unknown error'}`);
      console.error('Status update error:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── Toast ──────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Filtered & Sorted Orders ───────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.deliveryAddress?.recipientName?.toLowerCase().includes(q) ||
          o.deliveryAddress?.city?.toLowerCase().includes(q) ||
          o.deliveryAddress?.phone?.includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });

    return result;
  }, [orders, statusFilter, searchQuery, sortOrder]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF5]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#FDFCF5]/95 backdrop-blur-sm border-b border-taupe-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-taupe-600 hover:text-charcoal transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </button>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-roseGold" />
            <h1 className="font-serif text-base sm:text-lg font-bold text-charcoal">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-taupe-200/60 text-[11px] text-taupe-600 hover:bg-cream-100 transition cursor-pointer disabled:opacity-40"
            title="Refresh orders"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Supabase status notice */}
        {!isSupabaseConfigured && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200/60 rounded-xl text-xs text-amber-800">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              Supabase is not configured. Showing orders from local storage only.
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-2.5 bg-red-50 border border-red-200/60 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <AdminKPICards orders={orders} />

        {/* Filters */}
        <AdminOrderFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          totalCount={filteredOrders.length}
        />

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-roseGold border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-taupe-500">Loading orders…</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
            <span className="text-4xl">📦</span>
            <p className="text-sm font-serif font-bold text-charcoal">No orders found</p>
            <p className="text-xs text-taupe-500 max-w-xs">
              {searchQuery
                ? `No orders matching "${searchQuery}"`
                : statusFilter !== 'all'
                ? `No orders with status "${statusFilter}"`
                : 'Orders will appear here once customers place them.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <AdminOrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={updatingOrderId === order.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-charcoal text-cream-50 text-xs font-medium rounded-full shadow-luxury animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
