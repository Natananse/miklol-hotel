import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import '@/styles/globals.scss';
import MotionProvider from '@/components/MotionProvider';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: 'normal', variable: '--font-display', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: { canonical: '/' },
  title: 'MIKLOL Cafe & Restaurant — Coffee, Breakfast, Lunch & Dinner',
  description: 'Browse espresso, pancakes, Garden Pesto Pasta, Margherita pizza, and the MIKLOL Burger. Explore the menu and plan a table at MIKLOL.',
  applicationName: 'MIKLOL Cafe & Restaurant',
  openGraph: { title: 'MIKLOL — Coffee, Breakfast, Lunch & Dinner', description: 'Espresso, pancakes, pesto pasta, pizza, and burgers. Browse the menu and plan your visit.', type: 'website', locale: 'en_US', images: [{ url: '/images/interior/ambience.jpg', width: 1400, height: 1000, alt: 'Restaurant tables and upholstered chairs around a central bar' }] },
  twitter: { card: 'summary_large_image', title: 'MIKLOL Cafe & Restaurant', description: 'Espresso, pasta, pizza, and burgers. Find your next order at MIKLOL.', images: ['/images/interior/ambience.jpg'] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#211813', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body><a href="#main" className="skip-link">Skip to content</a><MotionProvider>{children}</MotionProvider></body></html>;
}
