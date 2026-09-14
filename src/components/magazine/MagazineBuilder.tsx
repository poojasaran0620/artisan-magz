import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product, ProductVariant } from '../../types/product';
import { PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import { CountingNumber } from '../ui/CountingNumber';
import { useCart } from '../../context/CartContext';
import { springs } from '../../styles/motion';
import {
  ArrowLeft,
  Check,
  Lock,
  Sparkles,
  Shuffle,
  Eye,
  ShoppingBag,
  MessageCircle,
  Gift,
  FileText,
  Heart,
  X,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MagazineBuilderProps {
  onBack: () => void;
}

// 4 Page packages matching user specifications
interface PagePackageOption {
  pages: 8 | 12 | 16 | 20;
  standardPrice: number;
  miniPrice: number;
  originalPrice: number;
  maxTemplates: number;
  tagline: string;
  recommendedPhotos: number;
  coverThumb: string;
}

const PAGE_PACKAGES: PagePackageOption[] = [
  {
    pages: 8,
    standardPrice: 899,
    miniPrice: 699,
    originalPrice: 1299,
    maxTemplates: 3,
    tagline: 'Cozy highlight reel for anniversaries',
    recommendedPhotos: 8,
    coverThumb: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
  },
  {
    pages: 12,
    standardPrice: 1199,
    miniPrice: 999,
    originalPrice: 1599,
    maxTemplates: 5,
    tagline: 'Most loved! Ample space for story & notes',
    recommendedPhotos: 12,
    coverThumb: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  },
  {
    pages: 16,
    standardPrice: 1499,
    miniPrice: 1299,
    originalPrice: 1999,
    maxTemplates: 7,
    tagline: 'Complete retrospective with timeline map',
    recommendedPhotos: 16,
    coverThumb: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
  },
  {
    pages: 20,
    standardPrice: 1799,
    miniPrice: 1599,
    originalPrice: 2499,
    maxTemplates: 9,
    tagline: 'Collector heirloom with full photo spreads',
    recommendedPhotos: 20,
    coverThumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
  },
];

// Dual-page spread templates for Step 2
interface SpreadTemplate {
  id: string;
  name: string;
  spreadTitle: string;
  category: string;
  previewImage: string;
  description: string;
}

const SPREAD_TEMPLATES: SpreadTemplate[] = [
  {
    id: 'spread-01',
    name: 'Template 01',
    spreadTitle: 'Fashion Editorial & Cover Interview',
    category: 'Editorial',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    description: 'Vogue-inspired left page portrait paired with an editorial story and custom typography.',
  },
  {
    id: 'spread-02',
    name: 'Template 02',
    spreadTitle: 'Inside Her World & Love Notes',
    category: 'Romance',
    previewImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'Two-column interview layout with candid polaroid cutouts and "The 10 Things I Love Most".',
  },
  {
    id: 'spread-03',
    name: 'Template 03',
    spreadTitle: 'Polaroid Memories & Date Stamps',
    category: 'Collage',
    previewImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    description: '6-photo polaroid grid spread with handwriting annotations and anniversary calendar.',
  },
  {
    id: 'spread-04',
    name: 'Template 04',
    spreadTitle: 'Milestone Timeline & Spotify Anthem',
    category: 'Music & Memories',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Interactive Spotify soundwave code spread with your relationship milestone dates.',
  },
  {
    id: 'spread-05',
    name: 'Template 05',
    spreadTitle: 'Reasons Why I Love You',
    category: 'Heartfelt',
    previewImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
    description: 'Romantic numbered keepsake notes with gold leaf accents and intimate couple snapshots.',
  },
  {
    id: 'spread-06',
    name: 'Template 06',
    spreadTitle: 'Golden Hour Full-Bleed Cinematic',
    category: 'Cinematic',
    previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    description: 'Dramatic double-page full bleed panoramic photo spread with minimalist quote footer.',
  },
];

// Step 3 Add-on options matching user reference
interface AddOnOption {
  id: 'wrap' | 'letter' | 'combo';
  badge: string;
  badgeType?: 'touch' | 'letter' | 'best';
  title: string;
  price: number;
  image: string;
  description: string;
}

const ADD_ONS: AddOnOption[] = [
  {
    id: 'wrap',
    badge: 'CUTE LITTLE TOUCH',
    badgeType: 'touch',
    title: 'GIFT WRAP',
    price: 50,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    description: 'Luxury embossed kraft gift wrapping with satin ribbon bow and studio gift tag.',
  },
  {
    id: 'letter',
    badge: 'HANDWRITTEN',
    badgeType: 'letter',
    title: 'HANDWRITTEN LETTER',
    price: 50,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    description: 'Calligraphy handwritten message on vintage cotton parchment sealed with authentic wax stamp.',
  },
  {
    id: 'combo',
    badge: 'BEST VALUE ♡',
    badgeType: 'best',
    title: 'COMBO (WRAP + LETTER)',
    price: 80,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    description: 'Both luxury gift wrapping and handwritten wax-sealed letter combined. Save ₹20!',
  },
];

export const MagazineBuilder: React.FC<MagazineBuilderProps> = ({ onBack }) => {
  const { addToCart, openCart, sendWhatsAppOrder } = useCart();
  const baseMagazine = PRODUCTS.find((p) => p.id === 'prod-mag-01') || PRODUCTS[0];

  // Step 1 State: Format & Package
  const [format, setFormat] = useState<'standard-a4' | 'mini-a5'>('standard-a4');
  const [selectedPages, setSelectedPages] = useState<number | null>(12); // Default to 12 pages for pleasant experience, or null if unselected

  // Step 2 State: Selected Spread Templates
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['spread-01', 'spread-02']);

  // Step 3 State: Selected Add-on
  const [selectedAddOn, setSelectedAddOn] = useState<'wrap' | 'letter' | 'combo' | null>(null);

  // Preview Modals State
  const [previewingSpread, setPreviewingSpread] = useState<SpreadTemplate | null>(null);
  const [previewingAddOn, setPreviewingAddOn] = useState<AddOnOption | null>(null);

  // Active page package object
  const currentPackage = PAGE_PACKAGES.find((pkg) => pkg.pages === selectedPages) || null;

  // Max templates allowed for selected package
  const maxTemplatesAllowed = currentPackage ? currentPackage.maxTemplates : 0;

  // Price calculations
  const packagePrice = currentPackage
    ? format === 'standard-a4'
      ? currentPackage.standardPrice
      : currentPackage.miniPrice
    : 0;

  const addOnPrice = selectedAddOn
    ? ADD_ONS.find((a) => a.id === selectedAddOn)?.price || 0
    : 0;

  const totalPrice = packagePrice + addOnPrice;

  // Handler for selecting package
  const handleSelectPackage = (pages: number) => {
    setSelectedPages(pages);
    // Smooth scroll down to Step 2
    setTimeout(() => {
      const step2El = document.getElementById('builder-step-2');
      if (step2El) {
        step2El.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Handler for toggling spread template
  const handleToggleTemplate = (templateId: string) => {
    if (!selectedPages) {
      scrollToStep1();
      return;
    }
    if (selectedTemplates.includes(templateId)) {
      setSelectedTemplates((prev) => prev.filter((id) => id !== templateId));
    } else {
      if (selectedTemplates.length >= maxTemplatesAllowed) {
        // Replace oldest or cap
        setSelectedTemplates((prev) => [...prev.slice(1), templateId]);
      } else {
        setSelectedTemplates((prev) => [...prev, templateId]);
      }
    }
  };

  // Handler for Randomise For Me
  const handleRandomiseTemplates = () => {
    if (!selectedPages) return;
    const shuffled = [...SPREAD_TEMPLATES].sort(() => 0.5 - Math.random());
    const countToPick = Math.min(maxTemplatesAllowed, SPREAD_TEMPLATES.length);
    setSelectedTemplates(shuffled.slice(0, countToPick).map((t) => t.id));
  };

  // Handler for scrolling to Step 1
  const scrollToStep1 = () => {
    const el = document.getElementById('builder-step-1');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handler for Add to Cart
  const handleAddToCart = () => {
    if (!selectedPages || !currentPackage) {
      scrollToStep1();
      alert('Please select your page package in Step 1 first!');
      return;
    }

    // Map to corresponding ProductVariant
    const variantId = `mag-${selectedPages}p`;
    const matchedVariant: ProductVariant = baseMagazine.variants.find(
      (v) => v.id === variantId
    ) || {
      id: variantId,
      name: `${selectedPages} Pages ${format === 'mini-a5' ? 'Mini (A5)' : 'Standard (A4)'} Edition`,
      price: packagePrice,
      recommendedPhotos: currentPackage.recommendedPhotos,
    };

    addToCart(
      baseMagazine,
      matchedVariant,
      {
        format,
        selectedPages,
        selectedTemplates,
        addOns: {
          giftWrap: selectedAddOn === 'wrap' || selectedAddOn === 'combo',
          handwrittenLetter: selectedAddOn === 'letter' || selectedAddOn === 'combo',
          combo: selectedAddOn === 'combo',
        },
        addOnPrice,
        variantId: matchedVariant.id,
        variantName: matchedVariant.name,
      },
      1
    );

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#B76E79', '#9E7864', '#C99E5C', '#EED8CC'],
    });

    openCart();
  };

  // Direct WhatsApp Order
  const handleWhatsAppCheckout = () => {
    if (!selectedPages || !currentPackage) {
      scrollToStep1();
      return;
    }
    const variantId = `mag-${selectedPages}p`;
    const matchedVariant: ProductVariant = baseMagazine.variants.find(
      (v) => v.id === variantId
    ) || {
      id: variantId,
      name: `${selectedPages} Pages ${format === 'mini-a5' ? 'Mini (A5)' : 'Standard (A4)'} Edition`,
      price: packagePrice,
      recommendedPhotos: currentPackage.recommendedPhotos,
    };

    const tempItem = {
      cartItemId: `mag-${Date.now()}`,
      product: baseMagazine,
      selectedVariant: matchedVariant,
      quantity: 1,
      customization: {
        format,
        selectedPages,
        selectedTemplates,
        addOns: {
          giftWrap: selectedAddOn === 'wrap' || selectedAddOn === 'combo',
          handwrittenLetter: selectedAddOn === 'letter' || selectedAddOn === 'combo',
          combo: selectedAddOn === 'combo',
        },
        addOnPrice,
      },
      unitPrice: totalPrice,
      totalPrice: totalPrice,
    };

    sendWhatsAppOrder([tempItem]);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] pb-32">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-taupe-200/60 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-roseGold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-base sm:text-lg font-bold text-charcoal tracking-wide">
              Artisan Magz
            </span>
            <span className="hidden sm:inline-block text-[11px] text-taupe-600 font-sans ml-2">
              • Custom Magazine Studio
            </span>
          </div>

          {/* Quick Cart Trigger */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal px-3 py-1.5 rounded-full text-xs font-semibold border border-taupe-200 cursor-pointer transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-roseGold" />
            <span>Bag</span>
          </button>
        </div>

      </header>

      {/* Main Content Flow */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-14">
        
        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE YOUR PACKAGE & FORMAT (Matching Reference Image 1)         */}
        {/* ========================================================================= */}
        <section id="builder-step-1" className="space-y-4">
          {/* Section Heading matching Reference */}
          <div className="text-center space-y-1.5">
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Choose your package
            </h1>
            <p className="text-xs sm:text-sm text-taupe-700">
              Pricing scales with page count. Front & back covers included.
            </p>
          </div>

          {/* Highlighted Banner Card with Website Brand Gradient */}
          <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#9E7864] via-[#B76E79] to-[#804D55] text-[#FDFCF5] shadow-luxury border border-white/40 space-y-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Subheader & Format Selector */}
            <div className="text-center space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#FFDBE5]">
                CHOOSE YOUR FORMAT
              </span>

              {/* Format Toggle Sliding Pill (shadcn Tabs / iOS segmented control) */}
              <div className="inline-flex p-1 bg-charcoal/40 backdrop-blur-md rounded-full border border-white/20 shadow-inner relative">
                <button
                  type="button"
                  onClick={() => setFormat('standard-a4')}
                  className={`relative px-4 sm:px-6 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    format === 'standard-a4'
                      ? 'text-charcoal'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {format === 'standard-a4' && (
                    <motion.div
                      layoutId="activeFormatIndicator"
                      transition={springs.snappy}
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                    />
                  )}
                  <span className="relative z-10">STANDARD • A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('mini-a5')}
                  className={`relative px-4 sm:px-6 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    format === 'mini-a5'
                      ? 'text-charcoal'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {format === 'mini-a5' && (
                    <motion.div
                      layoutId="activeFormatIndicator"
                      transition={springs.snappy}
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                    />
                  )}
                  <span className="relative z-10">MINI • A5</span>
                </button>
              </div>
            </div>

            {/* 4 Page Package Cards Grid (8, 12, 16, 20 Pages) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-2">
              {PAGE_PACKAGES.map((pkg) => {
                const isSelected = selectedPages === pkg.pages;
                const price = format === 'standard-a4' ? pkg.standardPrice : pkg.miniPrice;

                return (
                  <div
                    key={pkg.pages}
                    onClick={() => handleSelectPackage(pkg.pages)}
                    className={`rounded-2xl p-2.5 sm:p-3 bg-white/95 text-charcoal border transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 relative ${
                      isSelected
                        ? 'border-white ring-3 ring-white shadow-soft-lg scale-[1.02]'
                        : 'border-white/30 hover:border-white/70 shadow-xs'
                    }`}
                  >
                    {/* Active Selected Check Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-charcoal text-[#FDFCF5] flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="space-y-2">
                      {/* Cover Thumbnail / Gingham Pattern Preview */}
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#FFF9E6] border border-taupe-200/50 flex flex-col items-center justify-center p-2 text-center">
                        {/* Decorative Gingham / Mini Header */}
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9E7864_1px,transparent_1px)] [background-size:8px_8px]" />
                        <span className="font-serif text-[11px] sm:text-xs font-extrabold text-charcoal uppercase tracking-wider leading-tight z-1">
                          {pkg.pages} PAGES
                        </span>
                        <span className="text-[9px] text-roseGold font-serif italic z-1">
                          MAGAZINE
                        </span>
                      </div>

                      {/* Package Label */}
                      <div className="text-center">
                        <h4 className="font-serif text-xs font-bold text-charcoal">
                          {pkg.pages} PAGES
                        </h4>
                        <div className="mt-1">
                          <span className="inline-block bg-cream-100 text-charcoal px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-2xs font-sans tabular-nums">
                            {formatPrice(price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Row: Select & Eye */}
                    <div className="pt-2 mt-2 border-t border-taupe-200/40 flex items-center gap-1.5">
                      <button
                        type="button"
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-charcoal text-[#FDFCF5]'
                            : 'bg-cream-200 hover:bg-cream-300 text-charcoal'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPackage(pkg.pages);
                        }}
                        className="p-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-taupe-700 hover:text-charcoal transition"
                        title="View Package"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Prompt matching Reference */}
            <div className="pt-2 text-center space-y-2">
              <p className="text-[11px] sm:text-xs text-[#FDFCF5]/80 font-medium">
                ★ more pages, more stories to tell ★
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('builder-step-2');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2 rounded-full bg-charcoal/80 hover:bg-charcoal text-[#FDFCF5] text-xs font-bold tracking-wider uppercase border border-white/20 shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Scroll Down to Pick Your Template</span>
                  <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: PICK YOUR TEMPLATES (Matching Reference Image 3 with Lock Logic)  */}
        {/* ========================================================================= */}
        <section id="builder-step-2" className="space-y-4 pt-4">
          {/* Section Header */}
          <div className="text-center space-y-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-roseGold">
              STEP 2
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Pick your templates
            </h2>
            <p className="text-xs sm:text-sm text-taupe-700">
              Choose the exact number your package allows. Click a card for details.
            </p>
          </div>

          {/* Status Indicator / Lock Notice */}
          <div className="max-w-md mx-auto">
            {!selectedPages ? (
              // LOCKED BANNER (User's explicit requirement)
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-semibold">
                    Pick a page package above to unlock templates
                  </span>
                </div>
                <button
                  type="button"
                  onClick={scrollToStep1}
                  className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer transition"
                >
                  Pick Package ↑
                </button>
              </div>
            ) : (
              // UNLOCKED STATUS
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs shadow-xs">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    <strong>{selectedPages} Pages</strong> selected — choose up to{' '}
                    <strong>{maxTemplatesAllowed} layout spreads</strong>
                  </span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-sans tabular-nums">
                  {selectedTemplates.length} / {maxTemplatesAllowed}
                </span>
              </div>
            )}
          </div>

          {/* Templates Container styled in Brand Gradient */}
          <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#9E7864] via-[#B76E79] to-[#804D55] text-[#FDFCF5] shadow-luxury border border-white/40 space-y-6 relative">
            {/* Header & "Randomise For Me" action matching Reference Image 3 */}
            <div className="text-center space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#FFDBE5] block">
                  RIGHT - LEFT SIDE TEMPLATES
                </span>
                <span className="text-xs text-[#FDFCF5]/80 font-sans font-bold tabular-nums">
                  {selectedTemplates.length} OF {maxTemplatesAllowed || 1} SELECTED
                </span>
              </div>

              {/* Randomise For Me Button */}
              <div>
                <button
                  type="button"
                  onClick={handleRandomiseTemplates}
                  disabled={!selectedPages}
                  className="px-5 py-2 bg-white text-charcoal hover:bg-cream-100 rounded-full text-xs font-bold shadow-luxury active:scale-98 transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Shuffle className="w-3.5 h-3.5 text-roseGold" />
                  <span>RANDOMISE FOR ME</span>
                </button>
              </div>
            </div>

            {/* Template Spreads Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPREAD_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplates.includes(tmpl.id);

                return (
                  <div
                    key={tmpl.id}
                    className={`rounded-2xl p-3 bg-white text-charcoal border transition-all duration-200 flex flex-col justify-between relative ${
                      isSelected
                        ? 'ring-3 ring-white shadow-soft-lg scale-[1.01]'
                        : 'border-white/30 shadow-xs'
                    }`}
                  >
                    {/* Active Checkmark Pill */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 bg-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3 text-roseGold-light" />
                        <span>Chosen</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {/* Spread Visual Thumbnail */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-cream-100 border border-taupe-200/60 shadow-xs">
                        <img
                          src={tmpl.previewImage}
                          alt={tmpl.spreadTitle}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-charcoal/80 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md font-sans font-medium">
                          {tmpl.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-serif text-sm font-bold text-charcoal">
                          {tmpl.name}
                        </h4>
                        <p className="text-[11px] text-taupe-600 font-medium line-clamp-1">
                          {tmpl.spreadTitle}
                        </p>
                      </div>
                    </div>

                    {/* Action Row: Select & View */}
                    <div className="pt-2.5 mt-2 border-t border-taupe-200/50 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleTemplate(tmpl.id)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-charcoal text-[#FDFCF5]'
                            : 'bg-cream-100 hover:bg-cream-200 text-charcoal'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewingSpread(tmpl)}
                        className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-roseGold" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: ADD-ONS (Matching Reference Image 2)                              */}
        {/* ========================================================================= */}
        <section id="builder-step-3" className="space-y-4 pt-4">
          {/* Section Header */}
          <div className="text-center space-y-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-roseGold">
              STEP 3
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Add-ons
            </h2>
            <p className="text-xs sm:text-sm text-taupe-700">
              Little extras that make the keepsake feel personal.
            </p>
          </div>

          {/* Add-ons Container with Website Gradient */}
          <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#9E7864] via-[#B76E79] to-[#804D55] text-[#FDFCF5] shadow-luxury border border-white/40 space-y-6">
            {/* Title & Subtitle matching Reference Image 2 */}
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-[#FFDBE5]" />
                <span>ADD - ONS</span>
              </h3>
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#FFDBE5] uppercase">
                ✦ MAKE IT EXTRA SPECIAL ✦
              </p>
            </div>

            {/* 3 Add-on Cards Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {ADD_ONS.map((addon) => {
                const isSelected = selectedAddOn === addon.id;

                return (
                  <div
                    key={addon.id}
                    onClick={() => setSelectedAddOn(isSelected ? null : addon.id)}
                    className={`rounded-2xl p-3 bg-white text-charcoal border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? 'ring-3 ring-white shadow-soft-lg scale-[1.02]'
                        : 'border-white/30 shadow-xs hover:border-white/70'
                    }`}
                  >
                    {/* Badge on Top matching Reference */}
                    <div className="mb-2 text-center">
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          addon.badgeType === 'best'
                            ? 'bg-roseGold text-white'
                            : 'bg-cream-200 text-charcoal'
                        }`}
                      >
                        {addon.badge}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Image Preview */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-100 border border-taupe-200/60 shadow-xs">
                        <img
                          src={addon.image}
                          alt={addon.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      {/* Title & Price Pill */}
                      <div className="text-center space-y-1">
                        <h4 className="font-serif text-xs font-bold text-charcoal tracking-wide">
                          {addon.title}
                        </h4>
                        <div>
                          <span className="inline-block bg-cream-100 text-charcoal px-2.5 py-0.5 rounded-full text-xs font-extrabold font-sans tabular-nums shadow-2xs">
                            {formatPrice(addon.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Row: Select & View */}
                    <div className="pt-2.5 mt-2 border-t border-taupe-200/50 flex items-center gap-1.5">
                      <button
                        type="button"
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-charcoal text-[#FDFCF5]'
                            : 'bg-cream-100 hover:bg-cream-200 text-charcoal'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingAddOn(addon);
                        }}
                        className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal transition"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-roseGold" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Note matching Reference */}
            <div className="text-center pt-1">
              <p className="text-[11px] text-[#FDFCF5]/85 italic">
                ♡ Little extras, more love ♡
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM ACTION BAR (Total Price, Add to Cart & WhatsApp Checkout)   */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-taupe-200/80 shadow-luxury px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Summary Breakdown */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-taupe-600 block">
                Total Keepsake Price
              </span>
              <div className="flex items-baseline gap-1.5">
                <CountingNumber
                  value={totalPrice}
                  className="text-xl sm:text-2xl font-bold text-charcoal"
                />
                {selectedAddOn && (
                  <span className="text-[10px] text-roseGold font-semibold">
                    (incl. {ADD_ONS.find((a) => a.id === selectedAddOn)?.title})
                  </span>
                )}
              </div>
            </div>

            {/* Format & Page Pill */}
            {selectedPages && (
              <span className="bg-cream-200 text-charcoal text-[10px] font-bold px-2.5 py-1 rounded-full border border-taupe-200">
                {selectedPages}P • {format === 'mini-a5' ? 'A5' : 'A4'}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppCheckout}
              className="flex-1 sm:flex-none px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-2 sm:flex-none px-6 py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl text-xs sm:text-sm font-bold shadow-luxury active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-roseGold-light group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SPREAD PREVIEW MODAL                                                      */}
      {/* ========================================================================= */}
      {previewingSpread && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewingSpread(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-taupe-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-cream-100">
              <img
                src={previewingSpread.previewImage}
                alt={previewingSpread.spreadTitle}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewingSpread(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal/80 hover:bg-charcoal text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold">
                    {previewingSpread.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-charcoal">
                    {previewingSpread.name} • {previewingSpread.spreadTitle}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-taupe-700 leading-relaxed">
                {previewingSpread.description}
              </p>

              <div className="pt-3 border-t border-taupe-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleTemplate(previewingSpread.id);
                    setPreviewingSpread(null);
                  }}
                  className="flex-1 py-2.5 bg-charcoal text-white rounded-xl text-xs font-bold hover:bg-charcoal-dark transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-roseGold-light" />
                  <span>
                    {selectedTemplates.includes(previewingSpread.id)
                      ? 'Deselect Template'
                      : 'Select This Template'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD-ON PREVIEW MODAL                                                      */}
      {/* ========================================================================= */}
      {previewingAddOn && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewingAddOn(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-taupe-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square bg-cream-100">
              <img
                src={previewingAddOn.image}
                alt={previewingAddOn.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewingAddOn(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal/80 hover:bg-charcoal text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold">
                    {previewingAddOn.badge}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-charcoal">
                    {previewingAddOn.title}
                  </h3>
                </div>
                <span className="font-sans font-bold tabular-nums text-base text-charcoal bg-cream-100 px-3 py-1 rounded-full">
                  {formatPrice(previewingAddOn.price)}
                </span>
              </div>
              <p className="text-xs text-taupe-700 leading-relaxed">
                {previewingAddOn.description}
              </p>

              <div className="pt-3 border-t border-taupe-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAddOn(
                      selectedAddOn === previewingAddOn.id ? null : previewingAddOn.id
                    );
                    setPreviewingAddOn(null);
                  }}
                  className="w-full py-2.5 bg-charcoal text-white rounded-xl text-xs font-bold hover:bg-charcoal-dark transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-roseGold-light" />
                  <span>
                    {selectedAddOn === previewingAddOn.id ? 'Remove Add-on' : 'Add to Keepsake'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
