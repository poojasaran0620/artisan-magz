import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCcw,
  WifiOff,
  Mail,
  MessageCircle,
  Trash2,
  Calendar,
  Phone,
  User,
} from 'lucide-react';
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

interface BulkInquiryRecord {
  id: string;
  date: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  occasion: string;
  estimatedQuantity: string;
  kindOfGifts: string;
  specialRequirements?: string;
  anyQuestions?: string;
}

const ORDERS_STORAGE_KEY = 'artisan_magz_orders_v1';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tabs & Bulk Inquiries
  const [activeTab, setActiveTab] = useState<'orders' | 'bulk'>('orders');
  const [bulkInquiries, setBulkInquiries] = useState<BulkInquiryRecord[]>([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const loadBulkInquiries = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error: dbErr } = await supabase
          .from('bulk_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!dbErr && data && data.length > 0) {
          const mapped: BulkInquiryRecord[] = data.map((b: any) => ({
            id: String(b.id),
            date: b.created_at || new Date().toISOString(),
            name: b.name,
            email: b.email,
            phone: b.phone,
            occasion: b.occasion,
            estimatedQuantity: b.estimated_quantity,
            kindOfGifts: b.kind_of_gifts,
            specialRequirements: b.special_requirements || undefined,
            anyQuestions: b.any_questions || undefined,
          }));
          setBulkInquiries(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load inquiries from database, falling back to localStorage:', err);
    }

    try {
      const saved = localStorage.getItem('artisan_bulk_inquiries');
      if (saved) {
        setBulkInquiries(JSON.parse(saved));
      } else {
        setBulkInquiries([]);
      }
    } catch {
      setBulkInquiries([]);
    }
  };

  useEffect(() => {
    loadBulkInquiries();
  }, []);

  const handleDeleteInquiry = async (id: string) => {
    const updated = bulkInquiries.filter((b) => b.id !== id);
    setBulkInquiries(updated);
    try {
      localStorage.setItem('artisan_bulk_inquiries', JSON.stringify(updated));
    } catch {}

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('bulk_inquiries').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete inquiry from DB:', e);
      }
    }

    setToastMessage('Inquiry deleted.');
    setTimeout(() => setToastMessage(null), 2500);
  };

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
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2.5 border-b border-taupe-200/60 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-charcoal text-white shadow-soft'
                : 'bg-cream-100 text-charcoal hover:bg-cream-200'
            }`}
          >
            <span>Customer Orders</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold font-mono">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('bulk');
              loadBulkInquiries();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'bulk'
                ? 'bg-roseGold text-white shadow-soft'
                : 'bg-cream-100 text-charcoal hover:bg-cream-200'
            }`}
          >
            <span>Bulk Inquiries ✨</span>
            {bulkInquiries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/30 text-white font-bold font-mono">
                {bulkInquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Tab Content: Orders ─────────────────────────────────── */}
        {activeTab === 'orders' && (
          <>
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
          </>
        )}

        {/* ── Tab Content: Bulk Inquiries ─────────────────────────── */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Bulk Order Inquiries ({bulkInquiries.length})
              </h2>
              {bulkInquiries.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all bulk inquiries?')) {
                      setBulkInquiries([]);
                      localStorage.removeItem('artisan_bulk_inquiries');
                    }
                  }}
                  className="text-xs text-taupe-500 hover:text-red-600 transition"
                >
                  Clear All
                </button>
              )}
            </div>

            {bulkInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center bg-white rounded-2xl border border-taupe-200/60 p-8">
                <span className="text-4xl">💌</span>
                <p className="text-sm font-serif font-bold text-charcoal">No bulk inquiries yet</p>
                <p className="text-xs text-taupe-500 max-w-sm leading-relaxed">
                  When a customer fills out the Bulk Order form, their inquiry details will be listed right here with one-click WhatsApp and Email contact options.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bulkInquiries.map((inquiry) => {
                  const customerName =
                    inquiry.name ||
                    `${inquiry.firstName || ''} ${inquiry.lastName || ''}`.trim() ||
                    'Customer';
                  const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${customerName}! Thank you for reaching out to Artisan Magz regarding your bulk order inquiry for ${inquiry.occasion}.`
                  )}`;

                  return (
                    <div
                      key={inquiry.id}
                      className="bg-white rounded-2xl p-5 border border-taupe-200/80 shadow-soft space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-taupe-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base font-bold text-charcoal">
                              {customerName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blush-100 text-roseGold">
                              {inquiry.occasion}
                            </span>
                          </div>
                          <p className="text-[11px] text-taupe-500 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3 text-taupe-400" />
                            <span>{new Date(inquiry.date).toLocaleString('en-IN')}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sage-50 text-sage-800 border border-sage-200 hover:bg-sage-100 text-xs font-semibold transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-sage" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`mailto:${inquiry.email}?subject=Artisan Magz Bulk Order Inquiry - ${inquiry.occasion}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cream-100 text-charcoal border border-taupe-200 hover:bg-cream-200 text-xs font-semibold transition"
                          >
                            <Mail className="w-3.5 h-3.5 text-roseGold" />
                            <span>Email</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                            className="p-1.5 text-taupe-400 hover:text-red-600 transition"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inquiry Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-cream-50/60 p-3.5 rounded-xl border border-taupe-100">
                        <div>
                          <span className="text-taupe-500 font-bold block text-[10px] uppercase tracking-wider">Phone</span>
                          <span className="font-mono text-charcoal font-medium">{inquiry.phone}</span>
                        </div>
                        <div>
                          <span className="text-taupe-500 font-bold block text-[10px] uppercase tracking-wider">Email</span>
                          <span className="text-charcoal font-medium break-all">{inquiry.email}</span>
                        </div>
                        <div>
                          <span className="text-taupe-500 font-bold block text-[10px] uppercase tracking-wider">Estimated Quantity</span>
                          <span className="text-charcoal font-semibold">{inquiry.estimatedQuantity}</span>
                        </div>
                        <div className="sm:col-span-2 md:col-span-3">
                          <span className="text-taupe-500 font-bold block text-[10px] uppercase tracking-wider">Kind of Gifts</span>
                          <span className="text-charcoal">{inquiry.kindOfGifts}</span>
                        </div>
                        {inquiry.specialRequirements && (
                          <div className="sm:col-span-2 md:col-span-3">
                            <span className="text-taupe-500 font-bold block text-[10px] uppercase tracking-wider">Special Requirements</span>
                            <span className="text-charcoal whitespace-pre-wrap">{inquiry.specialRequirements}</span>
                          </div>
                        )}
                        {inquiry.anyQuestions && (
                          <div className="sm:col-span-2 md:col-span-3">
                            <span className="text-taupe-500 font-bold block text-[10px] uppercase tracking-wider">Questions</span>
                            <span className="text-charcoal whitespace-pre-wrap">{inquiry.anyQuestions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
