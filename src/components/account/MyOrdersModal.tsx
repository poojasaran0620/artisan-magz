import React from 'react';
import { useAuth, OrderRecord } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import { X, Package, MessageCircle, Clock, CheckCircle2, Truck, Gift, ArrowRight } from 'lucide-react';

export const MyOrdersModal: React.FC = () => {
  const { isOrdersModalOpen, closeOrdersModal, orders } = useAuth();

  if (!isOrdersModalOpen) return null;

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'placed':
        return <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Order Placed ✨</span>;
      case 'printing':
        return <span className="bg-blush-100 text-blush-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">In Production / Printing 🖨️</span>;
      case 'dispatched':
        return <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Dispatched 🚚</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Delivered 💖</span>;
      default:
        return null;
    }
  };

  const getStatusStepIndex = (status: OrderRecord['status']) => {
    switch (status) {
      case 'placed': return 0;
      case 'printing': return 1;
      case 'dispatched': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Placed', icon: Clock },
    { label: 'Printing', icon: Gift },
    { label: 'Dispatched', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  const handleWhatsAppSupport = (order: OrderRecord) => {
    const text = encodeURIComponent(
      `Hi Artisan Magz team! I have an inquiry regarding my order #${order.orderNumber} placed on ${new Date(order.createdAt).toLocaleDateString()}.`
    );
    window.open(`https://wa.me/917000041053?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={closeOrdersModal}
    >
      <div
        className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-luxury border border-white/80 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-taupe-200/60 flex items-center justify-between bg-cream-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cream-200 flex items-center justify-center text-charcoal">
              <Package className="w-5 h-5 text-roseGold" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                My Keepsakes & Orders
              </h2>
              <p className="text-xs text-taupe-600">Track and view your personalized gifts</p>
            </div>
          </div>

          <button
            onClick={closeOrdersModal}
            className="p-2 text-charcoal/50 hover:text-charcoal rounded-full hover:bg-cream-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-taupe-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">No orders yet</h3>
              <p className="text-xs text-taupe-600 max-w-xs mx-auto">
                Once you customize and place an order for a magazine, frame, or hamper, it will appear here with live tracking.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const currentStep = getStatusStepIndex(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-taupe-200/80 shadow-soft space-y-4"
                >
                  {/* Top Bar: Order ID, Date & Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-taupe-100">
                    <div>
                      <span className="text-xs font-mono font-bold text-charcoal">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[11px] text-taupe-500 ml-2">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Stepper Progress Bar */}
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      {/* Track Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-cream-200 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-roseGold -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      />

                      {/* Steps */}
                      {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStep;
                        const Icon = step.icon;

                        return (
                          <div key={step.label} className="relative z-1 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                isCompleted
                                  ? 'bg-roseGold text-white shadow-xs'
                                  : 'bg-cream-200 text-taupe-500'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span
                              className={`text-[10px] mt-1.5 font-medium ${
                                isCompleted ? 'text-charcoal font-bold' : 'text-taupe-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-2 pt-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-charcoal">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-taupe-200 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-charcoal truncate">
                            {item.title}
                          </h4>
                          {item.variantName && (
                            <p className="text-[11px] text-taupe-600 truncate">{item.variantName}</p>
                          )}
                          {item.customizationSummary && (
                            <p className="text-[10px] text-roseGold truncate font-medium">
                              {item.customizationSummary}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-charcoal font-sans tabular-nums">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[10px] text-taupe-500 block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Actions Footer */}
                  <div className="pt-3 border-t border-taupe-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-taupe-600">
                      <strong>Deliver to:</strong> {order.deliveryAddress.recipientName},{' '}
                      {order.deliveryAddress.city} ({order.deliveryAddress.pincode})
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppSupport(order)}
                        className="px-3 py-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
