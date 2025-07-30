import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Day Flow - Smart Task Management & Habit Tracking',
  description: 'Organize your day with intelligent task management, habit tracking, and productivity tools. Boost your productivity with Day Flow.',
  keywords: 'task management, habit tracking, productivity, time management, daily planner, habit tracker',
  authors: [{ name: 'Day Flow Team' }],
  creator: 'Day Flow',
  publisher: 'Day Flow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://day-flow-master-9d0qn6otx-software-hubs-projects.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Day Flow - Smart Task Management & Habit Tracking',
    description: 'Organize your day with intelligent task management, habit tracking, and productivity tools. Boost your productivity with Day Flow.',
    url: 'https://day-flow-master-9d0qn6otx-software-hubs-projects.vercel.app',
    siteName: 'Day Flow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Day Flow - Smart Task Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Day Flow - Smart Task Management & Habit Tracking',
    description: 'Organize your day with intelligent task management, habit tracking, and productivity tools.',
    images: ['/og-image.png'],
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='10' width='80' height='80' rx='8' fill='%234A90E2' stroke='%23E8F4FD' stroke-width='2'/><rect x='15' y='15' width='70' height='15' fill='%23336699' rx='2'/><circle cx='25' cy='22' r='2' fill='%23224466'/><circle cx='35' cy='22' r='2' fill='%23224466'/><rect x='15' y='35' width='70' height='50' fill='rgba(255,255,255,0.9)' rx='2'/><circle cx='50' cy='70' r='8' fill='%23FF6B35'/><path d='M 50 62 L 50 58 M 58 70 L 62 70 M 42 70 L 38 70 M 50 78 L 50 82 M 58 78 L 62 78 M 42 78 L 38 78' stroke='%23FF6B35' stroke-width='1.5' fill='none'/><path d='M 40 75 Q 50 65 60 75' stroke='%234A90E2' stroke-width='2' fill='none'/></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
