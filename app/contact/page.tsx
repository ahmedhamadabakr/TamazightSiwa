import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ContactSection } from "@/components/contact-section";
import { generateAdvancedMetadata } from "@/components/SEOOptimizer";

/* ================= SEO Metadata ================= */
export const metadata: Metadata = generateAdvancedMetadata({
  title: "Contact Us - Plan Your Siwa Adventure",
  description:
    "Get in touch with Siwa With Us to plan your perfect desert adventure. Available 24/7 via phone, WhatsApp, or email.",
  keywords:
    "contact Siwa tours, book Siwa tour, Siwa travel inquiry, Siwa booking",
  canonical: "/contact",
  ogImage: "/siwa-oasis-sunset-salt-lakes-reflection.avif",
  ogType: "website",
});

/* ================= Motion ================= */
const MotionDiv = dynamic(
  () => import("@/components/Motion").then((mod) => mod.MotionDiv),
  { ssr: false }
);

export default function ContactPage() {
  return (
    <>
      {/* ===== Structured Data ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Siwa With Us",
            url: "https://www.tamazight-siwa.com/contact",
            mainEntity: {
              "@type": "Organization",
              name: "Siwa With Us",
              telephone: "+201552624123",
              email: "tamazight.siwa@gmail.com",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-background overflow-x-hidden">
        <ClientOnlyNavigation />

        {/* ================= Hero ================= */}
        <section className="relative min-h-[60vh] sm:min-h-[50vh] md:h-[60vh] flex items-center justify-center">
          <Image
            src="/siwa-oasis-sunset-salt-lakes-reflection.avif"
            alt="Siwa Oasis sunset"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/50" />

          <MotionDiv
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center text-white px-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto opacity-90 leading-relaxed">
              Ready to start your Siwa adventure? We’re here to help plan your
              perfect journey.
            </p>
          </MotionDiv>
        </section>

        {/* ================= Main ================= */}
        <section className="py-10 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* ===== Contact Form ===== */}
            <MotionDiv
              initial={{ opacity: 1, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center lg:text-left">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-6 text-sm md:text-base text-center lg:text-left">
                Tell us about your trip and we’ll create the perfect itinerary.
              </p>

              <div className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
                <ContactSection />
              </div>
            </MotionDiv>

            {/* ===== Info Cards ===== */}
            <MotionDiv
              initial={{ opacity: 1, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              {[
                {
                  icon: Phone,
                  title: "Phone & WhatsApp",
                  text: "+20 155 262 4123",
                },
                { icon: Mail, title: "Email", text: "tamazight.siwa@gmail.com" },
                { icon: MapPin, title: "Location", text: "Siwa Oasis, Egypt" },
                {
                  icon: Clock,
                  title: "Office Hours",
                  text: "Daily 8:00 AM – 10:00 PM",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="border rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <CardContent className="p-4 sm:p-5 flex gap-3 items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground break-words">
                        {item.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </MotionDiv>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="py-12 md:py-20 bg-muted/30 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "Best time to visit Siwa?",
                  a: "October to April offers the most comfortable weather.",
                },
                {
                  q: "How do I get to Siwa?",
                  a: "Road from Cairo (8h) or Alexandria (5h).",
                },
                {
                  q: "Is Siwa family-friendly?",
                  a: "Yes, activities for all ages are available.",
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-background rounded-xl border px-3 sm:px-4"
                >
                  <AccordionTrigger className="text-left text-sm md:text-lg py-3">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ================= Social ================= */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Connect With Us
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                {
                  name: "WhatsApp",
                  icon: <MessageCircle className="w-7 h-7 text-white" />,
                  bg: "bg-[#25D366]",
                  link: "https://wa.me/201552624123",
                },
                {
                  name: "Instagram",
                  icon: <Instagram className="w-7 h-7 text-white" />,
                  bg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
                  link: "https://instagram.com/tamazight_siwa",
                },
                {
                  name: "Facebook",
                  icon: <Facebook className="w-7 h-7 text-white" />,
                  bg: "bg-[#1877F2]",
                  link: "https://facebook.com/tamazight.siwa",
                },
              ].map((s) => (
                <Card
                  key={s.name}
                  className="hover:shadow-lg transition-all rounded-2xl"
                >
                  <CardContent className="p-6 flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full ${s.bg} flex items-center justify-center mb-4 shadow-md`}
                    >
                      {s.icon}
                    </div>
                    <h3 className="font-bold mb-4">{s.name}</h3>
                    <Link href={s.link} target="_blank">
                      <Button size="sm" variant="outline" className="w-full">
                        Connect
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
