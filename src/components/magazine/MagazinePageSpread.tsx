import React from 'react';

export interface MagazinePageContent {
  id: string;
  pageNumber: number;
  type: 'cover' | 'editorial' | 'collage' | 'timeline' | 'spotify' | 'backCover';
  title?: string;
  subtitle?: string;
  tagline?: string;
  image: string;
  quote?: string;
  caption?: string;
  date?: string;
  songTitle?: string;
  artist?: string;
}

interface MagazinePageSpreadProps {
  page: MagazinePageContent;
  isLeftPage?: boolean;
  isRightPage?: boolean;
  isSingleView?: boolean;
  onPageClick?: () => void;
}

export const MagazinePageSpread: React.FC<MagazinePageSpreadProps> = ({
  page,
  isLeftPage = false,
  isRightPage = false,
  isSingleView = false,
  onPageClick,
}) => {
  return (
    <div
      onClick={onPageClick}
      className={`relative w-full h-full select-none overflow-hidden bg-[#FFFDF9] flex flex-col justify-between cursor-pointer transition-shadow duration-300 ${
        isLeftPage ? 'rounded-l-2xl sm:border-r border-taupe-200/40' : ''
      } ${
        isRightPage ? 'rounded-r-2xl sm:border-l border-taupe-200/40' : ''
      } ${
        isSingleView ? 'rounded-2xl shadow-luxury' : ''
      }`}
      style={{
        boxShadow: isLeftPage
          ? 'inset -14px 0 20px -8px rgba(0, 0, 0, 0.08), -6px 10px 24px -4px rgba(0, 0, 0, 0.12)'
          : isRightPage
          ? 'inset 14px 0 20px -8px rgba(0, 0, 0, 0.08), 6px 10px 24px -4px rgba(0, 0, 0, 0.12)'
          : '0 16px 36px -6px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Authentic subtle paper grain texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#333333_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.02] pointer-events-none z-10" />

      {/* Center Spine Gutter Shading for Physical Magazine Depth */}
      {isLeftPage && (
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-20" />
      )}
      {isRightPage && (
        <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-20" />
      )}

      {/* FRONT COVER */}
      {page.type === 'cover' && (
        <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 text-white overflow-hidden">
          <img
            src={page.image}
            alt={page.title || 'Magazine Cover'}
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.88] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 z-0" />

          {/* Masthead */}
          <div className="relative z-10 text-center pt-2">
            <span className="text-[10px] tracking-[0.32em] uppercase font-bold text-roseGold-light block mb-1">
              Bespoke Edition • Volume IV
            </span>
            <h2 className="font-logo text-4xl sm:text-5xl md:text-6xl tracking-wider text-[#FDFCF5] drop-shadow-md">
              ARTISAN
            </h2>
            <span className="text-[9px] tracking-[0.4em] uppercase text-roseGold-light/90 block -mt-1 font-semibold">
              The Keepsake Magazine
            </span>
          </div>

          {/* Cover Features */}
          <div className="relative z-10 space-y-3 pb-3">
            <div className="inline-flex items-center gap-2 bg-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-roseGold animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-roseGold-light">
                Exclusive Issue
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal leading-tight text-[#FDFCF5] drop-shadow">
              {page.title || 'The Day Forever Began'}
            </h3>
            {page.subtitle && (
              <p className="text-xs text-[#FDFCF5]/85 line-clamp-2 leading-relaxed">
                {page.subtitle}
              </p>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px] text-[#FDFCF5]/70 font-mono">
              <span>{page.date || 'Est. 2024'}</span>
              <span>Glossy Foil Print</span>
            </div>
          </div>
        </div>
      )}

      {/* EDITORIAL / INTERVIEW SPREAD */}
      {page.type === 'editorial' && (
        <div className="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between text-charcoal">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-taupe-200 pb-2 text-[9px] uppercase tracking-widest text-taupe-600 font-semibold">
            <span>Artisan Magz • Love Chronicles</span>
            <span>Pg. {page.pageNumber}</span>
          </div>

          {/* Content */}
          <div className="my-auto space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-roseGold font-bold">
              Feature Story
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal leading-snug">
              {page.title || 'How Our World Fell Into Place'}
            </h3>

            <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-soft border border-taupe-200/50 bg-cream-100">
              <img
                src={page.image}
                alt={page.title || 'Story'}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-charcoal/80 leading-relaxed font-sans line-clamp-3 sm:line-clamp-4">
              {page.caption ||
                'From awkward first conversations to finishing each other’s thoughts, every milestone felt effortlessly destined. Here is our story commemorated in archival velvet pages.'}
            </p>

            {page.quote && (
              <blockquote className="font-serif italic text-xs text-roseGold border-l-2 border-roseGold pl-3 my-2">
                "{page.quote}"
              </blockquote>
            )}
          </div>

          {/* Footer note */}
          <div className="border-t border-taupe-200 pt-2 flex items-center justify-between text-[9px] text-taupe-500">
            <span>Archival Velvet 300 GSM</span>
            <span>Artisan Studio</span>
          </div>
        </div>
      )}

      {/* COLLAGE SPREAD */}
      {page.type === 'collage' && (
        <div className="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between text-charcoal">
          <div className="flex items-center justify-between border-b border-taupe-200 pb-2 text-[9px] uppercase tracking-widest text-taupe-600 font-semibold">
            <span>Snapshot Collage</span>
            <span>Pg. {page.pageNumber}</span>
          </div>

          <div className="my-auto space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-soft border border-white bg-cream-100 p-1">
                  <img src={page.image} alt="Collage 1" className="w-full h-full object-cover rounded-lg" />
                </div>
                <p className="text-[9px] font-script text-roseGold italic text-center">
                  "Our favorite sunset"
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-2 p-1">
                <span className="text-[9px] uppercase tracking-widest text-roseGold font-bold">
                  Memories Reel
                </span>
                <h4 className="font-serif text-sm font-bold text-charcoal leading-snug">
                  {page.title || '1,000 Days of Smiles'}
                </h4>
                <p className="text-[10px] text-charcoal/70 leading-relaxed">
                  Your customized captions and photo stories are elegantly formatted by our studio artists.
                </p>
                <div className="pt-1">
                  <span className="text-[8px] bg-blush-100 text-charcoal px-2 py-0.5 rounded-full font-semibold">
                    ✨ High-Def Print
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-taupe-200 pt-2 text-center text-[9px] text-taupe-500">
            Artisan Magz Keepsake Album
          </div>
        </div>
      )}

      {/* SPOTIFY DEDICATION SPREAD */}
      {page.type === 'spotify' && (
        <div className="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-[#252525] via-charcoal to-[#181818] text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[9px] uppercase tracking-widest text-roseGold-light/80">
            <span>Soundtrack of Us</span>
            <span>Pg. {page.pageNumber}</span>
          </div>

          <div className="my-auto text-center space-y-3 py-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
              <img src={page.image} alt="Album Art" className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="text-[10px] text-roseGold-light uppercase tracking-wider font-bold">
                Special Dedication Track
              </span>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#FDFCF5] mt-0.5">
                {page.songTitle || 'Chaar Kadam • PK'}
              </h4>
              <p className="text-[11px] text-white/70">{page.artist || 'Shaan & Shreya Ghoshal'}</p>
            </div>

            {/* Soundwave representation */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 max-w-[200px] mx-auto border border-white/15 space-y-1.5">
              <div className="flex items-center justify-center gap-1 h-6">
                {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95, 65, 80, 50, 75, 40].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-sage rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[8px] tracking-wider text-roseGold-light uppercase block">
                Camera Scannable Spotify Code
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 text-center text-[9px] text-white/50">
            Scan with Spotify App to Play
          </div>
        </div>
      )}

      {/* BACK COVER */}
      {page.type === 'backCover' && (
        <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#F7F4EB] text-charcoal border-l-2 border-taupe-300/40">
          <div className="text-center pt-4">
            <span className="text-[10px] uppercase tracking-widest text-taupe-600 font-bold">
              Artisan Magz Studio
            </span>
            <p className="font-serif italic text-sm text-roseGold mt-1">
              "To Many More Unwritten Chapters"
            </p>
          </div>

          <div className="my-auto text-center space-y-3">
            <div className="w-16 h-16 rounded-full mx-auto bg-white p-1 border border-taupe-200 shadow-luxury overflow-hidden">
              <img src="/artisan_logo_horizontal.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-charcoal/80 max-w-xs mx-auto leading-relaxed">
              Hand-assembled with 300 GSM Velvet Paper, hot-wax stamped seal, and boundless love.
            </p>
          </div>

          {/* Barcode & Issue Info */}
          <div className="border-t border-taupe-200 pt-3 flex items-center justify-between text-[9px] text-taupe-500 font-mono">
            <span>ISBN 978-ARTISAN-01</span>
            <span>INDIA</span>
          </div>
        </div>
      )}
    </div>
  );
};
