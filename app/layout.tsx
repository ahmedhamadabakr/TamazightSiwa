
import type React from "react"
import type { Metadata } from "next"

import { Suspense } from "react"
import dynamicImport from "next/dynamic"
import Script from "next/script"
import { getServerAuthSession } from '@/lib/server-auth'

import "./globals.css"
import "@/components/ColorContrastFix.css"
import Loading from "./loading"
import { AuthProvider } from "@/components/auth-provider"
import { generateAdvancedMetadata } from "@/components/SEOOptimizer"
import { ResourceHints } from "@/components/PerformanceMonitor"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { inter, playfairDisplay, roboto } from "./fonts"

const Analytics = dynamicImport(() => import("@vercel/analytics/next").then(m => ({ default: m.Analytics })), {
  ssr: false
})
const SpeedInsights = dynamicImport(() => import("@vercel/speed-insights/next").then(m => ({ default: m.SpeedInsights })), {
  ssr: false
})
const PerformanceMonitor = dynamicImport(() => import("@/components/PerformanceMonitor").then(m => ({ default: m.PerformanceMonitor })), {
  ssr: false
})

export const metadata: Metadata = generateAdvancedMetadata({
  title: "Siwa With Us - Authentic Desert Experiences in Siwa Oasis",
  description: "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures. Book your trip now!",
  keywords: "Siwa, Siwa Oasis, desert tourism, Egypt, Siwa tours, White Desert, Great Sand Sea, natural springs, Berber heritage, eco-tourism, cultural heritage, desert adventures, Alexander the Great, Cleopatra Bath, Temple of Oracle, salt lakes, hot springs, sandboarding, desert camping, Berber culture, Western Desert, Matrouh, authentic travel, sustainable tourism",
  canonical: "/",
  ogImage: "/siwa-oasis-sunset-salt-lakes-reflection.avif",
  author: "Siwa With Us Team",
  locale: "en_US",
})

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  const session = await getServerAuthSession()
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${roboto.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//vercel.live" />

        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://vercel.live" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Theme and viewport */}
        <meta name="theme-color" content="#D4A574" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=+201552624123, date=no, email=tamazight.siwa@gmail.com, address=siwa oasis" />

        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="EG-MT" />
        <meta name="geo.placename" content="Siwa Oasis" />
        <meta name="geo.position" content="29.2030;25.5197" />
        <meta name="ICBM" content="29.2030, 25.5197" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Open Graph Additional */}
        <meta property="og:site_name" content="Siwa With Us" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:author" content="Siwa With Us" />
        <meta property="article:publisher" content="https://www.facebook.com/SiwaWithUs" />

        {/* Alternate Language Links - SEO Critical */}
        <link rel="alternate" hrefLang="x-default" href="https://www.tamazight-siwa.com" />

        {/* Twitter Additional */}
        <meta name="twitter:domain" content="tamazight-siwa.com" />
        <meta name="twitter:url" content="https://www.tamazight-siwa.com" />

        {/* Business Information */}
        <meta name="business:contact_data:street_address" content="Siwa Oasis" />
        <meta name="business:contact_data:locality" content="Siwa" />
        <meta name="business:contact_data:region" content="Matrouh Governorate" />
        <meta name="business:contact_data:country_name" content="Egypt" />
        <meta name="business:contact_data:phone_number" content="+201552624123" />

        {/* Canonical and alternate languages */}
        <link rel="canonical" href="https://www.tamazight-siwa.com" />
        <Script id="json-ld-organization" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Tamazight Siwa",
              "url": "https://www.tamazight-siwa.com",
              "logo": "https://www.tamazight-siwa.com/logo.png",
              "sameAs": [
                "https://www.facebook.com/SiwaWithUs",
                "https://www.instagram.com/",
                "https://x.com/"
              ],
              "contactPoint": [{
                "@type": "ContactPoint",
                "telephone": "+201552624123",
                "contactType": "customer service",
                "areaServed": "EG",
                "availableLanguage": ["en"]
              }]
            }
          `}
        </Script>
        <Script id="json-ld-website" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Tamazight Siwa",
              "url": "https://www.tamazight-siwa.com",
              "logo": "https://www.tamazight-siwa.com/logo.png",
              "image": "https://www.tamazight-siwa.com/logo.png",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.tamazight-siwa.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </Script>
        <Script id="json-ld-local-business" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Tamazight Siwa",
              "image": [
                "https://www.tamazight-siwa.com/siwa-oasis-sunset-salt-lakes-reflection.avif"
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Siwa Oasis",
                "addressLocality": "Siwa",
                "addressRegion": "Matrouh Governorate",
                "addressCountry": "EG"
              },
              "telephone": "+201552624123",
              "url": "https://www.tamazight-siwa.com",
              "priceRange": "$$",
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 29.205,
                "longitude": 25.519
              }
            }
          `}
        </Script>
        {/* Resource Hints */}
        <ResourceHints />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZMS386HG6N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZMS386HG6N');
          `}
        </Script>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <AuthProvider session={session}>
              {children}
            </AuthProvider>
          </Suspense>
        </ErrorBoundary>

        {/* Performance Monitoring */}
        {enableAnalytics && <PerformanceMonitor />}

        {/* Analytics - loaded after interactive */}
        {enableAnalytics && <Analytics />}
        {enableAnalytics && <SpeedInsights />}
      </body>
    </html>
  )
}
