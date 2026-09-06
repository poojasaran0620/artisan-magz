export interface FrameOption {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  image: string;
  badge?: string;
  tag?: string;
  productId: string;
  collageStyle?: 'playing-cards' | 'grid9' | 'single' | 'cutout';
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'frame-opt-playing-cards',
    slug: 'playing-card-collage-frame',
    title: 'Playing Card Collage',
    subtitle: 'Viral "How Lucky Are We?" 9-Card Heart Collage Frame',
    price: 699,
    originalPrice: 899,
    image: '/products/frame_playing_cards.jpg',
    badge: 'Viral Reel 🔥',
    tag: 'Trending',
    productId: 'prod-frame-01',
    collageStyle: 'playing-cards',
  },
  {
    id: 'frame-opt-paper-plane',
    slug: 'paper-plane-love-note-frame',
    title: 'Paper Plane Love Note',
    subtitle: '3-Tier Polaroid Photo Strip with Paper Airplane & Heart Stamp Doodles',
    price: 699,
    originalPrice: 899,
    image: '/products/frame_paper_plane_strip.jpg',
    badge: 'New Trend ✈️',
    tag: '3 Photos',
    productId: 'prod-frame-01',
    collageStyle: 'single',
  },
  {
    id: 'frame-opt-scrapbook',
    slug: 'favorite-person-scrapbook-frame',
    title: 'Favorite Person Scrapbook',
    subtitle: 'Vintage Kraft Scrapbook Collage with 35mm Filmstrip & Pastel Bow Stickers',
    price: 699,
    originalPrice: 899,
    image: '/products/frame_scrapbook_filmstrip.jpg',
    badge: 'BFF Favorite 🎀',
    tag: 'Scrapbook',
    productId: 'prod-frame-01',
    collageStyle: 'grid9',
  },
  {
    id: 'frame-opt-newspaper',
    slug: 'the-daily-slay-newspaper-frame',
    title: 'The Daily Slay Newspaper',
    subtitle: 'Vintage Editorial Headline Milestone Special Edition Frame',
    price: 699,
    originalPrice: 899,
    image: '/products/frame_newspaper_daily_slay.jpg',
    badge: 'Editorial Chic 📰',
    tag: 'Milestone',
    productId: 'prod-news-01',
    collageStyle: 'single',
  },
  {
    id: 'frame-opt-cutout-grid',
    slug: 'bestie-cutout-grid-frame',
    title: 'Cutout Grid Collage',
    subtitle: '3x3 Polaroid Memories with Elevated 3D Couple Cutout',
    price: 699,
    originalPrice: 899,
    image: '/products/frame_cutout_grid.jpg',
    badge: 'Customer Favorite 💖',
    tag: 'Couples & BFFs',
    productId: 'prod-frame-01',
    collageStyle: 'cutout',
  },
  {
    id: 'frame-opt-chaos-polaroid',
    slug: 'chaos-polaroid-mosaic-frame',
    title: 'Chaos Polaroid Mosaic',
    subtitle: 'Overlapping Polaroid Memory Collage with Pop-Out Portrait',
    price: 699,
    originalPrice: 899,
    image: '/products/frame_chaos_polaroid.jpg',
    badge: 'Romantic Mosaic ✨',
    tag: '20+ Memories',
    productId: 'prod-frame-01',
    collageStyle: 'grid9',
  },
  {
    id: 'frame-opt-spotify',
    slug: 'spotify-soundwave-frame',
    title: 'Spotify Code Frame',
    subtitle: 'Scannable Audio Track & Favorite Couple Memory Grid',
    price: 699,
    originalPrice: 899,
    image: '/products/media_1788608467332.jpg',
    badge: 'Scannable 🎵',
    tag: 'Soundtrack',
    productId: 'prod-song-01',
    collageStyle: 'single',
  },
  {
    id: 'frame-opt-mini',
    slug: 'desktop-mini-frame',
    title: 'Desktop Mini Frame',
    subtitle: 'Compact 4x4 Tabletop Acrylic & Pinewood Keepsake',
    price: 599,
    originalPrice: 799,
    image: '/products/media_1788608467334.jpg',
    badge: 'Cute & Compact 🌸',
    tag: 'Tabletop',
    productId: 'prod-frame-01',
    collageStyle: 'single',
  },
];
