export interface LocationSuggestion {
  placeId: string;
  displayName: string;
  name: string;
  houseFlat?: string;
  areaStreet: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'pk.94cd0e1ca967ff19f87e0f66e6e8b903';

/**
 * Searches Indian localities, roads, colonies, tech parks, and landmarks
 * using LocationIQ's Autocomplete API.
 */
export async function searchLocationIQ(query: string, signal?: AbortSignal): Promise<LocationSuggestion[]> {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 3) return [];

  const url = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(
    cleanQuery
  )}&countrycodes=in&limit=6&dedupe=1&normalizeaddress=1`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      if (res.status === 429) {
        console.warn('[LocationIQ] Rate limit reached.');
      }
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any): LocationSuggestion => {
      const addr = item.address || {};
      
      // Determine city: city > town > municipality > city_district > county
      const city = addr.city || addr.town || addr.municipality || addr.city_district || addr.county || '';
      
      // Determine state
      const state = addr.state || '';
      
      // Determine postal pincode
      const pincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '';

      // Determine road / street / neighborhood
      const streetOrRoad = addr.road || addr.street || '';
      const neighborhood = addr.neighbourhood || addr.suburb || addr.residential || '';
      
      const areaParts: string[] = [];
      if (streetOrRoad) areaParts.push(streetOrRoad);
      if (neighborhood && neighborhood !== streetOrRoad) areaParts.push(neighborhood);
      
      const areaStreet = areaParts.length > 0 ? areaParts.join(', ') : (addr.county || city || item.display_place || '');

      // Check if place itself is a named building / landmark
      const placeName = item.display_place || addr.name || '';
      const isNamedBuildingOrPOIType = ['building', 'amenity', 'commercial', 'office', 'apartments'].includes(item.class);
      
      const houseFlat = isNamedBuildingOrPOIType ? placeName : undefined;
      const landmark = addr.suburb || addr.neighbourhood || undefined;

      return {
        placeId: item.place_id,
        displayName: item.display_name,
        name: placeName,
        houseFlat,
        areaStreet,
        landmark: landmark !== areaStreet ? landmark : undefined,
        city,
        state,
        pincode,
      };
    });
  } catch (err: any) {
    if (err.name === 'AbortError') return [];
    console.warn('[LocationIQ] Failed to fetch suggestions:', err);
    return [];
  }
}
