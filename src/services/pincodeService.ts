import { getPincodeHint } from '../data/indiaLocations';

export interface PincodeLookupResult {
  city: string;
  state: string;
  district?: string;
  postOfficeName?: string;
  success: boolean;
}

// In-memory cache to avoid repeat network requests for the same pincode
const pincodeCache = new Map<string, PincodeLookupResult>();

/**
 * Resolves 6-digit Indian PIN code to City, State, and Post Office.
 * Uses official India Post API with instant fallback to built-in prefix heuristics.
 */
export async function lookupIndianPincode(pincode: string): Promise<PincodeLookupResult> {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) {
    return { city: '', state: '', success: false };
  }

  // Check in-memory cache
  if (pincodeCache.has(cleanPin)) {
    return pincodeCache.get(cleanPin)!;
  }

  // Built-in instant fallback hint
  const fallbackHint = getPincodeHint(cleanPin);
  const fallbackState = fallbackHint?.state || 'Karnataka';
  const fallbackCity = fallbackHint?.city || '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s max wait

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const state = po.State || fallbackState;
        // Clean city: prefer District or Block, fallback to PostOffice Name or existing hint
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
    // Network offline or timeout - gracefully use built-in heuristic
    console.info('[Pincode] Using built-in postal prefix lookup for', cleanPin);
  }

  // Return heuristic fallback
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
