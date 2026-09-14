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

/**
 * Exact 11-page "Chaar Kadam" magazine book matching the user's reference video and Anchor Customs template
 * Contains all 11 high-res pages: Cover -> Inside Spreads -> Back Cover
 */
export const CHAAR_KADAM_BOOK_PAGES: BookPage[] = [
  // Page 1: Standalone Front Cover
  {
    id: 'ck-page-1',
    pageNumber: 1,
    side: 'standalone',
    templateId: 'chaar-kadam-cover',
    title: 'MRUNIRUDH • Forever Edition Vol. 01',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_1.webp',
    photos: [
      {
        id: 'ck-p1-hero',
        label: 'Cover Couple Portrait',
        url: '/templates/chaar-kadam/page_1.webp',
        aspectRatio: '3/4',
        borderStyle: 'none',
      },
    ],
    texts: [
      {
        id: 'ck-p1-masthead',
        type: 'headline',
        content: 'MRUNIRUDH',
        fontFamily: 'serif',
        alignment: 'center',
        color: '#FFFFFF',
      },
      {
        id: 'ck-p1-sub',
        type: 'subheading',
        content: 'FOREVER EDITION • VOL. 01',
        fontFamily: 'sans',
        alignment: 'center',
        color: '#FFFFFF',
      },
      {
        id: 'ck-p1-quote',
        type: 'quote',
        content: "i'll always choose you <3",
        fontFamily: 'serif',
        isItalic: true,
        alignment: 'center',
        color: '#FFFFFF',
      },
    ],
  },

  // Page 2: Inside Front Cover (Left page of Spread 1)
  {
    id: 'ck-page-2',
    pageNumber: 2,
    side: 'left',
    templateId: 'chaar-kadam-inside-cover',
    title: 'Inside Cover',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FFFFFF',
    referenceImage: '/templates/chaar-kadam/page_2.webp',
    photos: [],
    texts: [],
  },

  // Page 3: Right page of Spread 1
  {
    id: 'ck-page-3',
    pageNumber: 3,
    side: 'right',
    templateId: 'chaar-kadam-page-3',
    title: 'TUM SA mile • jo koi REHGUZAR',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_3.webp',
    photos: [
      {
        id: 'ck-p3-1',
        label: 'Boarding Pass & Ribbon Moments',
        url: '/templates/chaar-kadam/page_3.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p3-headline',
        type: 'headline',
        content: 'TUM SA mile jo koi REHGUZAR',
        fontFamily: 'serif',
        color: '#333333',
      },
    ],
  },

  // Page 4: Left page of Spread 2
  {
    id: 'ck-page-4',
    pageNumber: 4,
    side: 'left',
    templateId: 'chaar-kadam-page-4',
    title: 'DUNIYA se कौन DARE',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_4.webp',
    photos: [
      {
        id: 'ck-p4-strip',
        label: 'Photobooth Strip & Camera',
        url: '/templates/chaar-kadam/page_4.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p4-song',
        type: 'headline',
        content: 'DUNIYA se कौन DARE',
        fontFamily: 'serif',
        color: '#111111',
      },
    ],
  },

  // Page 5: Right page of Spread 2
  {
    id: 'ck-page-5',
    pageNumber: 5,
    side: 'right',
    templateId: 'chaar-kadam-page-5',
    title: 'चार क़दम kya saari umar',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_5.webp',
    photos: [
      {
        id: 'ck-p5-photos',
        label: 'Clothesline Polaroids & Scalloped Stamp',
        url: '/templates/chaar-kadam/page_5.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p5-title',
        type: 'headline',
        content: 'चार क़दम kya saari umar',
        fontFamily: 'serif',
        color: '#7E121D',
      },
    ],
  },

  // Page 6: Left page of Spread 3
  {
    id: 'ck-page-6',
    pageNumber: 6,
    side: 'left',
    templateId: 'chaar-kadam-page-6',
    title: 'chal dungi साथ तेरे...',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_6.webp',
    photos: [
      {
        id: 'ck-p6-stamp',
        label: 'Maroon Stamp Frame',
        url: '/templates/chaar-kadam/page_6.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p6-line',
        type: 'headline',
        content: 'chal dungi साथ तेरे...',
        fontFamily: 'serif',
        color: '#111111',
      },
    ],
  },

  // Page 7: Right page of Spread 3
  {
    id: 'ck-page-7',
    pageNumber: 7,
    side: 'right',
    templateId: 'chaar-kadam-page-7',
    title: 'BIN कुछ कहे • BIN कुछ सुने',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_7.webp',
    photos: [
      {
        id: 'ck-p7-coll',
        label: 'Vintage Newspaper & Kiss Mark',
        url: '/templates/chaar-kadam/page_7.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p7-lyrics',
        type: 'headline',
        content: 'BIN कुछ कहे • BIN कुछ सुने',
        fontFamily: 'serif',
        color: '#111111',
      },
    ],
  },

  // Page 8: Left page of Spread 4
  {
    id: 'ck-page-8',
    pageNumber: 8,
    side: 'left',
    templateId: 'chaar-kadam-page-8',
    title: 'haathon mein haath liye',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_8.webp',
    photos: [
      {
        id: 'ck-p8-grid',
        label: 'Puzzle Photo Grid',
        url: '/templates/chaar-kadam/page_8.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p8-title',
        type: 'headline',
        content: 'haathon mein haath liye',
        fontFamily: 'serif',
        color: '#111111',
      },
    ],
  },

  // Page 9: Right page of Spread 4
  {
    id: 'ck-page-9',
    pageNumber: 9,
    side: 'right',
    templateId: 'chaar-kadam-page-9',
    title: 'CHAAR क़दम bas',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_9.webp',
    photos: [
      {
        id: 'ck-p9-env',
        label: 'Red Love Letter Envelope',
        url: '/templates/chaar-kadam/page_9.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p9-text',
        type: 'headline',
        content: 'CHAAR क़दम bas',
        fontFamily: 'serif',
        color: '#111111',
      },
    ],
  },

  // Page 10: Left page of Spread 5
  {
    id: 'ck-page-10',
    pageNumber: 10,
    side: 'left',
    templateId: 'chaar-kadam-page-10',
    title: 'chal do na saath mere <3',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_10.webp',
    photos: [
      {
        id: 'ck-p10-heart',
        label: 'Pixel Heart Cutout',
        url: '/templates/chaar-kadam/page_10.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p10-note',
        type: 'headline',
        content: 'chal do na saath mere <3',
        fontFamily: 'serif',
        color: '#FFFFFF',
      },
    ],
  },

  // Page 11: Right page of Spread 5 (Back Cover)
  {
    id: 'ck-page-11',
    pageNumber: 11,
    side: 'right',
    templateId: 'chaar-kadam-page-11',
    title: 'Back Cover • Rest of Pages in Reels <3',
    theme: 'Chaar Kadam Keepsake',
    backgroundColor: '#8B0D15',
    referenceImage: '/templates/chaar-kadam/page_11.webp',
    photos: [
      {
        id: 'ck-p11-back',
        label: 'Back Cover',
        url: '/templates/chaar-kadam/page_11.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [
      {
        id: 'ck-p11-tag',
        type: 'headline',
        content: 'REST OF THE PAGES ARE SHOWCASED IN OUR REELS <3',
        fontFamily: 'sans',
        alignment: 'center',
        color: '#FFFFFF',
      },
    ],
  },
];

/**
 * Songs Book featuring the user's newly uploaded custom template images:
 * - Page 1: Cover ("MY HOME • Special Edition #123")
 * - Page 2: Blank / Empty Inside Cover (Spread 1 Left)
 * - Page 3: "KOI AUR dooja • kyun MUJHE" (Spread 1 Right)
 * - Page 4: "NA TERE सिवा CHAIYE" (Spread 2 Left)
 * - Page 5: "HAR सफ़र mein mujhe" (Spread 2 Right)
 * - Page 6: "Tu hi रहनुमा chaiye" (Spread 3 Left)
 * - Pages 7-11: Ready for the next uploaded batch
 */
export const SONGS_BOOK_PAGES: BookPage[] = [
  // Page 1: Standalone Front Cover
  {
    id: 'sb-page-1',
    pageNumber: 1,
    side: 'standalone',
    templateId: 'tu-chahiye-cover',
    title: 'MY HOME • Special Edition #123',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/tu-chahiye/page_1.jpg',
    photos: [
      {
        id: 'sb-p1-hero',
        label: 'Cover Couple Portrait',
        url: '/templates/tu-chahiye/page_1.jpg',
        aspectRatio: '3/4',
        borderStyle: 'none',
      },
    ],
    texts: [
      {
        id: 'sb-p1-masthead',
        type: 'headline',
        content: 'MY HOME',
        fontFamily: 'serif',
        alignment: 'center',
        color: '#FFFFFF',
      },
    ],
  },

  // Page 2: Inside Front Cover (Empty / Left of Spread 1)
  {
    id: 'sb-page-2',
    pageNumber: 2,
    side: 'left',
    templateId: 'tu-chahiye-inside-cover',
    title: 'Inside Cover (Empty)',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FFFFFF',
    referenceImage: '/templates/tu-chahiye/page_2.webp',
    photos: [],
    texts: [],
  },

  // Page 3: Right of Spread 1
  {
    id: 'sb-page-3',
    pageNumber: 3,
    side: 'right',
    templateId: 'tu-chahiye-page-3',
    title: 'KOI AUR dooja • kyun MUJHE',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FFFFFF',
    referenceImage: '/templates/tu-chahiye/page_3.jpg',
    photos: [
      {
        id: 'sb-p3-1',
        label: 'KOI AUR dooja Tickets',
        url: '/templates/tu-chahiye/page_3.jpg',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 4: Left of Spread 2
  {
    id: 'sb-page-4',
    pageNumber: 4,
    side: 'left',
    templateId: 'tu-chahiye-page-4',
    title: 'NA TERE सिवा CHAIYE',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FFFFFF',
    referenceImage: '/templates/tu-chahiye/page_4.jpg',
    photos: [
      {
        id: 'sb-p4-1',
        label: 'NA TERE सिवा CHAIYE Filmstrip & Camera',
        url: '/templates/tu-chahiye/page_4.jpg',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 5: Right of Spread 2
  {
    id: 'sb-page-5',
    pageNumber: 5,
    side: 'right',
    templateId: 'tu-chahiye-page-5',
    title: 'HAR सफ़र mein mujhe',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FFFFFF',
    referenceImage: '/templates/tu-chahiye/page_5.jpg',
    photos: [
      {
        id: 'sb-p5-1',
        label: 'HAR सफ़र mein mujhe Stamp Frame',
        url: '/templates/tu-chahiye/page_5.jpg',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 6: Left of Spread 3
  {
    id: 'sb-page-6',
    pageNumber: 6,
    side: 'left',
    templateId: 'tu-chahiye-page-6',
    title: 'Tu hi रहनुमा chaiye',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FFFFFF',
    referenceImage: '/templates/tu-chahiye/page_6.jpg',
    photos: [
      {
        id: 'sb-p6-1',
        label: 'Tu hi रहनुमा chaiye Postage Frame',
        url: '/templates/tu-chahiye/page_6.jpg',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 7: Right of Spread 3 (Awaiting Next Upload Batch)
  {
    id: 'sb-page-7',
    pageNumber: 7,
    side: 'right',
    templateId: 'tu-chahiye-page-7',
    title: 'Page 7 (Upload Slot)',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_7.webp',
    photos: [
      {
        id: 'sb-p7-1',
        label: 'Page 7 Slot',
        url: '/templates/chaar-kadam/page_7.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 8: Left of Spread 4
  {
    id: 'sb-page-8',
    pageNumber: 8,
    side: 'left',
    templateId: 'tu-chahiye-page-8',
    title: 'Page 8 (Upload Slot)',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_8.webp',
    photos: [
      {
        id: 'sb-p8-1',
        label: 'Page 8 Slot',
        url: '/templates/chaar-kadam/page_8.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 9: Right of Spread 4
  {
    id: 'sb-page-9',
    pageNumber: 9,
    side: 'right',
    templateId: 'tu-chahiye-page-9',
    title: 'Page 9 (Upload Slot)',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_9.webp',
    photos: [
      {
        id: 'sb-p9-1',
        label: 'Page 9 Slot',
        url: '/templates/chaar-kadam/page_9.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 10: Left of Spread 5
  {
    id: 'sb-page-10',
    pageNumber: 10,
    side: 'left',
    templateId: 'tu-chahiye-page-10',
    title: 'Page 10 (Upload Slot)',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#FAF8F5',
    referenceImage: '/templates/chaar-kadam/page_10.webp',
    photos: [
      {
        id: 'sb-p10-1',
        label: 'Page 10 Slot',
        url: '/templates/chaar-kadam/page_10.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },

  // Page 11: Right of Spread 5 (Back Cover)
  {
    id: 'sb-page-11',
    pageNumber: 11,
    side: 'right',
    templateId: 'tu-chahiye-page-11',
    title: 'Back Cover',
    theme: 'Tu Chahiye Song Book',
    backgroundColor: '#8B0D15',
    referenceImage: '/templates/chaar-kadam/page_11.webp',
    photos: [
      {
        id: 'sb-p11-1',
        label: 'Back Cover Slot',
        url: '/templates/chaar-kadam/page_11.webp',
        aspectRatio: '3/4',
      },
    ],
    texts: [],
  },
];


