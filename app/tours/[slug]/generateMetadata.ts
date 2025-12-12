// app/tours/[slug]/generateMetadata.ts
import { Metadata } from "next"

async function getTour(slug: string) {
    // Use server-side caching strategy. Adjust revalidate to suit content volatility.
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tours/${slug}`, {
            // ISR: update every 30 minutes (1800s). Use 'force-cache' to serve cached HTML quickly.
            next: { revalidate: 1800 },
        })

        if (!res.ok) return null
        const result = await res.json()
        return result.success ? result.data : null
    } catch (err) {
        // gracefully handle fetch errors
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug
    const data = await getTour(slug)

    if (!data) return {}

    const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/tours/${data.slug || slug}`
    const shortDescription = data.description ? data.description.slice(0, 160) : ""

    const images = (data.images || []).map((img: string) => ({
        url: img.includes("http") ? img : `${process.env.NEXT_PUBLIC_DOMAIN}${img}`,
        width: 1200,
        height: 630,
        alt: `${data.title} - Siwa Oasis Tour`,
    }))

    return {
        title: `${data.title} | Siwa Oasis Tours`,
        description: shortDescription,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: data.title,
            description: shortDescription,
            url: canonicalUrl,
            siteName: "Siwa Oasis Tours",
            images: images,
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: data.title,
            description: shortDescription,
            images: images.length > 0 ? [images[0]] : [],
        },
    }
}
