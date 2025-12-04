import { memo } from 'react';

/**
 * مكون تحسينات SEO الشاملة
 * يضيف structured data و meta tags إضافية لتحسين محركات البحث
 */

interface SEOEnhancementsProps {
    page?: 'home' | 'tours' | 'about' | 'contact' | 'gallery';
    tourData?: {
        name: string;
        description: string;
        price: number;
        currency: string;
        rating?: number;
        reviewCount?: number;
    };
}

export const SEOEnhancements = memo(function SEOEnhancements({
    page = 'home',
    tourData
}: SEOEnhancementsProps) {

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.tamazight-siwa.com"
            },
            ...(page !== 'home' ? [{
                "@type": "ListItem",
                "position": 2,
                "name": page.charAt(0).toUpperCase() + page.slice(1),
                "item": `https://www.tamazight-siwa.com/${page}`
            }] : [])
        ]
    };

    // FAQ Schema for common questions
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the best time to visit Siwa Oasis?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best time to visit Siwa Oasis is from October to April when temperatures are mild and comfortable for desert activities. Summer months (June-August) can be extremely hot."
                }
            },
            {
                "@type": "Question",
                "name": "How do I get to Siwa Oasis?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Siwa Oasis is accessible by road from Cairo (approximately 10 hours) or from Marsa Matrouh (4 hours). We can arrange transportation as part of your tour package."
                }
            },
            {
                "@type": "Question",
                "name": "What activities are available in Siwa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Siwa offers desert safaris, sandboarding, visits to ancient temples, natural hot springs, salt lakes, cultural experiences with Berber communities, and stargazing in the desert."
                }
            },
            {
                "@type": "Question",
                "name": "Is Siwa Oasis safe for tourists?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Siwa Oasis is very safe for tourists. It's a peaceful community with friendly locals. We provide experienced guides for all tours to ensure your safety and comfort."
                }
            }
        ]
    };

    // Tour Schema (if tour data is provided)
    const tourSchema = tourData ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": tourData.name,
        "description": tourData.description,
        "offers": {
            "@type": "Offer",
            "price": tourData.price,
            "priceCurrency": tourData.currency,
            "availability": "https://schema.org/InStock",
            "url": "https://www.tamazight-siwa.com/tours"
        },
        "provider": {
            "@type": "Organization",
            "name": "Tamazight Siwa",
            "url": "https://www.tamazight-siwa.com"
        },
        ...(tourData.rating && tourData.reviewCount ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": tourData.rating,
                "reviewCount": tourData.reviewCount
            }
        } : {})
    } : null;

    return (
        <>
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* FAQ Schema */}
            {page === 'home' && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Tour Schema */}
            {tourSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
                />
            )}
        </>
    );
});

SEOEnhancements.displayName = 'SEOEnhancements';
