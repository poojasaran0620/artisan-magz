import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Helper to recursively collect all source and style files under a directory
function getAllFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.css', '.html', '.js']): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Exclude generated/dependency/agent directories
      if (!['node_modules', 'dist', '.agents', '.git'].includes(entry.name)) {
        files.push(...getAllFiles(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// Deprecated font families that must be completely eradicated
const DEPRECATED_FONTS = [
  'Caveat',
  'Playfair Display',
  'Courier Prime',
  'Allura',
  'Alex Brush',
  'Great Vibes',
  'Dancing Script',
] as const;

describe('Artisan Magz Luxury Typography System', () => {

  // =========================================================================
  // 1. Google Fonts Import Verification (index.html)
  // =========================================================================
  describe('1. Google Fonts Import (index.html)', () => {
    const indexPath = path.join(ROOT_DIR, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    it('loads index.html successfully', () => {
      assert.ok(indexHtml.length > 0, 'index.html should not be empty');
    });

    it('contains preconnect links for Google Fonts domains', () => {
      assert.match(
        indexHtml,
        /<link[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.googleapis\.com["']/i,
        'Should preconnect to https://fonts.googleapis.com'
      );
      assert.match(
        indexHtml,
        /<link[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.gstatic\.com["'][^>]*crossorigin/i,
        'Should preconnect to https://fonts.gstatic.com with crossorigin'
      );
    });

    it('imports Cormorant Garamond with regular and italic weights (400, 500, 600, 700)', () => {
      assert.ok(
        indexHtml.includes('Cormorant+Garamond') || indexHtml.includes('Cormorant Garamond'),
        'Google Fonts link must include Cormorant Garamond'
      );
      const fontUrlMatch = indexHtml.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/);
      assert.ok(fontUrlMatch, 'Must contain a valid Google Fonts css2 URL');

      const fontUrl = fontUrlMatch[0];
      assert.match(fontUrl, /family=Cormorant\+Garamond:[^&]+/, 'Should configure Cormorant Garamond styles');
      assert.ok(fontUrl.includes('ital,wght@'), 'Cormorant Garamond must specify both italic and upright weights');
      assert.ok(fontUrl.includes('0,400'), 'Must include Cormorant Garamond regular 400');
      assert.ok(fontUrl.includes('0,500'), 'Must include Cormorant Garamond regular 500');
      assert.ok(fontUrl.includes('0,600'), 'Must include Cormorant Garamond regular 600');
      assert.ok(fontUrl.includes('0,700'), 'Must include Cormorant Garamond regular 700');
      assert.ok(fontUrl.includes('1,400'), 'Must include Cormorant Garamond italic 400');
      assert.ok(fontUrl.includes('1,500') || fontUrl.includes('1,600') || fontUrl.includes('1,700'), 'Must include Cormorant Garamond italic weights');
    });

    it('imports Plus Jakarta Sans with weights (300, 400, 500, 600, 700)', () => {
      const fontUrlMatch = indexHtml.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/);
      assert.ok(fontUrlMatch, 'Must contain a valid Google Fonts css2 URL');
      const fontUrl = fontUrlMatch[0];

      assert.ok(
        fontUrl.includes('Plus+Jakarta+Sans'),
        'Google Fonts link must include Plus Jakarta Sans'
      );
      assert.match(
        fontUrl,
        /family=Plus\+Jakarta\+Sans:wght@[^&]*300/,
        'Plus Jakarta Sans must include weight 300'
      );
      assert.match(
        fontUrl,
        /family=Plus\+Jakarta\+Sans:wght@[^&]*400/,
        'Plus Jakarta Sans must include weight 400'
      );
      assert.match(
        fontUrl,
        /family=Plus\+Jakarta\+Sans:wght@[^&]*500/,
        'Plus Jakarta Sans must include weight 500'
      );
      assert.match(
        fontUrl,
        /family=Plus\+Jakarta\+Sans:wght@[^&]*600/,
        'Plus Jakarta Sans must include weight 600'
      );
      assert.match(
        fontUrl,
        /family=Plus\+Jakarta\+Sans:wght@[^&]*700/,
        'Plus Jakarta Sans must include weight 700'
      );
    });

    it('imports JetBrains Mono with weights (400, 500, 600)', () => {
      const fontUrlMatch = indexHtml.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/);
      assert.ok(fontUrlMatch, 'Must contain a valid Google Fonts css2 URL');
      const fontUrl = fontUrlMatch[0];

      assert.ok(
        fontUrl.includes('JetBrains+Mono'),
        'Google Fonts link must include JetBrains Mono'
      );
      assert.match(
        fontUrl,
        /family=JetBrains\+Mono:wght@[^&]*400/,
        'JetBrains Mono must include weight 400'
      );
      assert.match(
        fontUrl,
        /family=JetBrains\+Mono:wght@[^&]*500/,
        'JetBrains Mono must include weight 500'
      );
      assert.match(
        fontUrl,
        /family=JetBrains\+Mono:wght@[^&]*600/,
        'JetBrains Mono must include weight 600'
      );
    });

    it('specifies display=swap for font display optimization', () => {
      const fontUrlMatch = indexHtml.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/);
      assert.ok(fontUrlMatch, 'Must contain a valid Google Fonts css2 URL');
      assert.ok(fontUrlMatch[0].includes('display=swap'), 'Google Fonts link must have display=swap');
    });

    it('contains zero deprecated font families in index.html', () => {
      for (const deprecated of DEPRECATED_FONTS) {
        assert.ok(
          !indexHtml.toLowerCase().includes(deprecated.toLowerCase()),
          `index.html must not contain deprecated font: ${deprecated}`
        );
      }
    });
  });

  // =========================================================================
  // 2. Tailwind Configuration Verification (tailwind.config.js)
  // =========================================================================
  describe('2. Tailwind Configuration (tailwind.config.js)', () => {
    const tailwindPath = path.join(ROOT_DIR, 'tailwind.config.js');
    const tailwindRaw = fs.readFileSync(tailwindPath, 'utf-8');

    it('maps serif to Cormorant Garamond with standard fallbacks', async () => {
      const config = (await import('../tailwind.config.js')).default;
      const fontFamily = config.theme?.extend?.fontFamily;
      assert.ok(fontFamily, 'tailwind.config.js must define theme.extend.fontFamily');

      assert.ok(Array.isArray(fontFamily.serif), 'fontFamily.serif must be an array');
      assert.ok(
        fontFamily.serif.some((f: string) => f.includes('Cormorant Garamond')),
        'serif font family must include Cormorant Garamond'
      );
      assert.ok(
        fontFamily.serif.includes('serif'),
        'serif font family must include generic "serif" fallback'
      );
    });

    it('maps sans to Plus Jakarta Sans with standard fallbacks', async () => {
      const config = (await import('../tailwind.config.js')).default;
      const fontFamily = config.theme?.extend?.fontFamily;

      assert.ok(Array.isArray(fontFamily.sans), 'fontFamily.sans must be an array');
      assert.ok(
        fontFamily.sans.some((f: string) => f.includes('Plus Jakarta Sans')),
        'sans font family must include Plus Jakarta Sans'
      );
      assert.ok(
        fontFamily.sans.includes('sans-serif'),
        'sans font family must include generic "sans-serif" fallback'
      );
    });

    it('maps mono to JetBrains Mono with monospace fallback', async () => {
      const config = (await import('../tailwind.config.js')).default;
      const fontFamily = config.theme?.extend?.fontFamily;

      assert.ok(Array.isArray(fontFamily.mono), 'fontFamily.mono must be an array');
      assert.ok(
        fontFamily.mono.some((f: string) => f.includes('JetBrains Mono')),
        'mono font family must include JetBrains Mono'
      );
      assert.ok(
        fontFamily.mono.includes('monospace'),
        'mono font family must include generic "monospace" fallback'
      );
    });

    it('does not contain script or logo font family definitions', async () => {
      const config = (await import('../tailwind.config.js')).default;
      const fontFamily = config.theme?.extend?.fontFamily || {};

      assert.equal(fontFamily.script, undefined, 'script font family key must be removed');
      assert.equal(fontFamily.logo, undefined, 'logo font family key must be removed');
    });

    it('contains zero deprecated font names in tailwind.config.js source', () => {
      for (const deprecated of DEPRECATED_FONTS) {
        assert.ok(
          !tailwindRaw.toLowerCase().includes(deprecated.toLowerCase()),
          `tailwind.config.js must not contain deprecated font: ${deprecated}`
        );
      }
    });
  });

  // =========================================================================
  // 3. Global CSS Base Rules Verification (src/index.css)
  // =========================================================================
  describe('3. Global CSS Base Rules (src/index.css)', () => {
    const cssPath = path.join(SRC_DIR, 'index.css');
    const indexCss = fs.readFileSync(cssPath, 'utf-8');

    it('sets default headings (h1, h2, h3, h4, .font-serif) to Cormorant Garamond', () => {
      assert.match(
        indexCss,
        /h1,\s*h2,\s*h3,\s*h4,\s*\.font-serif\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"]/i,
        'Headings and .font-serif must be mapped to Cormorant Garamond'
      );
    });

    it('sets body font-family to Plus Jakarta Sans', () => {
      assert.match(
        indexCss,
        /body\s*\{[^}]*font-family:\s*['"]Plus Jakarta Sans['"]/i,
        'body must default to Plus Jakarta Sans'
      );
    });

    it('completely removes .font-script rule block from CSS', () => {
      assert.ok(
        !indexCss.includes('.font-script'),
        '.font-script CSS class rule block must be completely removed'
      );
    });

    it('configures .newspaper-font-headline to Cormorant Garamond', () => {
      assert.match(
        indexCss,
        /\.newspaper-font-headline\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"]/i,
        '.newspaper-font-headline must use Cormorant Garamond'
      );
    });

    it('configures .newspaper-font-body to Plus Jakarta Sans', () => {
      assert.match(
        indexCss,
        /\.newspaper-font-body\s*\{[^}]*font-family:\s*['"]Plus Jakarta Sans['"]/i,
        '.newspaper-font-body must use Plus Jakarta Sans'
      );
    });

    it('contains zero deprecated font names in src/index.css', () => {
      for (const deprecated of DEPRECATED_FONTS) {
        assert.ok(
          !indexCss.toLowerCase().includes(deprecated.toLowerCase()),
          `src/index.css must not contain deprecated font: ${deprecated}`
        );
      }
    });
  });

  // =========================================================================
  // 4. Admin KPI Metric Cards Verification (src/components/admin/AdminKPICards.tsx)
  // =========================================================================
  describe('4. Admin KPI Metric Cards (src/components/admin/AdminKPICards.tsx)', () => {
    const kpiPath = path.join(SRC_DIR, 'components', 'admin', 'AdminKPICards.tsx');
    const kpiContent = fs.readFileSync(kpiPath, 'utf-8');

    it('renders metric value numbers with font-sans, font-bold, and tabular-nums', () => {
      assert.match(
        kpiContent,
        /font-sans\s+font-bold\s+tabular-nums|tabular-nums\s+font-sans\s+font-bold|font-bold\s+font-sans\s+tabular-nums/,
        'Admin KPI cards metric values must render in font-sans font-bold tabular-nums'
      );
    });

    it('does not render metric values using font-serif', () => {
      const cardValueMatch = kpiContent.match(/<div className=\{`\${card\.color}[^`]*`\}>\s*\{card\.value\}\s*<\/div>/);
      assert.ok(cardValueMatch, 'Must find metric value container');
      assert.ok(
        !cardValueMatch[0].includes('font-serif'),
        'Metric value container must not use font-serif'
      );
    });
  });

  // =========================================================================
  // 5. Hamper Builder Dedication Card Note Verification (HamperBuilder.tsx)
  // =========================================================================
  describe('5. Hamper Builder Dedication Card Note (src/components/hamper/HamperBuilder.tsx)', () => {
    const hamperPath = path.join(SRC_DIR, 'components', 'hamper', 'HamperBuilder.tsx');
    const hamperContent = fs.readFileSync(hamperPath, 'utf-8');

    it('renders dedication card message textarea with font-serif and italic', () => {
      const textareaMatch = hamperContent.match(/<textarea[\s\S]*?value=\{cardMessage\}[\s\S]*?\/>/);
      assert.ok(textareaMatch, 'Must find cardMessage textarea element');
      const textareaTag = textareaMatch[0];
      assert.ok(
        textareaTag.includes('font-serif') && textareaTag.includes('italic'),
        'Dedication card message textarea must include font-serif italic'
      );
    });
  });

  // =========================================================================
  // 6. Monospace Precision & Discipline Across Storefront
  // =========================================================================
  describe('6. Monospace Precision & Discipline Across Storefront', () => {
    it('uses font-mono for order reference ID in CheckoutModal.tsx', () => {
      const checkoutPath = path.join(SRC_DIR, 'components', 'cart', 'CheckoutModal.tsx');
      const checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
      assert.match(
        checkoutContent,
        /<p className=["'][^"']*font-mono[^"']*["']>\s*#\{orderId\}\s*<\/p>/,
        'CheckoutModal order reference ID #{orderId} must use font-mono'
      );
    });

    it('uses font-mono for customer phone input in CheckoutModal.tsx', () => {
      const checkoutPath = path.join(SRC_DIR, 'components', 'cart', 'CheckoutModal.tsx');
      const checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
      assert.match(
        checkoutContent,
        /<input[\s\S]*?type=["']tel["'][\s\S]*?font-mono[\s\S]*?\/>/,
        'CheckoutModal phone input must use font-mono'
      );
    });

    it('uses font-mono for order number in MyOrdersModal.tsx', () => {
      const ordersPath = path.join(SRC_DIR, 'components', 'account', 'MyOrdersModal.tsx');
      const ordersContent = fs.readFileSync(ordersPath, 'utf-8');
      assert.match(
        ordersContent,
        /<span className=["'][^"']*font-mono[^"']*["']>\s*Order #\{order\.orderNumber\}\s*<\/span>/,
        'MyOrdersModal order number must use font-mono'
      );
    });

    it('uses font-mono for order number, customer phone, payment ID, and tracking in AdminOrderCard.tsx', () => {
      const adminOrderPath = path.join(SRC_DIR, 'components', 'admin', 'AdminOrderCard.tsx');
      const adminOrderContent = fs.readFileSync(adminOrderPath, 'utf-8');

      // Order number
      assert.match(
        adminOrderContent,
        /<span className=["'][^"']*font-mono[^"']*["']>\s*\{order\.orderNumber\}\s*<\/span>/,
        'AdminOrderCard order number must use font-mono'
      );

      // Customer phone
      assert.match(
        adminOrderContent,
        /<span className=["'][^"']*font-mono[^"']*["']>\s*\{order\.deliveryAddress\.phone\}\s*<\/span>/,
        'AdminOrderCard customer phone must use font-mono'
      );

      // Payment ID
      assert.match(
        adminOrderContent,
        /<span className=["'][^"']*font-mono[^"']*["']>\s*\{order\.paymentId\}\s*<\/span>/,
        'AdminOrderCard paymentId must use font-mono'
      );

      // Courier tracking input
      assert.match(
        adminOrderContent,
        /<input[\s\S]*?placeholder=["']e\.g\. BlueDart AWB[\s\S]*?font-mono[\s\S]*?\/>/,
        'AdminOrderCard courier tracking input must use font-mono'
      );
    });

    it('uses font-mono for coupon code input in CartDrawer.tsx', () => {
      const cartDrawerPath = path.join(SRC_DIR, 'components', 'cart', 'CartDrawer.tsx');
      const cartDrawerContent = fs.readFileSync(cartDrawerPath, 'utf-8');
      assert.match(
        cartDrawerContent,
        /<input[\s\S]*?placeholder=["']Enter Coupon[\s\S]*?font-mono[\s\S]*?\/>/,
        'CartDrawer coupon input must use font-mono'
      );
    });

    it('uses font-mono for timecodes and Spotify scan barcode in SongBookCustomizer.tsx', () => {
      const songPath = path.join(SRC_DIR, 'components', 'product', 'customizers', 'SongBookCustomizer.tsx');
      const songContent = fs.readFileSync(songPath, 'utf-8');
      assert.match(
        songContent,
        /font-mono[\s\S]*?1:24[\s\S]*?3:48/,
        'SongBook timecodes must use font-mono'
      );
      assert.match(
        songContent,
        /font-mono[\s\S]*?SPOTIFY SCAN CODE/,
        'SongBook Spotify code must use font-mono'
      );
    });

    it('uses font-mono for ISBN in MagazinePageSpread.tsx', () => {
      const spreadPath = path.join(SRC_DIR, 'components', 'magazine', 'MagazinePageSpread.tsx');
      const spreadContent = fs.readFileSync(spreadPath, 'utf-8');
      assert.match(
        spreadContent,
        /font-mono[\s\S]*?ISBN 978-ARTISAN-01/,
        'MagazinePageSpread ISBN barcode must use font-mono'
      );
    });

    it('uses font-mono for lead phone in AdminDashboard.tsx inquiry modal', () => {
      const dashPath = path.join(SRC_DIR, 'components', 'admin', 'AdminDashboard.tsx');
      const dashContent = fs.readFileSync(dashPath, 'utf-8');
      assert.match(
        dashContent,
        /<span className=["'][^"']*font-mono[^"']*["']>\s*\{inquiry\.phone\}\s*<\/span>/,
        'AdminDashboard inquiry modal phone must use font-mono'
      );
    });

    it('enforces monospace discipline by using tabular-nums rather than font-mono for numeric prices and counters', () => {
      const myOrdersPath = path.join(SRC_DIR, 'components', 'account', 'MyOrdersModal.tsx');
      const myOrdersContent = fs.readFileSync(myOrdersPath, 'utf-8');
      assert.match(
        myOrdersContent,
        /font-sans\s+tabular-nums|tabular-nums\s+font-sans/,
        'MyOrdersModal item prices should use font-sans tabular-nums'
      );

      const magazineBuilderPath = path.join(SRC_DIR, 'components', 'magazine', 'MagazineBuilder.tsx');
      const magazineBuilderContent = fs.readFileSync(magazineBuilderPath, 'utf-8');
      assert.match(
        magazineBuilderContent,
        /font-sans\s+text-xl\s+sm:text-2xl\s+font-bold\s+tabular-nums|font-sans\s+font-bold\s+tabular-nums/,
        'MagazineBuilder total price display should use font-sans tabular-nums'
      );
    });
  });

  // =========================================================================
  // 7. Complete Deprecated Font Class Purge Verification across src/
  // =========================================================================
  describe('7. Deprecated Font Class and Family Purge across src/', () => {
    const srcFiles = getAllFiles(SRC_DIR, ['.ts', '.tsx', '.css']);

    it('scans a substantial codebase in src/ (at least 50 files)', () => {
      assert.ok(
        srcFiles.length >= 50,
        `Expected at least 50 files in src/, found ${srcFiles.length}`
      );
    });

    it('zero occurrences of font-script across all files in src/', () => {
      const violations: string[] = [];

      for (const file of srcFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('font-script')) {
          violations.push(path.relative(ROOT_DIR, file));
        }
      }

      assert.deepEqual(
        violations,
        [],
        `Found font-script in files: ${violations.join(', ')}`
      );
    });

    it('zero occurrences of font-logo across all files in src/', () => {
      const violations: string[] = [];

      for (const file of srcFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('font-logo')) {
          violations.push(path.relative(ROOT_DIR, file));
        }
      }

      assert.deepEqual(
        violations,
        [],
        `Found font-logo in files: ${violations.join(', ')}`
      );
    });

    it('zero occurrences of deprecated font names across all files in src/', () => {
      const violations: { file: string; font: string }[] = [];

      for (const file of srcFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const font of DEPRECATED_FONTS) {
          const regex = new RegExp(`\\b${font.replace(/\s+/g, '\\s+')}\\b`, 'i');
          if (regex.test(content)) {
            violations.push({ file: path.relative(ROOT_DIR, file), font });
          }
        }
      }

      assert.deepEqual(
        violations,
        [],
        `Found deprecated font references: ${JSON.stringify(violations)}`
      );
    });
  });

  // =========================================================================
  // 8. Newspaper Customizer Broadsheet & Vintage Styles Verification
  // =========================================================================
  describe('8. Newspaper Customizer Broadsheet & Vintage Styles', () => {
    const newspaperPath = path.join(SRC_DIR, 'components', 'product', 'customizers', 'NewspaperCustomizer.tsx');
    const newspaperContent = fs.readFileSync(newspaperPath, 'utf-8');

    it('renders broadsheet preview headline with font-serif and font-black', () => {
      assert.match(
        newspaperContent,
        /<h2 className=["'][^"']*font-serif[^"']*font-black[^"']*["']>\s*\{headline\}\s*<\/h2>/,
        'Newspaper broadsheet headline must use font-serif font-black'
      );
    });

    it('renders article story input with font-sans', () => {
      const textareaMatch = newspaperContent.match(/<textarea[\s\S]*?articleStory[\s\S]*?\/>/);
      assert.ok(textareaMatch, 'Must find articleStory textarea');
      assert.ok(
        textareaMatch[0].includes('font-sans'),
        'Newspaper articleStory textarea must use font-sans'
      );
    });
  });

  // =========================================================================
  // 9. Romantic Accents & Editorial Serif Roles Across Key Storefront Pages
  // =========================================================================
  describe('9. Romantic Accents & Editorial Serif Across Storefront Pages', () => {
    it('uses font-serif italic for Best Selling section header in ProductCategoriesSection.tsx', () => {
      const catPath = path.join(SRC_DIR, 'components', 'home', 'ProductCategoriesSection.tsx');
      const catContent = fs.readFileSync(catPath, 'utf-8');
      assert.match(
        catContent,
        /<h2 className=["'][^"']*font-serif\s+italic[^"']*["']>\s*Best Selling\s*<\/h2>/,
        'Best Selling title must use font-serif italic'
      );
    });

    it('uses font-serif italic for Meet the Founders and Our Story in AboutUsSection.tsx', () => {
      const aboutPath = path.join(SRC_DIR, 'components', 'home', 'AboutUsSection.tsx');
      const aboutContent = fs.readFileSync(aboutPath, 'utf-8');
      assert.match(
        aboutContent,
        /<h2 className=["'][^"']*font-serif\s+italic[^"']*["']>\s*Meet the Founders\s*<\/h2>/,
        'Meet the Founders must use font-serif italic'
      );
      assert.match(
        aboutContent,
        /<h3 className=["'][^"']*font-serif\s+italic[^"']*["']>\s*Our Story\s*<\/h3>/,
        'Our Story must use font-serif italic'
      );
    });

    it('uses font-serif italic for Bulk Orders title in BulkOrderPage.tsx', () => {
      const bulkPath = path.join(SRC_DIR, 'components', 'bulk', 'BulkOrderPage.tsx');
      const bulkContent = fs.readFileSync(bulkPath, 'utf-8');
      assert.match(
        bulkContent,
        /<h1 className=["'][^"']*font-serif\s+italic[^"']*["']>[^<]*Bulk Orders/,
        'Bulk Orders header must use font-serif italic'
      );
    });

    it('uses font-serif italic for brand logo in Footer.tsx', () => {
      const footerPath = path.join(SRC_DIR, 'components', 'layout', 'Footer.tsx');
      const footerContent = fs.readFileSync(footerPath, 'utf-8');
      assert.match(
        footerContent,
        /<span className=["'][^"']*font-serif\s+italic[^"']*["']>\s*Artisan\s*<\/span>/,
        'Footer Artisan brand mark must use font-serif italic'
      );
    });

    it('uses font-serif italic for customer reviews and testimonials', () => {
      const reviewsPath = path.join(SRC_DIR, 'components', 'reviews', 'ReviewsPage.tsx');
      const reviewsContent = fs.readFileSync(reviewsPath, 'utf-8');
      assert.match(
        reviewsContent,
        /<p className=["'][^"']*font-serif\s+italic[^"']*["']>\s*"\{rev\.comment\}"\s*<\/p>/,
        'ReviewsPage quotes must use font-serif italic'
      );

      const testimonialPath = path.join(SRC_DIR, 'components', 'home', 'TestimonialSection.tsx');
      const testimonialContent = fs.readFileSync(testimonialPath, 'utf-8');
      assert.match(
        testimonialContent,
        /<p className=["'][^"']*font-serif\s+italic[^"']*["']>\s*"\{review\.comment\}"\s*<\/p>/,
        'Testimonial quotes must use font-serif italic'
      );
    });
  });

});
