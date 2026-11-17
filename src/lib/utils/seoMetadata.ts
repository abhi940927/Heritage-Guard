import { Destination } from "@/types";

export function generateTouristAttractionSchema(
  destination: Destination,
  siteUrl: string = "https://heritageguard.gov.in"
) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.short_description,
    image: destination.cover_image_url,
    url: `${siteUrl}/destinations/${destination.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: destination.location,
      addressRegion: destination.state,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.slug === "taj-mahal" ? 27.1751 : 28.6562,
      longitude: destination.slug === "taj-mahal" ? 78.0421 : 77.241,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Saturday",
          "Sunday",
        ].filter((day) => !destination.closed_days?.includes(day)),
        opens: destination.opening_time.substring(0, 5),
        closes: destination.closing_time.substring(0, 5),
      },
    ],
    isAccessibleForFree: destination.base_ticket_price === 0,
    publicAccess: true,
    touristType: ["Cultural Tourism", "Historical Architecture", "UNESCO Heritage"],
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
  siteUrl: string = "https://heritageguard.gov.in"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function generateWebsiteSchema(
  siteUrl: string = "https://heritageguard.gov.in"
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Heritage Guard - Heritage Site Crowd Management System",
    url: siteUrl,
    description:
      "Intelligent crowd monitoring, ticketing, and heritage conservation platform for historical monuments.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/destinations?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema(
  siteUrl: string = "https://heritageguard.gov.in"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "National Heritage Site Crowd Management Directorate",
    url: siteUrl,
    logo: `${siteUrl}/images/heritage-logo.png`,
    sameAs: [
      "https://en.wikipedia.org/wiki/Archaeological_Survey_of_India",
      "https://twitter.com/asi_india",
    ],
  };
}
