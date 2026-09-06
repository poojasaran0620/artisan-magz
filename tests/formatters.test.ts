import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice, calculateEstimatedDelivery, buildWhatsAppOrderMessage } from '../src/utils/formatters.ts';
import type { CartItem } from '../src/types/product.ts';

test('formatPrice correctly formats INR currency', () => {
  assert.equal(formatPrice(899), '₹899');
  assert.equal(formatPrice(1499), '₹1,499');
  assert.equal(formatPrice(12999), '₹12,999');
  assert.equal(formatPrice(0), '₹0');
});

test('calculateEstimatedDelivery handles valid metro and non-metro pincodes', () => {
  const metroRes = calculateEstimatedDelivery('400001'); // Mumbai
  assert.equal(metroRes.isValid, true);
  assert.equal(metroRes.isMetro, true);
  assert.equal(metroRes.estimatedDays, '4 - 5 business days');

  const nonMetroRes = calculateEstimatedDelivery('781001'); // Guwahati
  assert.equal(nonMetroRes.isValid, true);
  assert.equal(nonMetroRes.isMetro, false);
  assert.equal(nonMetroRes.estimatedDays, '6 - 7 business days');

  const invalidRes1 = calculateEstimatedDelivery('123');
  assert.equal(invalidRes1.isValid, false);

  const invalidRes2 = calculateEstimatedDelivery('abcdef');
  assert.equal(invalidRes2.isValid, false);

  const invalidRes3 = calculateEstimatedDelivery('012345'); // Starts with 0
  assert.equal(invalidRes3.isValid, false);
});

test('buildWhatsAppOrderMessage formats order with variants and customizations', () => {
  const dummyItem: CartItem = {
    cartItemId: 'item-1',
    product: {
      id: 'p-1',
      slug: 'mag',
      title: 'The Love Chronicle: Bespoke Custom Magazine',
      subtitle: '',
      category: 'magazine',
      basePrice: 1199,
      rating: 5,
      reviewCount: 1,
      images: [],
      description: '',
      variants: [],
      whatsIncluded: [],
      thingsRequired: [],
      dispatchesIn: '',
      deliveryTimeline: '',
      features: [],
    },
    selectedVariant: { id: 'v-1', name: '12 Pages Classic Edition', price: 1199 },
    quantity: 1,
    unitPrice: 1199,
    totalPrice: 1199,
    customization: {
      occasion: '5th Anniversary',
      headline: 'The Girl Who Won My Heart',
      uploadedPhotoCount: 12,
      spotifyLink: 'https://open.spotify.com/track/12345',
    },
  };

  const messageUrlEncoded = buildWhatsAppOrderMessage(
    [dummyItem],
    'Ananya',
    '9876543210',
    'Bandra West',
    'Mumbai',
    '400050',
    'Please handle with love'
  );

  const decoded = decodeURIComponent(messageUrlEncoded);

  assert.ok(decoded.includes('The Love Chronicle: Bespoke Custom Magazine'));
  assert.ok(decoded.includes('12 Pages Classic Edition'));
  assert.ok(decoded.includes('The Girl Who Won My Heart'));
  assert.ok(decoded.includes('5th Anniversary'));
  assert.ok(decoded.includes('12 photos'));
  assert.ok(decoded.includes('*Subtotal:* ₹1199'));
  assert.ok(decoded.includes('*Shipping:* ₹99')); // below 1499 threshold
  assert.ok(decoded.includes('*Estimated Total:* *₹1298*'));
  assert.ok(decoded.includes('Ananya'));
  assert.ok(decoded.includes('Bandra West'));
});

test('buildWhatsAppOrderMessage awards free shipping over ₹1499', () => {
  const dummyItem: CartItem = {
    cartItemId: 'item-2',
    product: {
      id: 'p-2',
      slug: 'mag-20',
      title: 'Collector Edition Magazine',
      subtitle: '',
      category: 'magazine',
      basePrice: 1799,
      rating: 5,
      reviewCount: 1,
      images: [],
      description: '',
      variants: [],
      whatsIncluded: [],
      thingsRequired: [],
      dispatchesIn: '',
      deliveryTimeline: '',
      features: [],
    },
    selectedVariant: { id: 'v-2', name: '20 Pages Collector Heirloom', price: 1799 },
    quantity: 1,
    unitPrice: 1799,
    totalPrice: 1799,
    customization: {},
  };

  const messageUrlEncoded = buildWhatsAppOrderMessage([dummyItem]);
  const decoded = decodeURIComponent(messageUrlEncoded);

  assert.ok(decoded.includes('*Shipping:* FREE (Express)'));
  assert.ok(decoded.includes('*Estimated Total:* *₹1799*'));
});

