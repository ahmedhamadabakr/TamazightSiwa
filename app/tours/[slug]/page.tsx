// app/tours/[slug]/page.tsx
import { Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Components
import { BookingForm } from "@/components/BookingForm"
import { TourReviews } from "@/components/tour/TourReviews"
import { TourBreadcrumbs } from "@/components/tour/TourBreadcrumbs"

// ========== 1. DATA FETCHING (Optimized with ISR) ==========
async function getTour(slug: string) {
  // استخدام revalidate بدلاً من no-store لتسريع الاستجابة (TTFB)
  // يتم تحديث البيانات كل ساعة (3600 ثانية)
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return null

  const result = await res.json()
  return result.success ? result.data : null
}

// ========== 2. LOADING COMPONENT (For CLS Prevention) ==========
// هذا المكون يظهر فقط أثناء تحميل المراجعات
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

// ========== 3. SEO METADATA ==========
export async function generateMetadata({ params }: any) {
  const slug = params.slug
  const data = await getTour(slug)

  if (!data) return {}

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${data.slug || slug}`
  const description = data.description?.slice(0, 155) + (data.description?.length > 155 ? '...' : '')

  const images = data.images?.length ?
    data.images.map((img: string) => ({
      url: img.includes('http') ? img : `${process.env.NEXT_PUBLIC_DOMAIN}${img}`,
      width: 1200,
      height: 630,
      alt: `${data.title} - Siwa Oasis Tour`,
    })) : []

  return {
    title: `${data.title} | Tamazight Siwa Tours`,
    description: description,
    keywords: [
      'Tamazight Siwa',
      'Siwa Oasis tours',
      'Egypt desert safari',
      'Siwa travel guide',
      data.title,
      ...(data.tags || []),
      ...(data.highlights || [])
    ].filter(Boolean).join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.title,
      description: description,
      url: canonicalUrl,
      siteName: 'Tamazight Siwa',
      locale: 'en_US',
      type: 'website',
      images: images,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: description,
      images: images.length ? [images[0]] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// ========== 4. MAIN PAGE COMPONENT ==========
export default async function TourDetailsPage({ params }: any) {
  const slug = params.slug
  const tour = await getTour(slug)

  if (!tour) return notFound()

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${tour?.slug || slug}`

  // إعداد البيانات المنظمة (Structured Data) بشكل ذكي
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction', // أو 'Product' إذا كنت تبيع تذاكر مباشرة
    'name': tour.title,
    'description': tour.description?.slice(0, 300),
    'image': tour.images?.length ? tour.images[0] : '',
    'url': canonicalUrl,
    'address': {
      '@type': 'Place',
      'name': tour.location || 'Siwa Oasis, Egypt'
    },
    'offers': {
      '@type': 'Offer',
      'price': tour.price,
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'validFrom': new Date().toISOString()
    },
    // إضافة التقييم فقط إذا كان موجوداً لتجنب الأخطاء
    ...(tour.reviews > 0 && {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': tour.rating,
        'reviewCount': tour.reviews,
        'bestRating': '5',
        'worstRating': '1'
      }
    })
  }

  return (
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/TouristAttraction">

      {/* حقن السكيما JSON-LD */}
      <Script
        id="tour-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <TourBreadcrumbs
          tourTitle={tour.title}
          tourSlug={tour.slug || slug}
        />
      </div>

      {/* HERO SECTION */}
      <header className="relative h-[60vh] overflow-hidden" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
        <div className="absolute inset-0">
          {tour.images?.length > 0 ? (
            <Image
              src={tour.images[0]}
              // تحسين النص البديل ليتضمن كلمات مفتاحية جغرافية
              alt={`${tour.title} - Best tours in Siwa Oasis Egypt`}
              fill
              className="object-cover"
              priority={true} // مهم جداً للـ LCP
              quality={85}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white px-4 text-center drop-shadow-md" itemProp="name">
            {tour.title}
          </h1>
        </div>
      </header>

      {/* GALLERY */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tour.images?.slice(1).map((img: string, i: number) => (
            <div key={i} className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={img}
                alt={`${tour.title} gallery image ${i + 1} - Siwa Oasis`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={75}
              />
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12" itemProp="mainEntityOfPage">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT SIDE: Info */}
          <article className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed" itemProp="description">
              {tour.description}
            </p>

            <h3 className="font-semibold mb-3">Highlights:</h3>
            <ul className="flex flex-wrap gap-2 mb-8">
              {tour.highlights?.map((h: string, i: number) => (
                <li key={i}><Badge variant="secondary" className="px-3 py-1">{h}</Badge></li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl border">
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" /> Group Size
                </dt>
                <dd className="font-medium">{tour.groupSize} people</dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500" /> Rating
                </dt>
                <dd className="font-medium">
                  {tour.rating ?? "New"}
                  {tour.reviews ? ` (${tour.reviews} reviews)` : ""}
                </dd>
              </div>
            </dl>
          </article>

          {/* RIGHT SIDE: Booking Card */}
          <aside className="w-full md:w-80 h-fit sticky top-24" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <div className="p-6 border rounded-xl shadow-lg bg-card">
              <meta itemProp="price" content={tour.price.toString()} />
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="availability" content="https://schema.org/InStock" />

              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-sm text-muted-foreground">From</span>
                  <div className="text-3xl font-bold text-primary">${tour.price}</div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">per person</div>
              </div>

              <BookingForm
                tourId={tour.id}
                tourTitle={tour.title}
                destination={tour.location}
                price={tour.price}
              />

              <div className="mt-4 pt-4 border-t text-center">
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary underline">
                  Have questions? Contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* REVIEWS SECTION with SUSPENSE */}
        <div className="mt-20 border-t pt-12" itemProp="review" itemScope itemType="https://schema.org/Review">
          <h2 className="text-2xl font-bold mb-8">Traveler Reviews</h2>

          {/* هنا يكمن السحر لثبات الصفحة CLS */}
          <Suspense fallback={<ReviewsLoading />}>
            <TourReviews tourId={tour.id} className="max-w-4xl" />
          </Suspense>
        </div>

      </main>
    </div>
  )
}