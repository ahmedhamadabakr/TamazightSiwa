export const revalidate = 0;
import { HeroSection } from "@/components/hero-section"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function fetchTours() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tamazight-siwa.com"
  const res = await fetch(`${site}/api/tours`, { cache: "no-store" })
  if (!res.ok) return []
  const payload = await res.json()
  return Array.isArray(payload?.data) ? payload.data : []
}

function truncateWords(text: string, limit = 8) {
  if (!text) return ""
  const words = text.trim().split(/\s+/)
  return words.length > limit ? `${words.slice(0, limit).join(" ")}...` : text
}

// Critical components - loaded immediately
const ClientOnlyNavigation = dynamic(() => import("@/components/ClientOnlyNavigation").then(m => ({ default: m.ClientOnlyNavigation })), {
  ssr: false,
  loading: () => <div className="h-16 bg-background" />
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

export default async function HomePage() {
  const tours = await fetchTours()
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

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
                  A quieter way to discover Siwa.
                </h2>
                <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
                  Slow mornings, warm light, and real moments.
                </p>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted">
                <Image
                  src="/siwa-oasis-sunset-salt-lakes-reflection.avif"
                  alt="Quiet moment in Siwa"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Experiences
              </h2>
              <p className="mt-4 text-muted-foreground">
                Three ways to feel Siwa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tours.slice(0, 3).map((tour: any) => {
                const tourId = String(tour?.slug || tour?._id || tour?.id || "")
                const href = tourId ? `/tours/${tourId}` : "/tours"
                const imageSrc = tour?.images?.[0] || "/siwa-oasis-sunset-salt-lakes-reflection.avif"
                return (
                  <div key={tourId || tour?.title} className="overflow-hidden rounded-3xl border border-border bg-background">
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={imageSrc}
                        alt={tour?.title || "Tour"}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-foreground">{tour?.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{truncateWords(tour?.description, 10)}</p>
                      <div className="mt-6">
                        <Link href={href} aria-label={`Explore ${tour?.title || "tour"}`}>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="relative h-[520px]">
                <Image
                  src="/siwa-oasis-sunset-salt-lakes-reflection.avif"
                  alt="Desert highlight"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="absolute inset-0 flex items-end">
                <div className="p-10 md:p-14 max-w-2xl text-white">
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    Let the desert slow you down.
                  </h2>
                  <p className="mt-4 text-white/85">
                    Not a checklist. A feeling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Why with us
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["Real people, real moments", "Quiet planning, fewer steps", "Soft pace, deep experience"].map((t) => (
                <div key={t} className="rounded-3xl bg-background border border-border p-8">
                  <p className="text-foreground font-medium">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-3xl bg-muted/40 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p className="text-xl md:text-2xl font-medium text-foreground">
                Ready to plan a quiet escape?
              </p>
              <Link href="https://wa.me/201552624123" aria-label="Request booking on WhatsApp">
                <Button className="rounded-full px-7">Request on WhatsApp</Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
