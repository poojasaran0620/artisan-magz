import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, MAGAZINE_TEMPLATES } from '../src/data/products.ts';

test('magazine flagship product includes 8 and 20 page variants', () => {
  const mag = PRODUCTS.find((p) => p.id === 'prod-mag-01');
  assert.ok(mag);
  assert.equal(mag.category, 'magazine');
  const variantIds = mag.variants.map((v) => v.id);
  assert.ok(variantIds.includes('mag-8p'), 'Must have 8 pages variant');
  assert.ok(variantIds.includes('mag-20p'), 'Must have 20 pages variant');
});

test('magazine templates provided by Artisan magz are populated with preview spreads', () => {
  assert.ok(MAGAZINE_TEMPLATES.length >= 5, 'Must provide at least 5 magazine templates');
  for (const tmpl of MAGAZINE_TEMPLATES) {
    assert.ok(tmpl.id.length > 0);
    assert.ok(tmpl.name.length > 0);
    assert.ok(tmpl.coverImage.length > 0);
    assert.ok(tmpl.previewPages.length >= 2, 'Template must include preview page spreads');
    assert.ok(tmpl.suitableFor.length > 0);
  }
});

test('catalog covers all 6 required front-page categories: magazine, frame, hamper, mini-magazine, newspaper, combo', () => {
  const categories = new Set(PRODUCTS.map((p) => p.category));
  assert.ok(categories.has('magazine'), 'Missing magazine');
  assert.ok(categories.has('frame'), 'Missing frame');
  assert.ok(categories.has('hamper'), 'Missing hamper');
  assert.ok(categories.has('mini-magazine'), 'Missing mini-magazine');
  assert.ok(categories.has('newspaper'), 'Missing newspaper');
  assert.ok(categories.has('combo'), 'Missing combo');
});
