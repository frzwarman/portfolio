import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { contacts, siteUrl } from "@/config/portfolio";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const dirtyline = localFont({
  src: "../../public/assets/fonts/Dirtyline.otf",
  variable: "--font-dirtyline",
  display: "swap",
});

const title = "Muhamad Fariz Warman, Front-End Engineer";
const description =
  "Front-end engineer in Jakarta building React, Next.js, and TypeScript products: an offline-first POS, a household finance app on Postgres RLS, a headless CMS, and a GPU photo editor.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Muhamad Fariz Warman" },
  description,
  keywords: ["Muhamad Fariz Warman", "Front-End Engineer", "React", "Next.js", "TypeScript", "Jakarta"],
  authors: [{ name: "Muhamad Fariz Warman" }],
  creator: "Muhamad Fariz Warman",
  openGraph: { type: "website", url: "/", title, description, siteName: "Muhamad Fariz Warman" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#050609" };

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhamad Fariz Warman",
  jobTitle: "Front-End Engineer",
  url: siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Jakarta", addressCountry: "ID" },
  sameAs: contacts.filter((contact) => /github|linkedin/.test(contact.href)).map((contact) => contact.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dirtyline.variable}`}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </body>
    </html>
  );
}
