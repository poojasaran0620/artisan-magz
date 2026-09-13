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

test('FAQ_DATA contains all 5 custom customer questions with verified answers', async () => {
  const { FAQ_DATA } = await import('../src/data/faqData.ts');
  assert.equal(FAQ_DATA.length, 5);
  const questions = FAQ_DATA.map((f: any) => f.question);
  assert.ok(questions.includes('What shipping options are available?'));
  assert.ok(questions.includes('Are my photos and personal details safe?'));
  assert.ok(questions.includes('Are there any additional delivery charges?'));
  assert.ok(questions.includes('Can I customize my magazine?'));
  assert.ok(questions.includes('What is your refund/return policy?'));

  for (const item of FAQ_DATA) {
    assert.ok(item.answer.length > 20, `Answer for "${item.question}" is too short`);
  }
});

test('BEST_PERFORMING_REELS contains the user specified reels in exact horizontal sequence', async () => {
  const { BEST_PERFORMING_REELS, INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL } = await import(
    '../src/data/instagramReels.ts'
  );

  assert.equal(INSTAGRAM_HANDLE, 'artisan.magz');
  assert.ok(INSTAGRAM_PROFILE_URL.includes('instagram.com/artisan.magz'));
  assert.equal(BEST_PERFORMING_REELS.length, 6);

  const expectedCodes = [
    'DJn07B_Tdld',
    'DNQodZTxIEw',
    'DaFOiWXItUf',
    'DaQBGNOoio3',
    'DQ3UwnqCA-M',
    'DUk5HOukvTm',
  ];

  BEST_PERFORMING_REELS.forEach((reel: any, index: number) => {
    assert.equal(reel.sequence, index + 1);
    assert.equal(reel.reelCode, expectedCodes[index]);
    assert.ok(reel.url.includes(expectedCodes[index]));
    assert.ok(reel.embedUrl.includes(`/reel/${expectedCodes[index]}/embed/`));
  });
});

