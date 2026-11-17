export const siteConfig = {
  name: "Heritage Guard",
  tagline: "Discover Heritage. Travel Smarter.",
  description:
    "An intelligent smart-tourism platform providing real-time crowd insights, slot bookings, and architecture guides to protect heritage sites and empower travelers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://heritageguard.gov.in",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Crowd Status", href: "/crowd-status" },
    { label: "Book Tickets", href: "/tickets" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: {
    explore: [
      { label: "Taj Mahal Agra", href: "/destinations/taj-mahal" },
      { label: "Red Fort Delhi", href: "/destinations/red-fort" },
      { label: "Amer Fort Jaipur", href: "/destinations/amer-fort" },
      { label: "Qutub Minar Delhi", href: "/destinations/qutub-minar" },
      { label: "Hawa Mahal Jaipur", href: "/destinations/hawa-mahal" },
      { label: "Ajanta & Ellora Caves", href: "/destinations/ajanta-caves" },
    ],
    management: [
      { label: "Live Crowd Status", href: "/crowd-status" },
      { label: "Time Slot Reservations", href: "/tickets" },
      { label: "Conservation Guidelines", href: "/about#conservation" },
      { label: "Official Visitor Safety", href: "/about#safety" },
    ],
    portals: [
      { label: "Visitor Dashboard", href: "/dashboard" },
      { label: "Admin Portal", href: "/admin" },
      { label: "Sign In / Register", href: "/login" },
      { label: "Support & Grievances", href: "/contact" },
    ],
  },
  contact: {
    helpline: "+91 (011) 2307-5500",
    email: "support@heritageguard.gov.in",
    address: "National Monument Authority & Heritage Informatics Directorate, New Delhi, India",
    operationalHours: "06:00 AM - 10:00 PM IST Daily",
  },
};
