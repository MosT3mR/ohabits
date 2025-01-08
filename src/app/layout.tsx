import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
