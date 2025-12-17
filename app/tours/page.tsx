// /app/tours/page.tsx
import { Metadata } from "next";
import ToursContent from "./ToursContent";
import { generateSEOMetadata, generateStructuredData } from "@/components/SEOHead";
import { StructuredDataScript } from "@/components/OptimizedScript";

async function fetchTours(category?: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tamazight-siwa.com";
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const url = `${site}/api/tours${params}`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error("Failed to fetch tours:", res.statusText);
    return [];
  }

  const payload = await res.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}

/** SEO metadata (use your helpers) */
export const metadata: Metadata = generateSEOMetadata({
  title: "Siwa Tours & Desert Experiences | Authentic Oasis Adventures - Siwa With Us",
  description:
    "Discover authentic Siwa Oasis tours: cultural heritage experiences, desert adventures, wellness retreats, and photography expeditions. Book your perfect Siwa journey today!",
  keywords:
    "Siwa tours, Siwa Oasis experiences, desert tours Egypt, Siwa cultural tours, White Desert tours, Great Sand Sea, Siwa adventure tours, eco-tourism Siwa, Berber culture tours, Siwa photography tours",
  canonical: "/tours",
  ogType: "website",
});

const toursStructuredData = generateStructuredData({
  type: "LocalBusiness",
  name: "Siwa With Us Tours",
  description: "Authentic desert tours and cultural experiences in Siwa Oasis, Egypt",
  url: "https://www.tamazight-siwa.com/tours",
  priceRange: "$$-$$$",
});

export default async function ToursPage() {
  const tours = await fetchTours();

  return (
    <>
      <StructuredDataScript data={toursStructuredData} />
      <ToursContent initialTours={tours} />
    </>
  );
}
