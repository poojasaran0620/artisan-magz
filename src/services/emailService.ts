import { supabase, isSupabaseConfigured } from './supabase';
import type { OrderRecord } from '../context/AuthContext';

/**
 * Sends a branded order status email to the customer via the
 * `send-order-email` Supabase Edge Function (Gmail SMTP).
 *
 * Fails silently — email delivery should never block the UI.
 */
export async function sendOrderEmail(
  order: OrderRecord,
  status?: OrderRecord['status'],
  trackingInfo?: string,
): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    console.info('[Email] Supabase not configured — skipping email.');
    return;
  }

  const email = order.deliveryAddress?.email;
  if (!email) {
    console.info('[Email] No customer email on order — skipping.');
    return;
  }

  try {
    const { error } = await supabase.functions.invoke('send-order-email', {
      body: {
        to: email,
        customerName: order.deliveryAddress.recipientName || 'Customer',
        orderNumber: order.orderNumber,
        status: status || order.status,
        items: order.items || [],
        totalAmount: order.totalAmount || 0,
        trackingInfo: trackingInfo || undefined,
      },
    });

    if (error) {
      console.warn('[Email] Edge function error:', error);
    } else {
      console.info(`[Email] Status "${status || order.status}" email sent to ${email}`);
    }
  } catch (err) {
    console.warn('[Email] Failed to send email:', err);
  }
}
