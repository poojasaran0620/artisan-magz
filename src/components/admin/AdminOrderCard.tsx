import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle2,
  CreditCard,
  Truck,
} from 'lucide-react';
import type { OrderRecord } from '../../context/AuthContext';

interface AdminOrderCardProps {
  order: OrderRecord;
  onStatusUpdate: (orderId: string, newStatus: OrderRecord['status'], trackingInfo?: string) => void;
  isUpdating: boolean;
}

const STATUS_OPTIONS: { value: OrderRecord['status']; label: string }[] = [
  { value: 'placed', label: 'Placed' },
  { value: 'printing', label: 'Printing' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
];

const STATUS_STYLES: Record<
  OrderRecord['status'],
  { badge: string; dot: string }
> = {
  placed: {
    badge: 'bg-amber-100 text-amber-900',
    dot: 'bg-amber-500',
  },
  printing: {
    badge: 'bg-pink-100 text-pink-900',
    dot: 'bg-pink-500',
  },
  dispatched: {
    badge: 'bg-blue-100 text-blue-900',
    dot: 'bg-blue-500',
  },
  delivered: {
    badge: 'bg-emerald-100 text-emerald-900',
    dot: 'bg-emerald-500',
  },
};

const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

import { Badge } from '../ui/badge';

export const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  order,
  onStatusUpdate,
  isUpdating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const style = STATUS_STYLES[order.status] || STATUS_STYLES.placed;

  return (
    <div className="bg-white border border-taupe-200/60 rounded-2xl overflow-hidden transition hover:shadow-soft">
      {/* ── Collapsed Header ────────────────────────────────────── */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-charcoal">
              {order.orderNumber}
            </span>
            <Badge variant={order.status} className="px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
              <span className={`${style.dot} w-1.5 h-1.5 rounded-full inline-block`} />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-taupe-600">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {order.deliveryAddress?.recipientName || '—'}
            </span>
            <span>•</span>
            <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span className="font-semibold text-charcoal">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="text-[10px] text-taupe-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="ml-3 shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-taupe-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-taupe-400" />
          )}
        </div>
      </button>

      {/* ── Expanded Details ────────────────────────────────────── */}
      {isExpanded && (
        <div className="border-t border-taupe-200/50 px-4 sm:px-5 pb-4 sm:pb-5">
          {/* Items */}
          <div className="mt-4">
            <h4 className="font-sans text-[11px] font-bold text-charcoal uppercase tracking-wider mb-2">
              Order Items
            </h4>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-cream-50 rounded-xl p-3 border border-taupe-200/40"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-taupe-200/50 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-charcoal truncate">
                      {item.title}
                    </div>
                    {item.variantName && (
                      <div className="text-[10px] text-taupe-500 mt-0.5">
                        Variant: {item.variantName}
                      </div>
                    )}
                    {item.customizationSummary && (
                      <div className="text-[10px] text-taupe-500 mt-0.5 line-clamp-2">
                        {item.customizationSummary}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className="text-taupe-500">Qty: {item.quantity}</span>
                      <span className="font-semibold text-charcoal">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="mt-4">
              <h4 className="font-sans text-[11px] font-bold text-charcoal uppercase tracking-wider mb-2">
                Delivery Address & Contact
              </h4>
              <div className="bg-cream-50 rounded-xl p-3 border border-taupe-200/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-charcoal font-medium">
                  <User className="w-3.5 h-3.5 text-roseGold" />
                  {order.deliveryAddress.recipientName}
                </div>
                {order.deliveryAddress.email && (
                  <div className="flex items-center gap-1.5 text-[11px] text-taupe-600">
                    <Mail className="w-3.5 h-3.5 text-roseGold" />
                    <span>{order.deliveryAddress.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-taupe-600">
                  <Phone className="w-3.5 h-3.5 text-roseGold" />
                  <span className="font-mono">{order.deliveryAddress.phone}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-taupe-600">
                  <MapPin className="w-3.5 h-3.5 text-roseGold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-charcoal">
                      {order.deliveryAddress.houseFlat}, {order.deliveryAddress.areaStreet}
                    </div>
                    {order.deliveryAddress.landmark && (
                      <div className="text-[10px] text-taupe-500">
                        Landmark: {order.deliveryAddress.landmark}
                      </div>
                    )}
                    <div className="text-taupe-700">
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} – <span className="font-mono">{order.deliveryAddress.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {(order.paymentMethod || order.paymentId) && (
            <div className="mt-4">
              <h4 className="font-sans text-[11px] font-bold text-charcoal uppercase tracking-wider mb-2">
                Payment Details
              </h4>
              <div className="bg-cream-50 rounded-xl p-3 border border-taupe-200/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs">
                  {order.paymentMethod === 'razorpay' ? (
                    <>
                      <CreditCard className="w-3.5 h-3.5 text-roseGold" />
                      <span className="font-medium text-charcoal">Online Payment</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded ml-1">
                        Razorpay
                      </span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-3.5 h-3.5 text-roseGold" />
                      <span className="font-medium text-charcoal">Cash on Delivery</span>
                    </>
                  )}
                </div>
                {order.paymentId && (
                  <div className="text-[11px] text-taupe-600">
                    <span className="text-taupe-400">Payment ID:</span>{' '}
                    <span className="font-mono font-medium text-charcoal">{order.paymentId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Update Control */}
          <div className="mt-4 pt-4 border-t border-taupe-200/50 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                Courier / Tracking Link (optional for Dispatched)
              </label>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. BlueDart AWB: 123456789 or https://track.shiprocket.in/..."
                className="w-full text-xs bg-white border border-taupe-200/80 rounded-xl px-3 py-2 text-charcoal placeholder:text-taupe-400 focus:outline-none focus:ring-1 focus:ring-roseGold font-mono"
              />
            </div>
            <div>
              <h4 className="font-sans text-[11px] font-bold text-charcoal uppercase tracking-wider mb-2">
                Update Status & Notify Customer
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = order.status === opt.value;
                  const optStyle = STATUS_STYLES[opt.value];
                  return (
                    <button
                      key={opt.value}
                      disabled={isActive || isUpdating}
                      onClick={() => onStatusUpdate(order.id, opt.value, trackingInput.trim() || undefined)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? `${optStyle.badge} ring-2 ring-offset-1 ring-current opacity-100`
                          : `${optStyle.badge} opacity-50 hover:opacity-80`
                      } ${isUpdating ? 'opacity-40 cursor-wait' : ''} ${isActive ? 'cursor-default' : ''}`}
                    >
                      {isActive && <CheckCircle2 className="w-3 h-3" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
