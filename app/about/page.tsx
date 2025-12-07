"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Leaf, Award, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

// --------------------- Dynamic Imports ---------------------
const ClientOnlyNavigation = dynamic(
  () =>
    import("@/components/ClientOnlyNavigation").then(
      (m) => ({ default: m.ClientOnlyNavigation })
    ),
  {
    ssr: false,
    loading: () => <div className="h-16 bg-background" />,
  }
);

const Footer = dynamic(
  () => import("@/components/footer").then((m) => ({ default: m.Footer })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-muted" />,
  }
);

const Motion = {
  Div: dynamic(
    () => import("framer-motion").then((mod) => mod.motion.div),
    { ssr: false }
  ),
  H1: dynamic(
    () => import("framer-motion").then((mod) => mod.motion.h1),
    { ssr: false }
  ),
  P: dynamic(
    () => import("framer-motion").then((mod) => mod.motion.p),
    { ssr: false }
  ),
};

// --------------------- Value Card ---------------------
function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Motion.Div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <Card className="text-center border-0 shadow-lg h-full group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8 h-full flex flex-col">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-foreground">{title}</h3>
          <p className="text-base text-muted-foreground flex-grow">
            {description}
          </p>
        </CardContent>
      </Card>
    </Motion.Div>
  );
}

// --------------------- Team Card ---------------------
function TeamCard({
  icon: Icon,
  name,
  role,
  bio,
}: {
  icon: React.ElementType;
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <Card className="text-center border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Icon className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-primary mb-4">{role}</p>
        <p className="text-muted-foreground">{bio}</p>
      </CardContent>
    </Card>
  );
}

// --------------------- About Page ---------------------
export default function AboutContent() {
  return (
    <>
      <Head>
        <title>About Us - Discover Our Story | Siwa With Us</title>
        <meta name="description" content="Learn about Siwa With Us, your trusted partner for authentic desert experiences in Siwa Oasis. Discover our story, values, and commitment to sustainable tourism since 2010." />
        <meta property="og:title" content="About Siwa With Us" />
        <meta property="og:description" content="Learn about our mission to provide authentic desert experiences in Siwa Oasis." />
        <meta property="og:image" content="/siwa-oasis-sunset-salt-lakes-reflection.avif" />
        <meta property="og:url" content="https://www.tamazight-siwa.com/about" />
        <link rel="canonical" href="https://www.tamazight-siwa.com/about" />
      </Head>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Siwa With Us",
            "description": "Learn about our mission to provide authentic desert experiences in Siwa Oasis",
            "url": "https://www.tamazight-siwa.com/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "Siwa With Us",
              "foundingDate": "2010",
              "description": "Leading eco-tourism and cultural heritage tour operator in Siwa Oasis",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Siwa Oasis",
                "addressRegion": "Matrouh Governorate",
                "addressCountry": "Egypt"
              }
            }
          })
        }}
      />

      <div className="min-h-screen bg-background">
        <ClientOnlyNavigation />

        {/* HERO Section */}
        <section className="relative min-h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden py-20 md:py-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40" />
          <Image
            src="/siwa-oasis-sunset-salt-lakes-reflection.avif"
            alt="Siwa Oasis landscape with palm trees and desert"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
            <Motion.Div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                Since 2010
              </span>
            </Motion.Div>

            <Motion.H1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Discover the Heart of Siwa
            </Motion.H1>

            <Motion.P
              className="text-xl md:text-2xl max-w-3xl mx-auto text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Where ancient traditions meet sustainable adventures.
            </Motion.P>

            <div className="mt-12">
              <Link
                href="#our-story"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/50 hover:border-white transition-colors"
                aria-label="Scroll to Our Story"
              >
                <span className="block w-2 h-4 border-r-2 border-b-2 border-white rotate-45 translate-y-1/4" />
              </Link>
            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section id="our-story" className="py-24 px-4 scroll-mt-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <Motion.Div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="text-sm font-medium text-primary mb-3 block">
                Our Story
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Hidden deep in Egypt&apos;s<br />
                <span className="text-primary">far west</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Siwa feels like another world — a place where time slows down
                  and life follows the rhythm of nature.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">
                  My Journey to Siwa
                </h3>

                <p>
                  Coming here felt like stepping into a dream — pure, alive, and
                  timeless.
                </p>

                <p>
                  With time, Siwa became more than a destination — it became a way
                  of life.
                </p>

                <p className="text-xl font-semibold text-primary italic">
                  From Siwa to the world: live slowly, love deeply, and find peace
                  in the desert.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/tours"
                  className="group relative inline-flex items-center px-8 py-3.5 font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-accent shadow-lg hover:-translate-y-1 transition-all"
                >
                  Explore Our Tours
                </Link>

                <Link
                  href="/contact"
                  className="px-8 py-3.5 font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </Motion.Div>

            <Motion.Div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/Siwa/WhatsApp Image 2025-10-11 at 14.22.17_134bc8e1.jpg"
                  alt="People in Siwa Oasis desert"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={85}
                />
              </div>
            </Motion.Div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every journey with us is guided by principles that honor both our
                guests and our homeland.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ValueCard
                icon={Leaf}
                title="Sustainability"
                description="Protecting Siwa's fragile ecosystem through responsible tourism."
              />
              <ValueCard
                icon={Heart}
                title="Authenticity"
                description="Connecting you with real Siwan culture and traditions."
              />
              <ValueCard
                icon={Users}
                title="Community"
                description="Supporting local families and traditional livelihoods."
              />
              <ValueCard
                icon={Award}
                title="Excellence"
                description="Delivering unforgettable experiences with care."
              />
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Local experts passionate about sharing the magic of Siwa Oasis.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TeamCard
                icon={Users}
                name="Ahmed Al-Siwi"
                role="Founder & Head Guide"
                bio="Born and raised in Siwa with 15+ years of experience."
              />
              <TeamCard
                icon={MapPin}
                name="Fatima Amazigh"
                role="Cultural Specialist"
                bio="A keeper of Siwan traditions ensuring authentic experiences."
              />
              <TeamCard
                icon={Clock}
                name="Omar Desert"
                role="Adventure Coordinator"
                bio="Expert in desert navigation and expedition safety."
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