test('buildWhatsAppOrderMessage formats newspaper, frame, and songbook customization fields', () => {
  const newsItem: CartItem = {
    cartItemId: 'item-news',
    product: {
      id: 'prod-news-01',
      slug: 'news',
      title: 'The Daily Love: Personalized Newspaper Frame',
      subtitle: '',
      category: 'newspaper',
      basePrice: 1199,
      rating: 5,
      reviewCount: 1,
      images: [],
      description: '',
      variants: [],
      whatsIncluded: [],
      thingsRequired: [],
      dispatchesIn: '',
      deliveryTimeline: '',
      features: [],
    },
    selectedVariant: { id: 'news-framed-a4', name: 'Framed Special Edition (A4)', price: 1199 },
    quantity: 1,
    unitPrice: 1199,
    totalPrice: 1199,
    customization: {
      coupleNames: 'Rohan & Simran',
      city: 'Delhi',
      newspaperHeadline: 'BREAKING NEWS',
      newspaperSubheadline: 'THEY SAID YES!',
      anniversaryDate: '24 DEC',
      articleStory: 'A timeless love story began in college library and blossomed into forever.',
      uploadedPhotoCount: 2,
    },
  };

  const frameItem: CartItem = {
    cartItemId: 'item-frame',
    product: {
      id: 'prod-frame-01',
      slug: 'frame',
      title: 'Heirloom Memory Frame',
      subtitle: '',
      category: 'frame',
      basePrice: 1399,
      rating: 5,
      reviewCount: 1,
      images: [],
      description: '',
      variants: [],
      whatsIncluded: [],
      thingsRequired: [],
      dispatchesIn: '',
      deliveryTimeline: '',
      features: [],
    },
    selectedVariant: { id: 'frame-a4', name: 'Statement A4', price: 1399 },
    quantity: 1,
    unitPrice: 1399,
    totalPrice: 1399,
    customization: {
      frameSize: 'A4 (8.3x11.7 inches)',
      frameStyle: 'Minimalist Oak',
      orientation: 'landscape',
      collageStyle: 'grid9',
      captionDate: 'Forever & Always • 2024',
    },
  };

  const songItem: CartItem = {
    cartItemId: 'item-song',
    product: {
      id: 'prod-song-01',
      slug: 'song',
      title: 'Melody of Us: Song Book',
      subtitle: '',
      category: 'songbook',
      basePrice: 749,
      rating: 5,
      reviewCount: 1,
      images: [],
      description: '',
      variants: [],
      whatsIncluded: [],
      thingsRequired: [],
      dispatchesIn: '',
      deliveryTimeline: '',
      features: [],
    },
    quantity: 1,
    unitPrice: 749,
    totalPrice: 749,
    customization: {
      songTitle: 'Perfect',
      artistName: 'Ed Sheeran',
      spotifyLink: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
      playlistDedication: 'Dancing in the dark with you between my arms',
    },
  };

  const messageUrlEncoded = buildWhatsAppOrderMessage(
    [newsItem, frameItem, songItem],
    'Simran',
    '9988776655',
    'Connaught Place',
    'New Delhi',
    '110001',
    'Rush order please',
    'LOVE20',
    669
  );

  const decoded = decodeURIComponent(messageUrlEncoded);

  // Newspaper assertions
  assert.ok(decoded.includes('Rohan & Simran'));
  assert.ok(decoded.includes('City Edition: Delhi'));
  assert.ok(decoded.includes('THEY SAID YES!'));
  assert.ok(decoded.includes('A timeless love story began'));

  // Frame assertions
  assert.ok(decoded.includes('Minimalist Oak'));
  assert.ok(decoded.includes('Layout Orientation: landscape'));
  assert.ok(decoded.includes('Forever & Always • 2024'));

  // Song assertions
  assert.ok(decoded.includes('Perfect - Ed Sheeran'));
  assert.ok(decoded.includes('Dancing in the dark'));

  // Coupon assertions
  assert.ok(decoded.includes('*Coupon Applied (LOVE20):* -₹669'));
});

test('buildWhatsAppOrderMessage formats magazine builder package, format, templates, and add-ons', () => {
  const builderItem: CartItem = {
    cartItemId: 'item-builder-1',
    product: {
      id: 'prod-mag-01',
      slug: 'personalized-custom-magazine',
      title: 'The Love Chronicle: Bespoke Custom Magazine',
      subtitle: '',
      category: 'magazine',
      basePrice: 899,
      rating: 5,
      reviewCount: 1,
      images: [],
      description: '',
      variants: [],
      whatsIncluded: [],
      thingsRequired: [],
      dispatchesIn: '',
      deliveryTimeline: '',
      features: [],
    },
    selectedVariant: { id: 'mag-12p', name: '12 Pages Standard (A4) Edition', price: 1199 },
    quantity: 1,
    unitPrice: 1279,
    totalPrice: 1279,
    customization: {
      format: 'standard-a4',
      selectedPages: 12,
      selectedTemplates: ['spread-01', 'spread-02'],
      addOns: {
        combo: true,
      },
      addOnPrice: 80,
    },
  };

  const messageUrlEncoded = buildWhatsAppOrderMessage(
    [builderItem],
    'Pooja',
    '9812345678',
    'Indiranagar',
    'Bangalore',
    '560038'
  );

  const decoded = decodeURIComponent(messageUrlEncoded);

  assert.ok(decoded.includes('12 Pages Magazine (Standard • A4)'));
  assert.ok(decoded.includes('spread-01, spread-02'));
  assert.ok(decoded.includes('Combo: Wrap + Letter (+₹80)'));
  assert.ok(decoded.includes('*Subtotal:* ₹1279'));
});
