"use client"
import { useState } from "react"
import { HeroContent } from "@/components/HeroContent"
import Image from "next/image"

export function HeroSection() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden hero-section">
      <div className="absolute inset-0">
        <Image
          src="/siwa-oasis-sunset-salt-lakes-reflection.avif"
          alt="Siwa Oasis sunset with salt lakes reflection"
          fill
          priority
          quality={70}
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkNGE1NzQ7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhiNDUxMztzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmFkKSIvPgogIDwvc3ZnPg=="
          className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          sizes="100vw"
          loading="eager"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 transition-opacity duration-1000 ${isImageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
        />
      </div>

      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Main Content */}
      <HeroContent />
    </section>
  )
}
