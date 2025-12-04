"use client"

import { useState, useEffect } from "react"
import React from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tour } from "@/types/tour"

// Dynamic imports للمكونات غير الحرجة
const ClientOnlyNavigation = dynamic(() => import("@/components/ClientOnlyNavigation").then(m => ({ default: m.ClientOnlyNavigation })), {
  ssr: false,
  loading: () => <div className="h-16 bg-background" />
})

const Footer = dynamic(() => import("@/components/footer").then(m => ({ default: m.Footer })), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted" />
})

const MotionDiv = dynamic(() => import("@/components/Motion").then(m => ({ default: m.MotionDiv })), { ssr: false })
const TourCard = dynamic(() => import("@/components/TourCard").then(m => ({ default: m.TourCard })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />
})
const categories = ["All", "Cultural", "Adventure", "Wellness", "Photography", "Extreme"]

export default function ToursContent() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [tour, setTour] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  const fetchTour = async () => {
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append('category', activeCategory as string);

      const response = await fetch(`/api/tours?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setTour(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  // استدعاء fetchTour عند تحميل الكومبوننت
  React.useEffect(() => {
    fetchTour();
    setVisibleCount(6) // إعادة ضبط عدد الكروت عند تغيير الفئة
  }, [activeCategory]);

  // Polling للتأكد من إضافة أي رحلات جديدة أثناء تصفح المستخدم
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTour();
    }, 30000); // كل 30 ثانية

    return () => clearInterval(intervalId);
  }, [activeCategory]);

  if (!tour) {
    return <div className="p-10 text-center text-red-500">Tour not found!</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientOnlyNavigation />

      {/* Tours Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="transition-all duration-300"
              >
                {category === "All" ? "All" : category}
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
              <MotionDiv layout={true} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tour
                  ?.slice(0, visibleCount)
                  .map((tourItem, index) => (
                    <TourCard key={tourItem._id} tour={tourItem} index={index} />
                  ))}
              </MotionDiv>

              {/* Load more button */}
              {tour && tour.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-6 py-2"
                  >
                    Load more tours
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && tour?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tours available in this category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
