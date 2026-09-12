import test from 'node:test';
import assert from 'node:assert/strict';
import { HAMPER_BOX_OPTIONS, HAMPER_GOODIES } from '../src/data/products.ts';
import { buildWhatsAppOrderMessage } from '../src/utils/formatters.ts';
import type { CartItem, HamperSelection } from '../src/types/product.ts';

test('hamper box choices have valid dimensions and pricing', () => {
  assert.ok(HAMPER_BOX_OPTIONS.length >= 2);
  for (const box of HAMPER_BOX_OPTIONS) {
    assert.ok(box.price > 0);
    assert.ok(box.name.length > 0);
    assert.ok(box.dimensions.length > 0);
  }
});

test('hamper goodies collection covers required categories', () => {
  const categories = new Set(HAMPER_GOODIES.map((g) => g.category));
  assert.ok(categories.has('accessory')); // Scrunchie, mirror
  assert.ok(categories.has('jewelry'));   // Bangles, Kashmiri jumkhe
  assert.ok(categories.has('beauty'));    // Press-on nails
  assert.ok(categories.has('keepsake'));  // Mini frame, scroll note, cards
  assert.ok(categories.has('treat'));     // KitKat & chocolates
});

test('hamper tally correctly adds box plus multiple items with varying quantities', () => {
  const box = HAMPER_BOX_OPTIONS[0]; // 199
  const scrunchie = HAMPER_GOODIES.find((g) => g.id === 'g-scrunchie')!; // 149
  const jhumkas = HAMPER_GOODIES.find((g) => g.id === 'g-jhumkas')!; // 249
  const nails = HAMPER_GOODIES.find((g) => g.id === 'g-presson-nails')!; // 199

  const items = [
    { goodie: scrunchie, quantity: 2 }, // 298
    { goodie: jhumkas, quantity: 1 },   // 249
    { goodie: nails, quantity: 1 },     // 199
  ];

  const goodiesTotal = items.reduce((sum, i) => sum + i.goodie.price * i.quantity, 0);
  assert.equal(goodiesTotal, 298 + 249 + 199); // 746
  const hamperTotal = box.price + goodiesTotal;
  assert.equal(hamperTotal, 199 + 746); // 945

  const hamperDetails: HamperSelection = {
    box,
    lidTag: 'Happy Birthday',
    items,
    card: {
      design: 'Floating Greeting Card',
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
  assert.ok(decoded.includes('Handcrafted Kashmiri Jumkhe (Qty: 1)'));
  assert.ok(decoded.includes('Happy Birthday!'));
});

test('catalog includes required box styles: Normal Cardboard Box and Hardboard Luxury Box', () => {
  const boxNames = HAMPER_BOX_OPTIONS.map((b) => b.name.toLowerCase());
  assert.ok(boxNames.some((n) => n.includes('cardboard')));
  assert.ok(boxNames.some((n) => n.includes('hardboard')));
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

test('hamper inspiration looks provide valid boxes, tags, and goodie references', async () => {
  const { HAMPER_INSPIRATION_LOOKS } = await import('../src/data/products.ts');
  assert.ok(HAMPER_INSPIRATION_LOOKS.length >= 4);

  const goodieIds = new Set(HAMPER_GOODIES.map((g) => g.id));
  const boxIds = new Set(HAMPER_BOX_OPTIONS.map((b) => b.id));

  for (const look of HAMPER_INSPIRATION_LOOKS) {
    assert.ok(look.title.length > 0);
    assert.ok(look.price > 0);
    assert.ok(boxIds.has(look.boxId), `Look ${look.id} references valid boxId ${look.boxId}`);
    assert.ok(look.includedGoodieIds.length >= 2, `Look ${look.id} should have at least 2 goodies`);
    for (const gid of look.includedGoodieIds) {
      assert.ok(goodieIds.has(gid), `Look ${look.id} references valid goodie ${gid}`);
    }
  }
});

test('hamper goodies have rich craftsmanship specifications for gallery deep-dive', () => {
  for (const goodie of HAMPER_GOODIES) {
    assert.ok(goodie.name.length > 0);
    assert.ok(goodie.description.length > 0);
    assert.ok(goodie.material && goodie.material.length > 0, `Goodie ${goodie.id} has material`);
    assert.ok(goodie.dimensions && goodie.dimensions.length > 0, `Goodie ${goodie.id} has dimensions`);
    assert.ok(goodie.specs && goodie.specs.length > 0, `Goodie ${goodie.id} has specs`);
  }
});
