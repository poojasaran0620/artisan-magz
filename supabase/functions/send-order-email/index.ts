import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

/*
 * ─── Artisan Magz · Bulletproof HTML Order Email ─────────────────────
 *
 * Supabase Edge Function that sends beautifully styled HTML emails
 * to customers via Gmail SMTP over direct TLS socket.
 *
 * Email features:
 * - MIME multipart/alternative with base64 encoding (100% standard RFC 2045)
 * - Table-based architecture compatible with Gmail, Apple Mail, Outlook
 * - Explicit bgcolor attributes + inline styles
 * - 4 distinct stages: Placed, Printing/Crafting, Dispatched, Delivered
 * ─────────────────────────────────────────────────────────────────────
 */

interface OrderItem {
  title: string;
  variantName?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface BulkInquiryDetails {
  occasion: string;
  estimatedQuantity: string;
  kindOfGifts: string;
  phone: string;
  specialRequirements?: string;
  anyQuestions?: string;
}

interface EmailPayload {
  type?: 'order' | 'bulk_inquiry';
  to: string;
  customerName: string;
  orderNumber?: string;
  status?: 'placed' | 'printing' | 'dispatched' | 'delivered';
  items?: OrderItem[];
  totalAmount?: number;
  trackingInfo?: string;
  bulkDetails?: BulkInquiryDetails;
}

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function getStatusEmoji(status: string): string {
  const map: Record<string, string> = {
    placed: '✨',
    printing: '🎨',
    dispatched: '📦',
    delivered: '💝',
    bulk_inquiry: '💌',
  };
  return map[status] || '📋';
}

function getSubjectLine(status: string, orderNumber?: string): string {
  if (status === 'bulk_inquiry') {
    return `✨ Bulk Order Inquiry Received · Artisan Magz`;
  }
  const subjects: Record<string, string> = {
    placed: `✨ Order Confirmed! #${orderNumber}`,
    printing: `🎨 Your keepsake is being crafted! #${orderNumber}`,
    dispatched: `📦 Your order is on its way! #${orderNumber}`,
    delivered: `💝 Your keepsake has arrived! #${orderNumber}`,
  };
  return subjects[status] || `Order Update #${orderNumber}`;
}

// ── Bulletproof Email HTML Builder ───────────────────────────────────

function buildEmailHTML(payload: EmailPayload): string {
  const { customerName, orderNumber, status, items, totalAmount, trackingInfo } = payload;
  const firstName = customerName ? customerName.split(' ')[0] : 'Customer';
  const emoji = getStatusEmoji(status);

  if (status === 'bulk_inquiry' || payload.type === 'bulk_inquiry') {
    return buildBulkInquiryEmailHTML(payload);
  }

  const statusConfig: Record<string, { heading: string; message: string; color: string; badgeBg: string }> = {
    placed: {
      heading: 'Order Confirmed!',
      message: `Thank you for your order, ${firstName}! We're absolutely thrilled to create something truly special for you. Our artisans will begin handcrafting your personalized keepsake very soon.`,
      color: '#B76E79',
      badgeBg: '#FDF0F2',
    },
    printing: {
      heading: 'Your Keepsake is Being Crafted!',
      message: `Great news, ${firstName}! Our artisans have started crafting your personalized keepsake with love and utmost care. Every photo, page, and detail is being hand-finished to perfection.`,
      color: '#C25975',
      badgeBg: '#FDF0F4',
    },
    dispatched: {
      heading: 'Your Order is On Its Way!',
      message: `Exciting news, ${firstName}! Your keepsake has been carefully packaged in our signature luxury gift box and dispatched. It is on its way to your doorstep!`,
      color: '#2563EB',
      badgeBg: '#EFF6FF',
    },
    delivered: {
      heading: 'Your Keepsake Has Arrived!',
      message: `${firstName}, your personalized keepsake has been delivered! We hope opening it brought happy smiles and made your memories eternal. Thank you for letting us be part of your story! 💕`,
      color: '#059669',
      badgeBg: '#ECFDF5',
    },
  };

  const config = statusConfig[status || 'placed'] || statusConfig.placed;

  // Build items rows
  const itemRows = (items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #F0EDE5; vertical-align: top;">
          <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: bold; color: #1F1F1F;">
            ${item.title}
          </div>
          ${item.variantName ? `<div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; color: #8C7B6D; margin-top: 2px;">${item.variantName}</div>` : ''}
        </td>
        <td align="center" style="padding: 12px 8px; border-bottom: 1px solid #F0EDE5; text-align: center; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; color: #736352;">
          ×${item.quantity}
        </td>
        <td align="right" style="padding: 12px 0; border-bottom: 1px solid #F0EDE5; text-align: right; vertical-align: top; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: bold; color: #1F1F1F;">
          ${formatINR(item.price)}
        </td>
      </tr>`
    )
    .join('');

  // 4-step progress tracker
  const steps = ['Placed', 'Crafting', 'Shipped', 'Delivered'];
  const stepIdx = { placed: 0, printing: 1, dispatched: 2, delivered: 3 }[status] || 0;

  const trackerCols = steps
    .map((s, i) => {
      const isDone = i <= stepIdx;
      const isCurrent = i === stepIdx;
      const circleColor = isDone ? config.color : '#D1C7BD';
      return `
        <td align="center" valign="top" style="width: 25%; text-align: center; padding: 0 4px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 6px;">
            <tr>
              <td align="center" valign="middle" bgcolor="${circleColor}" width="28" height="28" style="width: 28px; height: 28px; background-color: ${circleColor}; border-radius: 50%; text-align: center; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; font-weight: bold; line-height: 28px;">
                ${isDone ? '✓' : (i + 1)}
              </td>
            </tr>
          </table>
          <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; color: ${isCurrent ? config.color : '#8C7B6D'}; font-weight: ${isCurrent ? 'bold' : 'normal'}; text-transform: uppercase; letter-spacing: 0.5px;">
            ${s}
          </div>
        </td>
      `;
    })
    .join('');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${getSubjectLine(status, orderNumber)}</title>
</head>
<body bgcolor="#F8F6F0" style="margin: 0; padding: 0; background-color: #F8F6F0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  
  <!-- Outer Wrapper Table -->
  <table width="100%" bgcolor="#F8F6F0" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8F6F0; width: 100%; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        
        <!-- Main Card Container (max 560px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="max-width: 560px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5DFD5; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- 1. Luxury Header Banner -->
          <tr>
            <td align="center" bgcolor="#B76E79" style="background-color: #B76E79; background: linear-gradient(135deg, #B76E79 0%, #9E7864 50%, #C99E5C 100%); padding: 32px 20px; text-align: center;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #FFFFFF; opacity: 0.85; margin-bottom: 6px;">✦ &nbsp; ✦ &nbsp; ✦</div>
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: bold; color: #FFFFFF; letter-spacing: 1px;">
                Artisan Magz
              </h1>
              <div style="margin: 6px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: #FFFFFF; opacity: 0.85; letter-spacing: 2px; text-transform: uppercase;">
                Bespoke Personalized Keepsakes
              </div>
            </td>
          </tr>

          <!-- 2. Status Heading & Note -->
          <tr>
            <td style="padding: 32px 24px 20px 24px; text-align: center;">
              <div style="font-size: 40px; line-height: 1; margin-bottom: 12px;">${emoji}</div>
              <h2 style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: bold; color: ${config.color};">
                ${config.heading}
              </h2>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #4A4A4A;">
                ${config.message}
              </p>
            </td>
          </tr>

          <!-- 3. Progress Stepper Bar -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FDFCF5" style="background-color: #FDFCF5; border-radius: 12px; border: 1px solid #F0EDE5; padding: 16px 8px;">
                <tr>
                  ${trackerCols}
                </tr>
              </table>
            </td>
          </tr>

          ${trackingInfo ? `
          <!-- Optional Tracking Info Banner -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EFF6FF" style="background-color: #EFF6FF; border-radius: 12px; border: 1px solid #BFDBFE; padding: 16px; text-align: center;">
                <tr>
                  <td align="center">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; font-weight: bold; color: #2563EB; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">📍 Courier Tracking Information</div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #1E293B; word-break: break-all;">
                      ${trackingInfo}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- 4. Order Summary Card -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FDFCF5" style="background-color: #FDFCF5; border-radius: 12px; border: 1px solid #F0EDE5; padding: 20px;">
                <tr>
                  <td>
                    <!-- Order header -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px; border-bottom: 1px solid #EAE5D9; padding-bottom: 8px;">
                      <tr>
                        <td align="left" style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: bold; color: #1F1F1F;">
                          Order #${orderNumber}
                        </td>
                      </tr>
                    </table>

                    <!-- Items table -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <thead>
                        <tr>
                          <th align="left" style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #8C7B6D; padding-bottom: 8px; border-bottom: 2px solid #F0EDE5;">Item</th>
                          <th align="center" style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #8C7B6D; padding-bottom: 8px; border-bottom: 2px solid #F0EDE5;">Qty</th>
                          <th align="right" style="text-align: right; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #8C7B6D; padding-bottom: 8px; border-bottom: 2px solid #F0EDE5;">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemRows}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="2" align="right" style="padding-top: 14px; text-align: right; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #333333;">
                            Total Amount:
                          </td>
                          <td align="right" style="padding-top: 14px; text-align: right; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: bold; color: ${config.color};">
                            ${formatINR(totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${status === 'placed' ? `
          <!-- What's Next Box -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFF9F0" style="background-color: #FFF9F0; border-radius: 12px; border: 1px solid #F0E6D6; padding: 18px;">
                <tr>
                  <td>
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: bold; color: #1F1F1F; margin-bottom: 8px;">
                      📋 What Happens Next?
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12.5px; color: #5C4E43; line-height: 1.8;">
                      • Our curation team reviews your uploaded photos & text<br />
                      • Handcrafted design & layout begins within 24 hours<br />
                      • Luster print & bespoke packaging: 3–4 business days<br />
                      • We will send you real-time email updates at every stage!
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          ${status === 'delivered' ? `
          <!-- Review / Instagram Box -->
          <tr>
            <td style="padding: 0 24px 24px 24px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FAF5F7" style="background-color: #FAF5F7; border-radius: 12px; border: 1px solid #F2E4EC; padding: 20px; text-align: center;">
                <tr>
                  <td align="center">
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: bold; color: #1F1F1F; margin-bottom: 6px;">
                      Share Your Unboxing! 📸
                    </div>
                    <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; color: #736352;">
                      Tag <strong>@artisan_magz</strong> on Instagram stories for an exclusive 15% discount on your next anniversary gift!
                    </p>
                    <table align="center" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#B76E79" style="background-color: #B76E79; border-radius: 20px; padding: 8px 22px;">
                          <a href="https://instagram.com" style="color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; display: inline-block;">
                            Tag on Instagram ✨
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- 5. WhatsApp Support Button -->
          <tr>
            <td align="center" style="padding: 0 24px 28px 24px;">
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#25D366" style="background-color: #25D366; border-radius: 20px; padding: 10px 24px;">
                    <a href="https://wa.me/919876543210?text=Hi!%20I%20have%20a%20question%20about%20order%20${orderNumber}" style="color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; display: inline-block;">
                      💬 Questions? WhatsApp Us
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. Footer -->
          <tr>
            <td align="center" bgcolor="#2B2826" style="background-color: #2B2826; padding: 24px 20px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; color: #F0EDE5;">
                Handcrafted with love by the Saran Sisters 💕
              </p>
              <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: #A69480;">
                Artisan Magz Keepsake Studio • Bengaluru, India
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; color: #736352;">
                You received this notification because you placed an order at Artisan Magz.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ── Bulk Inquiry Email HTML Builder ───────────────────────────────────

function buildBulkInquiryEmailHTML(payload: EmailPayload): string {
  const { customerName, bulkDetails } = payload;
  const firstName = customerName ? customerName.split(' ')[0] : 'there';
  const occasion = bulkDetails?.occasion || 'Special Event';
  const quantity = bulkDetails?.estimatedQuantity || 'Bulk';
  const gifts = bulkDetails?.kindOfGifts || 'Personalised Magazines & Gifts';
  const phone = bulkDetails?.phone || '—';
  const specialReqs = bulkDetails?.specialRequirements || 'None';
  const questions = bulkDetails?.anyQuestions || 'None';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bulk Order Inquiry Received · Artisan Magz</title>
</head>
<body bgcolor="#F8F6F0" style="margin: 0; padding: 0; background-color: #F8F6F0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  
  <table width="100%" bgcolor="#F8F6F0" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8F6F0; width: 100%; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="max-width: 560px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5DFD5; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" bgcolor="#B76E79" style="background-color: #B76E79; background: linear-gradient(135deg, #B76E79 0%, #9E7864 50%, #C99E5C 100%); padding: 32px 20px; text-align: center;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #FFFFFF; opacity: 0.85; margin-bottom: 6px;">✦ &nbsp; ✦ &nbsp; ✦</div>
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: bold; color: #FFFFFF; letter-spacing: 1px;">
                Artisan Magz
              </h1>
              <div style="margin: 6px 0 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: #FFFFFF; opacity: 0.85; letter-spacing: 2px; text-transform: uppercase;">
                Bespoke Bulk & Event Gifting Studio
              </div>
            </td>
          </tr>

          <!-- Heading & Message -->
          <tr>
            <td style="padding: 32px 24px 20px 24px; text-align: center;">
              <div style="font-size: 40px; line-height: 1; margin-bottom: 12px;">💌</div>
              <h2 style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: bold; color: #B76E79;">
                Inquiry Received, ${firstName}!
              </h2>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #4A4A4A;">
                Thank you for reaching out to us for your special occasion. We’ve received your bulk inquiry and our team is already reviewing your vision to craft unforgettable personalized keepsakes for your guests.
              </p>
            </td>
          </tr>

          <!-- Summary Card -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FDFCF5" style="background-color: #FDFCF5; border-radius: 12px; border: 1px solid #F0EDE5; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: bold; color: #1F1F1F; margin-bottom: 14px; border-bottom: 1px solid #EAE5D9; padding-bottom: 8px;">
                      📋 Inquiry Summary
                    </div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; line-height: 1.8; color: #4A4A4A;">
                      <tr>
                        <td width="40%" style="color: #8C7B6D; font-weight: 600; padding: 4px 0;">Occasion:</td>
                        <td width="60%" style="color: #1F1F1F; font-weight: 500; padding: 4px 0;">${occasion}</td>
                      </tr>
                      <tr>
                        <td style="color: #8C7B6D; font-weight: 600; padding: 4px 0;">Estimated Quantity:</td>
                        <td style="color: #1F1F1F; font-weight: 500; padding: 4px 0;">${quantity}</td>
                      </tr>
                      <tr>
                        <td style="color: #8C7B6D; font-weight: 600; padding: 4px 0;">Gifts Needed:</td>
                        <td style="color: #1F1F1F; font-weight: 500; padding: 4px 0;">${gifts}</td>
                      </tr>
                      <tr>
                        <td style="color: #8C7B6D; font-weight: 600; padding: 4px 0;">Contact Phone:</td>
                        <td style="color: #1F1F1F; font-weight: 500; padding: 4px 0;">${phone}</td>
                      </tr>
                      ${specialReqs !== 'None' ? `
                      <tr>
                        <td style="color: #8C7B6D; font-weight: 600; padding: 4px 0; vertical-align: top;">Special Requests:</td>
                        <td style="color: #1F1F1F; font-weight: 500; padding: 4px 0;">${specialReqs}</td>
                      </tr>` : ''}
                      ${questions !== 'None' ? `
                      <tr>
                        <td style="color: #8C7B6D; font-weight: 600; padding: 4px 0; vertical-align: top;">Questions:</td>
                        <td style="color: #1F1F1F; font-weight: 500; padding: 4px 0;">${questions}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps Box -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFF9F0" style="background-color: #FFF9F0; border-radius: 12px; border: 1px solid #F0E6D6; padding: 18px;">
                <tr>
                  <td>
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: bold; color: #1F1F1F; margin-bottom: 8px;">
                      ⏳ What Happens Next?
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12.5px; color: #5C4E43; line-height: 1.8;">
                      • Our bespoke bulk concierge will review your quantity and deadline<br />
                      • We will share custom volume-discounted quotation and catalog proofs<br />
                      • We will reach out via WhatsApp / Email within <strong>24 business hours</strong>!
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WhatsApp Connect Button -->
          <tr>
            <td align="center" style="padding: 0 24px 28px 24px;">
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#25D366" style="background-color: #25D366; border-radius: 20px; padding: 10px 24px;">
                    <a href="https://wa.me/919876543210?text=Hi!%20I%20just%20submitted%20a%20bulk%20order%20inquiry%20for%20${encodeURIComponent(occasion)}" style="color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; display: inline-block;">
                      💬 Chat with Us on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#2B2826" style="background-color: #2B2826; padding: 24px 20px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; color: #F0EDE5;">
                Handcrafted with love by the Saran Sisters 💕
              </p>
              <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11px; color: #A69480;">
                Artisan Magz Keepsake Studio • Bengaluru, India
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 10px; color: #736352;">
                You received this email because you submitted a bulk inquiry on Artisan Magz.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ── Robust Base64 Helpers ────────────────────────────────────────────

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function chunkString(str: string, size = 76): string {
  const lines: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    lines.push(str.substring(i, i + size));
  }
  return lines.join('\r\n');
}

// ── SMTP via Direct Gmail TLS ────────────────────────────────────────

async function sendViaGmailSMTP(
  to: string,
  subject: string,
  htmlBody: string,
  plainText: string,
  gmailUser: string,
  gmailAppPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const conn = await Deno.connectTls({
      hostname: 'smtp.gmail.com',
      port: 465,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function readResponse(): Promise<string> {
      const buf = new Uint8Array(4096);
      const n = await conn.read(buf);
      return n ? decoder.decode(buf.subarray(0, n)) : '';
    }

    async function sendCommand(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + '\r\n'));
      return await readResponse();
    }

    // Greet
    await readResponse();

    // EHLO
    await sendCommand('EHLO artisanmagz.local');

    // AUTH LOGIN
    await sendCommand('AUTH LOGIN');
    await sendCommand(btoa(gmailUser));
    const authResult = await sendCommand(btoa(gmailAppPassword.replace(/\s+/g, '')));

    if (!authResult.startsWith('235')) {
      conn.close();
      return { success: false, message: 'Gmail auth failed: ' + authResult };
    }

    // MAIL FROM
    await sendCommand(`MAIL FROM:<${gmailUser}>`);

    // RCPT TO
    await sendCommand(`RCPT TO:<${to}>`);

    // DATA
    await sendCommand('DATA');

    // Assemble MIME multipart/alternative with Base64 encoding
    const boundary = `==_artisan_boundary_${Date.now()}_==`;
    const base64Html = chunkString(toBase64(htmlBody));
    const base64Plain = chunkString(toBase64(plainText));

    const emailData = [
      `From: "Artisan Magz" <${gmailUser}>`,
      `To: <${to}>`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      base64Plain,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      base64Html,
      ``,
      `--${boundary}--`,
      `.`,
    ].join('\r\n');

    const dataResult = await sendCommand(emailData);

    // QUIT
    await sendCommand('QUIT');
    conn.close();

    if (dataResult.startsWith('250')) {
      return { success: true, message: `Email sent to ${to}` };
    }
    return { success: false, message: `SMTP response: ${dataResult}` };
  } catch (err) {
    return { success: false, message: `SMTP error: ${(err as Error).message}` };
  }
}

// ── Edge Function Handler ────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const payload: EmailPayload = await req.json();

    const isBulkInquiry = payload.type === 'bulk_inquiry' || payload.status === 'bulk_inquiry';

    if (!payload.to) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: to' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isBulkInquiry && (!payload.orderNumber || !payload.status)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, orderNumber, status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const effectiveStatus = isBulkInquiry ? 'bulk_inquiry' : (payload.status || 'placed');

    const gmailUser = Deno.env.get('GMAIL_USER') || 'artisanmagz@gmail.com';
    const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailAppPassword) {
      return new Response(
        JSON.stringify({ error: 'GMAIL_APP_PASSWORD secret is not configured in Supabase.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subject = getSubjectLine(effectiveStatus, payload.orderNumber);
    const htmlBody = buildEmailHTML({ ...payload, status: effectiveStatus as any });

    let plainText = '';
    if (isBulkInquiry) {
      plainText = [
        subject,
        '',
        `Hi ${payload.customerName || 'there'},`,
        '',
        `Thank you for your bulk inquiry with Artisan Magz!`,
        `Occasion: ${payload.bulkDetails?.occasion || 'Special Event'}`,
        `Estimated Quantity: ${payload.bulkDetails?.estimatedQuantity || 'Bulk'}`,
        `Kind of Gifts: ${payload.bulkDetails?.kindOfGifts || 'Personalised Magazines & Gifts'}`,
        `Phone: ${payload.bulkDetails?.phone || '—'}`,
        '',
        'Our concierge will reach out to you within 24 hours with custom quotes & proofs.',
        '',
        'Handcrafted with love by the Saran Sisters at Artisan Magz.',
      ].join('\n');
    } else {
      plainText = [
        subject,
        '',
        `Hi ${payload.customerName || 'Customer'},`,
        '',
        `Thank you for your order #${payload.orderNumber}!`,
        `Status: ${effectiveStatus.toUpperCase()}`,
        `Total: ${formatINR(payload.totalAmount || 0)}`,
        '',
        payload.trackingInfo ? `Tracking: ${payload.trackingInfo}\n` : '',
        'Made with love by the Saran Sisters at Artisan Magz.',
      ].join('\n');
    }

    const result = await sendViaGmailSMTP(
      payload.to,
      subject,
      htmlBody,
      plainText,
      gmailUser,
      gmailAppPassword,
    );

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
