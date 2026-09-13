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

export interface BulkInquiryEmailData {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  estimatedQuantity: string;
  kindOfGifts: string;
  specialRequirements?: string;
  anyQuestions?: string;
}

/**
 * Sends a branded bulk order inquiry confirmation email to the customer
 * via the `send-order-email` Supabase Edge Function (Gmail SMTP).
 */
export async function sendBulkInquiryEmail(data: BulkInquiryEmailData): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    console.info('[Email] Supabase not configured — skipping bulk email.');
    return;
  }

  if (!data.email) {
    console.info('[Email] No customer email provided for bulk inquiry — skipping.');
    return;
  }

  try {
    const { error } = await supabase.functions.invoke('send-order-email', {
      body: {
        type: 'bulk_inquiry',
        to: data.email,
        customerName: data.name,
        bulkDetails: {
          occasion: data.occasion,
          estimatedQuantity: data.estimatedQuantity,
          kindOfGifts: data.kindOfGifts,
          phone: data.phone,
          specialRequirements: data.specialRequirements,
          anyQuestions: data.anyQuestions,
        },
      },
    });

    if (error) {
      console.warn('[Email] Edge function bulk inquiry error:', error);
    } else {
      console.info(`[Email] Bulk inquiry confirmation sent to ${data.email}`);
    }
  } catch (err) {
    console.warn('[Email] Failed to send bulk inquiry confirmation email:', err);
  }
}

