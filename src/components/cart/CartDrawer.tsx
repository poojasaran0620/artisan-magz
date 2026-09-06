import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';

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

  if (!isCartOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFCF5] shadow-2xl flex flex-col justify-between border-l border-taupe-200/80">
          {/* Header */}
          <div className="p-5 border-b border-taupe-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-roseGold" />
              <h2 className="font-serif text-lg font-bold text-charcoal">Your Keepsake Bag</h2>
              <span className="text-xs bg-blush-100 text-charcoal font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
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
              <div
                className="h-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-roseGold-light/30">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blush-100 text-blush-500 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-wine-900 font-bold">Your Bag is Empty</h3>
                  <p className="text-xs text-wine-900/60 mt-1 max-w-xs mx-auto">
                    Explore our personalized custom magazines, frames, and build-your-own hampers to begin!
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-wine-900 text-white rounded-full text-xs font-semibold shadow hover:bg-wine-800 transition"
                >
                  Start Customizing Gifts
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const c = item.customization;
                return (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 space-y-2">
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
                          <h4 className="font-serif text-xs font-bold text-wine-900 truncate">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-wine-900/40 hover:text-red-600 transition p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <p className="text-[11px] text-blush-700 font-medium">
                            {item.selectedVariant.name}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-xs text-wine-900 font-serif">
                            {formatPrice(item.totalPrice)}
                          </span>

                          {/* Quantity selector */}
                          <div className="flex items-center gap-2 bg-white border border-roseGold-light rounded-full px-2 py-0.5 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-wine-900/60 hover:text-blush-600 p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold min-w-[14px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-wine-900/60 hover:text-blush-600 p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
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
                        <div><strong>Frame:</strong> {c.frameStyle} • {c.frameSize || 'Selected Size'} ({c.orientation})</div>
                      )}
                      {c.songTitle && (
                        <div><strong>Song:</strong> {c.songTitle} - {c.artistName}</div>
                      )}
                      {c.uploadedPhotoCount ? (
                        <div className="text-emerald-700 font-medium">
                          ✓ {c.uploadedPhotoCount} Photos attached (Ready for design proof)
                        </div>
                      ) : null}

                      {/* Hamper contents preview if hamper */}
                      {c.hamperDetails && (
                        <div className="space-y-0.5 pt-1 border-t border-cream-100 text-blush-900">
                          <div><strong>Box:</strong> {c.hamperDetails.box.name}</div>
                          <div>
                            <strong>Items ({c.hamperDetails.items.length}):</strong>{' '}
                            {c.hamperDetails.items.map((i) => i.goodie.name.split(' ')[0]).join(', ')}
                          </div>
                          <div><strong>Wax Seal:</strong> {c.hamperDetails.card.waxSealColor}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary & Actions */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-roseGold-light/40 space-y-3 shadow-lg">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-wine-900/40" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (Try AURA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-cream-50 border border-roseGold-light rounded-xl uppercase focus:outline-none focus:ring-1 focus:ring-blush-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-cream-200 hover:bg-cream-300 text-wine-900 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] font-medium ${
                    promoMessage.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-wine-900/80 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountCode}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-wine-900 font-serif pt-2 border-t border-roseGold-light/30">
                  <span>Estimated Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="space-y-2 pt-1">
                {/* Option A: Direct Checkout */}
                <button
                  onClick={() => {
                    closeCart();
                    onProceedToDirectCheckout();
                  }}
                  className="w-full py-3.5 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl font-semibold text-xs sm:text-sm shadow-soft hover:shadow-soft-lg active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-roseGold-light" />
                  <span>Direct Online Checkout • {formatPrice(total)}</span>
                  <ArrowRight className="w-4 h-4 text-roseGold-light" />
                </button>

                {/* Option B: Order via WhatsApp */}
                <button
                  onClick={() => sendWhatsAppOrder()}
                  className="w-full py-3 bg-charcoal hover:bg-charcoal-dark text-white rounded-2xl font-semibold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer border border-taupe-200"
                >
                  <MessageCircle className="w-4 h-4 text-sage-400" />
                  <span>Order via WhatsApp (Pre-Filled) 💬</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal/50 pt-1">
                <ShieldCheck className="w-3 h-3 text-sage-600" />
                <span>100% Safe Gifting • WhatsApp Proof Confirmation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
