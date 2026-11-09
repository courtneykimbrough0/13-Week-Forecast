import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: '13-Week Cash Forecast',
  description: 'A minimalist 13-week cash flow projection tool for recurring income, expenses, liabilities, savings, and remaining spend.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CashForecast',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '13-Week Cash Forecast',
    description: 'Minimalist 13-week cash flow projection tool for tracking recurring cash balances and avoiding shortfalls.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '13-Week Cash Forecast',
    description: 'Minimalist 13-week cash flow projection tool for tracking recurring cash balances and avoiding shortfalls.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-gray-100 antialiased min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
