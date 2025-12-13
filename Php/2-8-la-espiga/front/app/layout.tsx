import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AuthControls from "./components/AuthControls";
import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Espiga",
  description: "Pan recien horneado, masas madre y cafe de barrio en La Espiga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-amber-900">
              <Image src="/la-espiga-logo.png" alt="La Espiga Logo" width={128} height={128} />
            </Link>
            <HeaderNav />
            <AuthControls />
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
