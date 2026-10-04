import type { BookPage } from '../types/book';
import {
  SONGS_BOOK_PAGES,
  SORANTIKA_BOOK_PAGES,
  CHAAR_KADAM_BOOK_PAGES,
  INITIAL_5_PAGE_BOOK,
} from './bookTemplates.ts';

export interface SongTemplateItem {
  id: string;
  title: string;
  subtitle?: string;
  songTitle: string;
  badge?: string; // 'BEST SELLER' | 'NEW RELEASE' | 'RAKSHABANDHAN SPECIAL' | 'SPECIAL EDITION'
  badgeColor?: string; // custom badge color class
  price: number;
  originalPrice: number;
  coverImage: string;
  pages: BookPage[];
  category?: 'Romantic' | 'Bollywood' | 'Wedding' | 'Special' | 'All';
  description?: string;
  details?: {
    whatsIncluded: string[];
    whatToShare: string[];
    howItWorks: string[];
    privacyPolicy: {
      headline: string;
      text: string;
    };
  };
}

const DEFAULT_DETAILS = {
  whatsIncluded: [
    '6 beautifully designed pages / 12 sides',
    'Premium-quality printing',
    'Aesthetic layouts tailored to your memories',
    'Personalized captions, messages & text',
    'Thoughtfully designed to match your chosen vibe',
    'Your photos transformed into a magazine-style keepsake',
  ],
  whatToShare: [
    'Minimum 20 photos required',
    '35–40 photos recommended for a fuller magazine experience',
    'Have more memories to include? You can choose additional pages while placing your order.',
  ],
  howItWorks: [
    'Place your order',
    'Share your photos and details with us',
    'We create your personalized design',
    'You review/approve the design',
    'Your magazine is printed and delivered',
  ],
  privacyPolicy: {
    headline: 'Your memories are personal to you.',
    text: 'We handle your photos and information with care. Your content will never be shared on our social media or used for promotional purposes without your permission.',
  },
};

/**
 * Registry of Song Magazines / Templates.
 * To add a new song template, simply add a new object to this array!
 */
export const SONG_MAGAZINE_TEMPLATES: SongTemplateItem[] = [
  {
    id: 'tu-chahiye',
    title: 'Tu Chahiye Magazine',
    subtitle: 'MY HOME • Special Edition #123 • Romantic Song Keepsake',
    songTitle: 'Tu Chahiye',
    badge: 'BEST SELLER',
    price: 700,
    originalPrice: 999,
    coverImage: '/templates/tu-chahiye/page_1.jpg',
    category: 'Romantic',
    pages: SONGS_BOOK_PAGES,
    description: 'Transform your unforgettable romantic journey into a song magazine with lyrics from Tu Chahiye.',
    details: DEFAULT_DETAILS,
  },
  {
    id: 'sorantika',
    title: 'Sorantika Magazine',
    subtitle: 'SPECIAL EDITION #123 • you feel like home<3',
    songTitle: 'Sorantika',
    badge: 'NEW RELEASE',
    price: 700,
    originalPrice: 999,
    coverImage: '/templates/sorantika/page_1.jpg',
    category: 'Romantic',
    pages: SORANTIKA_BOOK_PAGES,
    description: 'Bespoke 12-page couple keepsake magazine featuring 12 customized memory spreads and love letter dedication.',
    details: DEFAULT_DETAILS,
  },
  {
    id: 'shayarana',
    title: 'Shayarana magzine ( New Release )',
    subtitle: 'Romantic Melody • Special Kiss-Mark Keepsake',
    songTitle: 'Shayarana',
    badge: 'NEW RELEASE',
    price: 700,
    originalPrice: 999,
    coverImage: '/products/song-magazines/shayarana_magazine.jpg',
    category: 'Romantic',
    pages: SONGS_BOOK_PAGES,
    description: 'A whimsical and playful romantic song magazine celebrating unfiltered laughter and kisses.',
    details: DEFAULT_DETAILS,
  },
  {
    id: 'chaar-kadam',
    title: 'Chaar Kadam Magazine',
    subtitle: 'MRUNIRUDH • Forever Edition Vol. 01',
    songTitle: 'Chaar Kadam',
    badge: 'POPULAR',
    price: 700,
    originalPrice: 999,
    coverImage: '/templates/chaar-kadam/page_1.webp',
    category: 'Bollywood',
    pages: CHAAR_KADAM_BOOK_PAGES,
    description: 'A traditional and timeless keepsake book filled with poetic verses from Chaar Kadam.',
    details: DEFAULT_DETAILS,
  },
  {
    id: 'normal-magazine',
    title: 'Normal Magazine',
    subtitle: 'MY HOME • Classic Keepsake Edition',
    songTitle: 'My Home',
    badge: 'BEST SELLER',
    price: 700,
    originalPrice: 999,
    coverImage: '/products/song-magazines/normal_magazine.jpg',
    category: 'Romantic',
    pages: SONGS_BOOK_PAGES,
    description: 'Our signature magazine featuring aesthetic couple polaroids, personalized typography, and intimate moments.',
    details: DEFAULT_DETAILS,
  },
  {
    id: 'wedding-magazine',
    title: 'Wedding Magazine',
    subtitle: 'FOREVER • Grand Celebration Edition',
    songTitle: 'Forever',
    badge: 'SPECIAL',
    price: 999,
    originalPrice: 1299,
    coverImage: '/products/song-magazines/wedding_magazine.jpg',
    category: 'Wedding',
    pages: INITIAL_5_PAGE_BOOK,
    description: 'Celebrate your union with a grand luxury editorial magazine designed for wedding & sangeet memories.',
    details: DEFAULT_DETAILS,
  },
  {
    id: '2-years-of-us',
    title: '2 Years of Us',
    subtitle: 'Anniversary Special Edition',
    songTitle: '2 Years of Us',
    badge: 'ANNIVERSARY',
    price: 700,
    originalPrice: 999,
    coverImage: '/products/song-magazines/two_years_of_us.jpg',
    category: 'Romantic',
    pages: SONGS_BOOK_PAGES,
    description: 'Mark two beautiful years together with a commemorative anniversary song magazine.',
    details: DEFAULT_DETAILS,
  },
  {
    id: 'rakshabandhan-special',
    title: 'Certified Headache Magazine',
    subtitle: 'Rakshabandhan Sibling Special Edition',
    songTitle: 'Certified Headache',
    badge: 'RAKSHABANDHAN SPECIAL',
    price: 700,
    originalPrice: 999,
    coverImage: '/products/song-magazines/rakshabandhan_special.jpg',
    category: 'Special',
    pages: CHAAR_KADAM_BOOK_PAGES,
    description: 'Dedicated to your favorite partner-in-crime sibling with hilarious memories, inside jokes, and heartfelt notes.',
    details: DEFAULT_DETAILS,
  },
];
