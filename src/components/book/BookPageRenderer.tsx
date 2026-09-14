import React from 'react';
import { BookPage } from '../../types/book';
import { Camera, Music, Sparkles } from 'lucide-react';

interface BookPageRendererProps {
  page: BookPage;
  isEditable?: boolean;
  onPhotoClick?: (photoId: string) => void;
  onTextChange?: (textId: string, newContent: string) => void;
}

export const BookPageRenderer: React.FC<BookPageRendererProps> = ({
  page,
  isEditable = false,
  onPhotoClick,
  onTextChange,
}) => {
  // If user provided an uploaded reference template image for this exact page
  if (page.referenceImage) {
    return (
      <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden flex flex-col justify-between">
        <img
          src={page.referenceImage}
          alt={`Page ${page.pageNumber} Template`}
          className="w-full h-full object-cover select-none"
        />

        {/* Folio */}
        {page.decorations?.showFolio && (
          <div
            className={`absolute bottom-3 px-6 text-[10px] font-sans text-charcoal/60 tracking-wider z-20 ${
              page.side === 'left' ? 'left-0 text-left' : 'right-0 text-right'
            }`}
          >
            <span className="font-mono tabular-nums font-semibold">
              {page.pageNumber < 10 ? `0${page.pageNumber}` : page.pageNumber}
            </span>
            {page.decorations.folioText && (
              <span className="ml-2 uppercase tracking-widest text-[9px] opacity-70">
                • {page.decorations.folioText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 1. STANDALONE COVER (Page 1)
  // ==========================================
  if (page.side === 'standalone' || page.pageNumber === 1) {
    const coverPhoto = page.photos[0];
    const masthead = page.texts.find((t) => t.id === 'p1-text-masthead');
    const sub = page.texts.find((t) => t.id === 'p1-text-sub');
    const title = page.texts.find((t) => t.id === 'p1-text-title');
    const tagline = page.texts.find((t) => t.id === 'p1-text-tagline');
    const date = page.texts.find((t) => t.id === 'p1-text-date');

    return (
      <div className="relative w-full h-full bg-[#1E1B18] text-white flex flex-col justify-between p-6 sm:p-9 select-none overflow-hidden group">
        {/* Cover Background Photo */}
        {coverPhoto && (
          <>
            <img
              src={coverPhoto.url}
              alt="Cover Hero"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82] contrast-[1.08] transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60 pointer-events-none" />
          </>
        )}

        {/* Paper Grain Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.04] pointer-events-none z-10" />

        {/* Top Masthead */}
        <div className="relative z-20 text-center space-y-1 pt-2">
          {sub && (
            <p className="text-[10px] sm:text-xs font-sans font-bold tracking-[0.3em] uppercase text-roseGold-light">
              {sub.content}
            </p>
          )}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[0.25em] text-[#FDFCF5] drop-shadow-lg leading-none">
            {masthead?.content || 'ARTISAN'}
          </h1>
          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="h-[1px] w-12 bg-roseGold/60" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-roseGold-light font-semibold">
              KEEPSAKE MAGAZINE
            </span>
            <span className="h-[1px] w-12 bg-roseGold/60" />
          </div>
        </div>

        {/* Center / Bottom Editorial Highlights */}
        <div className="relative z-20 space-y-4 pb-2">
          <div className="inline-flex items-center gap-2 bg-charcoal/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-roseGold animate-pulse" />
            <span className="text-[10px] font-sans uppercase tracking-widest font-bold text-roseGold-light">
              Collector Edition • 01
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif italic text-2xl sm:text-4xl text-[#FDFCF5] drop-shadow-md leading-tight">
              {title?.content || 'The Day Forever Began'}
            </h2>
            {tagline && (
              <p className="text-xs sm:text-sm text-[#FDFCF5]/85 font-sans font-medium tracking-wide">
                {tagline.content}
              </p>
            )}
          </div>

          {date && (
            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-mono text-cream-200">
              <span>{date.content}</span>
              <span className="tracking-widest uppercase text-[10px] text-roseGold-light">Volume IV</span>
            </div>
          )}

          {isEditable && (
            <div className="pt-2">
              <button
                onClick={() => onPhotoClick && onPhotoClick(coverPhoto?.id || 'cover')}
                className="inline-flex items-center gap-1.5 bg-roseGold text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-soft hover:bg-roseGold-dark transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Replace Cover Photo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. INTERIOR PAGES (Pages 2, 3, 4, 5...)
  // ==========================================
  return (
    <div className="relative w-full h-full bg-[#FAF8F5] text-charcoal flex flex-col justify-between p-6 sm:p-9 select-none overflow-hidden">
      {/* Paper Micro-Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#333333_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.025] pointer-events-none z-10" />

      {/* Running Header */}
      <div
        className={`relative z-20 pb-3 border-b border-taupe-200/80 flex items-center justify-between text-[10px] font-sans tracking-widest uppercase text-charcoal/60`}
      >
        <span className="font-serif italic text-xs text-charcoal/80">Artisan Magz</span>
        <span className="text-[9px] text-roseGold font-semibold">
          {page.theme || `Volume IV • Page ${page.pageNumber}`}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-center py-4 space-y-4">
        {/* Template: Chapter Editorial (Page 2 & 4) */}
        {page.templateId.includes('editorial') || page.templateId.includes('vows') ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-roseGold block">
                {page.texts.find((t) => t.type === 'subheading')?.content || 'CHAPTER ARCHIVE'}
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-charcoal leading-tight">
                {page.texts.find((t) => t.type === 'headline')?.content || page.title}
              </h3>
            </div>

            {/* Editorial Photo */}
            {page.photos[0] && (
              <div className="relative rounded-2xl overflow-hidden shadow-soft border border-taupe-200/80 group">
                <img
                  src={page.photos[0].url}
                  alt={page.title || 'Editorial Image'}
                  className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {page.photos[0].caption && (
                  <div className="p-2 bg-white/90 backdrop-blur-xs text-[10px] font-sans text-charcoal/70 border-t border-taupe-100">
                    {page.photos[0].caption}
                  </div>
                )}
                {isEditable && (
                  <button
                    onClick={() => onPhotoClick && onPhotoClick(page.photos[0].id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer shadow-xs"
                    title="Change Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Story & Quote */}
            <p className="font-sans text-xs sm:text-sm text-charcoal/80 leading-relaxed text-justify">
              {page.texts.find((t) => t.type === 'body')?.content}
            </p>

            {page.texts.find((t) => t.type === 'quote') && (
              <div className="p-3 bg-cream-100/70 border-l-2 border-roseGold rounded-r-xl">
                <p className="font-serif italic text-xs sm:text-sm text-charcoal">
                  {page.texts.find((t) => t.type === 'quote')?.content}
                </p>
              </div>
            )}
          </div>
        ) : page.templateId.includes('collage') ? (
          /* Template: Snapshots / Collage (Page 3) */
          <div className="space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal leading-tight">
              {page.texts.find((t) => t.type === 'headline')?.content || page.title}
            </h3>

            <p className="font-sans text-xs text-charcoal/75 leading-relaxed">
              {page.texts.find((t) => t.type === 'body')?.content}
            </p>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-3">
              {page.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white p-2 rounded-xl shadow-soft border border-taupe-200/80 space-y-1.5 group relative"
                >
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={photo.url}
                      alt={photo.label || 'Snapshot'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {photo.caption && (
                    <p className="text-[9px] font-sans text-charcoal/60 truncate text-center">
                      {photo.caption}
                    </p>
                  )}
                  {isEditable && (
                    <button
                      onClick={() => onPhotoClick && onPhotoClick(photo.id)}
                      className="absolute top-3 right-3 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center pt-1">
              <span className="text-[10px] font-sans font-medium text-roseGold">
                {page.texts.find((t) => t.type === 'caption')?.content}
              </span>
            </div>
          </div>
        ) : (
          /* Template: Soundtrack / Vinyl (Page 5) */
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-roseGold" />
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-roseGold">
                {page.texts.find((t) => t.type === 'subheading')?.content || 'SOUNDTRACK OF US'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-soft border border-taupe-200/80 flex items-center gap-4">
              {page.photos[0] && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 shadow-xs">
                  <img
                    src={page.photos[0].url}
                    alt="Album Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <h4 className="font-serif text-lg sm:text-xl font-bold text-charcoal truncate">
                  {page.texts.find((t) => t.type === 'headline')?.content || 'Chaar Kadam'}
                </h4>
                <p className="text-[11px] font-mono text-charcoal/70 truncate">
                  {page.texts.find((t) => t.type === 'caption')?.content}
                </p>
                <div className="flex items-center gap-1 pt-1 text-[10px] text-roseGold font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Favorite Melody</span>
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-charcoal/80 leading-relaxed">
              {page.texts.find((t) => t.type === 'body')?.content}
            </p>
          </div>
        )}
      </div>

      {/* Running Folio / Page Number on Outer Bottom Margin */}
      <div
        className={`relative z-20 pt-3 border-t border-taupe-200/60 flex items-center justify-between text-[10px] font-sans text-charcoal/60 ${
          page.side === 'left' ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <span className="font-mono font-bold tabular-nums text-xs text-charcoal">
          {page.pageNumber < 10 ? `0${page.pageNumber}` : page.pageNumber}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-charcoal/50">
          {page.decorations?.folioText || 'ARTISAN MAGZ STUDIO'}
        </span>
      </div>
    </div>
  );
};
