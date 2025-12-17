// app/tours/[slug]/page.tsx

import { Suspense } from "react";
import type { Metadata } from 'next';
import dynamic from "next/dynamic";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

// UI components
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Server helpers
import { getServerAuthSession } from "@/lib/server-auth";

// Icons
import { Users, Star } from "lucide-react";

// ================= Dynamic Imports =================
// These components are loaded on the client-side to reduce the initial server payload.
const BookingForm = dynamic(() => import("@/components/BookingForm"), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full rounded-lg" />,
});

const TourReviews = dynamic(() => import("@/components/tour/TourReviews"), {
  ssr: false,
  loading: () => <ReviewsLoading />,
});

const TourBreadcrumbs = dynamic(() => import("@/components/tour/TourBreadcrumbs"));

// ================= Data Fetching =================

// Fetch a single tour with Incremental Static Regeneration (ISR)
async function getTour(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate data every hour
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Failed to fetch tour ${slug}:`, error);
    return null;
  }
}

// Statically generate routes for all tours at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours`);
    if (!res.ok) return [];
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      return result.data.map((tour: { slug: string }) => ({ slug: tour.slug }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch slugs for generateStaticParams:', error);
    return [];
  }
}

// ================= SEO Metadata Generation =================

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tour = await getTour(params.slug);

  if (!tour) {
    return {
      title: 'Tour Not Found',
      description: 'The tour you are looking for does not exist.',
    };
  }

  const heroImageUrl = tour.images?.length 
    ? tour.images[0].includes("cloudinary")
      ? tour.images[0].replace("/upload/", "/upload/f_auto,q_auto,w_1200/")
      : tour.images[0]
    : `${process.env.NEXT_PUBLIC_DOMAIN}/placeholder-image.jpg`;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${tour.slug || params.slug}`;

  return {
    title: `${tour.title} | Siwa Oasis Tours`,
    description: tour.description.substring(0, 155),
    keywords: [tour.title, tour.category, tour.location, 'Siwa Oasis', 'Egypt Tours'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tour.title} | Siwa Oasis Tours`,
      description: tour.description.substring(0, 155),
      url: canonicalUrl,
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: `${tour.title} cover image`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tour.title} | Siwa Oasis Tours`,
      description: tour.description.substring(0, 155),
      images: [heroImageUrl],
    },
  };
}


// ================= Loading Skeleton for Reviews =================
const ReviewsLoading = () => (
  <div className="space-y-4 max-w-4xl">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-4 mb-2">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 bg-gray-200" />
            <Skeleton className="h-3 w-24 bg-gray-200" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mt-4 bg-gray-200" />
        <Skeleton className="h-4 w-3/4 mt-2 bg-gray-200" />
      </div>
    ))}
  </div>
);

// ================= Page Component =================
export default async function TourDetailsPage({ params }: { params: { slug: string } }) {
  const tour = await getTour(params.slug);
  const session = await getServerAuthSession();

  if (!tour) {
    notFound();
  }

  const heroImageUrl = tour.images?.length
    ? tour.images[0].includes("cloudinary")
      ? tour.images[0].replace("/upload/", "/upload/f_auto,q_auto,w_1600/")
      : tour.images[0]
    : "/placeholder-image.jpg";

  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${tour.slug || params.slug}`;

  // -------- JSON-LD Structured Data for Rich Snippets --------
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": tour.title,
    "description": tour.description?.slice(0, 5000),
    "image": heroImageUrl,
    "url": canonicalUrl,
    "sku": tour._id,
    "brand": {
        "@type": "Brand",
        "name": "Siwa Oasis Tours"
    },
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
       "url": canonicalUrl,
        "seller": {
            "@type": "Organization",
            "name": "Siwa Oasis Tours"
        }
    },
    ...(tour.reviews?.length > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tour.rating || 5,
        "reviewCount": tour.reviews.length || 1,
      },
       "review": tour.reviews.map((r: any) => ({
            "@type": "Review",
            "author": {"@type": "Person", "name": r.user?.name || 'Anonymous'},
            "datePublished": r.createdAt,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.rating,
                "bestRating": "5"
            },
            "reviewBody": r.comment
        }))
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense>
         <TourBreadcrumbs tourTitle={tour.title} tourSlug={tour.slug || params.slug} />
      </Suspense>

      {/* ================= HERO ================= */}
      <header className="relative h-[60vh] overflow-hidden bg-gray-200">
        <Image
          src={heroImageUrl}
          alt={`${tour.title} - A premier tour in Siwa Oasis, Egypt.`}
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-start p-8 md:p-12">
          <h1 className="min-h-[72px] text-4xl md:text-6xl font-bold text-white max-w-4xl">
            {tour.title}
          </h1>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content */}
          <article className="lg:col-span-2">
             <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                 <p className="text-muted-foreground mb-6 leading-relaxed">
                    {tour.description}
                </p>

                <h3 className="font-semibold mb-3">Tour Highlights</h3>
                <ul className="flex flex-wrap gap-2 mb-8">
                {(tour.highlights || []).map((h: string, i: number) => (
                    <li key={i}>
                    <Badge variant="secondary">{h}</Badge>
                    </li>
                ))}
                </ul>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-white rounded-xl border">
                    <div>
                        <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" /> Group Size
                        </dt>
                        <dd className="font-medium text-lg">{tour.groupSize ?? "N/A"}</dd>
                    </div>

                     <div>
                        <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4" /> Rating
                        </dt>
                        <dd className="font-medium text-lg">
                        {tour.rating ?? "New"}
                        {tour.reviews?.length ? ` (${tour.reviews.length} reviews)` : ""}
                        </dd>
                    </div>
                </div>
             </div>
            
            {/* Reviews Section */}
            <div className="mt-16 border-t pt-12">
                <h2 className="text-2xl font-bold mb-8">Traveler Reviews</h2>
                <Suspense fallback={<ReviewsLoading />}>
                    <TourReviews tourId={tour._id} currentUserId={session?.user?.id} />
                </Suspense>
            </div>
          </article>

          {/* Booking Form Sidebar */}
          <aside className="w-full lg:col-span-1">
             <div className="sticky top-24">
                <div className="p-6 border rounded-xl shadow-lg bg-white">
                    <div className="flex justify-between items-baseline mb-6">
                         <div>
                             <span className="text-sm text-muted-foreground">From</span>
                            <p className="text-3xl font-bold text-primary">${tour.price}</p>
                         </div>
                        <span className="text-sm text-muted-foreground">per person</span>
                    </div>

                    <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
                        <BookingForm
                            tourId={tour._id}
                            tourTitle={tour.title}
                            destination={tour.location}
                            price={tour.price}
                        />
                    </Suspense>

                    <div className="mt-4 pt-4 border-t text-center">
                        <Link href="/contact" className="text-sm underline text-muted-foreground hover:text-primary">
                        Have questions? Contact us
                        </Link>
                    </div>
                </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
