import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { CountingNumber } from '../ui/CountingNumber';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { springs, modalBackdropVariants, drawerSlideRightVariants } from '../../styles/motion';

interface CartDrawerProps {
  onProceedToDirectCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToDirectCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    discountCode,
    applyDiscount,
    sendWhatsAppOrder,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyDiscount(promoInput);
    setPromoMessage({ success: res.success, text: res.message });
  };

  const progressPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          key="cart-drawer-wrapper"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop with Genuine Fade-In and Fade-Out */}
          <motion.div
            variants={modalBackdropVariants}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Slide-in Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              variants={drawerSlideRightVariants}
              className="w-screen max-w-md bg-[#FDFCF5] shadow-2xl flex flex-col justify-between border-l border-taupe-200/80 pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-taupe-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-roseGold" />
                  <h2 className="font-sans text-base sm:text-lg font-bold text-charcoal">Your Keepsake Bag</h2>
                  <span className="text-xs bg-blush-100 text-charcoal font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springs.snappy}
                  onClick={closeCart}
                  className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center transition cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Free Shipping Progress Bar with Animated Spring Width */}
              <div className="p-3.5 bg-cream-100/70 border-b border-taupe-200/40 text-xs">
                {amountNeededForFreeShipping > 0 ? (
                  <p className="text-charcoal/80 mb-1.5 flex items-center justify-between">
                    <span>Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> for <strong>FREE Express Shipping</strong></span>
                    <span className="text-sage-700 font-bold">{progressPercent}%</span>
                  </p>
                ) : (
                  <p className="text-sage-700 font-bold mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
                    <span>You qualify for FREE Express Shipping! 🎉</span>
                  </p>
                )}

                <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={springs.smooth}
                    className="h-full bg-gradient-to-r from-sage-400 to-sage-600"
                  />
                </div>
              </div>

              {/* Cart Item List with PopLayout Animated Presence */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-roseGold-light/30">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blush-100 text-blush-500 mx-auto flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base sm:text-lg text-wine-900 font-bold">Your Bag is Empty</h3>
                      <p className="text-xs text-wine-900/60 mt-1 max-w-xs mx-auto">
                        Explore our personalized custom magazines, frames, and build-your-own hampers to begin!
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={springs.snappy}
                      onClick={closeCart}
                      className="px-6 py-2.5 bg-wine-900 text-white rounded-full text-xs font-semibold shadow hover:bg-wine-800 transition cursor-pointer"
                    >
                      Start Customizing Gifts
                    </motion.button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => {
                      const c = item.customization;
                      return (
                        <motion.div
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                          transition={springs.smooth}
                          className="pt-4 first:pt-0 space-y-2"
                        >
                          <div className="flex items-start gap-3">
                            {/* Thumbnail */}
                            <img
                              src={c.uploadedPhotos?.[0] || item.product.images[0]}
                              alt={item.product.title}
                              className="w-16 h-16 rounded-xl object-cover border border-roseGold-light shrink-0"
                            />

                            {/* Product Title & Variant */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="font-sans text-xs sm:text-sm font-bold text-wine-900 truncate">
                                  {item.product.title}
                                </h4>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="text-wine-900/40 hover:text-red-600 transition p-1 cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>

                              {item.selectedVariant && (
                                <p className="text-[11px] text-blush-700 font-medium">
                                  {item.selectedVariant.name}
                                </p>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <span className="font-sans font-bold text-xs text-wine-900 tabular-nums">
                                  {formatPrice(item.totalPrice)}
                                </span>

                                {/* Quantity selector with tactile spring buttons */}
                                <div className="flex items-center gap-2 bg-white border border-roseGold-light rounded-full px-2 py-0.5 shadow-sm">
                                  <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    transition={springs.snappy}
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    className="text-wine-900/60 hover:text-blush-600 p-0.5 cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </motion.button>
                                  <span className="text-xs font-semibold min-w-[14px] text-center">
                                    {item.quantity}
                                  </span>
                                  <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    transition={springs.snappy}
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    className="text-wine-900/60 hover:text-blush-600 p-0.5 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Customization Details Summary Pill */}
                          <div className="bg-white/80 p-2 rounded-xl border border-cream-200 text-[10px] text-wine-900/75 space-y-1">
                            {c.selectedPages && (
                              <div className="font-semibold text-charcoal flex items-center gap-1.5">
                                <span className="bg-blush-100 text-blush-800 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                  {c.format === 'mini-a5' ? 'Mini • A5' : 'Standard • A4'}
                                </span>
                                <span>{c.selectedPages} Pages Magazine</span>
                              </div>
                            )}
                            {c.selectedTemplates && c.selectedTemplates.length > 0 && (
                              <div className="text-taupe-700">
                                <strong>Templates:</strong> {c.selectedTemplates.length} layout(s) chosen
                              </div>
                            )}
                            {c.addOns && (c.addOns.giftWrap || c.addOns.handwrittenLetter || c.addOns.combo) && (
                              <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full font-medium text-[9px] border border-amber-200/60">
                                <span>🎁</span>
                                <span>
                                  {c.addOns.combo
                                    ? 'Combo (Wrap + Letter) +₹80'
                                    : c.addOns.giftWrap
                                    ? 'Gift Wrap +₹50'
                                    : 'Handwritten Letter +₹50'}
                                </span>
                              </div>
                            )}
                            {c.occasion && <div><strong>Occasion:</strong> {c.occasion}</div>}
                            {c.headline && <div><strong>Headline:</strong> "{c.headline}"</div>}
                            {c.newspaperHeadline && (
                              <div><strong>Newspaper:</strong> "{c.newspaperHeadline}" ({c.anniversaryDate})</div>
                            )}
                            {c.frameStyle && (
                              <div><strong>Frame:</strong> {c.frameStyle} ({c.orientation})</div>
                            )}
                            {c.songTitle && (
                              <div><strong>Song:</strong> "{c.songTitle}" — {c.artistName}</div>
                            )}
                            {c.hamperDetails && (
                              <div>
                                <strong>Hamper:</strong> {c.hamperDetails.box.name} ({c.hamperDetails.items.length} goodies)
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer / Checkout */}
              {cartItems.length > 0 && (
                <div className="p-5 bg-white/95 border-t border-taupe-200/60 space-y-3.5 shadow-luxury">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-taupe-400" />
                        <input
                          type="text"
                          placeholder="Enter Coupon Code (e.g. ARTISAN10)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          className="w-full text-xs pl-8 pr-3 py-2 bg-cream-50 border border-taupe-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-roseGold uppercase font-mono"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springs.snappy}
                        type="submit"
                        className="px-3.5 py-2 bg-charcoal text-[#FDFCF5] text-xs font-semibold rounded-xl hover:bg-charcoal-dark transition cursor-pointer"
                      >
                        Apply
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {promoMessage && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`text-[11px] font-medium pt-0.5 ${
                            promoMessage.success ? 'text-sage-700' : 'text-rose-600'
                          }`}
                        >
                          {promoMessage.text}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </form>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1 text-xs text-charcoal/80">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-sans font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-roseGold font-semibold">
                        <span>Discount ({discountCode}):</span>
                        <span className="font-sans tabular-nums">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping:</span>
                      <span className="font-sans tabular-nums">
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700 font-semibold">FREE</span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-sans font-bold text-wine-900 tabular-nums pt-2 border-t border-roseGold-light/30 items-baseline">
                      <span>Estimated Total:</span>
                      <CountingNumber value={total} className="text-sm font-bold text-wine-900" />
                    </div>
                  </div>

                  {/* Primary CTAs with Spring Physics */}
                  <div className="space-y-2 pt-1">
                    {/* Option A: Direct Checkout */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      onClick={() => {
                        closeCart();
                        onProceedToDirectCheckout();
                      }}
                      className="w-full py-3.5 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl font-semibold text-xs sm:text-sm shadow-soft hover:shadow-soft-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-roseGold-light" />
                      <span>Direct Online Checkout • {formatPrice(total)}</span>
                      <ArrowRight className="w-4 h-4 text-roseGold-light" />
                    </motion.button>

                    {/* Option B: Order via WhatsApp */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      onClick={() => sendWhatsAppOrder()}
                      className="w-full py-3 bg-charcoal hover:bg-charcoal-dark text-white rounded-2xl font-semibold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer border border-taupe-200"
                    >
                      <MessageCircle className="w-4 h-4 text-sage-400" />
                      <span>Order via WhatsApp (Pre-Filled) 💬</span>
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal/50 pt-1">
                    <ShieldCheck className="w-3 h-3 text-sage-600" />
                    <span>100% Safe Gifting • WhatsApp Proof Confirmation</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
