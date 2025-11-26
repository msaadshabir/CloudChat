
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata, Viewport } from 'next';
import MobileNav from '@/components/MobileNav';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CloudChat - Share Your Thoughts',
    template: '%s | CloudChat',
  },
  description: 'A modern social platform for sharing ideas, connecting with others, and discovering new perspectives. Join the conversation on CloudChat.',
  keywords: ['social media', 'microblogging', 'social network', 'cloudchat', 'share thoughts'],
  authors: [{ name: 'CloudChat Team' }],
  creator: 'CloudChat',
  publisher: 'CloudChat',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cloudchat.app',
    siteName: 'CloudChat',
    title: 'CloudChat - Share Your Thoughts',
    description: 'A modern social platform for sharing ideas, connecting with others, and discovering new perspectives.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CloudChat - Share Your Thoughts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudChat - Share Your Thoughts',
    description: 'A modern social platform for sharing ideas, connecting with others, and discovering new perspectives.',
    images: ['/og-image.png'],
    creator: '@cloudchat',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://cloudchat.app',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <MobileNav />
        </body>
      </html>
    </ClerkProvider>
  );
}