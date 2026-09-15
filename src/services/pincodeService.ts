import { getPincodeHint } from '../data/indiaLocations';

export interface PincodeLookupResult {
  city: string;
  state: string;
  district?: string;
  postOfficeName?: string;
  success: boolean;
}

// In-memory cache to avoid repeat lookups for the same pincode
const pincodeCache = new Map<string, PincodeLookupResult>();

// Lazy-loaded offline dictionary: { [pincode: string]: [city: string, state: string] }
let localDb: Record<string, [string, string]> | null = null;
let loadPromise: Promise<Record<string, [string, string]> | null> | null = null;

/**
 * Preloads the 19,000+ Indian PIN code offline database (~58 KB gzip).
 * Safe to call when opening checkout or address modal for 0ms lookup.
 */
export async function preloadPincodeDatabase(): Promise<Record<string, [string, string]> | null> {
  if (localDb) return localDb;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch('/data/india-pincodes.json');
      if (res.ok) {
        localDb = await res.json();
        return localDb;
      }
    } catch (err) {
      console.warn('[Pincode] Could not load local pincode database, using fallbacks:', err);
    }
    return null;
  })();

  return loadPromise;
}

/**
 * Resolves 6-digit Indian PIN code to City & State.
 * 1. Checks in-memory cache
 * 2. Checks local offline database (19,097 PINs, 0ms latency, zero external API)
 * 3. Falls back to official India Post API if new or unknown
 * 4. Falls back to postal zone heuristics
 */
export async function lookupIndianPincode(pincode: string): Promise<PincodeLookupResult> {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) {
    return { city: '', state: '', success: false };
  }

  // 1. Check in-memory cache
  if (pincodeCache.has(cleanPin)) {
    return pincodeCache.get(cleanPin)!;
  }

  // 2. Check local offline database
  const db = await preloadPincodeDatabase();
  if (db && db[cleanPin]) {
    const [city, state] = db[cleanPin];
    const result: PincodeLookupResult = {
      city,
      state,
      success: true,
    };
    pincodeCache.set(cleanPin, result);
    return result;
  }

  // Built-in instant fallback hint
  const fallbackHint = getPincodeHint(cleanPin);
  const fallbackState = fallbackHint?.state || 'Karnataka';
  const fallbackCity = fallbackHint?.city || '';

  // 3. Fallback: Query India Post API for rare/newly assigned PINs
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const state = po.State || fallbackState;
        const city = po.District || po.Block || fallbackCity || po.Name;

        const result: PincodeLookupResult = {
          city,
          state,
          district: po.District,
          postOfficeName: po.Name,
          success: true,
        };
        pincodeCache.set(cleanPin, result);
        return result;
      }
    }
  } catch (err) {
    // Network offline or timeout - gracefully continue to heuristic
  }

  // 4. Return heuristic fallback
  const fallbackResult: PincodeLookupResult = {
    city: fallbackCity,
    state: fallbackState,
    success: Boolean(fallbackState),
  };
  if (fallbackResult.success) {
    pincodeCache.set(cleanPin, fallbackResult);
  }
  return fallbackResult;
}

