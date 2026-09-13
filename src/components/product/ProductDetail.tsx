import React, { useState, useMemo } from 'react';
import { Product, ProductVariant, CustomizationData } from '../../types/product';
import { formatPrice, calculateEstimatedDelivery } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { MagazineCustomizer } from './customizers/MagazineCustomizer';
import { FrameCustomizer } from './customizers/FrameCustomizer';
import { NewspaperCustomizer } from './customizers/NewspaperCustomizer';
import { SongBookCustomizer } from './customizers/SongBookCustomizer';
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  MessageCircle,
  Share2,
  Lock,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductDetailProps {
  product: Product;
  initialVariantId?: string;
  initialTemplateId?: string;
  initialImage?: string;
  initialTitle?: string;
  initialCollageStyle?: string;
  onBack: () => void;
  onNavigateHamper: () => void;
  onOpenPolicy: (policyName: string) => void;
  onDirectCheckout?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  initialVariantId,
  initialTemplateId,
  initialImage,
  initialTitle,
  initialCollageStyle,
  onBack,
  onNavigateHamper,
  onOpenPolicy,
  onDirectCheckout,
}) => {
  const { addToCart, sendWhatsAppOrder } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Determine initial variant
  const initialVar = initialVariantId
    ? product.variants.find((v) => v.id === initialVariantId) || product.variants[0]
    : product.variants[0];

  // Selected Variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVar);

  // Computed display images and title
  const displayImages = useMemo(() => {
    if (!initialImage) return product.images;
    return [initialImage, ...product.images.filter((img) => img !== initialImage)];
  }, [initialImage, product.images]);

  const displayTitle = initialTitle || product.title;

  // Active Gallery Image
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Customization State
  const [customization, setCustomization] = useState<CustomizationData>({
    variantId: initialVar?.id,
    variantName: initialVar?.name,
    selectedTemplate: initialTemplateId,
    frameSize: product.category === 'frame' ? initialVar?.name : undefined,
    frameStyle: 'Classic Black',
    orientation: 'portrait',
    collageStyle: (initialCollageStyle as any) || (product.category === 'frame' ? 'playing-cards' : 'grid9'),
    newspaperHeadline: 'BREAKING NEWS',
    newspaperSubheadline: 'LOVE IS REAL!',
    coupleNames: 'Saral & Pakhhi',
    anniversaryDate: '17 OCT',
    city: 'Mumbai',
    songTitle: 'Until I Found You',
    artistName: 'Stephen Sanchez',
  });

  // Pincode State for Delivery Calculator
  const [pincode, setPincode] = useState<string>('400001');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(true);

  // Accordion open/close states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    included: true,
    required: true,
    shipping: false,
    policies: false,
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCustomizationChange = (data: Partial<CustomizationData>) => {
    setCustomization((prev) => ({ ...prev, ...data }));
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setCustomization((prev) => ({
      ...prev,
      variantId: variant.id,
      variantName: variant.name,
      frameSize: product.category === 'frame' ? variant.name : prev.frameSize,
    }));
  };

  // Price calculations
  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Delivery estimation
  const deliveryInfo = useMemo(() => calculateEstimatedDelivery(pincode), [pincode]);

  const handleAddToCart = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f4b7bd', '#dd374e', '#d5b68d'],
    });

    addToCart(product, selectedVariant, customization, 1);
  };

  const handleBuyNow = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f4b7bd', '#dd374e', '#d5b68d'],
    });

    addToCart(product, selectedVariant, customization, 1);
    if (onDirectCheckout) {
      onDirectCheckout();
    }
  };

  const handleWhatsAppBuyNow = () => {
    // Add item and immediately pass the created item to sendWhatsAppOrder
    const newItem = addToCart(product, selectedVariant, customization, 1);
    sendWhatsAppOrder([newItem]);
  };

  const isLiked = isWishlisted(product.id);

  return (
    <div className="bg-[#FCFAF7] min-h-screen pb-28 md:pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & breadcrumb */}
        <div className="flex items-center justify-between py-3 mb-4 text-xs text-wine-900/60 border-b border-roseGold-light/40">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 hover:text-blush-600 transition font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{product.category === 'frame' ? 'Back to All Frames' : 'Back to All Gifts'}</span>
          </button>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Category:</span>
            <span className="font-semibold text-wine-900 capitalize">{product.category}</span>
          </div>
        </div>

        {/* Product Hero Grid: Gallery (Left) & Configurator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Image Gallery & Highlights */}
          <div className="lg:col-span-6 space-y-4">
            <div className="sticky top-24 space-y-4">
              {/* Main Image Viewport - Full uncropped photo */}
              <div className="relative aspect-[3/4] sm:aspect-square rounded-3xl overflow-hidden bg-[#FAF8F5] border border-roseGold-light shadow-luxury flex items-center justify-center p-2">
                <img
                  src={displayImages[activeImageIndex] || displayImages[0]}
                  alt={displayTitle}
                  className="w-full h-full object-contain"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-wine-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                    isLiked ? 'bg-blush-500 text-white shadow' : 'bg-white/85 text-wine-900 hover:bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-wine-900'}`} />
                </button>
              </div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition cursor-pointer bg-[#FAF8F5] p-1 flex items-center justify-center ${
                      activeImageIndex === idx
                        ? 'border-blush-600 ring-2 ring-blush-400/30'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Trust Callout */}
              <div className="p-4 bg-cream-100/70 rounded-2xl border border-cream-300/80 space-y-2 text-xs text-wine-900/80">
                <div className="flex items-center gap-2 font-bold text-wine-900">
                  <Sparkles className="w-4 h-4 text-blush-600" />
                  <span>The Artisan magz Gifting Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed text-wine-900/70">
                  Every order includes a digital proof draft sent to your WhatsApp for approval prior to printing. If your parcel arrives damaged during shipping, we replace it 100% free of charge.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Dynamic Price, Customizer Inputs & Accordions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Ratings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="font-bold text-wine-900 text-xs ml-1.5">{product.rating}</span>
                </div>
                <span className="text-wine-900/30">•</span>
                <span className="text-xs text-wine-900/60 underline">
                  {product.reviewCount} verified reviews
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-wine-900 font-normal leading-tight">
                {displayTitle}
              </h1>

              <p className="text-xs sm:text-sm text-wine-900/75 leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Dynamic Price Display */}
            <div className="p-4 bg-cream-50 rounded-2xl border border-roseGold-light/50 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-sans text-3xl font-bold text-wine-900 tabular-nums">
                    {formatPrice(currentPrice)}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-wine-900/40 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs bg-blush-100 text-blush-700 font-bold px-2 py-0.5 rounded-full">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-wine-900/60 mt-0.5">
                  Taxes included • Free Express Shipping on orders over ₹1,499
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  In Stock & Made-to-Order
                </span>
              </div>
            </div>

            {/* Dynamic Product Customizer Section based on category */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-roseGold-light/60 shadow-soft">
              {(product.category === 'magazine' || product.category === 'mini-magazine') && (
                <MagazineCustomizer
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantSelect}
                  customization={customization}
                  onChange={handleCustomizationChange}
                />
              )}

              {product.category === 'frame' && (
                <FrameCustomizer
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantSelect}
                  customization={customization}
                  onChange={handleCustomizationChange}
                />
              )}

              {product.category === 'newspaper' && (
                <NewspaperCustomizer
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantSelect}
                  customization={customization}
                  onChange={handleCustomizationChange}
                />
              )}

              {product.category === 'songbook' && (
                <SongBookCustomizer
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantSelect}
                  customization={customization}
                  onChange={handleCustomizationChange}
                />
              )}

              {product.category === 'hamper' && (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-wine-900 font-semibold">
                    Build your custom hamper step-by-step in our dedicated Hamper Bar!
                  </p>
                  <button
                    onClick={onNavigateHamper}
                    className="px-6 py-3 bg-blush-600 text-white rounded-full text-xs font-semibold shadow"
                  >
                    Open Interactive Hamper Builder ✨
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Action Buttons: Add to Bag, Buy Now, and WhatsApp */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 bg-white hover:bg-cream-100 text-charcoal border-2 border-charcoal rounded-2xl font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl font-semibold text-xs sm:text-sm shadow-soft hover:shadow-soft-lg active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-roseGold-light" />
                <span>Buy Now • {formatPrice(currentPrice)}</span>
              </button>

              <button
                onClick={handleWhatsAppBuyNow}
                className="py-3.5 px-4 bg-charcoal hover:bg-charcoal-dark text-white rounded-2xl font-semibold text-xs sm:text-sm shadow transition flex items-center justify-center gap-1.5 cursor-pointer border border-taupe-200"
              >
                <MessageCircle className="w-4 h-4 text-sage-400" />
                <span>Order via WhatsApp 💬</span>
              </button>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="p-4 bg-cream-50 rounded-2xl border border-taupe-200/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-roseGold" />
                  <span>Check Estimated Delivery Date</span>
                </span>
                <span className="text-[10px] text-charcoal/60 font-sans">Pan-India Express</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 400001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-taupe-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-roseGold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPincodeChecked(true)}
                  className="px-4 py-2 bg-charcoal text-white text-xs font-semibold rounded-xl hover:bg-charcoal-dark transition cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {pincodeChecked && deliveryInfo.isValid && (
                <div className="pt-2 text-xs text-charcoal space-y-1 animate-fadeIn border-t border-taupe-200/50">
                  <div className="flex items-center justify-between text-sage-700 font-semibold">
                    <span>Expected Delivery: {deliveryInfo.deliveryDateStr}</span>
                    <span className="text-[10px] bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full">
                      {deliveryInfo.isMetro ? 'Metro Express' : 'Standard Speed'}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-roseGold" />
                    <span>Dispatches by: {deliveryInfo.dispatchRange}</span>
                  </p>
                </div>
              )}

              {pincodeChecked && !deliveryInfo.isValid && (
                <div className="pt-2 text-xs text-rose-600 font-medium animate-fadeIn border-t border-cream-200">
                  ⚠️ {deliveryInfo.errorMessage || 'Please enter a valid 6-digit Indian postal pincode.'}
                </div>
              )}
            </div>

            {/* Expandable Accordions */}
            <div className="space-y-3 pt-2">
              {/* Accordion 1: Product Details */}
              <div className="border border-roseGold-light/60 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-wine-900 uppercase tracking-wider"
                >
                  <span>Product Details & Specifications</span>
                  <ChevronDown
                    className={`w-4 h-4 text-wine-900/60 transition-transform duration-200 ${
                      openAccordions.details ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.details && (
                  <div className="px-5 pb-4 text-xs text-wine-900/80 leading-relaxed border-t border-cream-100 pt-3 space-y-2">
                    <p>{product.description}</p>
                    <ul className="list-disc list-inside space-y-1 pt-1 text-wine-900/70">
                      {product.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: What's Included */}
              <div className="border border-roseGold-light/60 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('included')}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-wine-900 uppercase tracking-wider"
                >
                  <span>What's Included (Exact Package Checklist)</span>
                  <ChevronDown
                    className={`w-4 h-4 text-wine-900/60 transition-transform duration-200 ${
                      openAccordions.included ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.included && (
                  <div className="px-5 pb-4 text-xs text-wine-900/80 border-t border-cream-100 pt-3 space-y-2">
                    {product.whatsIncluded.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Things Required from You */}
              <div className="border border-roseGold-light/60 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('required')}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-wine-900 uppercase tracking-wider"
                >
                  <span>Things Required from You (Clear Guidelines)</span>
                  <ChevronDown
                    className={`w-4 h-4 text-wine-900/60 transition-transform duration-200 ${
                      openAccordions.required ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.required && (
                  <div className="px-5 pb-4 text-xs text-wine-900/80 border-t border-cream-100 pt-3 space-y-2">
                    <p className="text-[11px] text-wine-900/60">
                      You can input text/photos above or easily send remaining high-res files directly to our WhatsApp support team after placing your order:
                    </p>
                    {product.thingsRequired.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blush-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 4: Timelines & Shipping */}
              <div className="border border-roseGold-light/60 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-wine-900 uppercase tracking-wider"
                >
                  <span>Timelines & Express Shipping</span>
                  <ChevronDown
                    className={`w-4 h-4 text-wine-900/60 transition-transform duration-200 ${
                      openAccordions.shipping ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="px-5 pb-4 text-xs text-wine-900/80 border-t border-cream-100 pt-3 space-y-2">
                    <p>
                      <strong>Dispatch:</strong> {product.dispatchesIn}
                    </p>
                    <p>
                      <strong>Delivery:</strong> {product.deliveryTimeline}
                    </p>
                    <p className="text-[11px] text-wine-900/60">
                      Need urgent 24-48h milestone rush delivery? DM us on WhatsApp after ordering and our dispatch team will prioritize your print slot.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 5: Policies Drawer */}
              <div className="border border-roseGold-light/60 rounded-2xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('policies')}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-bold text-wine-900 uppercase tracking-wider"
                >
                  <span>Policies (Privacy, Non-Cancellation, Guarantees)</span>
                  <ChevronDown
                    className={`w-4 h-4 text-wine-900/60 transition-transform duration-200 ${
                      openAccordions.policies ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.policies && (
                  <div className="px-5 pb-4 text-xs text-wine-900/80 border-t border-cream-100 pt-3 space-y-3">
                    <div>
                      <h5 className="font-bold text-wine-900">Customized Orders Policy:</h5>
                      <p className="text-[11px] text-wine-900/70">
                        Since all gifts are uniquely customized with personal names and photos, cancellations are only possible within 2 hours of placing the order before printing commences.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-wine-900">100% Photo Privacy:</h5>
                      <p className="text-[11px] text-wine-900/70">
                        Your personal couple/family photos are treated with strict confidentiality and automatically purged from our production servers 14 days after successful delivery.
                      </p>
                    </div>

                    <div className="pt-1 flex gap-3 text-[11px]">
                      <button
                        onClick={() => onOpenPolicy('cancellation')}
                        className="text-blush-700 underline font-semibold"
                      >
                        Read Full Refund Policy
                      </button>
                      <button
                        onClick={() => onOpenPolicy('privacy')}
                        className="text-blush-700 underline font-semibold"
                      >
                        Read Privacy Terms
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar (Always Accessible on Mobile Devices with Add to Cart & Buy Now) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFCF5]/95 backdrop-blur-md border-t border-taupe-200/80 p-2.5 px-4 shadow-luxury md:hidden flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={product.images[0]}
            alt="Thumbnail"
            className="w-10 h-10 rounded-xl object-cover border border-taupe-200 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-sm font-bold text-charcoal tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              {originalPrice && (
                <span className="text-[10px] text-charcoal/40 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-roseGold truncate block max-w-[95px]">
              {selectedVariant.name.split('(')[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <button
            onClick={handleWhatsAppBuyNow}
            className="p-2.5 bg-charcoal hover:bg-charcoal-dark text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center shrink-0 border border-taupe-200"
            title="Order via WhatsApp"
            aria-label="Order via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-sage-400" />
          </button>

          <button
            onClick={handleAddToCart}
            className="px-2.5 py-2.5 bg-white hover:bg-cream-100 text-charcoal border border-charcoal/80 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 px-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-xl text-xs font-bold shadow-soft flex items-center justify-center gap-1 active:scale-95 transition"
          >
            <Zap className="w-3.5 h-3.5 text-roseGold-light" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
