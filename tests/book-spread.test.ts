import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBookSpreads,
  INITIAL_5_PAGE_BOOK,
  CHAAR_KADAM_BOOK_PAGES,
  SONGS_BOOK_PAGES,
} from '../src/data/bookTemplates.ts';
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

  test('Chaar Kadam 11-page magazine contains all downloaded high-res template pages', () => {
    assert.equal(CHAAR_KADAM_BOOK_PAGES.length, 11);


    const spreads = buildBookSpreads(CHAAR_KADAM_BOOK_PAGES);
    assert.equal(spreads.length, 6);

    // Spread 0: Cover (Page 1)
    assert.equal(spreads[0].type, 'single');
    assert.equal(spreads[0].label, 'Page 1 (Cover)');
    assert.equal(spreads[0].rightPage?.referenceImage, '/templates/chaar-kadam/page_1.webp');

    // Spread 1: Inside Cover & Tum Sa Mile (Pages 2-3)
    assert.equal(spreads[1].type, 'dual');
    assert.equal(spreads[1].label, 'Pages 2–3');
    assert.equal(spreads[1].leftPage?.referenceImage, '/templates/chaar-kadam/page_2.webp');
    assert.equal(spreads[1].rightPage?.referenceImage, '/templates/chaar-kadam/page_3.webp');

    // Spread 2: Duniya Se Kaun Dare & Chaar Kadam Kya Saari Umar (Pages 4-5)
    assert.equal(spreads[2].type, 'dual');
    assert.equal(spreads[2].label, 'Pages 4–5');
    assert.equal(spreads[2].leftPage?.referenceImage, '/templates/chaar-kadam/page_4.webp');
    assert.equal(spreads[2].rightPage?.referenceImage, '/templates/chaar-kadam/page_5.webp');

    // Spread 3: Chal Dungi Saath Tere & Bin Kuch Kahe (Pages 6-7)
    assert.equal(spreads[3].type, 'dual');
    assert.equal(spreads[3].label, 'Pages 6–7');
    assert.equal(spreads[3].leftPage?.referenceImage, '/templates/chaar-kadam/page_6.webp');
    assert.equal(spreads[3].rightPage?.referenceImage, '/templates/chaar-kadam/page_7.webp');

    // Spread 4: Haathon Mein Haath Liye & Envelope (Pages 8-9)
    assert.equal(spreads[4].type, 'dual');
    assert.equal(spreads[4].label, 'Pages 8–9');
    assert.equal(spreads[4].leftPage?.referenceImage, '/templates/chaar-kadam/page_8.webp');
    assert.equal(spreads[4].rightPage?.referenceImage, '/templates/chaar-kadam/page_9.webp');

    // Spread 5: Chal Do Na & Back Cover (Pages 10-11)
    assert.equal(spreads[5].type, 'dual');
    assert.equal(spreads[5].label, 'Pages 10–11');
    assert.equal(spreads[5].leftPage?.referenceImage, '/templates/chaar-kadam/page_10.webp');
    assert.equal(spreads[5].rightPage?.referenceImage, '/templates/chaar-kadam/page_11.webp');
  });

  test('SONGS_BOOK_PAGES correctly maps the user uploaded custom pages across 13 pages', () => {
    assert.equal(SONGS_BOOK_PAGES.length, 13);

    const spreads = buildBookSpreads(SONGS_BOOK_PAGES);
    assert.equal(spreads.length, 7);

    // Spread 0: Cover - MY HOME
    assert.equal(spreads[0].type, 'single');
    assert.equal(spreads[0].label, 'Page 1 (Cover)');
    assert.equal(spreads[0].rightPage?.referenceImage, '/templates/tu-chahiye/page_1.jpg');

    // Spread 1: Left envelope note, Right "KOI AUR dooja"
    assert.equal(spreads[1].type, 'dual');
    assert.equal(spreads[1].label, 'Pages 2–3');
    assert.equal(spreads[1].leftPage?.referenceImage, '/templates/tu-chahiye/page_2.jpg');
    assert.equal(spreads[1].rightPage?.referenceImage, '/templates/tu-chahiye/page_3.jpg');

    // Spread 2: Left "NA TERE सिवा CHAIYE", Right "HAR सफ़र mein mujhe"
    assert.equal(spreads[2].type, 'dual');
    assert.equal(spreads[2].label, 'Pages 4–5');
    assert.equal(spreads[2].leftPage?.referenceImage, '/templates/tu-chahiye/page_4.jpg');
    assert.equal(spreads[2].rightPage?.referenceImage, '/templates/tu-chahiye/page_5.jpg');

    // Spread 3: Left "Tu hi रहनुमा chaiye", Right "JEENE को BAS मुझे"
    assert.equal(spreads[3].type, 'dual');
    assert.equal(spreads[3].label, 'Pages 6–7');
    assert.equal(spreads[3].leftPage?.referenceImage, '/templates/tu-chahiye/page_6.jpg');
    assert.equal(spreads[3].rightPage?.referenceImage, '/templates/tu-chahiye/page_7.jpg');

    // Spread 4: Left "Tu hi meherbaan chaiye", Right "HOOOO सीने में Agar TU दर्द है"
    assert.equal(spreads[4].type, 'dual');
    assert.equal(spreads[4].label, 'Pages 8–9');
    assert.equal(spreads[4].leftPage?.referenceImage, '/templates/tu-chahiye/page_8.jpg');
    assert.equal(spreads[4].rightPage?.referenceImage, '/templates/tu-chahiye/page_9.jpg');

    // Spread 5: Left "ना koi दवा chaiye <3", Right "i'll be there for you"
    assert.equal(spreads[5].type, 'dual');
    assert.equal(spreads[5].label, 'Pages 10–11');
    assert.equal(spreads[5].leftPage?.referenceImage, '/templates/tu-chahiye/page_10.jpg');
    assert.equal(spreads[5].rightPage?.referenceImage, '/templates/tu-chahiye/page_11.jpg');

    // Spread 6: Left "Really blessed to have you in my life", Right blank inside back cover
    assert.equal(spreads[6].type, 'dual');
    assert.equal(spreads[6].label, 'Pages 12–13');
    assert.equal(spreads[6].leftPage?.referenceImage, '/templates/tu-chahiye/page_12.jpg');
    assert.equal(spreads[6].rightPage?.referenceImage, '/templates/tu-chahiye/page_13.webp');
  });
});


