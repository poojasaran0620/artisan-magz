import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Side Navigation Drawer Updates', () => {
  const navbarPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Navbar.tsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf-8');

  it('removes "Corporate" badge in front of Bulk Orders in the side navigation', () => {
    // In the side navigation, Bulk Orders must not have the "Corporate" badge
    assert.ok(
      !navbarContent.includes('>Corporate<'),
      'Navbar must not contain the "Corporate" text/badge'
    );
    assert.ok(
      navbarContent.includes('<span>Bulk Orders</span>'),
      'Navbar must still contain Bulk Orders'
    );
  });

  it('replaces "WhatsApp Concierge" with "Contact Us"', () => {
    assert.ok(
      !navbarContent.includes('WhatsApp Concierge'),
      'Navbar must not contain "WhatsApp Concierge"'
    );
    assert.ok(
      navbarContent.includes('<span>Contact Us</span>'),
      'Navbar must contain "Contact Us"'
    );
  });

  it('provides direct options for WhatsApp and Mail ID when Contact Us is opened', () => {
    // Check WhatsApp option
    assert.ok(
      navbarContent.includes('https://wa.me/917000041053'),
      'Navbar must have direct link to WhatsApp wa.me/917000041053'
    );
    assert.ok(
      navbarContent.includes('Our WhatsApp') || navbarContent.includes('WhatsApp'),
      'Navbar must label WhatsApp clearly'
    );

    // Check Mail ID option
    assert.ok(
      navbarContent.includes('mailto:artisanmagz@gmail.com'),
      'Navbar must have mailto link for artisanmagz@gmail.com'
    );
    assert.ok(
      navbarContent.includes('Mail ID') || navbarContent.includes('Email'),
      'Navbar must display Mail ID'
    );
  });
});
