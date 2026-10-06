import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SONG_MAGAZINE_TEMPLATES } from '../src/data/songTemplates.ts';
import { buildBookSpreads } from '../src/data/bookTemplates.ts';

describe('Song Magazine Templates System', () => {
  test('Contains all song options including Tu Chahiye, Chaar Kadam, Shayarana, etc.', () => {
    assert.ok(SONG_MAGAZINE_TEMPLATES.length >= 6, 'Must have at least 6 song magazine templates');

    const ids = SONG_MAGAZINE_TEMPLATES.map((t) => t.id);
    assert.ok(ids.includes('tu-chahiye'), 'Must include Tu Chahiye');
    assert.ok(ids.includes('sorantika'), 'Must include Sorantika');
    assert.ok(ids.includes('our-forever'), 'Must include Our Forever');
    assert.ok(!ids.includes('shayarana'), 'Must have removed Shayarana');
    const sorantikaIndex = ids.indexOf('sorantika');
    const ourForeverIndex = ids.indexOf('our-forever');
    assert.equal(ourForeverIndex, sorantikaIndex + 1, 'Our Forever must be positioned immediately after Sorantika');
    assert.ok(ids.includes('chaar-kadam'), 'Must include Chaar Kadam');
    assert.ok(ids.includes('normal-magazine'), 'Must include Normal Magazine');
    assert.ok(ids.includes('wedding-magazine'), 'Must include Wedding Magazine');
    assert.ok(ids.includes('2-years-of-us'), 'Must include 2 Years of Us');
    assert.ok(ids.includes('rakshabandhan-special'), 'Must include Rakshabandhan Special');
  });

  test('Every template has valid price, originalPrice, coverImage, and non-empty pages', () => {
    for (const t of SONG_MAGAZINE_TEMPLATES) {
      assert.ok(t.title && t.title.length > 0, `Template ${t.id} must have a title`);
      assert.ok(typeof t.price === 'number' && t.price > 0, `Template ${t.id} must have a valid price`);
      assert.ok(typeof t.originalPrice === 'number' && t.originalPrice >= t.price, `Template ${t.id} original price must be >= price`);
      assert.ok(t.coverImage && t.coverImage.length > 0, `Template ${t.id} must have cover image`);
      assert.ok(Array.isArray(t.pages) && t.pages.length > 0, `Template ${t.id} must have pages array`);

      // Verify book spreads can be computed for every template
      const spreads = buildBookSpreads(t.pages);
      assert.ok(spreads.length > 0, `Template ${t.id} must generate book spreads`);
    }
  });

  test('Every template provides standard description accordions', () => {
    for (const t of SONG_MAGAZINE_TEMPLATES) {
      assert.ok(t.details, `Template ${t.id} must have details object`);
      assert.ok(t.details.whatsIncluded.length >= 4, 'Must have what is included items');
      assert.ok(t.details.whatToShare.length >= 2, 'Must have what to share items');
      assert.ok(t.details.howItWorks.length >= 4, 'Must have how it works steps');
      assert.ok(t.details.privacyPolicy.headline, 'Must have privacy policy headline');
      assert.ok(t.details.privacyPolicy.text, 'Must have privacy policy text');
    }
  });

  test('MultiPageBookViewer renders Song Book heading and removes subtitle and category chips', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const viewerContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/book/MultiPageBookViewer.tsx'),
      'utf-8'
    );
    assert.ok(/Song Book\s*<\/h1>/.test(viewerContent), 'Heading must be Song Book');
    assert.ok(!/Magazines\s*<\/h1>/.test(viewerContent), 'Heading must not be Magazines');
    assert.ok(
      !viewerContent.includes('Choose your song template to preview interactive pages'),
      'Subtitle line must be removed'
    );
    assert.ok(
      !viewerContent.includes("['All', 'Romantic', 'Bollywood', 'Wedding', 'Special']"),
      'Must remove categories array from MultiPageBookViewer'
    );
    assert.ok(
      !viewerContent.includes('Category Filter Chips'),
      'Must remove Category Filter Chips section from MultiPageBookViewer'
    );
  });
});
