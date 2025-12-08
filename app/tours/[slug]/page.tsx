// app/tours/[slug]/page.tsx
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, MapPin, Calendar, User, Tag, Map } from "lucide-react"
import Link from "next/link"
import { BookingForm } from "@/components/BookingForm"
import { TourReviews } from "@/components/tour/TourReviews"
import { TourBreadcrumbs } from "@/components/tour/TourBreadcrumbs"
import { Skeleton } from "@/components/ui/skeleton"
import Script from "next/script"

// ======== SEO ==========
export async function generateMetadata({ params }: any) {
  const slug = params.slug

  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) return {}

  const { data } = await res.json()

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${data.slug || slug}`
  const description = data.description?.slice(0, 155) + (data.description?.length > 155 ? '...' : '')
  const images = data.images?.length ?
    data.images.map((img: string) => ({
      url: img.includes('http') ? img : `${process.env.NEXT_PUBLIC_DOMAIN}${img}`,
      width: 1200,
      height: 630,
      alt: data.title
    })) : []

  return {
    title: `${data.title} | Tamazight Siwa Tours`,
    description: description,
    keywords: [
      'Tamazight Siwa',
      'Siwa tours',
      'Egypt travel',
      'desert tours',
      'cultural experiences',
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
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
    },
  }
}

// ========== FETCH (SERVER SIDE) ==========
async function getTour(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) return null

  const result = await res.json()
  return result.success ? result.data : null
}

// ========== PAGE COMPONENT (Server Component) ==========
export default async function TourDetailsPage({ params }: any) {
  const slug = params.slug
  const tour = await getTour(slug)
  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${tour?.slug || slug}`

  if (!tour) return notFound()

  // Generate JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
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
      'validFrom': new Date().toISOString().split('T')[0]
    },
    'aggregateRating': tour.rating ? {
      '@type': 'AggregateRating',
      'ratingValue': tour.rating,
      'reviewCount': tour.reviews || 0,
      'bestRating': '5',
      'worstRating': '1'
    } : undefined
  }

  return (
    <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/TouristAttraction">
      {/* Structured Data */}
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

      {/* HERO */}
      <header className="relative h-[60vh] overflow-hidden" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
        <div className="absolute inset-0">
          {tour.images?.length > 0 ? (
            <Image
              src={tour.images[0]}
              alt={tour.title}
              fill
              className="object-cover"
              priority
              quality={80}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white px-4 text-center" itemProp="name">{tour.title}</h1>
        </div>
      </header>

      {/* GALLERY */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tour.images?.map((img: string, i: number) => (
            <div key={i} className="relative h-40 rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`${tour.title} - Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={75}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12" itemProp="mainEntityOfPage">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT SIDE */}
          <article className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6" itemProp="description">{tour.description}</p>

            <h3 className="font-semibold mb-2">Tour Highlights:</h3>
            <ul className="flex flex-wrap gap-2 mb-6">
              {tour.highlights?.map((h: string, i: number) => (
                <li key={i}><Badge variant="outline">{h}</Badge></li>
              ))}
            </ul>

            <dl className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {tour.duration} days
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {tour.groupSize} people
              </div>

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {tour.rating ?? "N/A"} ({tour.reviews ?? 0} reviews)
              </div>
            </dl>
          </article>

          {/* SIDEBAR */}
          <aside className="w-full md:w-72 p-6 border rounded-lg shadow-md bg-card" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="price" content={tour.price.toString()} />
            <meta itemProp="priceCurrency" content="USD" />
            <meta itemProp="availability" content="https://schema.org/InStock" />
            <div className="text-3xl font-bold text-primary mb-2">
              ${tour.price}
            </div>
            <p className="text-muted-foreground mb-6">per person</p>

            <BookingForm
              tourId={tour.id}
              tourTitle={tour.title}
              destination={tour.location}
              price={tour.price}
            />

            <Link href="/contact">
              <button className="border w-full mt-4 py-2 rounded-lg">
                Contact Us
              </button>
            </Link>
          </aside>
        </div>

        {/* REVIEWS */}
        <div className="mt-16 border-t pt-16" itemProp="review" itemScope itemType="https://schema.org/Review">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Tour Reviews</h2>
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
          </div>
          <TourReviews tourId={tour.id} className="max-w-4xl" />
        </div>
      </main>
    </div>
  )
}
