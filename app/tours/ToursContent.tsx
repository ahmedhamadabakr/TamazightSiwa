"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";

// Dynamic imports
const ClientOnlyNavigation = dynamic(
  () =>
    import("@/components/ClientOnlyNavigation").then(
      (m) => m.ClientOnlyNavigation
    ),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/footer").then((m) => m.Footer),
  { ssr: false }
);

const MotionDiv = dynamic(
  () => import("@/components/Motion").then((m) => m.MotionDiv)
);

const TourCard = dynamic(
  () => import("@/components/TourCard").then((m) => m.TourCard),
  {
    loading: () => (
      <div className="h-72 rounded-2xl bg-muted animate-pulse" />
    ),
  }
);

const categories = [
  "All",
  "Cultural",
  "Adventure",
  "Wellness",
  "Photography",
  "Extreme",
];

interface ToursContentProps {
  initialTours: Tour[];
}

export default function ToursContent({ initialTours }: ToursContentProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  /* ================= Normalize Tours ================= */
  const normalizedTours = useMemo(() => {
    if (!Array.isArray(initialTours)) return [];
    return initialTours
      .filter(Boolean)
      .map((t) => ({
        ...t,
        _id: String(t._id || t.id || ""),
      }))
      .filter((t) => t._id && t.title);
  }, [initialTours]);

  const filteredTours = useMemo(() => {
    if (activeCategory === "All") return normalizedTours;
    return normalizedTours.filter(
      (t) => String(t.category) === activeCategory
    );
  }, [normalizedTours, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <ClientOnlyNavigation />

      {/* ================= HEADER ================= */}
      <section className="pt-28 sm:pt-32 px-4 pb-20">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore Our Tours
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Discover unique experiences crafted to give you unforgettable
            memories.
          </p>
        </div>

        {/* ================= CATEGORIES ================= */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Button
                  key={cat}
                  size="sm"
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`
                    rounded-full px-4 text-xs sm:text-sm transition-all
                    ${
                      isActive
                        ? "bg-primary text-white shadow-md scale-105"
                        : "bg-background hover:bg-muted"
                    }
                  `}
                  variant={isActive ? "default" : "outline"}
                >
                  {cat}
                </Button>
              );
            })}
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="max-w-6xl mx-auto">
          <MotionDiv
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredTours.slice(0, visibleCount).map((tour, index) => (
              <TourCard
                key={tour._id}
                tour={tour}
                index={index}
              />
            ))}
          </MotionDiv>

          {/* ================= LOAD MORE ================= */}
          {filteredTours.length > visibleCount && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((v) => v + 6)}
                className="rounded-full px-8"
              >
                Load more tours
              </Button>
            </div>
          )}

          {/* ================= EMPTY STATE ================= */}
          {filteredTours.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                🧭
              </div>
              <p className="text-lg font-medium">
                {normalizedTours.length === 0
                  ? "No tours available right now"
                  : `No tours found in "${activeCategory}"`}
              </p>
              <p className="text-muted-foreground mt-2">
                Please try another category or come back later.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
