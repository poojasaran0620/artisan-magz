import type { BookPage, BookSpread } from '../types/book.ts';

/**
 * Builds physical book spreads according to the strict publishing rules:
 * - Page 1 is a standalone single page (Front Cover)
 * - Pages 2–3 form a side-by-side two-page spread
 * - Pages 4–5 form the next side-by-side two-page spread
 * - Continues throughout the entire book.
 */
export function buildBookSpreads(pages: BookPage[]): BookSpread[] {
  if (!pages || pages.length === 0) return [];

  const spreads: BookSpread[] = [];

  // Spread 0: Page 1 as standalone single page
  spreads.push({
    id: 'spread-1',
    spreadIndex: 0,
    type: 'single',
    label: 'Page 1 (Cover)',
    subtitle: pages[0]?.title || 'Front Cover',
    rightPage: pages[0],
  });

  // Dual Spreads: Pages 2–3, 4–5, 6–7, etc.
  let spreadIndex = 1;
  for (let i = 1; i < pages.length; i += 2) {
    const left = pages[i];
    const right = pages[i + 1];

    if (right) {
      spreads.push({
        id: `spread-${left.pageNumber}-${right.pageNumber}`,
        spreadIndex,
        type: 'dual',
        label: `Pages ${left.pageNumber}–${right.pageNumber}`,
        subtitle: `${left.title || `Page ${left.pageNumber}`} & ${right.title || `Page ${right.pageNumber}`}`,
        leftPage: left,
        rightPage: right,
      });
    } else {
      // Standalone trailing page (e.g., Back Cover when total pages is even + 1)
      spreads.push({
        id: `spread-${left.pageNumber}`,
        spreadIndex,
        type: 'single',
        label: `Page ${left.pageNumber} (Back Cover)`,
        subtitle: left.title || 'Back Cover',
        leftPage: left,
      });
    }
    spreadIndex++;
  }

  return spreads;
}

/**
 * Initial 5-page book template collection ready for user reference template uploads
 */
