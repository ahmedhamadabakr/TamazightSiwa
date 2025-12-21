"use client"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import Link from "next/link"

interface HeroContentProps {
  className?: string
}

// Memoized hero content to prevent unnecessary re-renders
export const HeroContent = memo(({ className }: HeroContentProps) => {
  return (
    <div className={`relative z-10 w-full max-w-5xl mx-auto px-6 text-white ${className || ''}`}
    >
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          Siwa, as it should feel.
        </h1>

        <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed">
          Quiet desert mornings, salt lakes at sunset, and real moments with real people.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/tours"
            aria-label="Explore Siwa experiences"
          >
            <Button className="rounded-full px-7">
              Explore Experiences
            </Button>
          </Link>

          <Link
            href="https://wa.me/201552624123"
            aria-label="Chat on WhatsApp"
          >
            <Button variant="outline" className="rounded-full px-7 bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground">
              WhatsApp
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
})

HeroContent.displayName = 'HeroContent'