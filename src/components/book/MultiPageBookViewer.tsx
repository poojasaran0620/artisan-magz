import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookPage, BookSpread } from '../../types/book';
import { buildBookSpreads } from '../../data/bookTemplates.ts';
import {
  SONG_MAGAZINE_TEMPLATES,
  SongTemplateItem,
} from '../../data/songTemplates.ts';
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
  ChevronDown,
  SlidersHorizontal,
  Upload,
  Heart,
} from 'lucide-react';

interface MultiPageBookViewerProps {
  initialPages?: BookPage[];
  initialSongId?: string | null;
  onBack?: () => void;
  onDirectCheckout?: () => void;
}

export const MultiPageBookViewer: React.FC<MultiPageBookViewerProps> = ({
  initialSongId = null,
  onBack,
  onDirectCheckout,
}) => {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const baseSongProduct = PRODUCTS.find((p) => p.id === 'prod-song-01') || PRODUCTS[0];

  // State: selected song (null = show all song options grid)
  const [selectedSongId, setSelectedSongId] = useState<string | null>(initialSongId);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  // Active song details
  const activeSong: SongTemplateItem | undefined = useMemo(() => {
    return SONG_MAGAZINE_TEMPLATES.find((s) => s.id === selectedSongId);
  }, [selectedSongId]);

  // Pages state for the selected song
  const [pages, setPages] = useState<BookPage[]>(() => {
    return activeSong?.pages || SONG_MAGAZINE_TEMPLATES[0].pages;
  });

  // When selectedSong changes, update pages
  useEffect(() => {
    if (activeSong) {
      setPages(activeSong.pages);
      setActiveSpreadIndex(0);
      setTargetFlipPage(0);
    }
  }, [activeSong]);

  const [activeSpreadIndex, setActiveSpreadIndex] = useState<number>(0);
  const [targetFlipPage, setTargetFlipPage] = useState<number | undefined>(undefined);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flipbook' | 'spreads'>('flipbook');
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute spreads from pages list
  const spreads: BookSpread[] = useMemo(() => {
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

  // Add to Cart handler
  const handleAddToCart = () => {
    const song = activeSong || SONG_MAGAZINE_TEMPLATES[0];
    addToCart(
      baseSongProduct,
      baseSongProduct.variants ? baseSongProduct.variants[0] : undefined,
      {
        headline: song.title,
        songTitle: song.songTitle,
        specialInstructions: `${song.title} Keepsake (6 Pages / 12 Sides)`,
      },
      1
    );
    showToast(`Added ${song.title} to Cart 🛍️`, 'cart');
    openCart();
  };

  // Buy Now handler
  const handleBuyNow = () => {
    const song = activeSong || SONG_MAGAZINE_TEMPLATES[0];
    addToCart(
      baseSongProduct,
      baseSongProduct.variants ? baseSongProduct.variants[0] : undefined,
      {
        headline: song.title,
        songTitle: song.songTitle,
        specialInstructions: `${song.title} Keepsake (6 Pages / 12 Sides)`,
      },
      1
    );
    showToast('Proceeding to Checkout ✨', 'success');
    if (onDirectCheckout) {
      onDirectCheckout();
    }
  };

  // Filter & sort song templates for gallery view
  const filteredTemplates = useMemo(() => {
    let list = [...SONG_MAGAZINE_TEMPLATES];
    if (activeCategory !== 'All') {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.badge === 'BEST SELLER' ? 1 : 0) - (a.badge === 'BEST SELLER' ? 1 : 0));
    }
    return list;
  }, [activeCategory, sortBy]);

  // Categories list
  const categories = ['All', 'Romantic', 'Bollywood', 'Wedding', 'Special'];

  // =========================================================================
  // VIEW 1: SONG OPTIONS GALLERY (FIRST VIEW AS REQUESTED BY USER)
  // Matching screenshot: Top "Magazines" title, ← All Categories, Default Sorting
  // 2-column mobile grid with badges, titles, and prices
  // =========================================================================
  if (!selectedSongId || !activeSong) {
    return (
      <div className="min-h-screen bg-[#FDFCF5] text-[#2D2622] pb-20">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#FDFCF5]/95 backdrop-blur-md border-b border-[#EBE6DE] px-4 sm:px-8 py-3.5 shadow-2xs">
          {/* Centered Page Title */}
          <div className="text-center mb-3">
            <h1 className="font-serif italic text-2xl sm:text-3xl text-[#2D2622] tracking-wide">
              Magazines
            </h1>
            <p className="text-xs text-[#2D2622]/60 mt-0.5">
              Choose your song template to preview interactive pages &amp; book spreads
            </p>
          </div>

          {/* Action Row: ← All Categories & Default Sorting */}
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            {/* Left Pill: All Categories */}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8CFC4] bg-[#FFFDF9] hover:bg-[#F5EFEB] text-[#4A3B32] text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#8C6D62]" />
              <span>All Categories</span>
            </button>

            {/* Right Pill: Sorting Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8CFC4] bg-[#FFFDF9] hover:bg-[#F5EFEB] text-[#4A3B32] text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs active:scale-95"
              >
                <span>
                  {sortBy === 'default'
                    ? 'Default Sorting'
                    : sortBy === 'price-asc'
                    ? 'Price: Low to High'
                    : sortBy === 'price-desc'
                    ? 'Price: High to Low'
                    : 'Best Sellers'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#8C6D62]" />
              </button>

              {/* Dropdown Menu */}
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFDF9] rounded-2xl border border-[#D8CFC4] shadow-luxury py-1.5 z-40 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('default');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F5EFEB] transition ${
                      sortBy === 'default' ? 'font-bold text-[#B76E79]' : 'text-[#4A3B32]'
                    }`}
                  >
                    Default Sorting
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('popular');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F5EFEB] transition ${
                      sortBy === 'popular' ? 'font-bold text-[#B76E79]' : 'text-[#4A3B32]'
                    }`}
                  >
                    Best Sellers First
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('price-asc');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F5EFEB] transition ${
                      sortBy === 'price-asc' ? 'font-bold text-[#B76E79]' : 'text-[#4A3B32]'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('price-desc');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F5EFEB] transition ${
                      sortBy === 'price-desc' ? 'font-bold text-[#B76E79]' : 'text-[#4A3B32]'
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#B76E79] text-white shadow-2xs'
                    : 'bg-[#F2ECE4] text-[#4A3B32] hover:bg-[#EAE2D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MAGAZINE GRID (MATCHING SCREENSHOT) ================= */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedSongId(template.id)}
                className="group flex flex-col cursor-pointer"
              >
                {/* Card Image Container with rounded corners matching screenshot */}
                <div className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#ECE6DD] border border-[#E0D7CC]/80 shadow-2xs group-hover:shadow-soft transition-all duration-300">
                  <img
                    src={template.coverImage}
                    alt={template.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Text Readability & Mood */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                  {/* Golden-Yellow Badge (e.g. BEST SELLER / RAKSHABANDHAN SPECIAL / NEW RELEASE) */}
                  {template.badge && (
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
                      <span className="inline-block bg-[#C8973E] text-white text-[9px] sm:text-[11px] font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm uppercase">
                        {template.badge}
                      </span>
                    </div>
                  )}

                  {/* Hover Prompt */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-[#2D2622]/90 text-white text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
                      <BookOpen className="w-3 h-3 text-[#B76E79]" />
                      <span>Preview Spreads</span>
                    </span>
                  </div>
                </div>

                {/* Card Meta below image (Title + Price centered matching screenshot) */}
                <div className="pt-2.5 sm:pt-3 text-center space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-[#2D2622] group-hover:text-[#B76E79] transition leading-snug">
                    {template.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2D2622]">
                      ₹{template.price}
                    </span>
                    {template.originalPrice && (
                      <span className="text-[11px] sm:text-xs text-[#2D2622]/40 line-through">
                        ₹{template.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* User Helper Note for uploading more templates */}
          <div className="mt-12 bg-[#F8F4EE] rounded-3xl p-6 sm:p-8 border border-[#E5DFD7] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#EAE2D8] text-[#8C6D62] flex items-center justify-center mx-auto mb-1">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic text-base sm:text-lg font-bold text-[#2D2622]">
              Want a custom song or magazine theme?
            </h4>
            <p className="text-xs sm:text-sm text-[#2D2622]/70 max-w-md mx-auto">
              You can choose any song template above to customize it with your own photos, captions, and lyrics.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INDIVIDUAL SONG MAGAZINE DETAIL & 3D BOOK SPREAD
  // Shown when customer clicks any song option from the grid!
  // =========================================================================
  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#FDFCF5] text-[#2D2622] flex flex-col justify-between ${
        isFullscreen ? 'p-4 sm:p-8' : 'pb-16'
      }`}
    >
      {/* ================= TOP HEADER / TOOLBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#FDFCF5]/95 backdrop-blur-md border-b border-[#EBE6DE] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Back button to return to Song Options Grid */}
          <button
            type="button"
            onClick={() => setSelectedSongId(null)}
            className="p-2 rounded-full hover:bg-[#F2ECE4] text-[#2D2622] transition cursor-pointer flex items-center gap-1.5"
            title="Back to All Song Magazines"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-semibold text-[#8C6D62]">
              All Songs
            </span>
          </button>
          <div>
            <span className="font-serif italic font-bold text-lg sm:text-xl text-[#2D2622]">
              {activeSong.title}
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Song Switcher Dropdown */}
          <div className="hidden lg:flex items-center bg-[#F2ECE4] p-0.5 rounded-full border border-[#D8CFC4] text-xs font-semibold">
            {SONG_MAGAZINE_TEMPLATES.slice(0, 3).map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => setSelectedSongId(song.id)}
                className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                  selectedSongId === song.id
                    ? 'bg-[#B76E79] text-white shadow-2xs'
                    : 'text-[#4A3B32] hover:text-[#2D2622]'
                }`}
              >
                <span>{song.songTitle}</span>
              </button>
            ))}
          </div>

          {/* 3D Flipbook vs Dual Spreads View Toggle */}
          <div className="hidden sm:flex items-center bg-[#F2ECE4] p-0.5 rounded-full border border-[#D8CFC4] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('flipbook')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'flipbook'
                  ? 'bg-[#2D2622] text-white shadow-2xs'
                  : 'text-[#4A3B32] hover:text-[#2D2622]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#E8CCD1]" />
              <span>3D Page-Flip</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('spreads')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'spreads'
                  ? 'bg-[#2D2622] text-white shadow-2xs'
                  : 'text-[#4A3B32] hover:text-[#2D2622]'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Flat Spreads</span>
            </button>
          </div>

          {/* Mode Toggle (Editing vs Preview) */}
          <button
            type="button"
            onClick={() => setIsEditable((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isEditable
                ? 'bg-[#B76E79] text-white border-[#B76E79] shadow-soft'
                : 'bg-white text-[#2D2622] border-[#D8CFC4] hover:bg-[#F2ECE4]'
            }`}
          >
            {isEditable ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isEditable ? 'Editing Mode' : 'Preview Mode'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white border border-[#D8CFC4] hover:bg-[#F2ECE4] text-[#2D2622] transition cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ================= MAIN SPREAD STAGE ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 relative py-4 sm:py-8">
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
              type="button"
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Previous Spread"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-[#D8CFC4] shadow-luxury flex items-center justify-center text-[#2D2622] hover:bg-[#F2ECE4] disabled:opacity-20 disabled:hover:bg-white/95 disabled:cursor-not-allowed transition z-40 cursor-pointer active:scale-95"
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
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next Spread"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md border border-[#D8CFC4] shadow-luxury flex items-center justify-center text-[#2D2622] hover:bg-[#F2ECE4] disabled:opacity-20 disabled:hover:bg-white/95 disabled:cursor-not-allowed transition z-40 cursor-pointer active:scale-95"
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
          <h1 className="font-serif italic font-bold text-3xl sm:text-4xl text-[#2D2622] tracking-tight">
            {activeSong.title}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-bold text-[#B76E79] font-sans tabular-nums">
              Rs. {activeSong.price}.00
            </span>
            <span className="text-sm text-[#2D2622]/40 line-through font-sans tabular-nums">
              Rs. {activeSong.originalPrice}.00
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#E8F0E8] text-[#3D6B3D] px-2.5 py-0.5 rounded-full">
              Special Edition
            </span>
          </div>
          {activeSong.subtitle && (
            <p className="text-xs text-[#2D2622]/70 font-sans">
              {activeSong.subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons: Add to Cart and Buy It Now */}
        <div className="space-y-3 max-w-md mx-auto pt-2">
          {/* Add to Cart Option */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 px-6 bg-white hover:bg-[#F5EFEB] text-[#2D2622] border-2 border-[#2D2622] rounded-2xl font-semibold text-sm shadow-xs hover:shadow-soft transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-[#2D2622]" />
            <span>Add to Cart</span>
          </button>

          {/* Buy It Now Option (direct to payment gateway) */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-3.5 px-6 bg-[#2D2622] hover:bg-[#1E1B18] text-[#FDFCF5] rounded-2xl font-semibold text-sm shadow-soft hover:shadow-luxury transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Zap className="w-4.5 h-4.5 text-[#E8CCD1]" />
            <span>Buy It Now</span>
          </button>

          {/* Back to All Songs Button */}
          <button
            type="button"
            onClick={() => setSelectedSongId(null)}
            className="w-full py-2 text-center text-xs text-[#8C6D62] hover:text-[#2D2622] font-medium transition cursor-pointer"
          >
            ← Explore Other Song Magazines
          </button>
        </div>

        {/* ================= PRODUCT DESCRIPTION ACCORDIONS ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DE] shadow-soft mt-8">
          <div className="border-b border-[#EBE6DE] pb-3 mb-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D2622]">
              Product Description
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Accordion 1: What's Included */}
            <AccordionItem value="included">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-[#B76E79] text-[#2D2622]">
                  What's Included
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#2D2622]/80 pt-1">
                  {activeSong.details?.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4E7D52] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 2: What You Need to Share */}
            <AccordionItem value="share">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-[#B76E79] text-[#2D2622]">
                  What You Need to Share
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#2D2622]/80 pt-1">
                  {activeSong.details?.whatToShare.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#B76E79] font-bold text-base leading-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 3: How It Works */}
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-[#B76E79] text-[#2D2622]">
                  How It Works
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-2.5 text-xs sm:text-sm text-[#2D2622]/80 pt-1">
                  {activeSong.details?.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#F2ECE4] text-[#2D2622] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 4: Privacy Policy */}
            <AccordionItem value="privacy">
              <AccordionTrigger className="group">
                <span className="text-sm font-semibold transition-colors group-hover:text-[#B76E79] text-[#2D2622]">
                  Privacy Policy
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs sm:text-sm text-[#2D2622]/80 leading-relaxed pt-1">
                  <p className="font-semibold text-[#2D2622]">
                    {activeSong.details?.privacyPolicy.headline}
                  </p>
                  <p>
                    {activeSong.details?.privacyPolicy.text}
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
