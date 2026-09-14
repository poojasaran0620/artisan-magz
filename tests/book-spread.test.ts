import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildBookSpreads, INITIAL_5_PAGE_BOOK } from '../src/data/bookTemplates.ts';
import type { BookPage } from '../src/types/book.ts';

describe('Multi-Page Physical Book Spread System', () => {
  test('Page 1 is created as a single standalone page (Spread 0)', () => {
    const spreads = buildBookSpreads(INITIAL_5_PAGE_BOOK);
    assert.ok(spreads.length >= 3, 'Spreads array must contain at least 3 spreads for 5 pages');

    const spread0 = spreads[0];
    assert.equal(spread0.spreadIndex, 0);
    assert.equal(spread0.type, 'single');
    assert.equal(spread0.label, 'Page 1 (Cover)');
    assert.equal(spread0.leftPage, undefined, 'Spread 0 must not have a left page');
    assert.equal(spread0.rightPage?.pageNumber, 1, 'Spread 0 rightPage must be Page 1');
  });

  test('Pages 2–3 are grouped as a two-page spread displayed side-by-side (Spread 1)', () => {
    const spreads = buildBookSpreads(INITIAL_5_PAGE_BOOK);
    const spread1 = spreads[1];

    assert.equal(spread1.spreadIndex, 1);
    assert.equal(spread1.type, 'dual');
    assert.equal(spread1.label, 'Pages 2–3');
    assert.ok(spread1.leftPage, 'Spread 1 must have leftPage');
    assert.ok(spread1.rightPage, 'Spread 1 must have rightPage');
    assert.equal(spread1.leftPage?.pageNumber, 2);
    assert.equal(spread1.rightPage?.pageNumber, 3);
  });

  test('Pages 4–5 are grouped as the next two-page spread displayed side-by-side (Spread 2)', () => {
    const spreads = buildBookSpreads(INITIAL_5_PAGE_BOOK);
    const spread2 = spreads[2];

    assert.equal(spread2.spreadIndex, 2);
    assert.equal(spread2.type, 'dual');
    assert.equal(spread2.label, 'Pages 4–5');
    assert.ok(spread2.leftPage, 'Spread 2 must have leftPage');
    assert.ok(spread2.rightPage, 'Spread 2 must have rightPage');
    assert.equal(spread2.leftPage?.pageNumber, 4);
    assert.equal(spread2.rightPage?.pageNumber, 5);
  });

  test('Continuous structure holds for arbitrary page counts (e.g. 8 pages, 12 pages)', () => {
    // Generate dummy 8-page book
    const mock8Pages: BookPage[] = Array.from({ length: 8 }, (_, i) => ({
      id: `p-${i + 1}`,
      pageNumber: i + 1,
      side: i === 0 ? 'standalone' : (i + 1) % 2 === 0 ? 'left' : 'right',
      templateId: `tpl-${i + 1}`,
      photos: [],
      texts: [],
    }));

    const spreads8 = buildBookSpreads(mock8Pages);
    // Spread 0: Page 1 (Cover)
    // Spread 1: Pages 2–3
    // Spread 2: Pages 4–5
    // Spread 3: Pages 6–7
    // Spread 4: Page 8 (Back Cover standalone)
    assert.equal(spreads8.length, 5);
    assert.equal(spreads8[0].label, 'Page 1 (Cover)');
    assert.equal(spreads8[1].label, 'Pages 2–3');
    assert.equal(spreads8[2].label, 'Pages 4–5');
    assert.equal(spreads8[3].label, 'Pages 6–7');
    assert.equal(spreads8[4].label, 'Page 8 (Back Cover)');
  });

  test('Initial 5-page book contains slots for photos and text across all pages', () => {
    assert.equal(INITIAL_5_PAGE_BOOK.length, 5);
    for (const page of INITIAL_5_PAGE_BOOK) {
      assert.ok(page.pageNumber >= 1 && page.pageNumber <= 5);
      assert.ok(Array.isArray(page.photos), `Page ${page.pageNumber} must have photos array`);
      assert.ok(Array.isArray(page.texts), `Page ${page.pageNumber} must have texts array`);
    }
  });
});