export const INITIAL_5_PAGE_BOOK: BookPage[] = [
  // ==========================================
  // PAGE 1: Standalone Front Cover
  // ==========================================
  {
    id: 'page-1',
    pageNumber: 1,
    side: 'standalone',
    templateId: 'tpl-cover-classic',
    title: 'The Day Forever Began',
    theme: 'Artisan Keepsake Edition',
    backgroundColor: '#1E1B18',
    decorations: {
      showFolio: false,
      borderAccent: true,
      vignette: true,
    },
    photos: [
      {
        id: 'p1-photo-1',
        label: 'Hero Cover Portrait',
        url: '/products/magazine_vogue_cover.jpg',
        aspectRatio: '3/4',
        borderStyle: 'classic',
      },
    ],
    texts: [
      {
        id: 'p1-text-masthead',
        type: 'headline',
        content: 'ARTISAN',
        fontFamily: 'serif',
        isItalic: false,
        letterSpacing: '0.3em',
        alignment: 'center',
        color: '#FDFCF5',
      },
      {
        id: 'p1-text-sub',
        type: 'subheading',
        content: 'BESPOKE EDITION • VOLUME IV',
        fontFamily: 'sans',
        letterSpacing: '0.25em',
        alignment: 'center',
        color: '#E8CCD1',
      },
      {
        id: 'p1-text-title',
        type: 'quote',
        content: 'The Day Forever Began',
        fontFamily: 'serif',
        isItalic: true,
        alignment: 'center',
        color: '#FDFCF5',
      },
      {
        id: 'p1-text-tagline',
        type: 'caption',
        content: 'Artfully made for your moments',
        fontFamily: 'sans',
        alignment: 'center',
        color: '#FAF8F5',
      },
      {
        id: 'p1-text-date',
        type: 'date',
        content: 'EST. 14 FEBRUARY 2021',
        fontFamily: 'mono',
        alignment: 'center',
        color: '#D4C9B0',
      },
    ],
  },

  // ==========================================
  // PAGE 2: Left Page of Spread 1
  // ==========================================
  {
    id: 'page-2',
    pageNumber: 2,
    side: 'left',
    templateId: 'tpl-editorial-left',
    title: 'How It All Began',
    theme: 'Chapter 01: The First Spark',
    backgroundColor: '#FAF8F5',
    decorations: {
      showFolio: true,
      folioText: 'ARTISAN MAGZ • CHAPTER 01',
    },
    photos: [
      {
        id: 'p2-photo-1',
        label: 'First Encounter Portrait',
        url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '4/5',
        caption: 'Mumbai, Monsoon 2021 • Under the umbrella',
        borderStyle: 'polaroid',
      },
    ],
    texts: [
      {
        id: 'p2-text-ch',
        type: 'subheading',
        content: 'CHAPTER 01',
        fontFamily: 'sans',
        letterSpacing: '0.2em',
        color: '#B76E79',
      },
      {
        id: 'p2-text-headline',
        type: 'headline',
        content: 'How It All Began',
        fontFamily: 'serif',
        isItalic: true,
        color: '#333333',
      },
      {
        id: 'p2-text-story',
        type: 'body',
        content:
          'We started as two strangers sharing an umbrella in Mumbai monsoon. Three years later, we have visited 14 cities, adopted a puppy named Oreo, and built a home out of memories.',
        fontFamily: 'sans',
        alignment: 'justify',
        color: '#4A4A4A',
      },
      {
        id: 'p2-text-quote',
        type: 'quote',
        content: '"In all the world, there is no heart for me like yours."',
        fontFamily: 'serif',
        isItalic: true,
        color: '#B76E79',
      },
    ],
  },

  // ==========================================
  // PAGE 3: Right Page of Spread 1
  // ==========================================
  {
    id: 'page-3',
    pageNumber: 3,
    side: 'right',
    templateId: 'tpl-collage-right',
    title: 'Our Favorite Snapshots',
    theme: 'Candid Gallery',
    backgroundColor: '#FAF8F5',
    decorations: {
      showFolio: true,
      folioText: 'MOMENTS & MEMORIES',
    },
    photos: [
      {
        id: 'p3-photo-1',
        label: 'Weekend Road Trip',
        url: '/products/media_1788608467332.jpg',
        aspectRatio: '1/1',
        caption: 'Spontaneous getaway to Lonavala',
        borderStyle: 'polaroid',
      },
      {
        id: 'p3-photo-2',
        label: 'Golden Hour Laughs',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '1/1',
        caption: 'Laughing until our stomachs hurt',
        borderStyle: 'polaroid',
      },
    ],
    texts: [
      {
        id: 'p3-text-headline',
        type: 'headline',
        content: 'Our Favorite Snapshots',
        fontFamily: 'serif',
        isItalic: false,
        color: '#333333',
      },
      {
        id: 'p3-text-desc',
        type: 'body',
        content:
          'Polaroids captured in between quiet mornings, noisy airport terminals, and Sunday pancakes. Every snapshot holds a secret only the two of us understand.',
        fontFamily: 'sans',
        color: '#4A4A4A',
      },
      {
        id: 'p3-text-caption',
        type: 'caption',
        content: 'Archival Matte Print Stock • High-Pigment Inks',
        fontFamily: 'sans',
        color: '#7B6E57',
      },
    ],
  },

  // ==========================================
  // PAGE 4: Left Page of Spread 2
  // ==========================================
  {
    id: 'page-4',
    pageNumber: 4,
    side: 'left',
    templateId: 'tpl-vows-left',
    title: 'The Unwritten Vows',
    theme: 'Chapter 02: Promises',
    backgroundColor: '#FAF8F5',
    decorations: {
      showFolio: true,
      folioText: 'ARTISAN MAGZ • CHAPTER 02',
    },
    photos: [
      {
        id: 'p4-photo-1',
        label: 'Hand in Hand Portrait',
        url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '3/4',
        borderStyle: 'classic',
      },
    ],
    texts: [
      {
        id: 'p4-text-ch',
        type: 'subheading',
        content: 'CHAPTER 02',
        fontFamily: 'sans',
        letterSpacing: '0.2em',
        color: '#B76E79',
      },
      {
        id: 'p4-text-headline',
        type: 'headline',
        content: 'The Unwritten Vows',
        fontFamily: 'serif',
        isItalic: true,
        color: '#333333',
      },
      {
        id: 'p4-text-body',
        type: 'body',
        content:
          'I promise to never steal your fries (unless they look extra crispy), to hold your hand through turbulent flights, and to always remind you how radiant you are even on chaotic Mondays.',
        fontFamily: 'sans',
        alignment: 'justify',
        color: '#4A4A4A',
      },
      {
        id: 'p4-text-quote',
        type: 'quote',
        content: '"Forever feels too short when it is with you."',
        fontFamily: 'serif',
        isItalic: true,
        color: '#B76E79',
      },
    ],
  },

  // ==========================================
  // PAGE 5: Right Page of Spread 2
  // ==========================================
  {
    id: 'page-5',
    pageNumber: 5,
    side: 'right',
    templateId: 'tpl-soundtrack-right',
    title: 'Soundtrack of Us',
    theme: 'Our Melody',
    backgroundColor: '#FAF8F5',
    decorations: {
      showFolio: true,
      folioText: 'THE VINYL ARCHIVE',
    },
    photos: [
      {
        id: 'p5-photo-1',
        label: 'Vinyl Memory',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '1/1',
        borderStyle: 'classic',
      },
    ],
    texts: [
      {
        id: 'p5-text-tag',
        type: 'subheading',
        content: 'OUR SPECIAL ANTHEM',
        fontFamily: 'sans',
        letterSpacing: '0.25em',
        color: '#B76E79',
      },
      {
        id: 'p5-text-song',
        type: 'headline',
        content: 'Chaar Kadam',
        fontFamily: 'serif',
        isItalic: false,
        color: '#333333',
      },
      {
        id: 'p5-text-artist',
        type: 'caption',
        content: 'Shaan & Shreya Ghoshal • 03:42',
        fontFamily: 'mono',
        color: '#7B6E57',
      },
      {
        id: 'p5-text-note',
        type: 'body',
        content:
          'The song that played on the radio during our first road trip. Every time the opening flute chords play, we are instantly transported back to that starry highway.',
        fontFamily: 'sans',
        color: '#4A4A4A',
      },
    ],
  },
];
