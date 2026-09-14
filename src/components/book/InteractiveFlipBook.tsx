import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Sparkles, Hand } from 'lucide-react';
import { BookPage } from '../../types/book';
import { BookPageRenderer } from './BookPageRenderer';

interface FlipPageProps {
  page: BookPage;
  isCover?: boolean;
  isBackCover?: boolean;
  isEditable?: boolean;
  onPhotoClick?: (photoId: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

// React-pageflip requires each page to be a forwardRef component
export const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  ({ page, isCover = false, isBackCover = false, isEditable = false, onPhotoClick, style, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`page bg-[#FAF8F5] relative overflow-hidden select-none shadow-md ${
          isCover ? 'page-cover' : ''
        } ${isBackCover ? 'page-back-cover' : ''} ${className}`}
      >
        {/* If page has uploaded reference image (like Anchor Customs template image) */}
        {page.referenceImage ? (
          <div className="w-full h-full relative">
            <img
              src={page.referenceImage}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 pointer-events-none mix-blend-multiply" />
          </div>
        ) : (
          <BookPageRenderer
            page={page}
            isEditable={isEditable}
            onPhotoClick={onPhotoClick}
          />
        )}

        {/* Dynamic Spine Shading based on left or right position */}
        {isCover ? (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/30 via-white/10 to-transparent" />
        ) : page.pageNumber % 2 === 0 ? (
          // Left page gutter shadow on the right edge
          <div className="absolute inset-y-0 right-0 w-8 pointer-events-none bg-gradient-to-l from-black/15 to-transparent" />
        ) : (
          // Right page gutter shadow on the left edge
          <div className="absolute inset-y-0 left-0 w-8 pointer-events-none bg-gradient-to-r from-black/15 to-transparent" />
        )}

        {/* Page Edge Highlight */}
        <div className="absolute inset-0 pointer-events-none border border-black/5" />
      </div>
    );
  }
);

FlipPage.displayName = 'FlipPage';

interface InteractiveFlipBookProps {
  pages: BookPage[];
  isEditable?: boolean;
  targetPage?: number;
  onPhotoClick?: (photoId: string) => void;
  onPageChange?: (pageNumber: number) => void;
}

export const InteractiveFlipBook: React.FC<InteractiveFlipBookProps> = ({
  pages,
  isEditable = false,
  targetPage,
  onPhotoClick,
  onPageChange,
}) => {
  const flipBookRef = useRef<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Web Audio API realistic subtle paper turn rustle
  const playFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.11);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, ctx.currentTime);
      filter.Q.setValueAtTime(1.4, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // AudioContext blocked or not supported
    }
  };

  // Sync external page navigation (e.g. clicking thumbnail strip)
  useEffect(() => {
    if (targetPage !== undefined && flipBookRef.current) {
      try {
        const pageFlip = flipBookRef.current.pageFlip();
        if (pageFlip && pageFlip.getCurrentPageIndex() !== targetPage) {
          pageFlip.flip(targetPage);
        }
      } catch {
        // Safe catch
      }
    }
  }, [targetPage]);

  const handleFlip = (e: { data: number }) => {
    setCurrentPageIndex(e.data);
    playFlipSound();
    if (onPageChange) {
      onPageChange(e.data + 1);
    }
  };

  const flipNext = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip()?.flipNext();
    }
  };

  const flipPrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip()?.flipPrev();
    }
  };

  // Compute active spread label (e.g. "Cover", "Pages 2 & 3", "Pages 4 & 5")
  const currentSpreadLabel = React.useMemo(() => {
    if (currentPageIndex === 0) return 'Page 1 (Front Cover)';
    const pageNum = currentPageIndex + 1;
    if (pageNum % 2 === 0) {
      const left = pageNum;
      const right = pageNum + 1;
      if (right <= pages.length) {
        return `Pages ${left} & ${right}`;
      }
      return `Page ${left} (Back Cover)`;
    } else {
      const left = pageNum - 1;
      const right = pageNum;
      return `Pages ${left} & ${right}`;
    }
  }, [currentPageIndex, pages.length]);

  // Two-page side-by-side dimensions across all devices (Desktop, Tablet, Mobile)
  // On desktop: 380px per page (760px spread, 538px height)
  // On mobile (< 768px): calculate page width so 2 pages sit side-by-side with padding
  const pageWidth = React.useMemo(() => {
    if (windowWidth >= 820) {
      return 380;
    }
    // Available width for two pages side-by-side with 16px total padding
    const availableWidth = Math.max(280, windowWidth - 16);
    const calculated = Math.floor(availableWidth / 2);
    return Math.min(380, calculated);
  }, [windowWidth]);

  const pageHeight = Math.round(pageWidth / 0.7075);

  // React-pageflip expects any cast due to React 18 types
  const FlipBookComponent = HTMLFlipBook as any;

  return (
    <div className="flex flex-col items-center justify-center w-full select-none py-2 sm:py-6">
      {/* Current Spread Pill Indicator matching Anchor Customs */}
      <div className="mb-3 sm:mb-6 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 bg-charcoal text-white px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold shadow-luxury tracking-wide uppercase">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-roseGold" />
          <span>{currentSpreadLabel}</span>
        </div>
      </div>

      {/* 3D FlipBook Stage with Outer Depth Shadow */}
      <div className="relative flex items-center justify-center max-w-full overflow-hidden p-1 sm:p-4">
        <div className="relative filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.22)]">
          <FlipBookComponent
            key={`flipbook-${pageWidth}`}
            ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            size="fixed"
            minWidth={100}
            maxWidth={500}
            minHeight={140}
            maxHeight={750}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            usePortrait={false}
            startPage={0}
            drawShadow={true}
            flippingTime={850}
            useMouseEvents={true}
            swipeDistance={20}
            showPageCorners={true}
            onFlip={handleFlip}
            className="artisan-magazine-flipbook"
            style={{ margin: '0 auto' }}
          >
            {pages.map((p, idx) => (
              <FlipPage
                key={p.id || idx}
                page={p}
                isCover={idx === 0}
                isBackCover={idx === pages.length - 1 && pages.length > 1}
                isEditable={isEditable}
                onPhotoClick={onPhotoClick}
              />
            ))}
          </FlipBookComponent>
        </div>
      </div>

      {/* Bottom Controls matching Anchor Customs ("Drag or Click to Flip") */}
      <div className="mt-3 sm:mt-6 flex items-center gap-2.5 sm:gap-4">
        <button
          type="button"
          onClick={flipPrev}
          aria-label="Previous Page"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-cream-100 text-charcoal border border-taupe-200 shadow-luxury flex items-center justify-center transition cursor-pointer active:scale-95"
          title="Previous Page (or click left page corner)"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs border border-taupe-200 rounded-full text-charcoal/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-2xs">
          <Hand className="w-3 h-3 text-roseGold animate-pulse" />
          <span>Tap or drag corner to flip</span>
        </div>

        <button
          type="button"
          onClick={flipNext}
          aria-label="Next Page"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-cream-100 text-charcoal border border-taupe-200 shadow-luxury flex items-center justify-center transition cursor-pointer active:scale-95"
          title="Next Page (or click right page corner)"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};


