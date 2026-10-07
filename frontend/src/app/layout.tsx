import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// ── Google Fonts loaded via next/font (subset, no layout shift) ──────────────
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'CareBridge Specialist Hospital | Jos, Plateau State',
    template: '%s | CareBridge Specialist Hospital',
  },
  description:
    'CareBridge Specialist Hospital in Jos, Plateau State — providing world-class healthcare with compassion. Book appointments, consult specialist doctors, and access health records online.',
  keywords: [
    'hospital jos',
    'specialist hospital plateau state',
    'carebridge hospital',
    'book appointment hospital jos',
    'doctors in jos nigeria',
    'plateau state hospital',
  ],
  openGraph: {
    siteName: 'CareBridge Specialist Hospital',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-white font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#14b8a6', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
