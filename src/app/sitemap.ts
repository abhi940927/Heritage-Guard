import { MetadataRoute } from "next";
import { getDestinations } from "@/services/destinationQueries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://heritageguard.gov.in";
  const destinations = await getDestinations();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/crowd-status`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tickets`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic destination routes
  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${siteUrl}/destinations/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [...staticRoutes, ...destinationRoutes];
}
