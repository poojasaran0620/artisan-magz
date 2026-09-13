import test from 'node:test';
import assert from 'node:assert/strict';
import type { SavedAddress, OrderRecord } from '../src/context/AuthContext.tsx';

test('saved address default assignment logic', () => {
  const addresses: SavedAddress[] = [];

  const addAddress = (addr: Omit<SavedAddress, 'id'>): SavedAddress => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${addresses.length + 1}`,
      isDefault: addresses.length === 0 ? true : addr.isDefault,
    };
    addresses.push(newAddr);
    return newAddr;
  };

  const first = addAddress({
    label: 'Home',
    recipientName: 'Priya Sharma',
    phone: '9876543210',
    streetAddress: '14th Main Road, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
  });

  assert.equal(first.isDefault, true);
  assert.equal(addresses.length, 1);

  const second = addAddress({
    label: "Partner's Place",
    recipientName: 'Rohan Roy',
    phone: '9812345678',
    streetAddress: 'Link Road, Andheri West',
    city: 'Mumbai',
    pincode: '400053',
    isDefault: false,
  });

  assert.equal(second.isDefault, false);
  assert.equal(addresses.length, 2);
});

test('order recording generates valid orderNumber, status, and items', () => {
  const orders: OrderRecord[] = [];

  const recordOrder = (orderData: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'status'>): OrderRecord => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${orders.length + 1}`,
      orderNumber: `AM-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'placed',
    };
    orders.push(newOrder);
    return newOrder;
  };

  const createdOrder = recordOrder({
    items: [
      {
        title: 'The Love Chronicle: Bespoke Custom Magazine',
        variantName: '12 Pages Standard (A4) Edition',
        quantity: 1,
        price: 1279,
        customizationSummary: '12 Pages • Standard (A4)',
      },
    ],
    totalAmount: 1279,
    paymentId: 'pay_test_123456',
    paymentMethod: 'razorpay',
    deliveryAddress: {
      recipientName: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya.sharma@gmail.com',
      address: '14th Main Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
    },
  });

  assert.ok(createdOrder.orderNumber.startsWith('AM-2026-'));
  assert.equal(createdOrder.status, 'placed');
  assert.equal(createdOrder.totalAmount, 1279);
  assert.equal(createdOrder.items.length, 1);
  assert.equal(createdOrder.deliveryAddress.city, 'Bengaluru');
  assert.equal(createdOrder.deliveryAddress.email, 'priya.sharma@gmail.com');
  assert.equal(createdOrder.paymentId, 'pay_test_123456');
  assert.equal(createdOrder.paymentMethod, 'razorpay');
});

