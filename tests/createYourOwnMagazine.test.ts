import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculateSpreadsCount,
  CUSTOM_MAGAZINE_OCCASIONS,
  CUSTOM_MAGAZINE_PACKAGES,
  CUSTOM_MAGAZINE_ADDONS,
  CUSTOM_MAGAZINE_SPREADS,
} from '../src/data/customMagazineTemplates.ts';
import type { CustomOccasionId } from '../src/data/customMagazineTemplates.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Create Your Own Magazine System', () => {
  // 1. Spreads Calculation Formula
  describe('1. Magazine Spreads Calculation Formula', () => {
    it('calculates 3 spreads for 8 pages (2 fixed covers + 6 inside pages)', () => {
      assert.strictEqual(calculateSpreadsCount(8), 3);
    });

    it('calculates 5 spreads for 12 pages (2 fixed covers + 10 inside pages)', () => {
      assert.strictEqual(calculateSpreadsCount(12), 5);
    });

    it('calculates 7 spreads for 16 pages (2 fixed covers + 14 inside pages)', () => {
      assert.strictEqual(calculateSpreadsCount(16), 7);
    });

    it('calculates 9 spreads for 20 pages (2 fixed covers + 18 inside pages)', () => {
      assert.strictEqual(calculateSpreadsCount(20), 9);
    });

    it('handles edge cases gracefully', () => {
      assert.strictEqual(calculateSpreadsCount(2), 0);
      assert.strictEqual(calculateSpreadsCount(0), 0);
    });
  });

  // 2. Occasion Configuration
  describe('2. Occasion Configuration', () => {
    it('contains all 6 required occasions', () => {
      const occasionIds = CUSTOM_MAGAZINE_OCCASIONS.map((o) => o.id);
      assert.deepStrictEqual(occasionIds, [
        'birthday',
        'couple',
        'friends',
        'wedding',
        'travel',
        'just-because',
      ]);
    });

    it('each occasion has complete metadata and pre-designed covers', () => {
      for (const occ of CUSTOM_MAGAZINE_OCCASIONS) {
        assert.ok(occ.name.length > 0, `Occasion ${occ.id} must have a name`);
        assert.ok(occ.tagline.length > 0, `Occasion ${occ.id} must have a tagline`);
        assert.ok(occ.frontCoverImage.length > 0, `Occasion ${occ.id} must have a front cover image`);
        assert.ok(occ.backCoverImage.length > 0, `Occasion ${occ.id} must have a back cover image`);
        assert.ok(occ.frontCoverTitle.length > 0, `Occasion ${occ.id} must have a front cover title`);
      }
    });
  });

  // 3. Package Configuration
  describe('3. Package Configuration', () => {
    it('contains exactly 4 package options with correct pricing and spread counts', () => {
      assert.strictEqual(CUSTOM_MAGAZINE_PACKAGES.length, 4);

      const [p8, p12, p16, p20] = CUSTOM_MAGAZINE_PACKAGES;

      assert.strictEqual(p8.totalPages, 8);
      assert.strictEqual(p8.price, 899);
      assert.strictEqual(p8.spreadsCount, 3);

      assert.strictEqual(p12.totalPages, 12);
      assert.strictEqual(p12.price, 1199);
      assert.strictEqual(p12.spreadsCount, 5);

      assert.strictEqual(p16.totalPages, 16);
      assert.strictEqual(p16.price, 1499);
      assert.strictEqual(p16.spreadsCount, 7);

      assert.strictEqual(p20.totalPages, 20);
      assert.strictEqual(p20.price, 1799);
      assert.strictEqual(p20.spreadsCount, 9);
    });
  });

  // 4. Spread Templates Library
  describe('4. Spread Templates Library', () => {
    const occasions: CustomOccasionId[] = [
      'birthday',
      'couple',
      'friends',
      'wedding',
      'travel',
      'just-because',
    ];

    it('provides at least 7 distinct 2-page spread templates for every occasion', () => {
      for (const occ of occasions) {
        const spreads = CUSTOM_MAGAZINE_SPREADS[occ];
        assert.ok(
          spreads && spreads.length >= 7,
          `Occasion ${occ} must have at least 7 spread templates (found ${spreads?.length || 0})`
        );

        // Verify side-by-side structure
        for (const spread of spreads) {
          assert.ok(spread.leftPageTitle.length > 0, `Spread ${spread.id} left page title`);
          assert.ok(spread.rightPageTitle.length > 0, `Spread ${spread.id} right page title`);
          assert.ok(spread.leftPageImage.length > 0, `Spread ${spread.id} left page image`);
          assert.ok(spread.rightPageImage.length > 0, `Spread ${spread.id} right page image`);
          assert.strictEqual(spread.occasionId, occ);
        }
      }
    });
  });

  // 5. Add-ons Configuration & Math
  describe('5. Add-ons Configuration & Math', () => {
    it('provides all 4 add-on tiers with correct prices', () => {
      assert.strictEqual(CUSTOM_MAGAZINE_ADDONS.length, 4);

      const addOnMap = new Map(CUSTOM_MAGAZINE_ADDONS.map((a) => [a.id, a]));

      assert.strictEqual(addOnMap.get('none')?.price, 0);
      assert.strictEqual(addOnMap.get('gift-box')?.price, 99);
      assert.strictEqual(addOnMap.get('handwritten-letter')?.price, 79);
      assert.strictEqual(addOnMap.get('combo')?.price, 149);
    });

    it('calculates total package + add-on pricing correctly', () => {
      const p12 = CUSTOM_MAGAZINE_PACKAGES.find((p) => p.id === 'mag-12p')!;
      const giftBox = CUSTOM_MAGAZINE_ADDONS.find((a) => a.id === 'gift-box')!;
      assert.strictEqual(p12.price + giftBox.price, 1199 + 99); // ₹1,298

      const p16 = CUSTOM_MAGAZINE_PACKAGES.find((p) => p.id === 'mag-16p')!;
      const combo = CUSTOM_MAGAZINE_ADDONS.find((a) => a.id === 'combo')!;
      assert.strictEqual(p16.price + combo.price, 1499 + 149); // ₹1,648
    });
  });

  // 6. Source Code Integrity & Routing
  describe('6. Source Code Integrity & Routing', () => {
    it('App.tsx contains create-magazine route handling and rendering', () => {
      const appPath = path.join(ROOT_DIR, 'src', 'App.tsx');
      const appContent = fs.readFileSync(appPath, 'utf-8');

      assert.ok(appContent.includes('create-magazine'), 'App.tsx should reference create-magazine');
      assert.ok(
        appContent.includes('CreateYourOwnMagazine'),
        'App.tsx should import and render CreateYourOwnMagazine'
      );
    });

    it('Navbar.tsx contains Create Your Own navigation buttons in desktop and mobile', () => {
      const navbarPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Navbar.tsx');
      const navbarContent = fs.readFileSync(navbarPath, 'utf-8');

      assert.ok(
        navbarContent.includes("handleNavClick('create-magazine')"),
        'Navbar should link to create-magazine'
      );
      assert.ok(
        navbarContent.includes('Create Your Own'),
        'Navbar should display "Create Your Own" text'
      );
    });

    it('CreateYourOwnMagazine.tsx enforces luxury typography and monospace discipline', () => {
      const componentPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'magazine',
        'CreateYourOwnMagazine.tsx'
      );
      const content = fs.readFileSync(componentPath, 'utf-8');

      // Zero occurrences of deprecated classes
      assert.strictEqual(content.includes('font-script'), false);
      assert.strictEqual(content.includes('font-logo'), false);
      assert.strictEqual(content.includes('Caveat'), false);
      assert.strictEqual(content.includes('Playfair'), false);
      assert.strictEqual(content.includes('Courier'), false);

      // Enforces tabular-nums for numeric prices
      assert.ok(
        content.includes('tabular-nums'),
        'CreateYourOwnMagazine should use tabular-nums for prices'
      );
    });

    it('CreateYourOwnMagazine.tsx renders How It Works process overview and 3D Interactive FlipBook directly below Step 1', () => {
      const componentPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'magazine',
        'CreateYourOwnMagazine.tsx'
      );
      const content = fs.readFileSync(componentPath, 'utf-8');

      assert.ok(content.includes('How It Works'), 'Should contain How It Works process section');
      assert.ok(
        content.includes('InteractiveFlipBook'),
        'Should import and render InteractiveFlipBook'
      );
      assert.ok(
        content.includes('dynamicBookPages'),
        'Should compute dynamicBookPages matching selected package size'
      );

      // Check ordering: Step 1 is Size and Step 2 is Occasion
      const step1Index = content.indexOf('Choose Your Magazine Size');
      const flipBookIndex = content.indexOf('<InteractiveFlipBook');
      const step2Index = content.indexOf('What is your magazine for?');

      assert.ok(step1Index !== -1, 'Step 1 Choose Your Magazine Size must exist');
      assert.ok(flipBookIndex !== -1, 'InteractiveFlipBook must exist');
      assert.ok(step2Index !== -1, 'Step 2 What is your magazine for? must exist');

      assert.ok(
        step1Index < flipBookIndex,
        'InteractiveFlipBook must be located below Step 1 (Size)'
      );
      assert.ok(
        flipBookIndex < step2Index,
        'InteractiveFlipBook must be located above Step 2 (Occasion)'
      );
    });
  });
});
