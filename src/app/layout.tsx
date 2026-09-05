import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Used to resolve the absolute URL for Open Graph / Twitter images below.
// Set NEXT_PUBLIC_SITE_URL to your deployed domain (e.g. Vercel URL).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Niven | 1st Birthday",
  description:
    "You're invited to celebrate Niven's 1st birthday on October 4, 2026 at 11:30 AM, at our home.",

  openGraph: {
    title: "Niven | 1st Birthday",
    description:
      "Join us as we celebrate Niven's 1st birthday — October 4, 2026, 11:30 AM at our home.",
    type: "website",
    locale: "en_PH",
    siteName: "Niven 1st Birthday",
    // Generated from your photo — see SETUP.md if you want to swap it.
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Niven's 1st Birthday Invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Niven | 1st Birthday",
    description:
      "Join us as we celebrate Niven's 1st birthday.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}