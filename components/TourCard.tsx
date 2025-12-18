"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Users, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MotionDiv } from "@/components/Motion"

const truncateWords = (text: string, limit: number) => {
  if (!text) return ""
  const words = text.split(" ")
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "..."
    : text
}


interface Tour {
  _id?: string
  id?: string
  title: string
  slug?: string
  description: string
  duration: string
  groupSize?: string
  location: string
  price: number
  images: string[]
  category?: string
  featured?: boolean
}

interface TourCardProps {
  tour: Tour
  index?: number
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  const tourLink = `/tours/${tour.slug || tour._id || tour.id}`

  return (
    <MotionDiv
      initial={{ opacity: 1, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="
        group h-full overflow-hidden rounded-2xl border border-border/40
        bg-background shadow-sm hover:shadow-2xl
        transition-all duration-300
      ">
        {/* ================= IMAGE ================= */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={tour.images?.[0] || "/placeholder.svg"}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Featured */}
          {tour.featured && (
            <span className="
              absolute top-3 left-3 inline-flex items-center gap-1
              rounded-full bg-primary px-3 py-1 text-xs font-medium text-white
              shadow-lg
            ">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}

          {/* Price */}
          <div className="
            absolute bottom-3 left-3 rounded-full
            bg-white/90 backdrop-blur px-4 py-1
            text-sm font-bold text-primary shadow
          ">
            ${tour.price}
          </div>

          {/* Images count */}
          {tour.images?.length > 1 && (
            <div className="
              absolute bottom-3 right-3 rounded-full
              bg-black/60 px-3 py-1 text-xs text-white backdrop-blur
            ">
              {tour.images.length} photos
            </div>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        <CardHeader className="pb-2">
          <CardTitle className="
            text-lg font-semibold leading-snug line-clamp-2
            transition-colors group-hover:text-primary
          ">
            {tour.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex h-full flex-col pt-0">
          {/* Description */}
          <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
            {truncateWords(tour.description, 20)}
          </p>


          {/* Meta info */}
          <div className="mb-5 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {parseInt(tour.duration)}{" "}
                {parseInt(tour.duration) > 1 ? "Days" : "Day"}
              </span>
            </div>

            {tour.groupSize && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Up to {tour.groupSize} people</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{tour.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <Link href={tourLink}>
              <Button className="
                w-full rounded-full
                bg-primary text-white
                hover:bg-primary/90
              ">
                Book Now
              </Button>
            </Link>

            <Link href={tourLink}>
              <Button
                variant="outline"
                className="
                  w-full rounded-full
                  border-primary/30
                  hover:bg-primary/10
                "
              >
                Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  )
}
