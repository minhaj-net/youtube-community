import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'TubeBoost Marketplace — Creator Services & YouTube Growth Platform',
  description:
    'Premium YouTube marketplace for compliant audience growth packages, professional creator services, monetized channel listings, and turnkey video assets.',
  keywords: [
    'YouTube Marketplace',
    'Audience Growth',
    'Video Editing',
    'Thumbnail Design',
    'YouTube Channels for Sale',
    'Monetized Channels',
    'YouTube SEO',
  ],
  authors: [{ name: 'TubeBoost Marketplace' }],
  openGraph: {
    title: 'TubeBoost Marketplace — Premier YouTube Creator Growth & Marketplace',
    description:
      'Buy audience growth packages, professional thumbnails, video editing services, and verified YouTube channels securely.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#050B14] text-slate-100 font-sans selection:bg-[#FF1744] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
