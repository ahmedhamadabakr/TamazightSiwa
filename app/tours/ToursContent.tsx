"use client";

import { useState, useEffect } from "react";
import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";

// Dynamic imports
const ClientOnlyNavigation = dynamic(
  () =>
    import("@/components/ClientOnlyNavigation").then((m) => ({
      default: m.ClientOnlyNavigation,
    })),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/footer").then((m) => ({ default: m.Footer })),
  { ssr: false }
);

const MotionDiv = dynamic(
  () => import("@/components/Motion").then((m) => ({ default: m.MotionDiv })),
  { ssr: false }
);

const TourCard = dynamic(
  () => import("@/components/TourCard").then((m) => ({ default: m.TourCard })),
  {
    loading: () => (
      <div className="animate-pulse h-96 bg-muted rounded-lg" />
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

export default function ToursContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [tour, setTour] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const fetchTour = async () => {
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append("category", activeCategory);

      const response = await fetch(`/api/tours?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        const allTours = data.data || [];
        setTour(allTours);
        // Always show all tours fetched so "All" really displays everything
        setVisibleCount(allTours.length);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTour();
    setVisibleCount(6);
  }, [activeCategory]);

  // polling every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTour();
    }, 30000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <ClientOnlyNavigation />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <MotionDiv
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {tour.slice(0, visibleCount).map((tourItem, index) => (
                  <TourCard key={tourItem._id} tour={tourItem} index={index} />
                ))}
              </MotionDiv>

              {tour.length > visibleCount && (
                <div className="flex justify-center mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    Load more tours
                  </Button>
                </div>
              )}
            </>
          )}

          {!loading && tour.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No tours available in this category
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
