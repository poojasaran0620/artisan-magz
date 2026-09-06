import test from 'node:test';
import assert from 'node:assert/strict';
import { HAMPER_BOX_OPTIONS, HAMPER_GOODIES } from '../src/data/products.ts';
import { buildWhatsAppOrderMessage } from '../src/utils/formatters.ts';
import type { CartItem, HamperSelection } from '../src/types/product.ts';

test('hamper box choices have valid dimensions and pricing', () => {
  assert.ok(HAMPER_BOX_OPTIONS.length >= 4);
  for (const box of HAMPER_BOX_OPTIONS) {
    assert.ok(box.price > 0);
    assert.ok(box.name.length > 0);
    assert.ok(box.dimensions.length > 0);
  }
});

test('hamper goodies collection covers required categories', () => {
  const categories = new Set(HAMPER_GOODIES.map((g) => g.category));
  assert.ok(categories.has('accessory')); // Scrunchie, keychain
  assert.ok(categories.has('jewelry'));   // Kashmiri jhumkas
  assert.ok(categories.has('beauty'));    // Press-on nails
  assert.ok(categories.has('keepsake'));  // Mini frame
  assert.ok(categories.has('treat'));     // Candle, chocolates
});

test('hamper tally correctly adds box plus multiple items with varying quantities', () => {
  const box = HAMPER_BOX_OPTIONS[0]; // 349
  const scrunchie = HAMPER_GOODIES.find((g) => g.id === 'g-scrunchie')!; // 149
  const jhumkas = HAMPER_GOODIES.find((g) => g.id === 'g-jhumkas')!; // 299
  const nails = HAMPER_GOODIES.find((g) => g.id === 'g-presson-nails')!; // 249

  const items = [
    { goodie: scrunchie, quantity: 2 }, // 298
    { goodie: jhumkas, quantity: 1 },   // 299
    { goodie: nails, quantity: 1 },     // 249
  ];

  const goodiesTotal = items.reduce((sum, i) => sum + i.goodie.price * i.quantity, 0);
  assert.equal(goodiesTotal, 298 + 299 + 249); // 846
  const hamperTotal = box.price + goodiesTotal;
  assert.equal(hamperTotal, 349 + 846); // 1195

  const hamperDetails: HamperSelection = {
    box,
    items,
    card: {
      design: 'Vintage Parchment',
      waxSealColor: 'Ruby Red',
      recipientName: 'Priya',
      message: 'Happy Birthday!',
      senderName: 'Rohit',
    },
  };

  const dummyCartItem: CartItem = {
    cartItemId: 'hamper-cart-1',
    product: {
      id: 'prod-hamper-01',
      slug: 'hamper',
      title: 'The Curated Bliss: Build Your Own Luxury Hamper',
      subtitle: '',
      category: 'hamper',
      basePrice: hamperTotal,
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
    unitPrice: hamperTotal,
    totalPrice: hamperTotal,
    customization: { hamperDetails },
  };

  const whatsappUrl = buildWhatsAppOrderMessage([dummyCartItem]);
  const decoded = decodeURIComponent(whatsappUrl);

  assert.ok(decoded.includes(box.name));
  assert.ok(decoded.includes('Mulberry Silk Red Scrunchie (Qty: 2)'));
  assert.ok(decoded.includes('Kashmiri Antique Silver Jhumkas (Qty: 1)'));
  assert.ok(decoded.includes('Seal: Ruby Red'));
  assert.ok(decoded.includes('Happy Birthday!'));
});

test('catalog includes required box styles: Pastel Gift Box, Vintage Wooden Crate, and Ribbon Hamper', () => {
  const boxNames = HAMPER_BOX_OPTIONS.map((b) => b.name.toLowerCase());
  assert.ok(boxNames.some((n) => n.includes('pastel') && n.includes('gift box')));
  assert.ok(boxNames.some((n) => n.includes('vintage') && n.includes('crate')));
  assert.ok(boxNames.some((n) => n.includes('ribbon') && n.includes('hamper')));
});

test('personalized frame product includes A3, A4, 8x10, 6x8, and mini sizes', async () => {
  const { PRODUCTS } = await import('../src/data/products.ts');
  const frameProd = PRODUCTS.find((p) => p.id === 'prod-frame-01');
  assert.ok(frameProd);
  const variantIds = frameProd.variants.map((v) => v.id);
  assert.ok(variantIds.includes('frame-mini'));
  assert.ok(variantIds.includes('frame-6x8'));
  assert.ok(variantIds.includes('frame-8x10'));
  assert.ok(variantIds.includes('frame-a4'));
  assert.ok(variantIds.includes('frame-a3'));
});
