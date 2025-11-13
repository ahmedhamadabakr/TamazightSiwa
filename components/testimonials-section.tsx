"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const testimonials = [
    {
        id: 1,
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "An amazing and unforgettable experience in Siwa Oasis! The team is very professional and the service is excellent. I recommend everyone to visit Siwa with this outstanding team.",
        image: "/placeholder.svg",
        tour: "Great Desert Journey"
    },
    {
        id: 2,
        name: "Emily Jones",
        location: "London, UK",
        rating: 5,
        text: "One of the most beautiful trips I've ever taken in my life. The natural scenery is breathtaking and the hospitality is wonderful. Thank you for this amazing experience.",
        image: "/placeholder.svg",
        tour: "Natural Springs Tour"
    },
    {
        id: 3,
        name: "Michael Müller",
        location: "Berlin, Germany",
        rating: 5,
        text: "First-class professional service. Everything was perfectly organized, from transportation to accommodation and food. An experience worth repeating.",
        image: "/placeholder.svg",
        tour: "Cultural Heritage Journey"
    },
    {
        id: 4,
        name: "Sophie Dubois",
        location: "Paris, France",
        rating: 5,
        text: "The best desert trip ever! The team is friendly and cooperative, and the activities are diverse and exciting. I highly recommend this unique experience.",
        image: "/placeholder.svg",
        tour: "Sand Dunes Adventure"
    },
    {
        id: 5,
        name: "David Lee",
        location: "Sydney, Australia",
        rating: 5,
        text: "An exceptional experience by all standards. The traditional food is delicious and the accommodation is comfortable. Thank you for the beautiful memories.",
        image: "/placeholder.svg",
        tour: "Traditional Food Experience"
    }
]

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsAutoPlaying(false)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
        setIsAutoPlaying(false)
    }

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Guests Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Real experiences from travelers who discovered the magic of Siwa Oasis with us
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <Card className="overflow-hidden shadow-xl border-0 bg-white">
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-col items-center text-center">
                                <Quote className="w-12 h-12 text-primary mb-6 opacity-20" />

                                <div className="mb-6">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20">
                                            <Image
                                                src={testimonials[currentIndex].image}
                                                alt={testimonials[currentIndex].name}
                                                width={64}
                                                height={64}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                                    "{testimonials[currentIndex].text}"
                                </p>

                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">
                                        {testimonials[currentIndex].name}
                                    </h4>
                                    <p className="text-gray-600">{testimonials[currentIndex].location}</p>
                                    <p className="text-sm text-primary mt-1">{testimonials[currentIndex].tour}</p>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={prevTestimonial}
                                    className="rounded-full"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={nextTestimonial}
                                    className="rounded-full"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex justify-center gap-2 mt-6">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentIndex(index)
                                            setIsAutoPlaying(false)
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentIndex
                                                ? "bg-primary w-8"
                                                : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
