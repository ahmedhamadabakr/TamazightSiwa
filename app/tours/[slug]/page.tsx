// app/tours/[slug]/page.tsx
import { Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"

// UI components
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Server helpers
import { getServerAuthSession } from "@/lib/server-auth"

// ================= Dynamic Imports =================
const BookingForm = dynamic(() => import("@/components/BookingForm"), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full" />,
})

const TourReviews = dynamic(() => import("@/components/tour/TourReviews"), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl">
      <Skeleton className="h-20 w-full" />
    </div>
  ),
})

const TourBreadcrumbs = dynamic(() => import("@/components/tour/TourBreadcrumbs"), {
  ssr: false,
})

const UsersIcon = dynamic(() => import("lucide-react").then((m) => m.Users), { ssr: false })
const StarIcon = dynamic(() => import("lucide-react").then((m) => m.Star), { ssr: false })

// ================= Data Fetching =================
async function getTour(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) return null
    const result = await res.json()
    return result.success ? result.data : null
  } catch {
    return null
  }
}

// ================= Loading Skeleton =================
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

// ================= Page =================
export default async function TourDetailsPage({ params }: any) {
  const slug = params.slug
  const tour = await getTour(slug)
  const session = await getServerAuthSession()

  if (!tour) return notFound()

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${tour.slug || slug}`

  // -------- Cloudinary Optimized Hero Image --------
  const heroImageUrl = tour.images?.length
    ? tour.images[0].includes("cloudinary")
      ? tour.images[0].replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1600/"
        )
      : tour.images[0].includes("http")
      ? tour.images[0]
      : `${process.env.NEXT_PUBLIC_DOMAIN}${tour.images[0]}`
    : null

  // -------- Structured Data --------
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: tour.title,
    description: tour.description?.slice(0, 300),
    image: heroImageUrl,
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    ...(tour.reviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tour.rating,
        reviewCount: tour.reviews,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <TourBreadcrumbs tourTitle={tour.title} tourSlug={tour.slug || slug} />
      </div>

      {/* ================= HERO ================= */}
      <header className="relative h-[60vh] overflow-hidden">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={`${tour.title} - Best tours in Siwa Oasis Egypt`}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            quality={70}
            placeholder="empty"
          />
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="min-h-[72px] text-4xl md:text-6xl font-bold text-white text-center px-4">
            {tour.title}
          </h1>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Info */}
          <article className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {tour.description}
            </p>

            <h3 className="font-semibold mb-3">Highlights</h3>
            <ul className="flex flex-wrap gap-2 mb-8">
              {(tour.highlights || []).map((h: string, i: number) => (
                <li key={i}>
                  <Badge variant="secondary">{h}</Badge>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl border">
              <div>
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UsersIcon className="w-4 h-4" /> Group Size
                </dt>
                <dd className="font-medium">{tour.groupSize ?? "N/A"}</dd>
              </div>

              <div>
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

          {/* Booking */}
          <aside className="w-full md:w-80 sticky top-24">
            <div className="p-6 border rounded-xl shadow bg-card">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-sm text-muted-foreground">From</span>
                  <div className="text-3xl font-bold text-primary">${tour.price}</div>
                </div>
                <span className="text-sm text-muted-foreground">per person</span>
              </div>

              <BookingForm
                tourId={tour.id}
                tourTitle={tour.title}
                destination={tour.location}
                price={tour.price}
              />

              <div className="mt-4 pt-4 border-t text-center">
                <Link href="/contact" className="text-sm underline text-muted-foreground">
                  Have questions? Contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Reviews */}
        <div className="mt-20 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">Traveler Reviews</h2>
          <Suspense fallback={<ReviewsLoading />}>
            <TourReviews
              tourId={tour.id}
              currentUserId={session?.user?.id}
              className="max-w-4xl"
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
