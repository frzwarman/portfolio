import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Muhamad Fariz Warman — Front-End Developer",
    template: "%s — Muhamad Fariz Warman",
  },
  description:
    "Front-end developer Muhamad Fariz Warman builds thoughtful, scalable interfaces with TypeScript, React, Next.js, and modern web technology.",
  keywords: ["Muhamad Fariz Warman", "Front-End Developer", "React", "Next.js", "TypeScript", "Jakarta"],
  authors: [{ name: "Muhamad Fariz Warman" }],
  creator: "Muhamad Fariz Warman",
  openGraph: {
    type: "website",
    title: "Muhamad Fariz Warman — Front-End Developer",
    description: "Thoughtful interfaces for real-world systems.",
    siteName: "Muhamad Fariz Warman Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Fariz Warman — Front-End Developer",
    description: "Thoughtful interfaces for real-world systems.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
