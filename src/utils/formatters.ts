import type { CartItem } from '../types/product.ts';

export const formatPrice = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateEstimatedDelivery = (pincode: string) => {
  const cleanPin = pincode ? pincode.trim() : '';
  const isValid = /^[1-9][0-9]{5}$/.test(cleanPin);

  if (!isValid) {
    return {
      isValid: false,
      dispatchRange: '',
      deliveryDateStr: '',
      isMetro: false,
      estimatedDays: '',
      errorMessage: 'Please enter a valid 6-digit Indian postal pincode (e.g. 400001).'
    };
  }

  const today = new Date();
  const dispatchStart = new Date(today);
  dispatchStart.setDate(today.getDate() + 2);

  const dispatchEnd = new Date(today);
  dispatchEnd.setDate(today.getDate() + 3);

  const deliveryDate = new Date(today);
  // Tier 1 metros roughly 4-5 days, others 6-7 days
  const isMetro = /^(11|40|56|60|70|50)/.test(cleanPin);
  deliveryDate.setDate(today.getDate() + (isMetro ? 5 : 7));

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' };

  return {
    isValid: true,
    dispatchRange: `${dispatchStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${dispatchEnd.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
    deliveryDateStr: deliveryDate.toLocaleDateString('en-IN', options),
    isMetro,
    estimatedDays: isMetro ? '4 - 5 business days' : '6 - 7 business days',
    errorMessage: undefined
  };
};

export const buildWhatsAppOrderMessage = (
  cartItems: CartItem[],
  customerName?: string,
  phone?: string,
  address?: string,
  city?: string,
  pincode?: string,
  notes?: string,
  discountCode?: string,
  discountAmount?: number
): string => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount = discountAmount && discountAmount > 0 ? discountAmount : 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const shipping = subtotal === 0 || subtotalAfterDiscount >= 1499 ? 0 : 99;
  const total = subtotalAfterDiscount + shipping;

  let message = `🌸 *NEW ORDER ENQUIRY - ARTISAN MAGZ* 🌸\n\n`;
  message += `Hi Artisan magz Team! I would like to place an order for the following personalized items:\n\n`;

  cartItems.forEach((item, index) => {
    message += `*${index + 1}. ${item.product.title}*\n`;
    if (item.selectedVariant) {
      message += `   • Variant: ${item.selectedVariant.name}\n`;
    }
    message += `   • Quantity: ${item.quantity}\n`;
    message += `   • Price: ₹${item.totalPrice}\n`;

    // Customization details
    const c = item.customization;
    if (c.selectedPages) {
      const formatLabel = c.format === 'mini-a5' ? 'Mini • A5' : 'Standard • A4';
      message += `   • Format & Package: ${c.selectedPages} Pages Magazine (${formatLabel})\n`;
    }
    if (c.selectedTemplates && c.selectedTemplates.length > 0) {
      message += `   • Selected Templates: ${c.selectedTemplates.join(', ')}\n`;
    }
    if (c.addOns) {
      const addonsList: string[] = [];
      if (c.addOns.giftWrap) addonsList.push('Gift Wrap (+₹50)');
      if (c.addOns.handwrittenLetter) addonsList.push('Handwritten Letter (+₹50)');
      if (c.addOns.combo) addonsList.push('Combo: Wrap + Letter (+₹80)');
      if (addonsList.length > 0) {
        message += `   🎁 *Add-on:* ${addonsList.join(', ')}\n`;
      }
    }
    if (c.selectedTemplate) message += `   • Magazine Template: ${c.selectedTemplate}\n`;
    if (c.occasion) message += `   • Occasion / Edition: ${c.occasion}\n`;
    if (c.headline) message += `   • Cover Headline: "${c.headline}"\n`;
    if (c.storyMessage) message += `   • Story / Dedication: "${c.storyMessage}"\n`;

    // Newspaper inputs
    if (c.coupleNames) message += `   • Couple / Celebrant: ${c.coupleNames}\n`;
    if (c.city) message += `   • City Edition: ${c.city}\n`;
    if (c.newspaperHeadline) message += `   • Newspaper Headline: "${c.newspaperHeadline}"\n`;
    if (c.newspaperSubheadline) message += `   • Sub-Headline: "${c.newspaperSubheadline}"\n`;
    if (c.anniversaryDate) message += `   • Milestone Date: ${c.anniversaryDate}\n`;
    if (c.articleStory) message += `   • Article Column Story: "${c.articleStory}"\n`;

    // Frame inputs
    if (c.frameSize) message += `   • Frame Size: ${c.frameSize}\n`;
    if (c.frameStyle) message += `   • Frame Finish: ${c.frameStyle}\n`;
    if (c.orientation) message += `   • Layout Orientation: ${c.orientation}\n`;
    if (c.collageStyle) message += `   • Collage Mode: ${c.collageStyle}\n`;
    if (c.captionDate) message += `   • Engraved Caption / Date: "${c.captionDate}"\n`;

    // Song Book inputs
    if (c.songTitle) message += `   • Song: ${c.songTitle} - ${c.artistName || ''}\n`;
    if (c.spotifyLink) message += `   • Spotify Link / Code: ${c.spotifyLink}\n`;
    if (c.playlistDedication) message += `   • Dedicated Lyrics / Note: "${c.playlistDedication}"\n`;

    // Uploaded photo note
    if (c.uploadedPhotoCount) {
      message += `   • Photos Attached: ${c.uploadedPhotoCount} photos (will confirm high-res copies in this chat)\n`;
    }

    // Hamper inputs
    if (c.hamperDetails) {
      const h = c.hamperDetails;
      message += `   🎁 *Hamper Box:* ${h.box.name}\n`;
      message += `   🎁 *Goodies Selected (${h.items.length}):*\n`;
      h.items.forEach(gi => {
        message += `     - ${gi.goodie.name} (Qty: ${gi.quantity})\n`;
      });
      if (h.card.recipientName || h.card.message) {
        message += `   💌 *Card Note:* "To: ${h.card.recipientName} - ${h.card.message}" (Wax Seal: ${h.card.waxSealColor})\n`;
      }
    }
    message += `\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📦 *Subtotal:* ₹${subtotal}\n`;
  if (discount > 0) {
    message += `🏷️ *Coupon Applied (${discountCode || 'DISCOUNT'}):* -₹${discount}\n`;
  }
  message += `🚚 *Shipping:* ${shipping === 0 ? 'FREE (Express)' : `₹${shipping}`}\n`;
  message += `💰 *Estimated Total:* *₹${total}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (customerName || phone || address) {
    message += `📍 *Delivery Details:*\n`;
    if (customerName) message += `Name: ${customerName}\n`;
    if (phone) message += `Phone: ${phone}\n`;
    if (address) message += `Address: ${address}, ${city || ''} - ${pincode || ''}\n`;
    message += `\n`;
  }

  if (notes) {
    message += `💬 *Special Instructions:* ${notes}\n\n`;
  }

  message += `Please confirm my order proof draft and share UPI payment link/bank QR. Thank you! ✨`;

  return encodeURIComponent(message);
};
