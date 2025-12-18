import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook } from "lucide-react"; // Added Icons imports just in case
import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ContactSection } from "@/components/contact-section";
import Link from "next/link";
import { generateAdvancedMetadata } from "@/components/SEOOptimizer";

// SEO Metadata
export const metadata: Metadata = generateAdvancedMetadata({
  title: "Contact Us - Plan Your Siwa Adventure",
  description: "Get in touch with Siwa With Us to plan your perfect desert adventure. Available 24/7 via phone, WhatsApp, or email. Contact us for tour bookings, custom itineraries, and travel information.",
  keywords: "contact Siwa tours, book Siwa tour, Siwa travel inquiry, Siwa tour operator contact, plan Siwa trip, Siwa booking, desert tour contact Egypt",
  canonical: "/contact",
  ogImage: "/siwa-oasis-sunset-salt-lakes-reflection.avif",
  ogType: "website",
});

/* -------------------------------
   Dynamic import for Motion components
------------------------------- */
const MotionDiv = dynamic(() =>
  import("@/components/Motion").then((mod) => mod.MotionDiv),
  { ssr: false }
);

export default function ContactPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Siwa With Us",
            "description": "Get in touch to plan your Siwa Oasis adventure",
            "url": "https://www.tamazight-siwa.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "Siwa With Us",
              "telephone": "+201552624123",
              "email": "tamazight.siwa@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Siwa Oasis",
                "addressRegion": "Matrouh Governorate",
                "addressCountry": "Egypt"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+201552624123",
                "contactType": "customer service",
                "availableLanguage": ["English", "Arabic", "Berber"],
                "hoursAvailable": "Mo-Su 08:00-22:00"
              }
            }
          })
        }}
      />

      <div className="min-h-screen bg-background overflow-x-hidden">
        <ClientOnlyNavigation />

        {/* Hero Section */}
        {/* Adjusted height for mobile and padding */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/siwa-oasis-sunset-salt-lakes-reflection.avif"
            alt="Scenic view of Siwa Oasis at sunset with salt lakes"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            sizes="100vw"
            blurDataURL="data:image/jpeg;base64,..." // Keep your existing base64
          />
          {/* Darker gradient for better text readability on mobile */}
          <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
          
          <MotionDiv
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center text-white w-full max-w-4xl mx-auto px-4 sm:px-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Ready to start your Siwa adventure? We&apos;re here to help plan your perfect journey.
            </p>
          </MotionDiv>
        </section>

        {/* Main Content Container */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Form */}
            <MotionDiv 
              initial={{ opacity: 1, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Send Us a Message</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Tell us about your dream Siwa experience and we&apos;ll create the perfect itinerary for you.
                </p>
              </div>
              
              {/* Added card wrapper for better mobile separation */}
              <div className="bg-card rounded-xl p-0 sm:p-2 md:p-0">
                 <ContactSection />
              </div>
            </MotionDiv>

            {/* Right Column: Info Cards */}
            <MotionDiv 
              initial={{ opacity: 1, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8 w-full"
            >
              <div className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Get in Touch</h2>
                <p className="text-muted-foreground text-sm md:text-base mb-6">
                  We&apos;re available 24/7 to answer your questions and help you plan your Siwa adventure.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: Phone, title: "Phone & WhatsApp", details: ["+20 155 262 4123"] },
                  { icon: Mail, title: "Email", details: ["tamazight.siwa@gmail.com"] },
                  { icon: MapPin, title: "Location", details: ["Siwa Oasis", "Matrouh, Egypt"] },
                  { icon: Clock, title: "Office Hours", details: ["Daily: 8:00 AM - 10:00 PM", "Emergency: 24/7"] },
                ].map((item, i) => (
                  <Card key={i} className="border bg-background/50 hover:bg-background shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4 sm:p-6 flex gap-4 items-start">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                        {item.details.map((d, j) => (
                          <p key={j} className="text-sm sm:text-base text-muted-foreground break-words">{d}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Frequently Asked Questions</h2>
              <p className="text-base md:text-xl text-muted-foreground">Quick answers to common questions about visiting Siwa</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
              {[
                  { q: "What's the best time to visit Siwa?", a: "October to April offers the most comfortable weather, 15-25°C. Summer can reach 45°C." },
                  { q: "How do I get to Siwa?", a: "Road from Cairo (8h) or Alexandria (5h). We can arrange comfortable transport." },
                  { q: "What should I pack?", a: "Light clothing, sun protection, walking shoes, warm layers for nights. Detailed list provided upon booking." },
                  { q: "Are tours family-friendly?", a: "Yes, we offer family-friendly activities for all ages, guided by experts." }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`q${index + 1}`} className="bg-background px-4 rounded-lg border">
                  <AccordionTrigger className="text-left text-sm md:text-lg font-medium hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Social Media & CTA Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Connect With Us</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12">Follow our journey and get instant updates</p>

            {/* Grid adjusts from 1 column (mobile) to 3 columns (desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              {[
                { name: "WhatsApp", color: "bg-[#25D366]", icon: <MessageCircle className="w-8 h-8 text-white" />, url: "https://wa.me/+201552624123" },
                { name: "Instagram", color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]", icon: <Instagram className="w-8 h-8 text-white" />, url: "https://instagram.com/tamazight_siwa" },
                { name: "Facebook", color: "bg-[#1877F2]", icon: <Facebook className="w-8 h-8 text-white" />, url: "https://facebook.com/tamazight.siwa" },
              ].map((social) => (
                <Card key={social.name} className="group border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 md:p-8 text-center h-full flex flex-col items-center">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${social.color} rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      {social.icon}
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-3">{social.name}</h3>
                    <Link href={social.url} target="_blank" rel="noopener noreferrer" className="mt-auto w-full">
                      <Button variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-white transition-colors">
                        Connect on {social.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}