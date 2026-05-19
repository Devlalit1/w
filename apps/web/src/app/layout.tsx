import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DevVerse AI — AI-Powered 3D Developer Workspace',
    template: '%s | DevVerse AI',
  },
  description:
    'Visualize software architectures in 3D, collaborate in real-time, and leverage AI-powered insights. The future of developer workspaces is here.',
  keywords: ['developer tools', '3D visualization', 'AI', 'software architecture', 'collaboration'],
  authors: [{ name: 'DevVerse AI Team' }],
  openGraph: {
    title: 'DevVerse AI',
    description: 'AI-Powered 3D Developer Workspace',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevVerse AI',
    description: 'AI-Powered 3D Developer Workspace',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
