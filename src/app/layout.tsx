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
