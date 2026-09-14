import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants, buttonTapSpring } from '../../styles/motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import { sendOrderEmail } from '../../services/emailService';
import { openRazorpayCheckout, isRazorpayConfigured } from '../../services/razorpay';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  Package,
  Wallet,
  Loader2,
  LogIn,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, total, subtotal, shippingFee, discountAmount, discountCode, clearCart, sendWhatsAppOrder } =
    useCart();
  const { user, isAuthenticated, savedAddresses, recordOrder, openOrdersModal, openAuthModal, signInWithGoogle, signInWithEmail } = useAuth();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [orderId, setOrderId] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Form State
  const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  const [formData, setFormData] = useState({
    fullName: user ? user.name : (defaultAddress ? defaultAddress.recipientName : 'Ananya Roy'),
    phone: defaultAddress ? defaultAddress.phone : (user?.phone || '9876543210'),
    email: user ? user.email : 'ananya.roy@gmail.com',
    address: defaultAddress ? defaultAddress.streetAddress : 'Flat 402, Lotus Residency, Off Link Road, Andheri West',
    city: defaultAddress ? defaultAddress.city : 'Mumbai',
    state: 'Maharashtra',
    pincode: defaultAddress ? defaultAddress.pincode : '400053',
    giftNote: 'Please pack with extra soft shred paper and luxury ribbon bow! 🌸',
    paymentMethod: 'razorpay',
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Sync if user logs in or addresses change
  useEffect(() => {
    if (user) {
      const addr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: addr ? addr.phone : prev.phone,
        address: addr ? addr.streetAddress : prev.address,
        city: addr ? addr.city : prev.city,
        pincode: addr ? addr.pincode : prev.pincode,
      }));
    }
  }, [user, savedAddresses]);

  const handleSelectSavedAddress = (addr: typeof savedAddresses[0]) => {
    setFormData((prev) => ({
      ...prev,
      fullName: addr.recipientName,
      phone: addr.phone,
      address: addr.streetAddress,
      city: addr.city,
      pincode: addr.pincode,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build order payload (shared between razorpay and COD)
    const orderPayload = {
      items: cartItems.map((item) => ({
        title: item.product.title,
        variantName: item.selectedVariant?.name,
        quantity: item.quantity,
        price: item.totalPrice,
        image: item.customization.uploadedPhotos?.[0] || item.product.images[0],
        customizationSummary: item.customization.selectedPages
          ? `${item.customization.selectedPages} Pages • ${item.customization.format === 'mini-a5' ? 'Mini (A5)' : 'Standard (A4)'}`
          : item.customization.headline
          ? `Headline: "${item.customization.headline}"`
          : undefined,
      })),
      totalAmount: total,
      deliveryAddress: {
        recipientName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
    };

    // ── Razorpay Online Payment ─────────────────────────────────
    if (formData.paymentMethod === 'razorpay') {
      setIsProcessingPayment(true);

      try {
        const result = await openRazorpayCheckout({
          amount: total,
          description: `Order — ${cartItems.length} keepsake${cartItems.length > 1 ? 's' : ''}`,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
        });

        if (!result.success) {
          // Payment cancelled or failed — stay on form
          setIsProcessingPayment(false);
          if (result.error && !result.error.includes('cancelled')) {
            alert(result.error);
          }
          return;
        }

        // Payment succeeded → record order with payment info
        const recorded = recordOrder({
          ...orderPayload,
          paymentId: result.paymentId,
          paymentMethod: 'razorpay',
        });

        setOrderId(recorded.orderNumber);
        setStep('success');
        sendOrderEmail(recorded, 'placed');
      } catch (err) {
        console.error('Payment error:', err);
        alert('Something went wrong with payment. Please try again.');
        setIsProcessingPayment(false);
        return;
      } finally {
        setIsProcessingPayment(false);
      }
    } else {
      // ── Cash on Delivery ────────────────────────────────────────
      const recorded = recordOrder({
        ...orderPayload,
        paymentMethod: 'cod',
      });

      setOrderId(recorded.orderNumber);
      setStep('success');
      sendOrderEmail(recorded, 'placed');
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#B76E79', '#9E7864', '#C99E5C', '#EED8CC'],
    });
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleFinishAndClear = () => {
    clearCart();
    onClose();
    setStep('form');
  };

  const handleWhatsAppWithInfo = () => {
    sendWhatsAppOrder({
      name: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      notes: `${formData.giftNote} (Order Reference: ${orderId})`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-xl bg-[#FCFAF7] rounded-3xl shadow-2xl border border-roseGold-light overflow-hidden my-8"
          >
        {/* Header */}
        <div className="p-5 bg-white border-b border-roseGold-light/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-blush-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-sans text-base sm:text-lg font-bold text-wine-900">
                {step === 'success' ? 'Order Confirmed! 🎉' : !isAuthenticated ? 'Sign In Required' : 'Secure Checkout'}
              </h3>
              <p className="text-[11px] text-wine-900/60">
                {step === 'success' ? 'Your keepsake is being handcrafted' : !isAuthenticated ? 'Quick sign in to proceed with checkout' : 'Enter delivery destination & shipping details'}
              </p>
            </div>
          </div>

          <button
            onClick={step === 'success' ? handleFinishAndClear : onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-wine-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAuthenticated && step === 'form' ? (
          /* LOGIN GATE — must sign in before checkout */
          <div className="p-6 sm:p-8 space-y-5 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-blush-100 text-blush-600 mx-auto flex items-center justify-center">
              <LogIn className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-sans text-lg sm:text-xl font-bold text-wine-900">
                Sign In to Continue
              </h3>
              <p className="text-xs text-wine-900/60 max-w-xs mx-auto">
                Please sign in so we can save your order, send confirmation emails, and let you track your keepsake.
              </p>
            </div>

            {/* Order Summary Peek */}
            <div className="p-3 bg-cream-100/70 rounded-xl border border-cream-300 text-xs flex items-center justify-between">
              <span className="text-wine-900/70">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in bag
              </span>
              <span className="font-sans text-base font-bold text-wine-900 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full py-3 bg-white border border-taupe-200 hover:border-blush-300 rounded-2xl font-semibold text-sm text-charcoal shadow-soft transition flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C36.1 2.5 30.5 0 24 0 14.6 0 6.6 5.5 2.7 13.5l8 6.2C12.7 13 17.9 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.8-2.2 5.2-4.6 6.8l7.3 5.6c4.2-3.9 6.9-9.6 6.9-16.9z"/>
                <path fill="#FBBC05" d="M10.7 28.3c-1-2.8-1-5.8 0-8.6l-8-6.2c-3.6 7.1-3.6 15.5 0 22.6l8-6.2c-.2-.5-.3-1-.3-1.6z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.6c-2.2 1.5-5 2.4-8.6 2.4-6.1 0-11.3-3.5-13.3-10.2l-8 6.2C6.6 42.5 14.6 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-taupe-200/60" />
              <span className="text-[10px] text-wine-900/40 uppercase tracking-wider">or sign in with email</span>
              <div className="flex-1 border-t border-taupe-200/60" />
            </div>

            {/* Quick Email Sign-in */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.target as HTMLFormElement).querySelector('input');
                if (input?.value) signInWithEmail(input.value);
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="your.email@gmail.com"
                className="flex-1 text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-blush-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-wine-900 hover:bg-wine-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Sign In
              </button>
            </form>

            <p className="text-[10px] text-wine-900/40">
              🔒 We only use your email for order updates & tracking
            </p>
          </div>
        ) : step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Order Brief Summary */}
            <div className="p-3.5 bg-cream-100/70 rounded-2xl border border-cream-300 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-wine-900">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Bag
                </span>
                <p className="text-[10px] text-wine-900/60 mt-0.5">
                  Includes personalized custom design proofs
                </p>
              </div>
              <span className="font-sans text-lg font-bold text-wine-900 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>

            {/* Recipient Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-wine-900 uppercase tracking-wider">
                1. Shipping & Contact Details
              </h4>

              {savedAddresses.length > 0 && (
                <div className="p-2.5 bg-cream-100/80 rounded-xl border border-taupe-200/60">
                  <span className="text-[10px] font-bold text-taupe-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-roseGold" />
                    <span>Autofill from Saved Address:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="px-2.5 py-1 bg-white hover:bg-cream-200 text-charcoal rounded-lg text-[11px] font-medium border border-taupe-300/70 transition shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <span>{addr.label}:</span>
                        <span className="font-semibold text-charcoal">{addr.recipientName.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                  Email Address (For Invoices) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                  Delivery Street Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                  Special Gifting Instructions / Landmark
                </label>
                <input
                  type="text"
                  value={formData.giftNote}
                  onChange={(e) => setFormData({ ...formData, giftNote: e.target.value })}
                  className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:ring-1 focus:ring-blush-400"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-wine-900 uppercase tracking-wider">
                2. Select Payment Mode
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Razorpay Online Payment */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                    formData.paymentMethod === 'razorpay'
                      ? 'border-blush-600 bg-blush-50 ring-1 ring-blush-400'
                      : 'border-roseGold-light/60 bg-white hover:border-blush-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Wallet className="w-4 h-4 text-wine-900" />
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <span className="text-xs font-bold text-wine-900">Online Payment</span>
                  <div className="flex flex-wrap gap-1">
                    {['UPI', 'Cards', 'Netbanking', 'Wallets'].map((m) => (
                      <span key={m} className="text-[9px] bg-cream-100 text-wine-900/70 px-1.5 py-0.5 rounded-md font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                  {!isRazorpayConfigured() && (
                    <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                      🧪 Test / Simulation Mode
                    </span>
                  )}
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                    formData.paymentMethod === 'cod'
                      ? 'border-blush-600 bg-blush-50 ring-1 ring-blush-400'
                      : 'border-roseGold-light/60 bg-white hover:border-blush-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className="w-4 h-4 text-wine-900" />
                  </div>
                  <span className="text-xs font-bold text-wine-900">Cash on Delivery</span>
                  <span className="text-[9px] text-wine-900/50 font-medium">
                    Pay when your keepsake arrives
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-roseGold-light/30 space-y-2.5">
              <button
                type="submit"
                disabled={isProcessingPayment}
                className={`w-full py-3.5 sm:py-4 rounded-2xl font-semibold text-sm shadow-soft hover:shadow-soft-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  isProcessingPayment
                    ? 'bg-wine-900/60 text-white/80 cursor-wait'
                    : formData.paymentMethod === 'razorpay'
                    ? 'bg-wine-900 hover:bg-wine-800 text-white active:scale-95'
                    : 'bg-wine-900 hover:bg-wine-800 text-white active:scale-95'
                }`}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment…</span>
                  </>
                ) : formData.paymentMethod === 'razorpay' ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay & Place Order • {formatPrice(total)}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place COD Order • {formatPrice(total)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => {
                  sendWhatsAppOrder(cartItems, {
                    name: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode,
                    notes: formData.giftNote,
                  });
                }}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp with this Address 💬</span>
              </button>

              <p className="text-[10px] text-center text-wine-900/50">
                🔒 Secure Checkout via Razorpay • Encrypted 256-bit SSL • Immediate confirmation sent to WhatsApp
              </p>
            </div>
          </form>
        ) : (
          /* SUCCESS CONFIRMATION SCREEN */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-blush-600 uppercase tracking-widest">
                Milestone Captured
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-wine-900">
                Thank you, {formData.fullName}!
              </h3>
              <p className="text-xs text-wine-900/70 max-w-sm mx-auto">
                Your bespoke personalized order has been placed. Our studio artisans have begun typesetting and prepping your design proofs!
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-4 bg-white rounded-2xl border border-roseGold-light/60 shadow-soft text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                <div>
                  <span className="text-[10px] text-wine-900/50 uppercase font-semibold">
                    Order Reference ID
                  </span>
                  <p className="font-mono text-sm font-bold text-wine-900">#{orderId}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-wine-900 text-[11px] rounded-lg border border-cream-300 flex items-center gap-1 transition"
                >
                  {copiedOrderId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs space-y-1 text-wine-900/80">
                <div className="flex justify-between">
                  <span>Estimated Dispatch:</span>
                  <span className="font-semibold text-emerald-700">Within 48-72 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Address:</span>
                  <span className="font-medium text-right max-w-[200px] truncate">
                    {formData.address}, {formData.city} - {formData.pincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-sans font-bold text-wine-900 tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Post-Order WhatsApp Sync Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleWhatsAppWithInfo}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order & Photos on WhatsApp 💬</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleFinishAndClear();
                  openOrdersModal();
                }}
                className="w-full py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-roseGold-light" />
                <span>Track Keepsake in My Orders</span>
              </button>

              <button
                type="button"
                onClick={handleFinishAndClear}
                className="w-full py-2.5 text-xs font-semibold text-wine-900/70 hover:text-wine-900 cursor-pointer"
              >
                Back to Studio Home
              </button>
            </div>
          </div>
        )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
