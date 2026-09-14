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
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Edit3,
  Sparkles,
  UploadCloud,
  Maximize2,
  Minimize2,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface MultiPageBookViewerProps {
  initialPages?: BookPage[];
  onBack?: () => void;
}

export const MultiPageBookViewer: React.FC<MultiPageBookViewerProps> = ({
  initialPages = SONGS_BOOK_PAGES,
  onBack,
}) => {
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
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-bold text-lg sm:text-xl text-charcoal">
                Songs Book
              </span>
              <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-roseGold">
                PHYSICAL BOOK SPREADS
              </span>
            </div>
            <p className="text-xs text-charcoal/60 font-sans hidden sm:block">
              Page 1 Standalone Cover • Pages 2–3 &amp; 4–5 Side-by-Side Dual Spreads
            </p>
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


          <div className="hidden md:flex items-center gap-2 bg-cream-100 border border-taupe-200 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
            <BookOpen className="w-4 h-4 text-roseGold" />
            <span className="text-charcoal font-medium">{activeSpread.label}</span>
            <span className="text-taupe-400">•</span>
            <span className="text-charcoal/60 font-mono tabular-nums">
              Spread {activeSpreadIndex + 1} of {spreads.length}
            </span>
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

      {/* ================= BOTTOM FILMSTRIP / SPREAD THUMBNAIL DRAWER ================= */}
      <footer className="bg-[#FDFCF5] border-t border-taupe-200/80 px-4 sm:px-8 py-3.5 space-y-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-charcoal/70">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-roseGold" />
            <span className="font-semibold text-charcoal">Book Spreads</span>
            <span className="text-taupe-400">•</span>
            <span className="font-sans text-[11px]">
              Showing {pages.length} pages in physical book layout
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTemplateUpload(activeSpread.rightPage?.pageNumber || 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-100 hover:bg-cream-200 text-charcoal rounded-full border border-taupe-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Upload reference template JPG for active page"
            >
              <UploadCloud className="w-3.5 h-3.5 text-roseGold" />
              <span>Upload Template JPG</span>
            </button>
          </div>
        </div>

        {/* Filmstrip Thumbnails */}
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto pb-1 pt-1">
          {spreads.map((spread, idx) => {
            const isSelected = activeSpreadIndex === idx;

            const handleThumbnailClick = () => {
              setActiveSpreadIndex(idx);
              if (idx === 0) {
                setTargetFlipPage(0);
              } else {
                setTargetFlipPage(idx * 2 - 1);
              }
            };

            if (spread.type === 'single') {
              // Single Page 1 Thumbnail
              const coverImg = spread.rightPage?.referenceImage || spread.rightPage?.photos[0]?.url;

              return (
                <button
                  key={spread.id}
                  onClick={handleThumbnailClick}
                  className={`flex flex-col items-center gap-1.5 group cursor-pointer transition-all ${
                    isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-14 sm:w-16 aspect-[1/1.38] rounded-r-md rounded-l-xs overflow-hidden bg-charcoal border-2 transition ${
                      isSelected
                        ? 'border-roseGold ring-2 ring-roseGold/30 shadow-luxury'
                        : 'border-taupe-300 hover:border-charcoal'
                    }`}
                  >
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt="Page 1 Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1E1B18] flex items-center justify-center text-[9px] text-white font-bold">
                        P1
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-sans font-bold ${
                      isSelected ? 'text-roseGold' : 'text-charcoal/70'
                    }`}
                  >
                    Page 1 (Cover)
                  </span>
                </button>
              );
            }

            // Dual Spread Thumbnail (Pages 2–3, 4–5, etc.)
            const leftImg = spread.leftPage?.referenceImage || spread.leftPage?.photos[0]?.url;
            const rightImg = spread.rightPage?.referenceImage || spread.rightPage?.photos[0]?.url;

            return (
              <button
                key={spread.id}
                onClick={handleThumbnailClick}
                className={`flex flex-col items-center gap-1.5 group cursor-pointer transition-all ${
                  isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-24 sm:w-28 aspect-[2/1.38] grid grid-cols-2 rounded-md overflow-hidden bg-white border-2 transition ${
                    isSelected
                      ? 'border-roseGold ring-2 ring-roseGold/30 shadow-luxury'
                      : 'border-taupe-300 hover:border-charcoal'
                  }`}
                >
                  {/* Left Page Mini */}
                  <div className="relative border-r border-taupe-200 overflow-hidden bg-[#FAF8F5]">
                    {leftImg ? (
                      <img
                        src={leftImg}
                        alt={`Page ${spread.leftPage?.pageNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-charcoal/60 font-bold">
                        P{spread.leftPage?.pageNumber}
                      </div>
                    )}
                  </div>

                  {/* Right Page Mini */}
                  <div className="relative overflow-hidden bg-[#FAF8F5]">
                    {rightImg ? (
                      <img
                        src={rightImg}
                        alt={`Page ${spread.rightPage?.pageNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-charcoal/60 font-bold">
                        P{spread.rightPage?.pageNumber}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-sans font-bold ${
                    isSelected ? 'text-roseGold' : 'text-charcoal/70'
                  }`}
                >
                  {spread.label}
                </span>
              </button>
            );
          })}
        </div>

      </footer>
    </div>
  );
};
