import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

function getAllSourceFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.css', '.html', '.js']): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.agents', '.git'].includes(entry.name)) {
        files.push(...getAllSourceFiles(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

describe('Milestone 4 Adversarial Stress Testing: Responsive Viewports & Font Fallbacks', () => {

  // =========================================================================
  // 1. Font Fallback Chains & Google Fonts CDN Resilience
  // =========================================================================
  describe('1. Font Fallback Chains & Google Fonts CDN Resilience', () => {
    it('tailwind.config.js defines valid system and generic fallbacks for serif, sans, and mono', async () => {
      const config = (await import('../tailwind.config.js')).default;
      const fontFamily = config.theme?.extend?.fontFamily;

      assert.ok(fontFamily, 'tailwind.config.js must define fontFamily');

      // Serif fallback chain
      assert.ok(Array.isArray(fontFamily.serif), 'fontFamily.serif must be an array');
      assert.equal(fontFamily.serif[0], '"Cormorant Garamond"', 'Primary serif must be Cormorant Garamond');
      assert.ok(fontFamily.serif.includes('Georgia'), 'Serif must include Georgia as robust system fallback');
      assert.ok(fontFamily.serif.includes('serif'), 'Serif must terminate with generic serif fallback');
      assert.equal(fontFamily.serif[fontFamily.serif.length - 1], 'serif', 'Generic serif must be the final fallback');

      // Sans fallback chain
      assert.ok(Array.isArray(fontFamily.sans), 'fontFamily.sans must be an array');
      assert.equal(fontFamily.sans[0], '"Plus Jakarta Sans"', 'Primary sans must be Plus Jakarta Sans');
      assert.ok(fontFamily.sans.includes('system-ui'), 'Sans must include system-ui');
      assert.ok(fontFamily.sans.includes('-apple-system'), 'Sans must include -apple-system');
      assert.ok(fontFamily.sans.includes('sans-serif'), 'Sans must terminate with generic sans-serif fallback');
      assert.equal(fontFamily.sans[fontFamily.sans.length - 1], 'sans-serif', 'Generic sans-serif must be the final fallback');

      // Mono fallback chain
      assert.ok(Array.isArray(fontFamily.mono), 'fontFamily.mono must be an array');
      assert.equal(fontFamily.mono[0], '"JetBrains Mono"', 'Primary mono must be JetBrains Mono');
      assert.ok(fontFamily.mono.includes('monospace'), 'Mono must terminate with generic monospace fallback');
      assert.equal(fontFamily.mono[fontFamily.mono.length - 1], 'monospace', 'Generic monospace must be the final fallback');
    });

    it('src/index.css specifies valid fallback chains for body, headings, and newspaper classes', () => {
      const cssPath = path.join(SRC_DIR, 'index.css');
      const css = fs.readFileSync(cssPath, 'utf-8');

      // Body rule
      assert.match(
        css,
        /body\s*\{[^}]*font-family:\s*['"]Plus Jakarta Sans['"],\s*system-ui,\s*-apple-system,\s*sans-serif;/i,
        'Body font-family must include Plus Jakarta Sans with full system-ui, -apple-system, sans-serif fallbacks'
      );

      // Heading and .font-serif rule
      assert.match(
        css,
        /h1,\s*h2,\s*h3,\s*h4,\s*\.font-serif\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"],\s*Georgia,\s*serif;/i,
        'Headings and .font-serif must include Cormorant Garamond with Georgia, serif fallbacks'
      );

      // Newspaper classes
      assert.match(
        css,
        /\.newspaper-font-headline\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"],\s*Georgia,\s*serif;/i,
        '.newspaper-font-headline must include Cormorant Garamond with Georgia, serif fallbacks'
      );

      assert.match(
        css,
        /\.newspaper-font-body\s*\{[^}]*font-family:\s*['"]Plus Jakarta Sans['"],\s*system-ui,\s*-apple-system,\s*sans-serif;/i,
        '.newspaper-font-body must include Plus Jakarta Sans with system-ui, -apple-system, sans-serif fallbacks'
      );
    });

    it('all font-family declarations in source code terminate in standard generic CSS font family keywords', () => {
      const allFiles = getAllSourceFiles(SRC_DIR, ['.css', '.ts', '.tsx', '.html']);
      const genericKeywords = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];

      for (const file of allFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const matches = content.matchAll(/font-family:\s*([^;]+);/gi);
        for (const match of matches) {
          const rule = match[1].trim();
          const hasGeneric = genericKeywords.some(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(rule);
          });
          assert.ok(
            hasGeneric,
            `File ${path.relative(ROOT_DIR, file)} has font-family without generic fallback: ${rule}`
          );
        }
      }
    });

    it('index.html font stylesheet link specifies display=swap to prevent FOIT during slow CDN connections', () => {
      const htmlPath = path.join(ROOT_DIR, 'index.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      assert.ok(html.includes('display=swap'), 'Google fonts URL must declare display=swap for seamless fallback rendering');
    });
  });

  // =========================================================================
  // 2. Mobile Viewport (375px) Layout Safety & Wrapping Stress Testing
  // =========================================================================
  describe('2. Mobile Viewport (375px) Layout Safety & Wrapping', () => {
    it('no storefront component contains fixed pixel widths > 360px without responsive container constraints', () => {
      const tsxFiles = getAllSourceFiles(path.join(SRC_DIR, 'components'), ['.tsx']);
      const violations: { file: string; match: string; line: number }[] = [];

      for (const file of tsxFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          // Look for arbitrary width classes like w-[400px] or min-w-[400px]
          const matches = line.matchAll(/\b(?:min-)?w-\[(\d+)px\]/g);
          for (const match of matches) {
            const width = parseInt(match[1], 10);
            if (width > 360) {
              // Check if line or parent element context (prior 150 lines) is conditionally hidden on mobile or inside responsive breakpoint
              const contextStart = Math.max(0, idx - 115);
              const precedingBlock = lines.slice(contextStart, idx + 1).join('\n');
              const isResponsiveScoped = precedingBlock.includes('hidden lg:block') ||
                                         precedingBlock.includes('hidden md:block') ||
                                         precedingBlock.includes('hidden sm:block') ||
                                         line.includes('hidden') ||
                                         line.includes('lg:') ||
                                         line.includes('md:') ||
                                         line.includes('sm:');
              if (!isResponsiveScoped) {
                violations.push({
                  file: path.relative(ROOT_DIR, file),
                  match: match[0],
                  line: idx + 1,
                });
              }
            }
          }
        });
      }

      assert.deepEqual(
        violations,
        [],
        `Found unbounded fixed pixel widths > 360px on mobile: ${JSON.stringify(violations)}`
      );
    });

    it('AdminKPICards layout uses 2-column mobile grid with responsive font-size to prevent number clipping at 375px', () => {
      const kpiPath = path.join(SRC_DIR, 'components', 'admin', 'AdminKPICards.tsx');
      const content = fs.readFileSync(kpiPath, 'utf-8');

      // Grid definition
      assert.match(
        content,
        /grid-cols-2\s+sm:grid-cols-3\s+lg:grid-cols-6/,
        'AdminKPICards grid must start at grid-cols-2 on mobile and scale to sm:grid-cols-3 and lg:grid-cols-6'
      );

      // Font size responsive scaling
      assert.match(
        content,
        /text-xl\s+sm:text-2xl/,
        'AdminKPICards metric number must be text-xl on mobile and scale to sm:text-2xl on larger viewports'
      );
    });

    it('HamperBuilder dedication card note textarea is full-width (w-full) without fixed-width clipping', () => {
      const hamperPath = path.join(SRC_DIR, 'components', 'hamper', 'HamperBuilder.tsx');
      const content = fs.readFileSync(hamperPath, 'utf-8');

      const textareaMatch = content.match(/<textarea[\s\S]*?value=\{cardMessage\}[\s\S]*?\/>/);
      assert.ok(textareaMatch, 'Must find cardMessage textarea in HamperBuilder');
      assert.ok(
        textareaMatch[0].includes('w-full'),
        'HamperBuilder dedication textarea must use w-full for responsive viewport safety'
      );
      assert.ok(
        textareaMatch[0].includes('font-serif') && textareaMatch[0].includes('italic'),
        'HamperBuilder dedication textarea must use font-serif italic'
      );
    });

    it('AdminOrderCard order numbers and status badges wrap flexibly on narrow mobile screens (flex-wrap)', () => {
      const orderCardPath = path.join(SRC_DIR, 'components', 'admin', 'AdminOrderCard.tsx');
      const content = fs.readFileSync(orderCardPath, 'utf-8');

      // Header row must have flex-wrap
      assert.match(
        content,
        /flex items-center gap-2 flex-wrap/,
        'AdminOrderCard header badge row must declare flex-wrap so order numbers and badges never overflow 375px'
      );
      assert.match(
        content,
        /<span className=["'][^"']*font-mono[^"']*["']>\s*\{order\.orderNumber\}\s*<\/span>/,
        'AdminOrderCard orderNumber must use font-mono'
      );
    });

    it('CheckoutModal order reference ID card accommodates long order numbers and copy button within mobile constraints', () => {
      const checkoutPath = path.join(SRC_DIR, 'components', 'cart', 'CheckoutModal.tsx');
      const content = fs.readFileSync(checkoutPath, 'utf-8');

      // Order ID container check
      assert.match(
        content,
        /<p className=["'][^"']*font-mono text-sm font-bold[^"']*["']>\s*#\{orderId\}\s*<\/p>/,
        'CheckoutModal order ID must use font-mono text-sm'
      );
      assert.match(
        content,
        /flex items-center justify-between pb-3 border-b/,
        'Order ID and Copy button container must use flex items-center justify-between'
      );
    });

    it('NewspaperCustomizer broadsheet headline container is bounded with responsive text sizing', () => {
      const newsPath = path.join(SRC_DIR, 'components', 'product', 'customizers', 'NewspaperCustomizer.tsx');
      const content = fs.readFileSync(newsPath, 'utf-8');

      // Bounded preview container
      assert.match(
        content,
        /max-w-sm/,
        'NewspaperCustomizer broadsheet live preview must be bounded by max-w-sm'
      );

      // Headline responsive font-size
      assert.match(
        content,
        /text-2xl\s+sm:text-3xl\s+font-serif\s+font-black/,
        'Newspaper headline must use text-2xl on mobile and scale to sm:text-3xl font-serif font-black'
      );
    });

    it('InteractiveFlipbook responds to mobile viewport (< 640px) by switching to single-page portrait spread', () => {
      const flipbookPath = path.join(SRC_DIR, 'components', 'magazine', 'InteractiveFlipbook.tsx');
      const content = fs.readFileSync(flipbookPath, 'utf-8');

      assert.match(
        content,
        /setIsSinglePageMode\(window\.innerWidth\s*<\s*640\)/,
        'InteractiveFlipbook must dynamically detect mobile viewports (< 640px) and switch to single-page portrait layout'
      );
    });
  });

  // =========================================================================
  // 3. Tablet (768px) & Desktop (1280px) Layout Adaptability Stress Testing
  // =========================================================================
  describe('3. Tablet (768px) & Desktop (1280px) Layout Adaptability', () => {
    it('Footer adapts across viewports with 1 column (mobile), 2 columns (tablet 768px), and 4 columns (desktop 1280px)', () => {
      const footerPath = path.join(SRC_DIR, 'components', 'layout', 'Footer.tsx');
      const content = fs.readFileSync(footerPath, 'utf-8');

      assert.match(
        content,
        /grid-cols-1\s+md:grid-cols-2\s+lg:grid-cols-4/,
        'Footer must declare grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      );
    });

    it('HeroSection headline scales responsively across mobile, tablet, and desktop viewports', () => {
      const heroPath = path.join(SRC_DIR, 'components', 'home', 'HeroSection.tsx');
      const content = fs.readFileSync(heroPath, 'utf-8');

      assert.match(
        content,
        /font-serif\s+text-3xl\s+sm:text-5xl\s+lg:text-6xl/,
        'HeroSection headline must provide responsive scaling (text-3xl on mobile, sm:text-5xl, lg:text-6xl on desktop)'
      );
    });

    it('HamperBuilder reserves 780px orbital ring canvas strictly for large screens (lg:block)', () => {
      const hamperPath = path.join(SRC_DIR, 'components', 'hamper', 'HamperBuilder.tsx');
      const content = fs.readFileSync(hamperPath, 'utf-8');

      assert.match(
        content,
        /hidden\s+lg:block\s+relative\s+w-full\s+max-w-5xl\s+mx-auto\s+h-\[780px\]/,
        'The large 780px orbital canvas must be hidden on mobile/tablet viewports (< 1024px) via hidden lg:block'
      );
    });
  });

  // =========================================================================
  // 4. Deprecated Class & Font Infiltration Adversarial Regression Check
  // =========================================================================
  describe('4. Deprecated Class & Font Infiltration Adversarial Regression Check', () => {
    const srcFiles = getAllSourceFiles(SRC_DIR, ['.ts', '.tsx', '.css', '.html']);

    it('zero occurrences of font-script or font-logo classes across all src files', () => {
      const forbiddenClasses = ['font-script', 'font-logo', 'font-display'];
      const violations: { file: string; class: string }[] = [];

      for (const file of srcFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const cls of forbiddenClasses) {
          if (content.includes(cls)) {
            violations.push({ file: path.relative(ROOT_DIR, file), class: cls });
          }
        }
      }

      assert.deepEqual(
        violations,
        [],
        `Found forbidden classes: ${JSON.stringify(violations)}`
      );
    });

    it('zero occurrences of deprecated font family names across all src files and config files', () => {
      const deprecated = [
        'Caveat',
        'Playfair',
        'Courier Prime',
        'Allura',
        'Alex Brush',
        'Great Vibes',
        'Dancing Script',
      ];
      const checkFiles = [
        ...srcFiles,
        path.join(ROOT_DIR, 'index.html'),
        path.join(ROOT_DIR, 'tailwind.config.js'),
      ];

      const violations: { file: string; font: string }[] = [];

      for (const file of checkFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const font of deprecated) {
          const regex = new RegExp(`\\b${font.replace(/\s+/g, '\\s+')}\\b`, 'i');
          if (regex.test(content)) {
            violations.push({ file: path.relative(ROOT_DIR, file), font });
          }
        }
      }

      assert.deepEqual(
        violations,
        [],
        `Found deprecated font families: ${JSON.stringify(violations)}`
      );
    });
  });

});
