// /app/tours/ToursContent.tsx
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";

// Dynamic (only for heavy UI parts)
const ClientOnlyNavigation = dynamic(
  () => import("@/components/ClientOnlyNavigation").then((m) => m.ClientOnlyNavigation),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: false });
const MotionDiv = dynamic(() => import("@/components/Motion").then((m) => m.MotionDiv));
const TourCard = dynamic(() => import("@/components/TourCard").then((m) => m.TourCard), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />,
});

const categories = ["All", "Cultural", "Adventure", "Wellness", "Photography", "Extreme"];

interface ToursContentProps {
  initialTours: Tour[];
}

export default function ToursContent({ initialTours }: ToursContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Make sure initialTours is a safe array and normalize IDs
  const normalizedTours = useMemo(() => {
    if (!Array.isArray(initialTours)) return [];
    return initialTours
      .filter(Boolean)
      .map((t) => ({
        ...t,
        _id: (t._id && String(t._id)) || (t.id && String(t.id)) || undefined,
      }))
      .filter((t) => t._id && t.title); // ensure minimal shape
  }, [initialTours]);

  const filteredTours = useMemo(() => {
    if (activeCategory === "All") return normalizedTours;
    return normalizedTours.filter((t) => String(t.category) === activeCategory);
  }, [normalizedTours, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <ClientOnlyNavigation />

      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(6);
                }}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Tour Grid */}
          <MotionDiv layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTours.slice(0, visibleCount).map((tour, index) => (
              <TourCard key={String(tour._id)} tour={tour} index={index} />
            ))}
          </MotionDiv>

          {/* Load more */}
          {filteredTours.length > visibleCount && (
            <div className="flex justify-center mt-12">
              <Button variant="outline" onClick={() => setVisibleCount((v) => v + 6)}>
                Load more tours
              </Button>
            </div>
          )}

          {/* Empty state */}
          {filteredTours.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                {normalizedTours.length === 0
                  ? "No tours available at the moment. Please check back later."
                  : `No tours found in the "${activeCategory}" category.`}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
