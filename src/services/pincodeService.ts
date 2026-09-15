import { getPincodeHint } from '../data/indiaLocations.ts';

export interface PincodeLookupResult {
  city: string;
  state: string;
  district?: string;
  postOfficeName?: string;
  success: boolean;
  error?: string;
  isHeuristic?: boolean;
}

export interface PincodeValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates Indian postal code formatting.
 * Indian PIN codes are 6 digits, starting with digits 1-9 (never 0).
 */
export function validateIndianPincodeFormat(pincode: string): PincodeValidationResult {
  const clean = pincode.replace(/\D/g, '');
  if (!clean) {
    return { isValid: false, error: 'PIN code is required' };
  }
  if (clean.startsWith('0')) {
    return { isValid: false, error: 'Indian PIN codes cannot start with 0' };
  }
  if (clean.length < 6) {
    return { isValid: false, error: `Enter 6 digits (currently ${clean.length})` };
  }
  if (clean.length > 6) {
    return { isValid: false, error: 'PIN code cannot exceed 6 digits' };
  }
  if (/^(\d)\1{5}$/.test(clean)) {
    return { isValid: false, error: 'Invalid dummy PIN code' };
  }
  return { isValid: true };
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
      if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
        // Node.js test environment: read from filesystem
        const fsMod = 'node:fs';
        const pathMod = 'node:path';
        const fs = await import(/* @vite-ignore */ fsMod);
        const path = await import(/* @vite-ignore */ pathMod);
        const localPath = path.resolve(process.cwd(), 'public/data/india-pincodes.json');
        if (fs.existsSync(localPath)) {
          localDb = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          return localDb;
        }
      }

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
 * 1. Checks format rules (no leading 0, exactly 6 digits, no repeated dummy numbers)
 * 2. Checks in-memory cache
 * 3. Checks local offline database (19,097 PINs, 0ms latency, zero external API)
 * 4. Falls back to official India Post API for rare/newly assigned PINs
 * 5. Falls back to postal zone heuristics if available
 * 6. Returns error with guidance if completely unrecognized
 */
export async function lookupIndianPincode(pincode: string): Promise<PincodeLookupResult> {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);

  // 1. Format validation
  const validation = validateIndianPincodeFormat(cleanPin);
  if (!validation.isValid) {
    return {
      city: '',
      state: '',
      success: false,
      error: validation.error || 'Invalid PIN code format',
    };
  }

  // 2. Check in-memory cache
  if (pincodeCache.has(cleanPin)) {
    return pincodeCache.get(cleanPin)!;
  }

  // 3. Check local offline database (19,097 verified PINs)
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

  // 4. Fallback: Query India Post API for rare/newly assigned PINs
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
        const state = po.State || '';
        const city = po.District || po.Block || po.Name || '';

        if (state) {
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
    }
  } catch (err) {
    // Network offline or timeout - gracefully continue to heuristic
  }

  // 5. Fallback: Heuristic by 2-digit postal prefix
  const fallbackHint = getPincodeHint(cleanPin);
  if (fallbackHint && fallbackHint.state) {
    const fallbackResult: PincodeLookupResult = {
      city: fallbackHint.city || '',
      state: fallbackHint.state,
      success: true,
      isHeuristic: true,
    };
    pincodeCache.set(cleanPin, fallbackResult);
    return fallbackResult;
  }

  // 6. Unknown / Invalid PIN code
  const errorResult: PincodeLookupResult = {
    city: '',
    state: '',
    success: false,
    error: 'Unrecognized PIN code. Please verify or manually enter City & State.',
  };
  pincodeCache.set(cleanPin, errorResult);
  return errorResult;
}

