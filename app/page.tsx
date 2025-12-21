export const revalidate = 0;
import { HeroSection } from "@/components/hero-section"
import dynamic from "next/dynamic"

// Critical components - loaded immediately
const ClientOnlyNavigation = dynamic(() => import("@/components/ClientOnlyNavigation").then(m => ({ default: m.ClientOnlyNavigation })), {
  ssr: false,
  loading: () => <div className="h-16 bg-background" />
})

const FeaturedTours = dynamic(() => import("@/components/featured-tours").then(m => ({ default: m.FeaturedTours })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg mx-4 my-8" />
})

// Above-the-fold components - high priority
const StatsSection = dynamic(() => import("@/components/stats-section").then(m => ({ default: m.StatsSection })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg mx-4 my-8" />
})

/* const OverviewSection = dynamic(() => import("@/components/overview-section").then(m => ({ default: m.OverviewSection })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg mx-4 my-8" />
})
// Below-the-fold components - deferred loading
const VideoShowcaseLazy = dynamic(() => import("@/components/video-showcase").then(m => ({ default: m.VideoShowcase })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg mx-4 my-8" />
})

const GalleryPreviewLazy = dynamic(() => import("@/components/gallery-preview").then(m => ({ default: m.GalleryPreview })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg mx-4 my-8" />
})
*/

const TestimonialsSectionLazy = dynamic(() => import("@/components/testimonials-section").then(m => ({ default: m.TestimonialsSection })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg mx-4 my-8" />
})

/* const ServicesSectionLazy = dynamic(() => import("@/components/services-section").then(m => ({ default: m.ServicesSection })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg mx-4 my-8" />
}) */

const Footer = dynamic(() => import("@/components/footer").then(m => ({ default: m.Footer })), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted" />
})
import { ResourceHints } from "@/components/PerformanceMonitor"
import { GlobalPerformanceOptimizer, CriticalCSS } from "@/components/GlobalPerformanceOptimizer"
import { HomePageSEO } from "@/components/PageSEO"
import { LocalSEO } from "@/components/LocalSEO"
import { SEOEnhancements } from "@/components/SEOEnhancements"
import { AccessibilityEnhancements } from "@/components/AccessibilityEnhancements"
import { PerformanceOptimizations } from "@/components/PerformanceOptimizations"

export default function HomePage() {
  return (
    <>
      {/* SEO Optimization */}
      <HomePageSEO />
      <LocalSEO />
      <SEOEnhancements page="home" />
      <AccessibilityEnhancements />
      <PerformanceOptimizations />

      {/* Essential optimizations only */}
      <CriticalCSS />
      <ResourceHints />
      <GlobalPerformanceOptimizer />

      <main className="min-h-screen" id="main-content">
        <ClientOnlyNavigation />
        <HeroSection />
        <FeaturedTours />
        <StatsSection />
        {/*  <OverviewSection /> 
        <VideoShowcaseLazy />
        <GalleryPreviewLazy />
        */}
        <TestimonialsSectionLazy />
        {/*         <ServicesSectionLazy />
 */}        <Footer />
      </main>
    </>
  )
}
