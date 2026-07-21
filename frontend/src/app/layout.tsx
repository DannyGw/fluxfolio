import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FluxFolio — Developer Portfolio",
    template: "%s | FluxFolio",
  },
  description:
    "A modern portfolio showcasing projects, skills, and experience. Built with Next.js, Express, and PostgreSQL.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "web development",
    "react",
    "next.js",
    "typescript",
  ],
  authors: [{ name: "FluxFolio" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FluxFolio",
    title: "FluxFolio — Developer Portfolio",
    description:
      "A modern portfolio showcasing projects, skills, and experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FluxFolio Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxFolio — Developer Portfolio",
    description:
      "A modern portfolio showcasing projects, skills, and experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.toggle("dark",localStorage.getItem("fluxfolio-theme")==="dark")`,
          }}
        />
        <Header />
        <main className="flex-1"><Providers>{children}</Providers></main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent font-semibold">
              FluxFolio
            </span>{" "}
            &copy; {new Date().getFullYear()}. Built with Next.js & Express.
          </div>
        </footer>
      </body>
    </html>
  );
}
