// app/tours/[slug]/page.tsx
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, User } from "lucide-react"
import Link from "next/link"
import {BookingForm} from "@/components/BookingForm"
import {TourReviews} from "@/components/tour/TourReviews"
import { TourBreadcrumbs } from "@/components/tour/TourBreadcrumbs"

// ======== SEO ==========
export async function generateMetadata({ params }: any) {
  const slug = params.slug

  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) return {}

  const { data } = await res.json()

  return {
    title: `${data.title} | Tamazight Siwa`,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 160),
      images: data.images?.length ? data.images[0] : "",
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

  if (!tour) return notFound()

  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <TourBreadcrumbs
          tourTitle={tour.title}
          tourSlug={tour.slug || slug}
        />
      </div>

      {/* HERO */}
      <header className="relative h-[60vh]">
        {tour.images?.length > 0 ? (
          <Image
            src={tour.images[0]}
            alt={tour.title}
            fill
            className="object-cover"
            priority
            quality={85}
          />
        ) : (
          <div className="w-full h-full bg-gray-500" />
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{tour.title}</h1>
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
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT SIDE */}
          <article className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6">{tour.description}</p>

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
          <aside className="w-full md:w-72 p-6 border rounded-lg shadow-md bg-card">
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
        <div className="mt-16 border-t pt-16">
          <TourReviews tourId={tour.id} className="max-w-4xl" />
        </div>
      </main>
    </div>
  )
}
