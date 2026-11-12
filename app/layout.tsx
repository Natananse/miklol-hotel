import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import '@/styles/globals.scss';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: { canonical: '/' },
  title: 'MIKLOL — Good food. Great company.',
  description: 'A little escape. A lot of flavour. Discover specialty coffee, beautiful plates, and slow moments at MIKLOL cafe & restaurant.',
  applicationName: 'MIKLOL Cafe & Restaurant',
  openGraph: { title: 'MIKLOL — A little escape. A lot of flavour.', description: 'Coffee with character. Food with soul. Make room for a good moment.', type: 'website', locale: 'en_US', images: [{ url: '/images/interior/ambience.jpg', width: 1400, height: 1000, alt: 'Warm, inviting cafe interior' }] },
  twitter: { card: 'summary_large_image', title: 'MIKLOL Cafe & Restaurant', description: 'Good food. Great company.', images: ['/images/interior/ambience.jpg'] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#211813' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body><a href="#main" className="skip-link">Skip to content</a>{children}</body></html>;
}
