// app/tours/[slug]/page.tsx
import { Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"

// UI components (lightweight)
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Server helpers
import { getServerAuthSession } from "@/lib/server-auth"

// Dynamic imports to reduce initial JS bundle (ssr: false where appropriate)
const BookingForm = dynamic(() => import("@/components/BookingForm"), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full" />
})

const TourReviews = dynamic(() => import("@/components/tour/TourReviews"), {
  ssr: false,
  loading: () => <div className="max-w-4xl"><Skeleton className="h-20 w-full" /></div>
})

const TourBreadcrumbs = dynamic(() => import("@/components/tour/TourBreadcrumbs"), {
  ssr: false
})

// Dynamic icon imports to avoid pulling whole icon library into client bundle
const UsersIcon = dynamic(() => import("lucide-react").then(m => m.Users), { ssr: false })
const StarIcon = dynamic(() => import("lucide-react").then(m => m.Star), { ssr: false })

// ========== 1. DATA FETCHING (Optimized) ==========
async function getTour(slug: string) {
  // Use server-side caching strategy. Adjust revalidate to suit content volatility.
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
      // ISR: update every 30 minutes (1800s). Use 'force-cache' to serve cached HTML quickly.
      next: { revalidate: 1800 },
      // don't specify cache: "no-store" to keep edge/ISR benefits
    })

    if (!res.ok) return null
    const result = await res.json()
    return result.success ? result.data : null
  } catch (err) {
    // gracefully handle fetch errors
    return null
  }
}

// ========== 2. SMALL LOADING COMPONENT FOR REVIEWS ==========
const ReviewsLoading = () => (
  <div className="space-y-4 max-w-4xl">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border rounded-lg p-4">
        <div className="flex items-center gap-4 mb-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
    ))}
  </div>
)

// ========== 3. PAGE COMPONENT (Refactored & Performance-First) ==========
export default async function TourDetailsPage({ params }: any) {
  const slug = params.slug
  const tour = await getTour(slug)
  const session = await getServerAuthSession()

  if (!tour) return notFound()

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${tour.slug || slug}`

  // Structured data assembled on server to avoid client computation
  const structuredData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: tour.title,
    description: tour.description ? tour.description.slice(0, 300) : "",
    image: tour.images?.length ? (tour.images[0].includes("http") ? tour.images[0] : `${process.env.NEXT_PUBLIC_DOMAIN}${tour.images[0]}`) : "",
    url: canonicalUrl,
    address: {
      "@type": "Place",
      name: tour.location || "Siwa Oasis, Egypt",
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
    ...(tour.reviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tour.rating,
        reviewCount: tour.reviews,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  }

  // Preload hero image and preconnect domain for faster LCP
  const heroImageUrl = tour.images?.length ? (tour.images[0].includes("http") ? tour.images[0] : `${process.env.NEXT_PUBLIC_DOMAIN}${tour.images[0]}`) : null

  return (
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/TouristAttraction">
      {/* Preconnect & DNS prefetch for domain hosting images/APIs (beforeInteractive) */}
      <Script
        id="preconnect"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            <link rel="preconnect" href="${process.env.NEXT_PUBLIC_DOMAIN}" crossorigin>
            <link rel="dns-prefetch" href="${process.env.NEXT_PUBLIC_DOMAIN}">
            ${heroImageUrl ? `<link rel="preload" as="image" href="${heroImageUrl}" imagesrcset="${heroImageUrl} 1200w" fetchpriority="high">` : ""}
          `,
        }}
      />

      {/* Inject JSON-LD structured data early */}
      <Script
        id="tour-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <TourBreadcrumbs tourTitle={tour.title} tourSlug={tour.slug || slug} />
      </div>

      {/* HERO */}
      <header className="relative h-[60vh] overflow-hidden" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
        <div className="absolute inset-0">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={`${tour.title} - Best tours in Siwa Oasis Egypt`}
              fill
              className="object-cover"
              priority // keep priority for hero image
              fetchPriority="high"
              sizes="100vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA..." // keep a short blur fallback
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          {/* min-h to reduce CLS while webfonts load */}
          <h1 className="min-h-[72px] text-4xl md:text-6xl font-bold text-white px-4 text-center drop-shadow-md" itemProp="name">
            {tour.title}
          </h1>
        </div>
      </header>

      {/* GALLERY */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(tour.images || []).slice(1).map((img: string, i: number) => {
            const src = img.includes("http") ? img : `${process.env.NEXT_PUBLIC_DOMAIN}${img}`
            return (
              <div key={i} className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={src}
                  alt={`${tour.title} gallery image ${i + 1} - Siwa Oasis`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={75}
                  loading="lazy" // lazy load gallery images
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-12" itemProp="mainEntityOfPage">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT: info */}
          <article className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed" itemProp="description">
              {tour.description}
            </p>

            <h3 className="font-semibold mb-3">Highlights:</h3>
            <ul className="flex flex-wrap gap-2 mb-8">
              {(tour.highlights || []).map((h: string, i: number) => (
                <li key={i}>
                  <Badge variant="secondary" className="px-3 py-1">
                    {h}
                  </Badge>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl border">
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UsersIcon className="w-4 h-4" /> Group Size
                </dt>
                <dd className="font-medium">{tour.groupSize ?? "N/A"} people</dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <StarIcon className="w-4 h-4" /> Rating
                </dt>
                <dd className="font-medium">
                  {tour.rating ?? "New"}
                  {tour.reviews ? ` (${tour.reviews} reviews)` : ""}
                </dd>
              </div>
            </dl>
          </article>

          {/* RIGHT: booking */}
          <aside className="w-full md:w-80 h-fit sticky top-24" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <div className="p-6 border rounded-xl shadow-lg bg-card">
              <meta itemProp="price" content={String(tour.price)} />
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="availability" content="https://schema.org/InStock" />

              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-sm text-muted-foreground">From</span>
                  <div className="text-3xl font-bold text-primary">${tour.price}</div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">per person</div>
              </div>

              {/* BookingForm is lazy-loaded (client) */}
              <BookingForm tourId={tour.id} tourTitle={tour.title} destination={tour.location} price={tour.price} />

              <div className="mt-4 pt-4 border-t text-center">
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary underline">
                  Have questions? Contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* REVIEWS (suspended) */}
        <div className="mt-20 border-t pt-12" itemProp="review" itemScope itemType="https://schema.org/Review">
          <h2 className="text-2xl font-bold mb-8">Traveler Reviews</h2>

          <Suspense fallback={<ReviewsLoading />}>
            <TourReviews tourId={tour.id} currentUserId={session?.user?.id} className="max-w-4xl" />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
