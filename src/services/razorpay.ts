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
      '[Razorpay] No API key configured (VITE_RAZORPAY_KEY_ID) — launching simulated checkout UI',
    );

    return showSimulatedCheckoutUI(options);
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

// ── Simulated Razorpay Checkout UI ─────────────────────────────────────

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Shows a visual popup that mimics the Razorpay Standard Checkout overlay.
 * Used when no API key is configured (test / simulation mode).
 */
function showSimulatedCheckoutUI(
  options: RazorpayCheckoutOptions,
): Promise<RazorpayPaymentResult> {
  return new Promise((resolve) => {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'rzp-sim-backdrop';
    backdrop.style.cssText = `
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;
      animation:rzpFadeIn .25s ease;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    `;

    const paise = Math.round(options.amount * 100);
    const amountStr = formatINR(options.amount);
    const name = options.prefill?.name || 'Customer';
    const email = options.prefill?.email || '';
    const phone = options.prefill?.contact || '';

    backdrop.innerHTML = `
      <style>
        @keyframes rzpFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes rzpSlideUp { from { transform:translateY(30px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes rzpSpin { to { transform:rotate(360deg) } }
        #rzp-sim-card { animation: rzpSlideUp .3s ease; }
        .rzp-tab { cursor:pointer; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:600; border:1px solid #e5e5e5; background:#fff; color:#333; transition:all .15s; }
        .rzp-tab:hover { border-color:#528ff0; color:#528ff0; }
        .rzp-tab.active { background:#528ff0; color:#fff; border-color:#528ff0; }
        .rzp-pay-btn { cursor:pointer; width:100%; padding:14px; border:none; border-radius:8px; font-size:15px; font-weight:700; color:#fff; background:linear-gradient(135deg,#528ff0,#3d6dd8); transition:all .2s; }
        .rzp-pay-btn:hover { background:linear-gradient(135deg,#3d6dd8,#2b5bc4); transform:translateY(-1px); box-shadow:0 4px 12px rgba(82,143,240,.4); }
        .rzp-pay-btn:disabled { opacity:.7; cursor:wait; transform:none; box-shadow:none; }
        .rzp-cancel { cursor:pointer; background:none; border:none; color:#888; font-size:12px; padding:8px; margin-top:4px; }
        .rzp-cancel:hover { color:#333; }
      </style>
      <div id="rzp-sim-card" style="
        width:380px; max-width:92vw; background:#fff; border-radius:16px;
        box-shadow:0 25px 60px rgba(0,0,0,.3); overflow:hidden;
      ">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#528ff0,#3d6dd8);padding:20px 24px;color:#fff;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:18px;">🏪</div>
              <div>
                <div style="font-weight:700;font-size:15px;">${COMPANY_NAME}</div>
                <div style="font-size:11px;opacity:.8;">Test Mode</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:22px;font-weight:800;">${amountStr}</div>
              <div style="font-size:10px;opacity:.7;">(${paise.toLocaleString('en-IN')} paise)</div>
            </div>
          </div>
          <div style="font-size:11px;opacity:.75;border-top:1px solid rgba(255,255,255,.2);padding-top:8px;">
            ${name}${email ? ` · ${email}` : ''}${phone ? ` · ${phone}` : ''}
          </div>
        </div>

        <!-- Body -->
        <div style="padding:20px 24px;">
          <!-- Test Mode Banner -->
          <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:10px 12px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">🧪</span>
            <div>
              <div style="font-size:11px;font-weight:700;color:#e65100;">RAZORPAY TEST MODE</div>
              <div style="font-size:10px;color:#bf360c;">No real money will be charged. This is a simulated payment.</div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div style="font-size:11px;font-weight:600;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;">Select Payment Method</div>
          <div id="rzp-tabs" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;">
            <button class="rzp-tab active" data-tab="upi">📱 UPI</button>
            <button class="rzp-tab" data-tab="card">💳 Cards</button>
            <button class="rzp-tab" data-tab="netbanking">🏦 Netbanking</button>
            <button class="rzp-tab" data-tab="wallet">👛 Wallets</button>
          </div>

          <!-- UPI Content (default active) -->
          <div id="rzp-content" style="background:#f8f9fa;border-radius:10px;padding:16px;margin-bottom:20px;">
            <div style="font-size:12px;color:#666;margin-bottom:10px;">Enter UPI ID</div>
            <div style="display:flex;gap:8px;">
              <input id="rzp-upi-input" type="text" value="success@razorpay" 
                style="flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;outline:none;font-family:monospace;" 
                readonly />
            </div>
            <div style="font-size:10px;color:#999;margin-top:8px;">
              In test mode, any UPI ID will work. Use <strong>success@razorpay</strong> for successful payment.
            </div>
          </div>

          <!-- Pay Button -->
          <button id="rzp-pay-btn" class="rzp-pay-btn">
            Pay ${amountStr}
          </button>

          <!-- Processing State (hidden initially) -->
          <div id="rzp-processing" style="display:none;text-align:center;padding:20px 0;">
            <div style="width:36px;height:36px;border:3px solid #e5e5e5;border-top-color:#528ff0;border-radius:50%;animation:rzpSpin .7s linear infinite;margin:0 auto 12px;"></div>
            <div style="font-size:13px;font-weight:600;color:#333;">Processing Payment…</div>
            <div style="font-size:11px;color:#888;margin-top:4px;">Please wait while we verify your payment</div>
          </div>

          <!-- Cancel -->
          <div style="text-align:center;">
            <button id="rzp-cancel-btn" class="rzp-cancel">Cancel Payment</button>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #f0f0f0;padding:12px 24px;display:flex;align-items:center;justify-content:center;gap:6px;">
          <span style="font-size:10px;color:#aaa;">🔒 Secured by</span>
          <span style="font-size:12px;font-weight:800;color:#528ff0;">Razorpay</span>
          <span style="font-size:9px;background:#e8f0fe;color:#528ff0;padding:2px 6px;border-radius:4px;font-weight:700;">TEST</span>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    // ── Wire up tab switching ────────────────────────────────────
    const tabs = backdrop.querySelectorAll('.rzp-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // ── Cleanup helper ───────────────────────────────────────────
    const cleanup = () => {
      document.body.style.overflow = '';
      backdrop.remove();
    };

    // ── Cancel button ────────────────────────────────────────────
    const cancelBtn = backdrop.querySelector('#rzp-cancel-btn') as HTMLElement;
    cancelBtn?.addEventListener('click', () => {
      cleanup();
      resolve({
        success: false,
        error: 'Payment was cancelled by customer.',
      });
    });

    // ── Backdrop click to cancel ─────────────────────────────────
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        cleanup();
        resolve({
          success: false,
          error: 'Payment was cancelled by customer.',
        });
      }
    });

    // ── Pay button ───────────────────────────────────────────────
    const payBtn = backdrop.querySelector('#rzp-pay-btn') as HTMLButtonElement;
    const processingEl = backdrop.querySelector('#rzp-processing') as HTMLElement;
    const contentEl = backdrop.querySelector('#rzp-content') as HTMLElement;

    payBtn?.addEventListener('click', () => {
      // Show processing state
      payBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      if (contentEl) contentEl.style.display = 'none';
      if (processingEl) processingEl.style.display = 'block';

      // Simulate processing delay
      setTimeout(() => {
        cleanup();
        resolve({
          success: true,
          paymentId: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          simulated: true,
        });
      }, 2000);
    });
  });
}
