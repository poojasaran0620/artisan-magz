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
  onPhotoClick?: (photoId: string) => void;
  onPageChange?: (pageNumber: number) => void;
}

export const InteractiveFlipBook: React.FC<InteractiveFlipBookProps> = ({
  pages,
  isEditable = false,
  onPhotoClick,
  onPageChange,
}) => {
  const flipBookRef = useRef<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFlip = (e: { data: number }) => {
    setCurrentPageIndex(e.data);
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
    if (currentPageIndex >= pages.length) return 'Back Cover';
    const leftNum = currentPageIndex % 2 === 0 ? currentPageIndex : currentPageIndex - 1;
    const rightNum = leftNum + 1;
    if (rightNum <= pages.length) {
      return `Pages ${leftNum} & ${rightNum}`;
    }
    return `Page ${leftNum}`;
  }, [currentPageIndex, pages.length]);

  // Page dimensions modeled after Anchor Customs (aspect ~1:1.41)
  const pageWidth = isMobile ? 320 : 380;
  const pageHeight = isMobile ? 450 : 538;

  // React-pageflip expects any cast due to React 18 types
  const FlipBookComponent = HTMLFlipBook as any;

  return (
    <div className="flex flex-col items-center justify-center w-full select-none py-2 sm:py-6">
      {/* Current Spread Pill Indicator matching Anchor Customs */}
      <div className="mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-luxury tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-roseGold" />
          <span>{currentSpreadLabel}</span>
        </div>
      </div>

      {/* 3D FlipBook Stage with Outer Depth Shadow */}
      <div className="relative flex items-center justify-center max-w-full overflow-hidden p-2 sm:p-4">
        <div className="relative filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)]">
          <FlipBookComponent
            ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            size="fixed"
            minWidth={240}
            maxWidth={500}
            minHeight={340}
            maxHeight={700}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            usePortrait={isMobile}
            startPage={0}
            drawShadow={true}
            flippingTime={900}
            useMouseEvents={true}
            swipeDistance={30}
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
      <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={flipPrev}
          aria-label="Previous Page"
          className="w-10 h-10 rounded-full bg-white hover:bg-cream-100 text-charcoal border border-taupe-200 shadow-luxury flex items-center justify-center transition cursor-pointer active:scale-95"
          title="Previous Page (or click left page corner)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-xs border border-taupe-200 rounded-full text-charcoal/70 text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-2xs">
          <Hand className="w-3.5 h-3.5 text-roseGold animate-pulse" />
          <span>Drag corner or click to flip</span>
        </div>

        <button
          type="button"
          onClick={flipNext}
          aria-label="Next Page"
          className="w-10 h-10 rounded-full bg-white hover:bg-cream-100 text-charcoal border border-taupe-200 shadow-luxury flex items-center justify-center transition cursor-pointer active:scale-95"
          title="Next Page (or click right page corner)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
