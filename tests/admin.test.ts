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

// ── Bulk Inquiry Customer Name Resolution ─────────────────────────────

function resolveInquiryCustomerName(inquiry: { name?: string; firstName?: string; lastName?: string }): string {
  return inquiry.name || `${inquiry.firstName || ''} ${inquiry.lastName || ''}`.trim() || 'Customer';
}

it('resolveInquiryCustomerName correctly prioritizes single name', () => {
  assert.equal(resolveInquiryCustomerName({ name: 'Aarav Sharma' }), 'Aarav Sharma');
  assert.equal(resolveInquiryCustomerName({ name: 'Pooja Saran', firstName: 'Pooja', lastName: 'Saran' }), 'Pooja Saran');
});

it('resolveInquiryCustomerName falls back to legacy firstName and lastName', () => {
  assert.equal(resolveInquiryCustomerName({ firstName: 'Rachna', lastName: 'Saran' }), 'Rachna Saran');
  assert.equal(resolveInquiryCustomerName({ firstName: 'Aarti' }), 'Aarti');
  assert.equal(resolveInquiryCustomerName({}), 'Customer');
});

// ── Customer Profile Aggregation Tests ─────────────────────────────────

interface MockOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  deliveryAddress: {
    recipientName: string;
    email?: string;
    phone: string;
    city: string;
    state: string;
  };
}

function compileProfilesFromOrders(orders: MockOrder[], adminEmails: readonly string[]) {
  const map = new Map<string, {
    email: string;
    name: string;
    role: 'admin' | 'customer';
    ordersCount: number;
    totalSpent: number;
    city?: string;
  }>();

  // Seed admins
  adminEmails.forEach((email) => {
    map.set(email.toLowerCase().trim(), {
      email: email.toLowerCase().trim(),
      name: email.split('@')[0],
      role: 'admin',
      ordersCount: 0,
      totalSpent: 0,
    });
  });

  // Aggregate orders
  orders.forEach((o) => {
    const email = (o.deliveryAddress.email || `${o.deliveryAddress.phone}@artisanmagz.in`).toLowerCase().trim();
    const isAdm = adminEmails.includes(email);
    const existing = map.get(email);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.totalAmount;
      if (!existing.city) existing.city = o.deliveryAddress.city;
    } else {
      map.set(email, {
        email,
        name: o.deliveryAddress.recipientName,
        role: isAdm ? 'admin' : 'customer',
        ordersCount: 1,
        totalSpent: o.totalAmount,
        city: o.deliveryAddress.city,
      });
    }
  });

  return Array.from(map.values());
}

it('aggregates customer profiles accurately from orders and admin emails', () => {
  const sampleOrders: MockOrder[] = [
    {
      id: 'ord-1',
      orderNumber: 'AM-1001',
      createdAt: '2026-09-01T10:00:00Z',
      totalAmount: 1499,
      deliveryAddress: {
        recipientName: 'Priya Sharma',
        email: 'priya@gmail.com',
        phone: '9876543210',
        city: 'Bengaluru',
        state: 'Karnataka',
      },
    },
    {
      id: 'ord-2',
      orderNumber: 'AM-1002',
      createdAt: '2026-09-05T12:00:00Z',
      totalAmount: 2499,
      deliveryAddress: {
        recipientName: 'Priya Sharma',
        email: 'priya@gmail.com',
        phone: '9876543210',
        city: 'Bengaluru',
        state: 'Karnataka',
      },
    },
    {
      id: 'ord-3',
      orderNumber: 'AM-1003',
      createdAt: '2026-09-08T15:00:00Z',
      totalAmount: 999,
      deliveryAddress: {
        recipientName: 'Rohan Roy',
        email: 'rohan@outlook.com',
        phone: '9812345678',
        city: 'Mumbai',
        state: 'Maharashtra',
      },
    },
  ];

  const profiles = compileProfilesFromOrders(sampleOrders, ADMIN_EMAILS);

  // Contains 3 admin accounts + 2 distinct customer profiles = 5 profiles total
  assert.equal(profiles.length, 5);

  const priya = profiles.find((p) => p.email === 'priya@gmail.com');
  assert.ok(priya);
  assert.equal(priya.name, 'Priya Sharma');
  assert.equal(priya.role, 'customer');
  assert.equal(priya.ordersCount, 2);
  assert.equal(priya.totalSpent, 3998); // 1499 + 2499
  assert.equal(priya.city, 'Bengaluru');

  const rohan = profiles.find((p) => p.email === 'rohan@outlook.com');
  assert.ok(rohan);
  assert.equal(rohan.ordersCount, 1);
  assert.equal(rohan.totalSpent, 999);
  assert.equal(rohan.city, 'Mumbai');

  const adminPooja = profiles.find((p) => p.email === 'poojasaran0620@gmail.com');
  assert.ok(adminPooja);
  assert.equal(adminPooja.role, 'admin');
});


