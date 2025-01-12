import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { WorkoutProvider } from '@/context/WorkoutContext'
import SupabaseProvider from '@/providers/SupabaseProvider'
import { AuthProvider } from '@/context/AuthContext'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: "Ohabits",
  description: "Track your habits and workouts",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      type: 'image/png',
    },
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SupabaseProvider>
          <AuthProvider>
            <WorkoutProvider>
              {children}
            </WorkoutProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
