import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ── Admin Email Whitelist ────────────────────────────────────────────

const ADMIN_EMAILS: readonly string[] = [
  'poojasaran0620@gmail.com',
  'vijayrathod8422@gmail.com',
  'artisanmagz@gmail.com',
] as const;

function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// ── Valid Status Transitions ─────────────────────────────────────────

const VALID_STATUSES = ['placed', 'printing', 'dispatched', 'delivered'] as const;

// ── Tests ────────────────────────────────────────────────────────────

it('ADMIN_EMAILS contains the allowed admin emails', () => {
  assert.equal(ADMIN_EMAILS.length, 3);
  assert.ok(ADMIN_EMAILS.includes('poojasaran0620@gmail.com'));
  assert.ok(ADMIN_EMAILS.includes('vijayrathod8422@gmail.com'));
  assert.ok(ADMIN_EMAILS.includes('artisanmagz@gmail.com'));
});

it('isAdminEmail returns true for allowed admin emails (case-insensitive)', () => {
  assert.equal(isAdminEmail('poojasaran0620@gmail.com'), true);
  assert.equal(isAdminEmail('vijayrathod8422@gmail.com'), true);
  assert.equal(isAdminEmail('artisanmagz@gmail.com'), true);
  assert.equal(isAdminEmail('ARTISANMAGZ@GMAIL.COM'), true);
  assert.equal(isAdminEmail('POOJASARAN0620@GMAIL.COM'), true);
  assert.equal(isAdminEmail('  vijayrathod8422@gmail.com  '), true);
});

it('isAdminEmail returns false for non-admin emails and edge cases', () => {
  assert.equal(isAdminEmail('priya.sharma@gmail.com'), false);
  assert.equal(isAdminEmail('random@example.com'), false);
  assert.equal(isAdminEmail(''), false);
  assert.equal(isAdminEmail(null), false);
  assert.equal(isAdminEmail(undefined), false);
});

it('order status values match the expected 4-step pipeline', () => {
  assert.deepEqual([...VALID_STATUSES], ['placed', 'printing', 'dispatched', 'delivered']);
  assert.equal(VALID_STATUSES.length, 4);
});
