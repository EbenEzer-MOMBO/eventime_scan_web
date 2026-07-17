import { API_CONFIG, DEFAULT_HEADERS } from './api.config';
import { BRANDING_FALLBACK, type BrandingAssets } from '@/config/branding';

export class BrandingService {
  /** Charge les logos depuis info_site via l'API scanner. */
  static async fetch(): Promise<BrandingAssets> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BRANDING}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        return {
          logoDark: BRANDING_FALLBACK.LOGO_DARK,
          logoLight: BRANDING_FALLBACK.LOGO_LIGHT,
        };
      }

      const payload = await response.json();
      if (!payload.success || !payload.data) {
        return {
          logoDark: BRANDING_FALLBACK.LOGO_DARK,
          logoLight: BRANDING_FALLBACK.LOGO_LIGHT,
        };
      }

      return {
        logoDark: payload.data.logo_dark || BRANDING_FALLBACK.LOGO_DARK,
        logoLight: payload.data.logo_light || BRANDING_FALLBACK.LOGO_LIGHT,
      };
    } catch {
      return {
        logoDark: BRANDING_FALLBACK.LOGO_DARK,
        logoLight: BRANDING_FALLBACK.LOGO_LIGHT,
      };
    }
  }
}
