import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookPage, BookSpread } from '../../types/book';
import {
  buildBookSpreads,
  SONGS_BOOK_PAGES,
  CHAAR_KADAM_BOOK_PAGES,
  INITIAL_5_PAGE_BOOK,
} from '../../data/bookTemplates';
import { PhysicalBookSpread } from './PhysicalBookSpread';
import { InteractiveFlipBook } from './InteractiveFlipBook';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { PRODUCTS } from '../../data/products';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Edit3,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ShoppingBag,
  Zap,
  Check,
} from 'lucide-react';

interface MultiPageBookViewerProps {
  initialPages?: BookPage[];
  onBack?: () => void;
  onDirectCheckout?: () => void;
}

export const MultiPageBookViewer: React.FC<MultiPageBookViewerProps> = ({
  initialPages = SONGS_BOOK_PAGES,
  onBack,
  onDirectCheckout,
}) => {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const tuChahiyeProduct = PRODUCTS.find((p) => p.id === 'prod-song-01') || PRODUCTS[0];
  const [pages, setPages] = useState<BookPage[]>(initialPages);
  const [activeTemplate, setActiveTemplate] = useState<'tu-chahiye' | 'chaar-kadam' | 'classic'>('tu-chahiye');
  const [activeSpreadIndex, setActiveSpreadIndex] = useState<number>(0);
  const [targetFlipPage, setTargetFlipPage] = useState<number | undefined>(undefined);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flipbook' | 'spreads'>('flipbook');
  const containerRef = useRef<HTMLDivElement>(null);

  // Switch between Templates
  const handleTemplateSelect = (template: 'tu-chahiye' | 'chaar-kadam' | 'classic') => {
    setActiveTemplate(template);
    if (template === 'tu-chahiye') {
      setPages(SONGS_BOOK_PAGES);
    } else if (template === 'chaar-kadam') {
      setPages(CHAAR_KADAM_BOOK_PAGES);
    } else {
      setPages(INITIAL_5_PAGE_BOOK);
    }
    setActiveSpreadIndex(0);
    setTargetFlipPage(0);
  };

  const handleAddToCart = () => {
    addToCart(
      tuChahiyeProduct,
      tuChahiyeProduct.variants ? tuChahiyeProduct.variants[0] : undefined,
      {
        headline: 'Tu Chahiye Magazine',
        songTitle: 'Tu Chahiye',
        specialInstructions: 'Songs Book Multi-Page Keepsake (6 Pages / 12 Sides)',
      },
      1
    );
    showToast('Added Tu Chahiye Magazine to Cart 🛍️', 'cart');
    openCart();
  };

  const handleBuyNow = () => {
    addToCart(
      tuChahiyeProduct,
      tuChahiyeProduct.variants ? tuChahiyeProduct.variants[0] : undefined,
      {
        headline: 'Tu Chahiye Magazine',
        songTitle: 'Tu Chahiye',
        specialInstructions: 'Songs Book Multi-Page Keepsake (6 Pages / 12 Sides)',
      },
      1
    );
    showToast('Proceeding to Checkout ✨', 'success');
    if (onDirectCheckout) {
      onDirectCheckout();
    }
  };


  // Compute spreads from pages list
  const spreads: BookSpread[] = React.useMemo(() => {
    return buildBookSpreads(pages);
  }, [pages]);


  const activeSpread = spreads[activeSpreadIndex] || spreads[0];
  const canGoPrev = activeSpreadIndex > 0;
  const canGoNext = activeSpreadIndex < spreads.length - 1;

  const handlePrev = useCallback(() => {
    if (canGoPrev) {
      setActiveSpreadIndex((prev) => prev - 1);
    }
  }, [canGoPrev]);

  const handleNext = useCallback(() => {
    if (canGoNext) {
      setActiveSpreadIndex((prev) => prev + 1);
    }
  }, [canGoNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Replace photo handler
  const handlePhotoClick = (photoId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const fileUrl = URL.createObjectURL(target.files[0]);
        setPages((prevPages) =>
          prevPages.map((page) => ({
            ...page,
            photos: page.photos.map((photo) =>
              photo.id === photoId ? { ...photo, url: fileUrl } : photo
            ),
          }))
        );
      }
    };
    input.click();
  };

  // Upload template JPG handler
  const handleTemplateUpload = (pageNumber: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const fileUrl = URL.createObjectURL(target.files[0]);
        setPages((prevPages) =>
          prevPages.map((p) =>
            p.pageNumber === pageNumber ? { ...p, referenceImage: fileUrl } : p
          )
        );
      }
    };
    input.click();
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#F7F5F0] text-charcoal flex flex-col justify-between ${
        isFullscreen ? 'p-4 sm:p-8' : 'pb-12'
      }`}
    >
      {/* ================= TOP HEADER / TOOLBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#FDFCF5]/95 backdrop-blur-md border-b border-taupe-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-cream-200 text-charcoal transition cursor-pointer"
              title="Back to Studio"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="font-serif italic font-bold text-lg sm:text-xl text-charcoal">
              Tu Chahiye Magazine
            </span>
          </div>
        </div>

        {/* Spread Navigation Badges & Controls */}
        <div className="flex items-center gap-2">
          {/* Template Selector */}
          <div className="hidden lg:flex items-center bg-cream-100 p-0.5 rounded-full border border-taupe-200 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => handleTemplateSelect('tu-chahiye')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                activeTemplate === 'tu-chahiye'
                  ? 'bg-roseGold text-white shadow-2xs'
                  : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Custom Song Book</span>
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSelect('chaar-kadam')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                activeTemplate === 'chaar-kadam'
                  ? 'bg-roseGold text-white shadow-2xs'
                  : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <span>Chaar Kadam</span>
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSelect('classic')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                activeTemplate === 'classic'
                  ? 'bg-roseGold text-white shadow-2xs'
                  : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <span>Classic Keepsake</span>
            </button>
          </div>

          {/* 3D Flipbook vs Dual Spreads View Toggle */}
          <div className="hidden sm:flex items-center bg-cream-100 p-0.5 rounded-full border border-taupe-200 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('flipbook')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'flipbook'
                  ? 'bg-charcoal text-white shadow-2xs'
                  : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <Sparkles className="w-3 h-3 text-roseGold" />
              <span>3D Page-Flip</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('spreads')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'spreads'
                  ? 'bg-charcoal text-white shadow-2xs'
                  : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Flat Spreads</span>
            </button>
          </div>

          {/* Mode Toggle */}
          <button
            onClick={() => setIsEditable((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isEditable
                ? 'bg-roseGold text-white border-roseGold shadow-soft'
                : 'bg-white text-charcoal border-taupe-200 hover:bg-cream-100'
            }`}
          >
            {isEditable ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isEditable ? 'Editing Mode' : 'Preview Mode'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white border border-taupe-200 hover:bg-cream-100 text-charcoal transition cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ================= MAIN SPREAD STAGE ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 relative py-2 sm:py-6">
        {viewMode === 'flipbook' ? (
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
            <InteractiveFlipBook
              pages={pages}
              targetPage={targetFlipPage}
              isEditable={isEditable}
              onPhotoClick={handlePhotoClick}
              onPageChange={(pageNumber) => {
                const spreadIdx = pageNumber <= 1 ? 0 : Math.floor((pageNumber - 2) / 2) + 1;
                setActiveSpreadIndex(Math.min(spreadIdx, spreads.length - 1));
              }}
            />
          </div>
        ) : (

          <>
            {/* Floating Left Navigation Button */}
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Previous Spread"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-taupe-200 shadow-luxury flex items-center justify-center text-charcoal hover:bg-cream-100 disabled:opacity-20 disabled:hover:bg-white/95 disabled:cursor-not-allowed transition z-40 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Physical Book Spread Component */}
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
              <PhysicalBookSpread
                spread={activeSpread}
                isEditable={isEditable}
                onPhotoClick={handlePhotoClick}
              />
            </div>

            {/* Floating Right Navigation Button */}
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next Spread"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-taupe-200 shadow-luxury flex items-center justify-center text-charcoal hover:bg-cream-100 disabled:opacity-20 disabled:hover:bg-white/95 disabled:cursor-not-allowed transition z-40 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </>
        )}
      </main>

      {/* ================= PRODUCT DETAILS, PRICING & ACCORDION ================= */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Title & Price Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif italic font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            Tu Chahiye Magazine
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-bold text-roseGold font-sans tabular-nums">
              Rs. 700.00
            </span>
            <span className="text-sm text-charcoal/40 line-through font-sans tabular-nums">
              Rs. 999.00
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-sage-100 text-sage-800 px-2.5 py-0.5 rounded-full">
              Special Edition
            </span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart and Buy It Now */}
        <div className="space-y-3 max-w-md mx-auto pt-2">
          {/* Add to Cart Option */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 px-6 bg-white hover:bg-cream-100 text-charcoal border-2 border-charcoal rounded-2xl font-semibold text-sm shadow-xs hover:shadow-soft transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-charcoal" />
            <span>Add to Cart</span>
          </button>

          {/* Buy It Now Option (direct to payment gateway) */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-3.5 px-6 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl font-semibold text-sm shadow-soft hover:shadow-luxury transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Zap className="w-4.5 h-4.5 text-roseGold-light" />
            <span>Buy It Now</span>
          </button>
        </div>

        {/* ================= PRODUCT DESCRIPTION ACCORDIONS ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-taupe-200/80 shadow-soft mt-8">
          <div className="border-b border-taupe-200 pb-3 mb-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
              Product Description
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Accordion 1: What's Included */}
            <AccordionItem value="included">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-roseGold text-charcoal">
                  What's Included
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal/80 pt-1">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                    <span>6 beautifully designed pages / 12 sides</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                    <span>Premium-quality printing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                    <span>Aesthetic layouts tailored to your memories</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                    <span>Personalized captions, messages &amp; text</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                    <span>Thoughtfully designed to match your chosen vibe</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                    <span>Your photos transformed into a magazine-style keepsake</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 2: What You Need to Share */}
            <AccordionItem value="share">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-roseGold text-charcoal">
                  What You Need to Share
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal/80 pt-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-roseGold font-bold text-base leading-none">•</span>
                    <span>Minimum 20 photos required</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-roseGold font-bold text-base leading-none">•</span>
                    <span>35–40 photos recommended for a fuller magazine experience</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-roseGold font-bold text-base leading-none">•</span>
                    <span>Have more memories to include? You can choose additional pages while placing your order.</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 3: How It Works */}
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-roseGold text-charcoal">
                  How It Works
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-2.5 text-xs sm:text-sm text-charcoal/80 pt-1">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Place your order</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Share your photos and details with us</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>We create your personalized design</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span>You review/approve the design</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                    <span>Your magazine is printed and delivered</span>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 4: Privacy Policy */}
            <AccordionItem value="privacy">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-roseGold text-charcoal">
                  Privacy Policy
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed pt-1">
                  <p className="font-semibold text-charcoal">
                    Your memories are personal to you.
                  </p>
                  <p>
                    We handle your photos and information with care. Your content will never be shared on our social media or used for promotional purposes without your permission.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
};
