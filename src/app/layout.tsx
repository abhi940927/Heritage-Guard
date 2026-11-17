import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Heritage Guard - Smart Tourism & Crowd Management",
    default: "Heritage Guard | Smart Tourism & Crowd Management System",
  },
  description:
    "Explore iconic heritage destinations, discover rich historical architecture, check real-time and predicted crowd levels, and book optimal visit time slots for a serene tourism experience.",
  keywords: [
    "heritage site crowd management",
    "smart tourism",
    "Taj Mahal ticket booking",
    "Red Fort visiting hours",
    "historical monuments India",
    "crowd prediction tourism",
    "monument entry time slots",
  ],
  authors: [{ name: "Heritage Site Smart Tourism Directorate" }],
  creator: "Heritage Site Crowd Management System",
  publisher: "Archaeological and Cultural Heritage Board",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://heritageguard.gov.in"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Heritage Guard",
    title: "Heritage Guard | Smart Tourism & Crowd Management System",
    description:
      "Intelligent crowd monitoring, ticketing, and heritage conservation platform for historical monuments and cultural destinations.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Taj Mahal Agra - Heritage Site Crowd Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage Guard - Smart Tourism & Crowd Management",
    description:
      "Plan your heritage visits smarter with live crowd indicators, time slot bookings, and architecture guides.",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
