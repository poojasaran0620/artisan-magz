import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MagazinePageContent, MagazinePageSpread } from './MagazinePageSpread';
import { FlipbookControls } from './FlipbookControls';
import { paperSound } from './audio/paperSound';

interface Spread {
  id: string;
  label: string;
  leftPage?: MagazinePageContent;
  rightPage?: MagazinePageContent;
  isCover?: boolean;
  isBackCover?: boolean;
}

interface InteractiveFlipbookProps {
  pages: MagazinePageContent[];
  magazineTitle?: string;
  onCustomizeClick?: () => void;
  autoPlayIntervalMs?: number;
}

export const InteractiveFlipbook: React.FC<InteractiveFlipbookProps> = ({
  pages,
  magazineTitle = 'The Love Chronicle',
  onCustomizeClick,
  autoPlayIntervalMs = 4200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isSinglePageMode, setIsSinglePageMode] = useState(false);
  const [isMuted, setIsMuted] = useState(paperSound.getMuted());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  // Responsive mode detection: < 640px displays single portrait page, >= 640px dual spread
  useEffect(() => {
    const handleResize = () => {
      setIsSinglePageMode(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build spreads structure based on viewport
  const spreads: Spread[] = React.useMemo(() => {
    if (isSinglePageMode) {
      // In single-page mode (mobile), each page is its own spread
      return pages.map((page, idx) => ({
        id: `single-${page.id}`,
        label:
          page.type === 'cover'
            ? 'Cover'
            : page.type === 'backCover'
            ? 'Back Cover'
            : `Page ${idx + 1} of ${pages.length}`,
        rightPage: page,
        isCover: page.type === 'cover',
        isBackCover: page.type === 'backCover',
      }));
    }

    // In dual-spread mode (tablet/desktop)
    const result: Spread[] = [];

    // Front Cover
    if (pages.length > 0) {
      result.push({
        id: 'spread-cover',
        label: 'Front Cover',
        rightPage: pages[0],
        isCover: true,
      });
    }

    // Inside Spreads (pairs: 1-2, 3-4, etc.)
    for (let i = 1; i < pages.length - 1; i += 2) {
      const left = pages[i];
      const right = pages[i + 1] || undefined;
      result.push({
        id: `spread-${i}-${i + 1}`,
        label: `Pages ${left.pageNumber} & ${right ? right.pageNumber : ''}`,
        leftPage: left,
        rightPage: right,
      });
    }

    // Back Cover
    if (pages.length > 1 && pages[pages.length - 1].type === 'backCover') {
      result.push({
        id: 'spread-back',
        label: 'Back Cover',
        leftPage: pages[pages.length - 1],
        isBackCover: true,
      });
    }

    return result;
  }, [pages, isSinglePageMode]);

  // Turn page logic with sound
  const goToNextSpread = useCallback(() => {
    if (currentSpreadIndex < spreads.length - 1) {
      setFlipDirection('next');
      paperSound.playPageFlip();
      setCurrentSpreadIndex((prev) => prev + 1);
      setTimeout(() => setFlipDirection(null), 400);
    } else {
      // Loop back if auto-playing
      if (isAutoPlaying) {
        setFlipDirection('next');
        paperSound.playPageFlip();
        setCurrentSpreadIndex(0);
        setTimeout(() => setFlipDirection(null), 400);
      }
    }
  }, [currentSpreadIndex, spreads.length, isAutoPlaying]);

  const goToPrevSpread = useCallback(() => {
    if (currentSpreadIndex > 0) {
      setFlipDirection('prev');
      paperSound.playPageFlip();
      setCurrentSpreadIndex((prev) => prev - 1);
      setTimeout(() => setFlipDirection(null), 400);
    }
  }, [currentSpreadIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextSpread();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSpread();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSpread, goToPrevSpread]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      goToNextSpread();
    }, autoPlayIntervalMs);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayIntervalMs, goToNextSpread]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const delta = e.touches[0].clientX - touchStartX;
      setTouchDeltaX(delta);
    }
  };

  const handleTouchEnd = () => {
    if (touchDeltaX < -45) {
      goToNextSpread();
    } else if (touchDeltaX > 45) {
      goToPrevSpread();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Sound toggle
  const handleToggleMute = () => {
    const muted = paperSound.toggleMute();
    setIsMuted(muted);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeSpread = spreads[currentSpreadIndex] || spreads[0];

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col items-center justify-center relative transition-all duration-300 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#242424] p-6' : ''
      }`}
    >
      {/* 3D Flipbook Stage Canvas */}
      <div
        className="w-full relative flex items-center justify-center py-4"
        style={{ perspective: '1600px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Physical Drop Shadow & Surface Depth */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
          {/* Magazine Book Container */}
          <div
            className={`relative flex items-center justify-center transition-transform duration-300 ${
              isSinglePageMode
                ? 'w-full max-w-[320px] sm:max-w-[380px] aspect-[3/4.2]'
                : activeSpread.isCover
                ? 'w-full max-w-[360px] sm:max-w-[420px] aspect-[3/4.2] sm:translate-x-1/4'
                : activeSpread.isBackCover
                ? 'w-full max-w-[360px] sm:max-w-[420px] aspect-[3/4.2] sm:-translate-x-1/4'
                : 'w-full max-w-[760px] lg:max-w-[820px] aspect-[1.48/1]'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Ambient Base Shadow underneath the book */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-8 bg-black/25 blur-xl rounded-full pointer-events-none -z-10" />

            {/* SINGLE PAGE VIEW (Mobile) */}
            {isSinglePageMode && activeSpread.rightPage && (
              <div
                className={`w-full h-full relative transition-all duration-300 ${
                  flipDirection === 'next'
                    ? 'animate-slideInRight'
                    : flipDirection === 'prev'
                    ? 'animate-slideInLeft'
                    : ''
                }`}
              >
                <MagazinePageSpread
                  page={activeSpread.rightPage}
                  isSingleView={true}
                  onPageClick={goToNextSpread}
                />
              </div>
            )}

            {/* DUAL SPREAD VIEW (Tablet & Desktop) */}
            {!isSinglePageMode && (
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Left Page (if open spread) */}
                {activeSpread.leftPage ? (
                  <div
                    className="w-1/2 h-full relative origin-right transition-transform duration-400"
                    style={{
                      transformOrigin: 'right center',
                      transform: flipDirection === 'prev' ? 'rotateY(12deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <MagazinePageSpread
                      page={activeSpread.leftPage}
                      isLeftPage={true}
                      onPageClick={goToPrevSpread}
                    />
                  </div>
                ) : (
                  /* Placeholder when single cover is open on right */
                  <div className="w-1/2 h-full hidden" />
                )}

                {/* Right Page (Cover or Right Facing Page) */}
                {activeSpread.rightPage ? (
                  <div
                    className={`h-full relative origin-left transition-transform duration-400 ${
                      activeSpread.isCover ? 'w-full' : 'w-1/2'
                    }`}
                    style={{
                      transformOrigin: 'left center',
                      transform: flipDirection === 'next' ? 'rotateY(-12deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <MagazinePageSpread
                      page={activeSpread.rightPage}
                      isRightPage={!activeSpread.isCover}
                      isSingleView={activeSpread.isCover}
                      onPageClick={goToNextSpread}
                    />
                  </div>
                ) : null}

                {/* Physical Spine Gutter Stitch Simulation (Only for 2-page spreads) */}
                {!activeSpread.isCover && !activeSpread.isBackCover && (
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 z-30 pointer-events-none flex flex-col justify-around items-center">
                    {/* Saddle stitch staples */}
                    <div className="w-1.5 h-6 rounded-sm bg-neutral-400 shadow-sm border border-black/20" />
                    <div className="w-1.5 h-6 rounded-sm bg-neutral-400 shadow-sm border border-black/20" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails Quick Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1.5 px-2 no-scrollbar">
        {spreads.map((spr, idx) => {
          const isActive = currentSpreadIndex === idx;
          const thumbImg = spr.rightPage?.image || spr.leftPage?.image;
          return (
            <button
              key={spr.id}
              type="button"
              onClick={() => {
                paperSound.playPageFlip();
                setCurrentSpreadIndex(idx);
              }}
              className={`relative rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'border-roseGold scale-110 shadow-md ring-2 ring-roseGold/30'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
              } ${isSinglePageMode ? 'w-9 h-12' : 'w-11 h-14'}`}
              title={spr.label}
              aria-label={`Jump to ${spr.label}`}
            >
              {thumbImg && (
                <img src={thumbImg} alt={spr.label} className="w-full h-full object-cover" />
              )}
              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[7px] text-center font-sans font-medium py-0.2 truncate px-0.5">
                {idx === 0 ? 'Cover' : idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Luxury Controls Pill */}
      <FlipbookControls
        currentSpreadIndex={currentSpreadIndex}
        totalSpreads={spreads.length}
        isMuted={isMuted}
        isAutoPlaying={isAutoPlaying}
        isFullscreen={isFullscreen}
        onPrev={goToPrevSpread}
        onNext={goToNextSpread}
        onToggleMute={handleToggleMute}
        onToggleAutoPlay={() => setIsAutoPlaying((prev) => !prev)}
        onToggleFullscreen={handleToggleFullscreen}
        spreadLabel={activeSpread.label}
      />

      {/* Optional Customize CTA if clicked from template preview */}
      {onCustomizeClick && (
        <div className="pt-3">
          <button
            type="button"
            onClick={onCustomizeClick}
            className="px-6 py-2.5 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-full text-xs font-semibold shadow-luxury flex items-center gap-2 transition cursor-pointer"
          >
            <span>Customize "{magazineTitle}" (from ₹899)</span>
          </button>
        </div>
      )}
    </div>
  );
};
