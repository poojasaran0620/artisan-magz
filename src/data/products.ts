import type { Product, HamperGoodie, HamperBoxOption, Review, StoryHighlight, MagazineTemplate } from '../types/product.ts';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-mag-01',
    slug: 'personalized-custom-magazine',
    title: 'The Love Chronicle: Bespoke Custom Magazine',
    subtitle: 'A high-fashion glossy magazine featuring your love story or birthday star',
    category: 'magazine',
    basePrice: 899,
    originalPrice: 1299,
    rating: 4.9,
    reviewCount: 384,
    badge: 'Best Seller 🔥',
    images: [
      '/products/magazine_vogue_cover.jpg',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
      '/products/media_1788608467332.jpg',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Transform your cherished memories into an editorial-grade keepsake. Styled like Vogue or Kinfolk, printed on 300 GSM velvety soft-touch matte paper with gold foil accents on the cover. Perfect for romantic anniversaries, milestone 18th/21st/30th birthdays, wedding retrospectives, or bestie appreciation!',
    variants: [
      {
        id: 'mag-8p',
        name: '8 Pages Mini Edition',
        price: 899,
        originalPrice: 1299,
        description: 'Cozy highlight reel. Perfect for dating milestones or sweet birthdays.',
        recommendedPhotos: 8
      },
      {
        id: 'mag-12p',
        name: '12 Pages Classic Edition',
        price: 1199,
        originalPrice: 1599,
        description: 'Our most popular choice! Ample space for timeline milestones and heartfelt letters.',
        recommendedPhotos: 12
      },
      {
        id: 'mag-16p',
        name: '16 Pages Storybook Edition',
        price: 1499,
        originalPrice: 1999,
        description: 'Complete retrospective with interview Q&As, timeline maps, and photo collages.',
        recommendedPhotos: 16
      },
      {
        id: 'mag-20p',
        name: '20 Pages Collector Heirloom',
        price: 1799,
        originalPrice: 2499,
        description: 'Luxury hardbound feel with custom Spotify scan code and full photo spreads.',
        recommendedPhotos: 20
      }
    ],
    whatsIncluded: [
      'Bespoke printed magazine with full-color HD photographic print',
      'Velvet-touch anti-scratch laminated cover',
      'Custom Spotify QR code dedication plaque sticker',
      'Sealed in parchment paper with an authentic wax seal stamp',
      'Studio presentation envelope with satin ribbon bow'
    ],
    thingsRequired: [
      'Photos matching the page count (8 to 20 high-res photos)',
      'Cover headline & Subtitle (e.g. "The Girl Who Won My Heart")',
      'Occasion / Date (e.g. "Celebrating 5 Years • Oct 2024")',
      'Personal story, letter, or sweet memories (100–300 words)',
      'Optional: Your favorite couple track on Spotify'
    ],
    dispatchesIn: '3 - 4 Business Days',
    deliveryTimeline: 'Delivery in 5 - 7 days nationwide with express tracking',
    features: [
      '300 GSM Archival Velvet Paper',
      'Foil-stamped Cover Accents',
      'Editorial Layout Designed by Pro Designers',
      'Free Digital PDF Preview Before Printing'
    ]
  },
  {
    id: 'prod-frame-01',
    slug: 'personalized-aesthetic-frames',
    title: 'Heirloom Playing Card Collage & Memory Frame',
    subtitle: 'Trending "How Lucky Are We?" playing card collage & polaroid frames',
    category: 'frame',
    basePrice: 599,
    originalPrice: 899,
    rating: 4.95,
    reviewCount: 512,
    badge: 'Customer Favorite 💖',
    images: [
      '/products/playing_cards_frame.jpg',
      '/products/media_1788608467332.jpg',
      '/products/media_1788608467334.jpg',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Capture time in its most charming form. Choose our viral "How Lucky Are We?" 9-card playing collage or our signature elevated polaroid memory frame, handcrafted from solid pinewood with shatterproof crystal glass.',
    variants: [
      {
        id: 'frame-mini',
        name: 'Mini Desktop Frame (4x4 inches)',
        price: 599,
        originalPrice: 899,
        description: 'Ultra-cute square frame with easel stand, ideal for work desks and bedside tables.',
        recommendedPhotos: 1
      },
      {
        id: 'frame-6x8',
        name: 'Medium Keepsake (6x8 inches)',
        price: 799,
        originalPrice: 1099,
        description: 'Compact yet striking, includes both wall hook and desktop strut.',
        recommendedPhotos: 4
      },
      {
        id: 'frame-8x10',
        name: 'Classic Gallery (8x10 inches)',
        price: 1099,
        originalPrice: 1499,
        description: 'Our top seller! Perfect for 9-photo polaroid grids with cutout overlays.',
        recommendedPhotos: 9
      },
      {
        id: 'frame-a4',
        name: 'Statement A4 (8.3x11.7 inches)',
        price: 1399,
        originalPrice: 1899,
        description: 'Grand presentation frame with premium deep border and museum matting.',
        recommendedPhotos: 12
      },
      {
        id: 'frame-a3',
        name: 'Grand Exhibition A3 (11.7x16.5 inches)',
        price: 1899,
        originalPrice: 2499,
        description: 'Large-scale museum centerpiece frame with dual mounting for living spaces.',
        recommendedPhotos: 16
      }
    ],
    whatsIncluded: [
      'Handmade wooden or crystal acrylic frame of selected finish',
      'High-definition lab-grade matte photographic print (non-fading for 50+ years)',
      'Shatterproof crystal clear acrylic front protector',
      'Pre-installed desktop stand & dual wall hangers',
      'Complimentary gift box packaging with floral fragrance spritz'
    ],
    thingsRequired: [
      '1 to 9 high-resolution photos for collage or single portrait',
      'Special date or personalized caption (e.g. "You & Me, Always")',
      'Preferred frame style & orientation'
    ],
    dispatchesIn: '2 - 3 Business Days',
    deliveryTimeline: 'Delivery in 4 - 6 days with shockproof bubble packaging',
    features: [
      'Solid Pinewood or Clear Acrylic',
      'Non-glare Museum Quality Glass',
      'Includes Desktop Stand + Wall Mount',
      'Water & UV resistant printing'
    ]
  },
  {
    id: 'prod-news-01',
    slug: 'personalized-newspaper-frame-card',
    title: 'The Daily Love: Personalized Newspaper Frame',
    subtitle: 'Vintage breaking news front-page headline celebrating your milestone',
    category: 'newspaper',
    basePrice: 699,
    originalPrice: 999,
    rating: 4.88,
    reviewCount: 297,
    badge: 'Viral on Reels 🚀',
    images: [
      '/products/media_1788608467346.jpg',
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Stop the presses — "BREAKING NEWS: LOVE IS REAL!" A breathtaking, whimsical vintage broadsheet celebrating your proposal, wedding, anniversary, or birthday. Styled with classic typography, editorial columns, commemorative date badges, and your favorite candid photos framed in a sleek black gallery frame.',
    variants: [
      {
        id: 'news-card',
        name: 'Archival Art Print Card (A4 un-framed)',
        price: 699,
        originalPrice: 999,
        description: 'Printed on 300 GSM textured antique parchment in a protective presentation folder.',
        recommendedPhotos: 2
      },
      {
        id: 'news-framed-a4',
        name: 'Framed Special Edition (A4 Classic Black)',
        price: 1199,
        originalPrice: 1599,
        description: 'Ready-to-hang framed newspaper as seen in our viral Instagram reels.',
        recommendedPhotos: 2
      },
      {
        id: 'news-framed-a3',
        name: 'Framed Collector Edition (A3 Statement)',
        price: 1699,
        originalPrice: 2299,
        description: 'Impressive broadsheet size with rich article columns and multiple photo features.',
        recommendedPhotos: 4
      }
    ],
    whatsIncluded: [
      'Customized vintage newspaper layout printed on heavy archival stock',
      'Optional premium matte black exhibition frame with hanging hardware',
      'Authentic press masthead with your city, date & special edition number',
      'Free wax-sealed vintage envelope containing greeting note'
    ],
    thingsRequired: [
      'Main Headline (e.g., "BREAKING NEWS: Sarah Said YES!")',
      'Sub-headline / Story blurb (or let our AI copywriter write it for you!)',
      'Milestone Date & City',
      '1 to 2 high-contrast couple or portrait photos'
    ],
    dispatchesIn: '2 - 3 Business Days',
    deliveryTimeline: 'Delivery in 4 - 6 days with reinforced protective casing',
    features: [
      'Authentic Broadsheet Layout',
      'Customizable Columns & Badges',
      'Vintage Font Hierarchy',
      'Live Front-page Preview'
    ]
  },
  {
    id: 'prod-song-01',
    slug: 'custom-song-book-acrylic-plaque',
    title: 'Melody of Us: Song Book & Spotify Plaque',
    subtitle: 'Interactive musical keepsake with scannable Spotify code & personal lyrics',
    category: 'songbook',
    basePrice: 749,
    originalPrice: 1099,
    rating: 4.92,
    reviewCount: 220,
    badge: 'Trending Gift 🎵',
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Every love story has its soundtrack. Our Song Book & Acrylic Plaque transforms your couple anthem or favorite memory track into an interactive art piece. Scan the code with your phone camera to instantly stream your song on Spotify, paired with your sweetest photo and custom inscribed lyrics.',
    variants: [
      {
        id: 'song-acrylic-clear',
        name: 'Crystal Clear Acrylic Plaque (with Pine Wood Base)',
        price: 749,
        originalPrice: 1099,
        description: 'Sleek 3mm laser-cut acrylic with scannable soundwave and natural beechwood stand.',
        recommendedPhotos: 1
      },
      {
        id: 'song-led-plaque',
        name: 'Luminescent LED Night-Light Plaque',
        price: 1099,
        originalPrice: 1499,
        description: 'Warm glowing LED wooden base that illuminates your photo and song text at night.',
        recommendedPhotos: 1
      },
      {
        id: 'song-hardbound-book',
        name: 'Deluxe "Our Playlist" Song Book (12 Songs)',
        price: 1499,
        originalPrice: 1999,
        description: 'A pocket-sized book filled with your favorite songs, lyrics, and photos.',
        recommendedPhotos: 6
      }
    ],
    whatsIncluded: [
      'Custom laser-printed acrylic plaque or bound songbook',
      'Scannable Spotify playback soundwave code',
      'Solid natural beechwood display easel or LED illumination base',
      'Bespoke gift box packaging with crinkle paper and satin ribbon'
    ],
    thingsRequired: [
      'Song Title & Artist Name',
      'Spotify song or playlist URL',
      'Favorite couple photo for the album cover',
      'Custom timestamp or dedicated quote'
    ],
    dispatchesIn: '2 - 3 Business Days',
    deliveryTimeline: 'Delivery in 4 - 6 days with damage-proof shipping box',
    features: [
      '100% Scannable Spotify Soundwave',
      'Warm LED Glow Base Option',
      'Crystal Clarity Acrylic',
      'Laser-Etched Scratch Resistant'
    ]
  },
  {
    id: 'prod-hamper-01',
    slug: 'build-your-own-hamper',
    title: 'The Curated Bliss: Build Your Own Luxury Hamper',
    subtitle: 'Handpick aesthetic goodies, scrunchies, jhumkas, frames & custom wax-sealed note',
    category: 'hamper',
    basePrice: 999,
    originalPrice: 1499,
    rating: 4.98,
    reviewCount: 640,
    badge: '100% Bespoke 🎁',
    images: [
      '/products/gift_hamper_curated_box.jpg',
      '/products/media_1788608467331.jpg',
      '/products/media_1788608467334.jpg',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Craft the most heartfelt unboxing experience! Mix and match curated boutique delights from mulberry silk scrunchies and handmade Kashmiri silver jhumkas to salon-finish press-on nails, mini photo frames, and crystal hair claws, all nestled in pastel crinkle shreds with your personalized wax-sealed greeting letter.',
    variants: [
      {
        id: 'hamper-standard',
        name: 'Signature Curated Hamper',
        price: 999,
        originalPrice: 1499,
        description: 'Includes premium keepsake box + packaging + greeting card. Add goodies of your choice!',
      }
    ],
    whatsIncluded: [
      'Luxury keepsake hamper box with magnetic closure or satin ribbon',
      'Eco-friendly pastel pink crinkle paper bed & fairy light accents',
      'All selected goodies hand-wrapped in delicate tissue paper',
      'Handwritten calligraphy greeting letter on deckled cotton paper',
      'Handmade wax seal stamp with dried lavender sprig'
    ],
    thingsRequired: [
      'Selection of hamper box style',
      'Selection of 3 or more goodies',
      'Recipient name & personalized heartfelt note',
      'Wax seal color preference'
    ],
    dispatchesIn: '2 - 3 Business Days',
    deliveryTimeline: 'Delivery in 4 - 6 days with reinforced bubble outer box',
    features: [
      'Fully Custom Goodie Selection',
      'Real-time Visual Box Preview',
      'Authentic Wax Seal Stamp',
      'Aesthetic Instagram Unboxing Ready'
    ]
  },
  {
    id: 'prod-mini-mag-01',
    slug: 'personalized-mini-magazine',
    title: 'The Pocket Chronicle: 8-Page Mini Magazine',
    subtitle: 'Compact 5x7" aesthetic pocket magazine with 8 curated glossy pages',
    category: 'mini-magazine',
    basePrice: 699,
    originalPrice: 999,
    rating: 4.93,
    reviewCount: 198,
    badge: 'Cute & Portable 🌸',
    images: [
      '/products/mini_magazine.jpg',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      '/products/media_1788608467332.jpg'
    ],
    description: 'An adorable pocket-sized keepsake that fits right in your handbag! Featuring 8 professionally typeset pages on 250 GSM satin paper, finished with a chic magazine cover, couple timeline, and your Spotify love song QR code.',
    variants: [
      {
        id: 'mini-mag-8p',
        name: '8 Pages Pocket Edition (5x7 inches)',
        price: 699,
        originalPrice: 999,
        description: 'Compact 8-page glossy mini magazine. Ideal for anniversaries, Valentine, and birthday surprises.',
        recommendedPhotos: 8
      }
    ],
    whatsIncluded: [
      '8-Page Glossy Mini Magazine (5x7 inches)',
      'Custom Cover with Foil Stamping Accent',
      'Spotify QR Code Plaque Sticker',
      'Bespoke Mini Envelope with Hand-poured Wax Seal',
      'Free Digital Proof Preview before print'
    ],
    thingsRequired: [
      '8 High-Resolution Photos',
      'Front Cover Headline (e.g. "You Are My Favorite Story")',
      'Occasion / Special Date',
      'Sweet message or letter (100 words)',
      'Favorite Spotify Song'
    ],
    dispatchesIn: '2 - 3 Business Days',
    deliveryTimeline: 'Delivery in 4 - 6 days with rigid protective envelope',
    features: [
      'Compact 5x7" Pocket Size',
      '250 GSM Velvety Satin Paper',
      'Curated Editorial Layouts',
      'Wax Seal Gift Envelope'
    ]
  },
  {
    id: 'prod-combo-01',
    slug: 'magazine-and-frame-combo',
    title: 'The Editorial Keepsake Combo: Custom Magazine + 6x8 Frame',
    subtitle: 'Our #1 best-selling gift duo: Glossy magazine plus an elegant pinewood memory frame',
    category: 'combo',
    basePrice: 1499,
    originalPrice: 2199,
    rating: 4.97,
    reviewCount: 286,
    badge: 'Best Value Combo 💎',
    images: [
      '/products/media_1788608467332.jpg',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      '/products/media_1788608467334.jpg'
    ],
    description: 'The ultimate milestone combination. Your special someone receives a fully personalized custom magazine to read and cherish, accompanied by an archival pinewood photo frame featuring your top couple portrait.',
    variants: [
      {
        id: 'combo-mag8-frame6x8',
        name: '8-Page Magazine + 6x8" Keepsake Frame',
        price: 1499,
        originalPrice: 2199,
        description: 'Includes 8-page custom magazine + handcrafted 6x8 frame with Polaroid cutout.',
        recommendedPhotos: 12
      },
      {
        id: 'combo-mag20-framea4',
        name: '20-Page Heirloom Magazine + A4 Exhibition Frame',
        price: 2499,
        originalPrice: 3499,
        description: 'Complete 20-page collector magazine + grand A4 wooden memory frame.',
        recommendedPhotos: 24
      }
    ],
    whatsIncluded: [
      'Personalized Custom Magazine (8 or 20 Pages)',
      'Handmade Wooden Photo Frame with Hanging & Stand Kit',
      'Wax-Sealed Greeting Card with Handwritten Note',
      'Luxury Gift Box with Double Satin Ribbon'
    ],
    thingsRequired: [
      '12 to 24 Photos for Magazine & Frame',
      'Cover Headline & Love Letter',
      'Occasion Date & Couple Names',
      'Frame finish preference (Black, Oak, White)'
    ],
    dispatchesIn: '3 - 4 Business Days',
    deliveryTimeline: 'Delivery in 5 - 7 days with heavy-duty dual protective packaging',
    features: [
      'Save ₹700+ vs Buying Separately',
      'Matching Color Themes',
      'Luxury Gift Box Included',
      'Free Digital Proof Verification'
    ]
  },
  {
    id: 'prod-combo-02',
    slug: 'hamper-and-mini-mag-combo',
    title: 'The Luxe Celebration Combo: Hamper Box + Mini Magazine',
    subtitle: 'A full curated goodies hamper paired with an 8-page pocket mini-magazine',
    category: 'combo',
    basePrice: 1899,
    originalPrice: 2799,
    rating: 4.96,
    reviewCount: 142,
    badge: 'Complete Surprise 🎁',
    images: [
      '/products/media_1788608467331.jpg',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80',
      '/products/media_1788608467334.jpg'
    ],
    description: 'A match made in heaven: our viral boutique gift hamper box packed with silk scrunchies, Kashmiri jhumkas, press-on nails, and a personalized 8-page mini magazine placed right on top with a wax-sealed note.',
    variants: [
      {
        id: 'combo-hamper-minimag',
        name: 'Luxe Hamper + 8-Page Mini Magazine',
        price: 1899,
        originalPrice: 2799,
        description: 'Pastel gift box with 5 aesthetic goodies + custom 8-page mini magazine.',
        recommendedPhotos: 9
      }
    ],
    whatsIncluded: [
      'Luxury Hamper Box (Pastel or Wooden Crate)',
      '8-Page Custom Mini Magazine',
      'Pure Silk Scrunchie & Kashmiri Silver Jhumkas',
      'Press-on Nails & Mini Couple Photo Frame',
      'Handwritten Wax-Sealed Greeting Card'
    ],
    thingsRequired: [
      '8 to 10 High-Res Photos',
      'Recipient Name & Note',
      'Magazine Title & Occasion Date'
    ],
    dispatchesIn: '3 - 4 Business Days',
    deliveryTimeline: 'Delivery in 5 - 7 days nationwide',
    features: [
      'All-in-One Gifting Solution',
      'Personalized Magazine + Self-Care Goodies',
      'Double Ribbon Presentation Box',
      'Guaranteed Instagram Smiles'
    ]
  },
  {
    id: 'prod-combo-03',
    slug: 'newspaper-and-mini-frame-duet',
    title: 'The Nostalgia Duet: Newspaper Card + Mini Frame',
    subtitle: 'Vintage "Breaking News" card paired with a sleek couple mini frame',
    category: 'combo',
    basePrice: 999,
    originalPrice: 1499,
    rating: 4.91,
    reviewCount: 110,
    badge: 'Nostalgic Pair 📰',
    images: [
      '/products/media_1788608467346.jpg',
      '/products/media_1788608467334.jpg',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An unforgettable retro pairing. A framed vintage broadsheet newspaper declaring your love milestone as the headline story, accompanied by an intimate desktop mini frame.',
    variants: [
      {
        id: 'combo-news-frame',
        name: 'A4 Framed Newspaper + 4x4" Mini Desktop Frame',
        price: 999,
        originalPrice: 1499,
        description: 'A4 framed vintage newspaper + mini couple photo frame.',
        recommendedPhotos: 3
      }
    ],
    whatsIncluded: [
      'A4 Framed Vintage Newspaper Print',
      '4x4" Glossy Black Desktop Mini Frame',
      'Wax-Sealed Vintage Envelope with Letter',
      'Gift Packaging with Ribbon'
    ],
    thingsRequired: [
      'Newspaper Headline & Milestone Date',
      '2 to 3 Couple Photos'
    ],
    dispatchesIn: '2 - 3 Business Days',
    deliveryTimeline: 'Delivery in 4 - 6 days with protective air-cushion pack',
    features: [
      'Retro Print & Frame Combo',
      'Ready to Hang & Display',
      'Archival Fade-Proof Inks'
    ]
  }
];

export const MAGAZINE_TEMPLATES: MagazineTemplate[] = [
  {
    id: 'tmpl-vogue',
    name: 'The Vogue Fashion Editorial',
    tagline: 'High-fashion minimalism with bold mastheads & editorial interviews',
    suitableFor: 'Anniversaries, Romantic Milestones & Birthdays',
    themeColor: '#1A1A1A',
    badge: 'Most Popular ✨',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    previewPages: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Inspired by iconic fashion publications with bold serif typography, full-bleed couple portraits, and "Our 10 Favorite Moments" interview spreads.'
  },
  {
    id: 'tmpl-vintage',
    name: 'Vintage Film & Kodak Romance',
    tagline: 'Warm sepia grains, 35mm film borders, and handwritten letters',
    suitableFor: 'Dating Anniversaries & Long Distance Lovers',
    themeColor: '#8C5E47',
    badge: 'Warm & Cozy 🎞️',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    previewPages: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Nostalgic film-strip aesthetics, polaroid snapshots with date stamps, and a dedicated scanned Spotify code page for your couple anthem.'
  },
  {
    id: 'tmpl-birthday',
    name: 'Milestone Birthday Star Edition',
    tagline: 'Celebratory, golden champagne accents & "Reasons Why We Love You"',
    suitableFor: '18th, 21st, 25th, 30th & 50th Birthdays',
    themeColor: '#C99E5C',
    badge: 'Celebration 🎂',
    coverImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
    previewPages: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Make your star feel like a celebrity on their birthday. Includes a celebratory headline, friend notes montage, and throwback timeline.'
  },
  {
    id: 'tmpl-wedding',
    name: 'Kinfolk Minimalist Wedding Edition',
    tagline: 'Understated luxury, generous white space, and timeless vows',
    suitableFor: 'Weddings, Engagements & Golden Anniversaries',
    themeColor: '#5C6B5E',
    badge: 'Luxury Heirloom 💍',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    previewPages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Designed for couples who appreciate subtle, refined elegance. Heavy emphasis on high-resolution photography, vows text, and dates.'
  },
  {
    id: 'tmpl-scrapbook',
    name: 'Chic Bestie Scrapbook',
    tagline: 'Playful washi tape accents, hilarious insider jokes, and roadtrip collages',
    suitableFor: 'Best Friends, Siblings & Farewell Keepsakes',
    themeColor: '#DD374E',
    badge: 'Playful & Cute 🌸',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    previewPages: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A vibrant, joyful retrospective filled with scrapbook stickers, candid unposed laughs, and fun friend-tribute columns.'
  }
];

export const HAMPER_BOX_OPTIONS: HamperBoxOption[] = [
  {
    id: 'box-cardboard',
    name: 'Normal Cardboard Box',
    subtitle: 'Lightweight Tuck-Top Kraft Mailer Box',
    price: 199,
    image: '/hamper/real_cardboard_box_open.png',
    colorHex: '#DFCAAD',
    dimensions: '25 x 20 x 8 cm'
  },
  {
    id: 'box-hardboard',
    name: 'Hardboard Luxury Box',
    subtitle: 'Heavyweight Sturdy Rigid Gift Box',
    price: 399,
    image: '/hamper/box_flatlay_pink.jpg',
    colorHex: '#461724',
    dimensions: '26 x 22 x 10 cm'
  }
];

export interface HamperLidTagOption {
  id: string;
  label: string;
  tagline: string;
  icon: string;
  previewClass: string;
}

export const HAMPER_LID_TAGS: HamperLidTagOption[] = [
  {
    id: 'tag-birthday',
    label: 'Happy Birthday',
    tagline: '★ Happy Birthday Star ★',
    icon: '🎂',
    previewClass: 'from-amber-500 to-rose-500 text-white'
  },
  {
    id: 'tag-anniversary',
    label: 'Happy Anniversary',
    tagline: '♡ Happy Anniversary Love ♡',
    icon: '💍',
    previewClass: 'from-rose-500 to-blush-600 text-white'
  },
  {
    id: 'tag-love',
    label: 'Made with Love',
    tagline: '♡ Made with Love & Care ♡',
    icon: '💖',
    previewClass: 'from-blush-500 to-roseGold text-white'
  },
  {
    id: 'tag-just-for-you',
    label: 'Just for You',
    tagline: '✨ Specially Curated for You ✨',
    icon: '🌸',
    previewClass: 'from-charcoal to-taupe-700 text-[#FDFCF5]'
  }
];

export const HAMPER_GOODIES: HamperGoodie[] = [
  {
    id: 'g-mini-frame',
    name: 'Mini Photo Frame (4×4)',
    category: 'keepsake',
    price: 299,
    image: '/hamper/frame_exact.jpg',
    detailedImage: '/hamper/frame_exact.jpg',
    material: 'Solid Wood & Glass',
    dimensions: '4 × 4 inches (10 × 10 cm)',
    specs: [
      'Premium matte black solid wood moulding',
      'Crystal clear glass front protects photo from dust',
      'Sturdy easel strut for work desks & bedside tables',
      'Your custom couple photo printed inside on 300 GSM photo paper'
    ],
    description: '4×4 inch glossy black desktop keepsake frame with your custom photo printed inside.',
    tag: 'Photo Included'
  },
  {
    id: 'g-mirror',
    name: 'Cute Pink Fluffy Mirror',
    category: 'accessory',
    price: 149,
    image: '/hamper/mirror_exact.jpg',
    detailedImage: '/hamper/mirror_exact.jpg',
    material: 'Plush Faux Fur & Polished Alloy',
    dimensions: 'Compact 8 × 6.5 cm',
    specs: [
      'Dual-sided mirrors (1x standard true reflection + 2x magnification)',
      'Cute plush bunny ears with rhinestone accent',
      'Sturdy swivel keychain clasp to attach to handbags or backpacks',
      'Ultra-soft pink faux-fur outer shell'
    ],
    description: 'Ultra-soft plush heart pocket mirror & charm keychain.',
    tag: 'Cute'
  },
  {
    id: 'g-jhumkas',
    name: 'Handcrafted Kashmiri Jumkhe',
    category: 'jewelry',
    price: 249,
    image: '/hamper/jhumkas_style1_exact.jpg',
    detailedImage: '/hamper/jhumkas_style1_exact.jpg',
    material: 'German Oxidized Silver',
    dimensions: '5.5 cm drop length',
    specs: [
      'Official Artisan Magz floral watercolor designer card',
      'Intricate lotus dome filigree with oxidized antique finish',
      'Hand-strung jingling silver ghungroos',
      'Lead and nickel-free, hypoallergenic skin-safe posts'
    ],
    description: 'Traditional silver bell-drop jhumkhe with intricate filigree.',
    tag: 'Bestseller'
  },
  {
    id: 'g-jhumkas-style2',
    name: 'Handcrafted Kashmiri Jumkhe (Chandbali Apex)',
    category: 'jewelry',
    price: 249,
    image: '/hamper/jhumkas_style2_exact.jpg',
    detailedImage: '/hamper/jhumkas_style2_exact.jpg',
    material: 'German Oxidized Silver',
    dimensions: '5.5 cm drop length',
    specs: [
      'Official Artisan Magz floral watercolor designer card',
      'Intricate chandbali pointed apex filigree with oxidized antique finish',
      'Hand-strung jingling silver ghungroos',
      'Lead and nickel-free, hypoallergenic skin-safe posts'
    ],
    description: 'Traditional silver pointed apex bell-drop jhumkhe with exquisite filigree.',
    tag: 'Handcrafted'
  },
  {
    id: 'g-dangles',
    name: 'Kashmiri Chandelier Dangles',
    category: 'jewelry',
    price: 199,
    image: '/hamper/elephant_earrings_exact.jpg',
    detailedImage: '/hamper/elephant_earrings_exact.jpg',
    material: 'Oxidized Silver Alloy',
    dimensions: '7.5 cm cascading drop',
    specs: [
      'Royal embossed elephant motif stud design',
      'Cascading multi-strand ball chain tassels with ghungroo bells',
      'Lightweight balance for all-day comfort and dancing',
      'Packaged on signature Artisan Magz keepsake card'
    ],
    description: 'Statement silver ethnic chandelier dangle earrings.',
    tag: 'Handcrafted'
  },
  {
    id: 'g-hoops',
    name: 'Silver Floral Hoop Jumkhe',
    category: 'jewelry',
    price: 179,
    image: '/hamper/item_hoops_silver.png',
    detailedImage: '/hamper/item_hoops_silver.png',
    material: 'Silver-Toned Brass',
    dimensions: '4 cm diameter',
    specs: [
      'Beaded circular hoop silhouette with filigree border',
      'Mini dangling silver bell accents',
      'Easy click-top secure latch closure'
    ],
    description: 'Beaded round floral hoop earrings with dangling silver bells.',
    tag: 'Trending'
  },
  {
    id: 'g-bangles',
    name: 'Festive Golden Charm Bangles',
    category: 'jewelry',
    price: 199,
    image: '/hamper/bangles_exact.jpg',
    detailedImage: '/hamper/bangles_exact.jpg',
    material: 'Anti-Tarnish Golden Polish',
    dimensions: 'Size 2.4 - 2.6 (Universal Fit)',
    specs: [
      'Set of 3 textured golden celebration bangles',
      'Dangling cluster bell charms (ghungroos) along rim',
      'Subtle, melodious festive jingling sound',
      'Protective clear lacquer prevents tarnish & skin discoloration'
    ],
    description: 'Gleaming golden party & celebration bangles & charm bracelet set.',
    tag: 'Festive'
  },
  {
    id: 'g-rose-bracelet',
    name: 'Rose Crystal Vine Bracelet',
    category: 'jewelry',
    price: 249,
    image: '/hamper/rose_bracelet_exact.jpg',
    detailedImage: '/hamper/rose_bracelet_exact.jpg',
    material: '18K Gold Polish & Rose Crystals',
    dimensions: 'Adjustable 16 - 20 cm',
    specs: [
      'Delicate golden vine branch silhouette with leaf motifs',
      'Hand-set sparkling blush pink oval crystal stones',
      'Anti-tarnish protective lacquer coat',
      'Adjustable lobster clasp for comfortable wrist fit'
    ],
    description: 'Delicate golden branch bracelet embellished with shimmering rose pink crystal gems.',
    tag: 'Trending'
  },
  {
    id: 'g-claw',
    name: 'Peach Flower Hair Claw',
    category: 'accessory',
    price: 129,
    image: '/hamper/item_claw_flower.png',
    detailedImage: '/hamper/item_claw_flower.png',
    material: 'Resin Acrylic & Stainless Spring',
    dimensions: '7.5 cm width',
    specs: [
      'Translucent crystal peach blossom petal shape',
      'Strong dual-row interlocking teeth with high-tension spring',
      'Smooth edges prevent hair snagging or pulling',
      'Holds half-up and full updos firmly in place'
    ],
    description: 'Delicate translucent peach floral hair claw clip.',
    tag: 'Aesthetic'
  },
  {
    id: 'g-scrunchie',
    name: 'Mulberry Silk Red Scrunchie',
    category: 'accessory',
    price: 149,
    image: '/hamper/scrunchies_exact.jpg',
    detailedImage: '/hamper/scrunchies_exact.jpg',
    material: '100% Pure Mulberry Silk',
    dimensions: '10 cm diameter (Oversized Cloud)',
    specs: [
      'Ultra-gentle grade 6A silk protects delicate hair strands',
      'Zero hair breakage, friction, or crease marks',
      'Durable double-elastic core retains bounce wash after wash',
      'Rich royal wine / maroon tone that suits all outfits'
    ],
    description: 'Ultra-gentle pure silk scrunchie in rich festive maroon.',
    tag: 'Cozy'
  },
  {
    id: 'g-presson-nails',
    name: 'Salon Press-On Nails Set',
    category: 'beauty',
    price: 199,
    image: '/hamper/studio_nails_white.jpg',
    detailedImage: '/hamper/studio_nails_white.jpg',
    material: 'Salon ABS Resin & UV Gel Coat',
    dimensions: '24 tips (12 assorted sizes)',
    specs: [
      '24 full cover nail tips to fit every cuticle size perfectly',
      'Includes 24 jelly adhesive tabs + wooden cuticle stick + buffer',
      'Natural salon French blush with golden bow accents',
      'Reusable, non-damaging, applies in 2 minutes flat'
    ],
    description: 'Salon-ready 24-piece press-on nails with jelly adhesive tabs.',
    tag: 'Glam'
  },
  {
    id: 'g-chocolates',
    name: 'KitKat Celebration Treats',
    category: 'treat',
    price: 99,
    image: '/hamper/box_cardboard_love.jpg',
    detailedImage: '/hamper/box_cardboard_love.jpg',
    material: 'Crisp Baked Wafer & Milk Chocolate',
    dimensions: '2 Bars (Double Pack)',
    specs: [
      'Crisp baked wafer fingers coated in smooth milk chocolate',
      'Nestled inside pink crinkle paper for the sweetest surprise',
      'Fresh manufacturer sealed packaging'
    ],
    description: 'Crisp KitKat chocolate bars nestled inside for a celebratory sweet crunch.',
    tag: 'Sweet'
  },
  {
    id: 'g-small-note',
    name: 'A Small Note (Rolled Scroll)',
    category: 'keepsake',
    price: 0,
    image: '/hamper/box_empty_center.png',
    detailedImage: '/hamper/box_empty_center.png',
    material: 'Textured Parchment & Red Thread',
    dimensions: '12 × 8 cm rolled parchment',
    specs: [
      'Vintage parchment scroll letter tied with crimson cotton ribbon',
      'Personalized with your custom recipient name and heartfelt message',
      'Complementary and included with every hamper order at no charge'
    ],
    description: 'Handwritten sweet scroll letter tied with delicate red thread. Included complimentary!',
    tag: 'Included ★'
  },
  {
    id: 'g-greeting-card',
    name: 'Floating Greeting Card',
    category: 'keepsake',
    price: 99,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    detailedImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    material: '300 GSM Archival Textured Card',
    dimensions: 'A6 (10.5 × 14.8 cm)',
    specs: [
      'Heavyweight 300 GSM textured cardstock',
      'Custom typography with your words printed clearly',
      'Matching cream envelope included'
    ],
    description: 'Custom message card on textured archival paper with your heartfelt words.',
    tag: 'Personalized'
  },
  {
    id: 'g-newspaper-card',
    name: 'Vintage Newspaper Card',
    category: 'keepsake',
    price: 149,
    image: '/products/media_1788608467346.jpg',
    detailedImage: '/products/media_1788608467346.jpg',
    material: '250 GSM Matte Newsprint Card',
    dimensions: '5 × 7 inches',
    specs: [
      'Retro newspaper masthead with custom date & headlines',
      'Custom couple photo printed on front page',
      'Delightfully nostalgic keepsake gift'
    ],
    description: 'Mini retro headline card featuring your milestone date & couple photo.',
    tag: 'Unique'
  }
];

export interface HamperInspirationLook {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  boxId: string;
  lidTagId: string;
  includedGoodieIds: string[];
  price: number;
  highlight: string;
}

export const HAMPER_INSPIRATION_LOOKS: HamperInspirationLook[] = [
  {
    id: 'look-romantic-love',
    title: 'The Romantic Love Box',
    subtitle: 'Polaroid string lights, custom 4x4 frame, KitKat treats & rolled love letter',
    badge: 'Anniversary Bestseller ♡',
    image: '/hamper/box_cardboard_love.jpg',
    boxId: 'box-cardboard',
    lidTagId: 'tag-love',
    includedGoodieIds: ['g-mini-frame', 'g-chocolates', 'g-small-note', 'g-greeting-card'],
    price: 699,
    highlight: 'Includes 4x4 wood couple frame, KitKat treats, handwritten scroll note & photo card in kraft mailer box.',
  },
  {
    id: 'look-bday-celebration',
    title: 'Birthday Star Celebration Box',
    subtitle: 'Balloon foil lid stickers, polaroid memory prints, KitKat & pink bunny mirror',
    badge: 'Birthday Favorite 🎂',
    image: '/hamper/box_bday_hamper.jpg',
    boxId: 'box-cardboard',
    lidTagId: 'tag-birthday',
    includedGoodieIds: ['g-mini-frame', 'g-chocolates', 'g-mirror', 'g-small-note'],
    price: 749,
    highlight: 'Festive birthday stickers on box lid, 4x4 frame, dual pocket mirror & celebratory treats.',
  },
  {
    id: 'look-box-of-happiness',
    title: 'The Box of Happiness',
    subtitle: 'Bunting bows banner, vintage photo cards, golden charm bangles & scroll',
    badge: 'Customer Top Pick 🌸',
    image: '/hamper/box_happiness.jpg',
    boxId: 'box-cardboard',
    lidTagId: 'tag-just-for-you',
    includedGoodieIds: ['g-mini-frame', 'g-bangles', 'g-small-note', 'g-greeting-card'],
    price: 799,
    highlight: 'Pastel pink ribbon bunting banner with photo cards, charm bangles, and keepsake scroll note.',
  },
  {
    id: 'look-royal-pink-deluxe',
    title: 'The Royal Keepsake Deluxe',
    subtitle: 'Heavyweight luxury rigid box packed with silver jhumkhe, nails, scrunchie & bangles',
    badge: 'Grand Luxury Keepsake 🎁',
    image: '/hamper/box_flatlay_pink.jpg',
    boxId: 'box-hardboard',
    lidTagId: 'tag-love',
    includedGoodieIds: ['g-mini-frame', 'g-jhumkas', 'g-dangles', 'g-bangles', 'g-claw', 'g-scrunchie', 'g-presson-nails', 'g-mirror'],
    price: 1899,
    highlight: 'Heavyweight rigid keepsake box with full boutique jewelry collection, salon nails, silk scrunchie & couple frame.',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Ananya & Kabir',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: '3 days ago',
    productTitle: 'The Love Chronicle (16 Pages Magazine)',
    comment: 'I cried happy tears when this arrived! The print quality is literally like a real Vogue magazine. My boyfriend was completely stunned on our 3rd anniversary. Ordering on WhatsApp was so seamless too!',
    verifiedBuyer: true,
    image: '/products/media_1788608467332.jpg'
  },
  {
    id: 'rev-2',
    author: 'Pooja Sharma',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '1 week ago',
    productTitle: 'Build Your Own Hamper',
    comment: 'The hamper box exceeded all expectations! The mulberry scrunchie, the Kashmiri jhumkas, and the cute mini couple frame looked so luxurious together. The handwritten card with red wax seal gave it such a royal touch.',
    verifiedBuyer: true,
    image: '/products/media_1788608467331.jpg'
  },
  {
    id: 'rev-3',
    author: 'Rhea & Dev',
    location: 'New Delhi',
    rating: 5,
    date: '2 weeks ago',
    productTitle: 'The Daily Love: Newspaper Frame',
    comment: 'Saw this on Instagram reels and had to get it for our proposal anniversary! The newspaper layout is so aesthetic and funny. All our guests at home immediately walk over to read the article.',
    verifiedBuyer: true,
    image: '/products/media_1788608467346.jpg'
  },
  {
    id: 'rev-4',
    author: 'Tanvi M.',
    location: 'Pune',
    rating: 5,
    date: '3 weeks ago',
    productTitle: 'Square Desktop Mini Couple Frame',
    comment: 'The mini frame is the cutest thing on my desk! The photo clarity is top notch and the black border is so elegant. 10/10 gifting experience.',
    verifiedBuyer: true,
    image: '/products/media_1788608467334.jpg'
  }
];

export const STORY_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: 'unboxing',
    title: 'Unboxing ✨',
    coverImage: '/products/media_1788608467331.jpg',
    stories: [
      {
        id: 's-1',
        title: 'Hamper Reveal',
        image: '/products/media_1788608467331.jpg',
        caption: 'Unboxing our viral custom hamper box filled with handmade goodies & personalized mini frames! 🎀'
      },
      {
        id: 's-2',
        title: 'Wax Seal Detail',
        image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
        caption: 'Every single hamper is finished with an authentic hand-stamped wax seal and dried botanical sprigs 🌸'
      }
    ]
  },
  {
    id: 'magazines',
    title: 'Magazines 📖',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    stories: [
      {
        id: 's-3',
        title: 'Vogue-Style Spreads',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        caption: 'Turn your WhatsApp photos into high-fashion glossy pages that last forever 💖'
      }
    ]
  },
  {
    id: 'frames',
    title: 'Frames 🖼️',
    coverImage: '/products/playing_cards_frame.jpg',
    stories: [
      {
        id: 's-card-frame',
        title: 'Playing Card Frame',
        image: '/products/playing_cards_frame.jpg',
        caption: 'Viral "How Lucky Are We?" 9-card heart collage in a sleek black gallery frame! 🃏❤️'
      },
      {
        id: 's-4',
        title: 'Collage & Cutouts',
        image: '/products/media_1788608467332.jpg',
        caption: '9-Photo grid frames with raised couple cutout stickers. Pure nostalgia in a frame!'
      },
      {
        id: 's-5',
        title: 'Mini Frames',
        image: '/products/media_1788608467334.jpg',
        caption: 'Mini 4x4 frames for your work desk or bedside table 💕'
      }
    ]
  },
  {
    id: 'newspaper',
    title: 'Newspaper 📰',
    coverImage: '/products/media_1788608467346.jpg',
    stories: [
      {
        id: 's-6',
        title: 'Breaking News Frame',
        image: '/products/media_1788608467346.jpg',
        caption: 'Breaking News: Love is Real! The ultimate anniversary & birthday statement card.'
      }
    ]
  },
  {
    id: 'reviews',
    title: 'Love Notes 💌',
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    stories: [
      {
        id: 's-7',
        title: 'Customer Smiles',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        caption: 'Over 2,500+ love stories brought to life across India! Thank you for trusting us with your milestones ✨'
      }
    ]
  }
];
