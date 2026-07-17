/** Fallbacks si l'API branding est indisponible. */
export const BRANDING_FALLBACK = {
  LOGO_DARK:
    'https://eventime.ga/public/storage/img-theme-dark/HmRqNxtuS855clAUx06JiTBFn0jlZskQOh9f2cJf.png',
  LOGO_LIGHT:
    'https://eventime.ga/public/storage/img-theme-light/2ts4fbscLGcLd58lFyUX8ADznjSUtnFSwpfekwxb.png',
} as const;

export type BrandingAssets = {
  logoDark: string;
  logoLight: string;
};
