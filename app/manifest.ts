import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: '13-Week Cash Forecast',
    short_name: 'CashForecast',
    description: 'A minimalist 13-week cash flow projection tool for recurring payments and cash balance.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#090D16',
    theme_color: '#090D16',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
