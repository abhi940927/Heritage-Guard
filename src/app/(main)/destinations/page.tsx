import React from "react";
import { Metadata } from "next";
import { getDestinations } from "@/services/destinationQueries";
import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";

export const metadata: Metadata = {
  title: "Explore Destinations | Indian Heritage Sites & Monuments",
  description:
    "Explore India's most celebrated heritage sites including the Taj Mahal, Red Fort, Amer Palace, Qutub Minar, and Ajanta-Ellora caves. Check ticket prices, crowd status, and visiting hours.",
  keywords: [
    "heritage destinations India",
    "Taj Mahal ticket booking",
    "Red Fort visiting hours",
    "Amer Fort Jaipur",
    "Qutub Minar crowd status",
    "Ajanta caves ticket price",
  ],
};

interface DestinationsPageProps {
  searchParams: Promise<{
    search?: string;
    state?: string;
    category?: string;
  }>;
}

export default async function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const destinations = await getDestinations();

  return (
    <DestinationsExplorer
      initialDestinations={destinations}
      initialSearch={resolvedSearchParams.search || ""}
      initialState={resolvedSearchParams.state || "All"}
      initialCategory={resolvedSearchParams.category || "All"}
    />
  );
}
