/**
 * Razorpay Payment Gateway Integration
 * ─────────────────────────────────────
 * Dynamically loads the Razorpay Checkout SDK and provides a clean
 * function to launch the payment overlay with Artisan Magz branding.
 *
 * Set VITE_RAZORPAY_KEY_ID in your .env to enable real/test payments.
 * When no key is provided, the checkout runs in simulation mode.
 */

// ── Types ──────────────────────────────────────────────────────────────

export interface RazorpayCheckoutOptions {
  /** Amount in INR (not paise — conversion is handled internally) */
  amount: number;
  /** Order description shown in Razorpay popup */
  description?: string;
  /** Customer details to pre-fill */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Internal order reference (shown in Razorpay notes) */
  orderNumber?: string;
}

export interface RazorpayPaymentResult {
  /** True if payment was successfully completed */
  success: boolean;
  /** Razorpay payment ID (e.g. pay_XXXXX) — only present on success */
  paymentId?: string;
  /** Human-readable error message — only present on failure */
  error?: string;
  /** Whether this was a simulated (test mode without key) payment */
  simulated?: boolean;
}

// ── Configuration ──────────────────────────────────────────────────────

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const RAZORPAY_SDK_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const BRAND_COLOR = '#B76E79'; // Rose gold
const COMPANY_NAME = 'Artisan Magz';

/** Returns true when a real Razorpay key is configured */
export const isRazorpayConfigured = (): boolean =>
  Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_ID.startsWith('rzp_'));

// ── SDK Loader ─────────────────────────────────────────────────────────

let sdkLoadPromise: Promise<boolean> | null = null;

/**
 * Dynamically injects the Razorpay Checkout SDK script tag.
 * Only loads once — subsequent calls return the cached promise.
 */
function loadRazorpaySdk(): Promise<boolean> {
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise<boolean>((resolve) => {
    // Already loaded?
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Razorpay] SDK failed to load — falling back to simulation');
      sdkLoadPromise = null; // Allow retry
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

// ── Checkout Launcher ──────────────────────────────────────────────────

/**
 * Opens the Razorpay Standard Checkout overlay.
 *
 * Returns a promise that resolves with the payment result:
 * - `{ success: true, paymentId: 'pay_...' }` on successful payment
 * - `{ success: false, error: '...' }` on failure or dismissal
 * - `{ success: true, paymentId: 'sim_...', simulated: true }` in test simulation mode
 */
export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions,
): Promise<RazorpayPaymentResult> {
  // ── Simulation mode (no key configured) ────────────────────────────
  if (!isRazorpayConfigured()) {
    console.info(
      '[Razorpay] No API key configured (VITE_RAZORPAY_KEY_ID) — running simulated payment',
    );

    // Simulate a 1.5 s payment processing delay
    await new Promise((r) => setTimeout(r, 1500));

    return {
      success: true,
      paymentId: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      simulated: true,
    };
  }

  // ── Real Razorpay checkout ─────────────────────────────────────────
  const sdkLoaded = await loadRazorpaySdk();

  if (!sdkLoaded || !(window as any).Razorpay) {
    return {
      success: false,
      error: 'Payment gateway could not be loaded. Please try again.',
    };
  }

  return new Promise<RazorpayPaymentResult>((resolve) => {
    const rzpOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(options.amount * 100), // INR → paise
      currency: 'INR',
      name: COMPANY_NAME,
      description: options.description || 'Custom Keepsake Order',
      image: '/favicon.svg', // Uses the app favicon
      theme: {
        color: BRAND_COLOR,
        backdrop_color: 'rgba(0,0,0,0.55)',
      },
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      notes: {
        order_number: options.orderNumber || '',
        source: 'artisan-magz-web',
      },
      modal: {
        ondismiss: () => {
          resolve({
            success: false,
            error: 'Payment was cancelled by customer.',
          });
        },
        confirm_close: true,
        escape: true,
      },
      handler: (response: { razorpay_payment_id: string }) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
        });
      },
    };

    try {
      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on('payment.failed', (failResponse: any) => {
        resolve({
          success: false,
          error:
            failResponse?.error?.description ||
            'Payment failed. Please try again.',
        });
      });
      rzp.open();
    } catch (err) {
      console.error('[Razorpay] Checkout error:', err);
      resolve({
        success: false,
        error: 'Could not launch payment gateway. Please try again.',
      });
    }
  });
}
