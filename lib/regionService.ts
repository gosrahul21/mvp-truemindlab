import { PlanRegion } from '@/lib/supabase/types';

/**
 * Service to determine the user's region based on their IP address.
 * Uses a free IP geolocation API. Defaults to 'us' on failure or non-Indian regions.
 */
export async function determineUserRegion(ip?: string | null): Promise<PlanRegion> {
  try {
    const url = ip && ip !== '::1' && ip !== '127.0.0.1' 
      ? `https://ipinfo.io/${ip}/json` 
      : 'https://ipinfo.io/json'

    // Provide a User-Agent to prevent basic bot blocking
    const geoRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const geoData = await geoRes.json()
    
    // ipinfo uses "country" instead of "country_code"
    if (geoData.country === 'IN') {
       return 'india'
    }
    
    // Log for local debugging
    console.log('GeoData mapped:', geoData.country)
  } catch (e) {
    console.warn('Geo IP fetch failed, defaulting region to US:', e)
  }
  
  return 'us'
}
