"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import { TourLoading } from '@/components/tour/tour-loading'
import { TourNotFound } from '@/components/tour/tour-not-found'
import { TourBreadcrumbs } from '@/components/tour/TourBreadcrumbs'

// Dynamic imports
const BookingForm = dynamic(() => import('@/components/BookingForm').then(m => ({ default: m.BookingForm })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />,
  ssr: false
})

const ImageGalleryFallback = dynamic(
  () => import('@/components/ImageGalleryFallback').then(m => ({ default: m.ImageGalleryFallback })),
  {
    loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
    ssr: false
  }
)

const TourReviews = dynamic(
  () => import('@/components/tour/TourReviews').then(m => ({ default: m.TourReviews })),
  {
    loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />,
    ssr: false
  }
)

const Dialog = dynamic(() => import("@/components/ui/dialog").then(m => ({ default: m.Dialog })), { ssr: false })
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(m => ({ default: m.DialogContent })), { ssr: false })
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(m => ({ default: m.DialogHeader })), { ssr: false })
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(m => ({ default: m.DialogTitle })), { ssr: false })

export default function TourDetailsPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const router = useRouter()
  const session = useSession() as {
    data: Session | null
    status: "loading" | "authenticated" | "unauthenticated"
  }
  const { slug } = useParams()

  interface Tour {
    id: string
    title: string
    slug?: string
    description: string
    duration: string
    groupSize: string
    category: string
    price: number
    featured: boolean
    status: string
    location: string
    images: string[]
    highlights: string[]
    reviews?: number
    rating?: number
  }

  const [tour, setTour] = useState<Tour | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTour()
  }, [slug])

  const fetchTour = async () => {
    try {
      setIsLoading(true)
      const apiUrl = `/api/tours/${slug}`
      const response = await fetch(apiUrl, { cache: "no-store" })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setTour(data.success ? data.data : null)
    } catch (error) {
      setTour(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <TourLoading />
  if (!tour) return <TourNotFound />

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <TourBreadcrumbs
          tourTitle={tour.title}
          tourSlug={tour.slug || (slug as string)}
        />
      </div>

      {/* Hero */}
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

      {/* Image Gallery */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
        <ImageGalleryFallback images={tour.images || []} title={tour.title} />
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT */}
          <article className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6">{tour.description}</p>

            <h3 className="font-semibold mb-2">Tour Highlights:</h3>
            <ul className="flex flex-wrap gap-2 mb-6">
              {tour.highlights?.map((h, i) => (
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

          {/* RIGHT SIDEBAR */}
          <aside className="w-full md:w-72 p-6 border rounded-lg shadow-md bg-card">
            <div className="text-3xl font-bold text-primary mb-2">${tour.price}</div>
            <p className="text-muted-foreground mb-6">per person</p>

            <Button
              className="w-full mb-3"
              onClick={() => {
                if (!session.data) {
                  router.push(`/login?callbackUrl=/tours/${slug}`)
                  return
                }
                setIsBookingOpen(true)
              }}
            >
              <User className="ml-2 h-4 w-4" />
              Book Now
            </Button>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogContent className="sm:max-w-[425px] rtl">
                <DialogHeader>
                  <DialogTitle>Book the tour</DialogTitle>
                </DialogHeader>

                <BookingForm
                  tourId={tour.id}
                  tourTitle={tour.title}
                  destination={tour.location}
                  price={tour.price}
                  onSuccess={() => {
                    setIsBookingOpen(false)
                    const userId = session.data?.user?.id
                    router.push(userId ? `/user/${userId}` : "/login")
                  }}
                />
              </DialogContent>
            </Dialog>

            <Link href="/contact">
              <Button variant="outline" className="w-full">Contact Us</Button>
            </Link>
          </aside>
        </div>

        {/* REVIEWS */}
        <div className="mt-16 border-t pt-16">
          <TourReviews
            tourId={tour.id}
            currentUserId={session.data?.user?.id}
            className="max-w-4xl"
          />
        </div>
      </main>
    </div>
  )
}
