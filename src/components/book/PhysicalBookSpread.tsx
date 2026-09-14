import React from 'react';
import { BookSpread } from '../../types/book';
import { BookPageRenderer } from './BookPageRenderer';

interface PhysicalBookSpreadProps {
  spread: BookSpread;
  isEditable?: boolean;
  onPhotoClick?: (photoId: string) => void;
  onTextChange?: (textId: string, newContent: string) => void;
}

export const PhysicalBookSpread: React.FC<PhysicalBookSpreadProps> = ({
  spread,
  isEditable = false,
  onPhotoClick,
  onTextChange,
}) => {
  // ==========================================
  // 1. STANDALONE COVER SPREAD (Page 1)
  // ==========================================
  if (spread.type === 'single' && spread.rightPage) {
    const page = spread.rightPage;
    return (
      <div className="flex items-center justify-center w-full py-4 sm:py-8 select-none">
        <div
          className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] aspect-[1/1.38] rounded-r-2xl rounded-l-md overflow-hidden bg-[#FAF8F5] transition-transform duration-500 hover:scale-[1.01]"
          style={{
            boxShadow:
              '16px 24px 50px -10px rgba(0, 0, 0, 0.4), inset -4px 0 10px rgba(0, 0, 0, 0.05), inset 6px 0 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Left Spine Thickness / Wrap */}
          <div className="absolute top-0 bottom-0 left-0 w-5 sm:w-6 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none z-30" />
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/25 pointer-events-none z-30" />

          {/* Right Paper Stack Thickness (Simulating pages beneath the cover) */}
          <div className="absolute top-0 bottom-0 right-0 w-[5px] bg-[#EAE4DC] border-l border-[#D8D0C5] pointer-events-none z-30" />

          {/* Render Page 1 */}
          <BookPageRenderer
            page={page}
            isEditable={isEditable}
            onPhotoClick={onPhotoClick}
            onTextChange={onTextChange}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. DUAL TWO-PAGE SPREAD (Pages 2–3, 4–5, etc.)
  // ==========================================
  const leftPage = spread.leftPage;
  const rightPage = spread.rightPage;

  return (
    <div className="flex items-center justify-center w-full py-4 sm:py-8 select-none">
      <div
        className="relative w-full max-w-[840px] sm:max-w-[960px] lg:max-w-[1040px] aspect-[2/1.38] grid grid-cols-2 rounded-2xl overflow-hidden bg-[#FAF8F5]"
        style={{
          boxShadow:
            '0 28px 60px -12px rgba(0, 0, 0, 0.35), 0 12px 28px -6px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* ================= LEFT PAGE ================= */}
        <div
          className="relative w-full h-full overflow-hidden rounded-l-2xl"
          style={{
            boxShadow: 'inset -16px 0 24px -10px rgba(0, 0, 0, 0.18)',
          }}
        >
          {/* Left Page Stack Edge */}
          <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-[#EAE4DC] border-r border-[#D8D0C5] pointer-events-none z-30" />

          {/* Center Spine Valley Gutter Shadow (Right edge of left page) */}
          <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-black/30 via-black/10 to-transparent pointer-events-none z-30" />

          {/* Left Page Subtle Curvature Highlight */}
          <div className="absolute top-0 bottom-0 right-12 sm:right-16 w-8 bg-gradient-to-l from-white/10 to-transparent pointer-events-none z-20" />

          {leftPage ? (
            <BookPageRenderer
              page={leftPage}
              isEditable={isEditable}
              onPhotoClick={onPhotoClick}
              onTextChange={onTextChange}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/40 font-serif italic">
              Blank Page
            </div>
          )}
        </div>

        {/* ================= CENTER BINDING SEAM ================= */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/40 z-40 pointer-events-none shadow-sm" />

        {/* ================= RIGHT PAGE ================= */}
        <div
          className="relative w-full h-full overflow-hidden rounded-r-2xl"
          style={{
            boxShadow: 'inset 16px 0 24px -10px rgba(0, 0, 0, 0.18)',
          }}
        >
          {/* Center Spine Valley Gutter Shadow (Left edge of right page) */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-30" />

          {/* Right Page Subtle Curvature Highlight */}
          <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-8 bg-gradient-to-r from-white/10 to-transparent pointer-events-none z-20" />

          {/* Right Page Stack Edge */}
          <div className="absolute top-0 bottom-0 right-0 w-[4px] bg-[#EAE4DC] border-l border-[#D8D0C5] pointer-events-none z-30" />

          {rightPage ? (
            <BookPageRenderer
              page={rightPage}
              isEditable={isEditable}
              onPhotoClick={onPhotoClick}
              onTextChange={onTextChange}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/40 font-serif italic">
              Blank Page
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
