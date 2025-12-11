"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Star, ThumbsUp, Shield, Filter, ChevronDown, Calendar, User } from "lucide-react"
import { Review } from "@/models/Review"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ReviewsListProps {
  tourId: string
  currentUserId?: string
  initialReviews?: Review[]
  showFilters?: boolean
}

export function ReviewsList({
  tourId,
  currentUserId,
  initialReviews = [],
  showFilters = true
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  // filters
  const [filters, setFilters] = useState({
    rating: "",
    verified: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  })

  // prevent updating state if component unmounted
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const formatDate = useCallback((date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }, [])

  // main fetch function
  const fetchReviews = useCallback(
    async (resetPage = false) => {
      setLoading(true)

      try {
        const currentPage = resetPage ? 1 : page

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          ...filters
        })

        const res = await fetch(`/api/tours/${tourId}/reviews?${params}`)
        const data = await res.json()

        if (data.success && mountedRef.current) {
          if (resetPage) {
            setReviews(data.data.reviews)
            setPage(1)
          } else {
            setReviews((prev) => [...prev, ...data.data.reviews])
          }

          setHasMore(data.data.pagination.hasNext)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    },
    [tourId, page, filters]
  )

  // when filters or tourId changes → reload page 1
  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchReviews(true)
    }
  }, [filters, tourId])

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return
    setPage((prev) => prev + 1)
    fetchReviews()
  }, [hasMore, loading, fetchReviews])

  // helpful vote
  const handleHelpfulVote = useCallback(
    async (reviewId: string) => {
      if (!currentUserId) {
        alert("You must be logged in to vote helpful")
        return
      }

      try {
        const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })

        const data = await res.json()

        if (data.success && mountedRef.current) {
          setReviews((prev) =>
            prev.map((r) =>
              r._id === reviewId
                ? { ...r, helpful: data.data.helpful, helpfulVotes: data.data.helpfulVotes }
                : r
            )
          )
        }
      } catch (error) {
        console.error("Error voting helpful:", error)
      }
    },
    [currentUserId]
  )

  // No Reviews
  if (reviews.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Star className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews</h3>
        <p className="text-gray-600">No reviews have been added for this tour yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b pb-4">
          <Button
            variant="outline"
            onClick={() => setShowFiltersPanel((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter Reviews
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFiltersPanel ? "rotate-180" : ""
              }`}
            />
          </Button>

          {showFiltersPanel && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, rating: e.target.value }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                {/* Verified */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
                  <select
                    value={filters.verified}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, verified: e.target.value }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Reviews</option>
                    <option value="true">Verified Only</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="createdAt">Date</option>
                    <option value="rating">Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {/* User Image */}
                <div className="flex-shrink-0">
                  {review.userImage ? (
                    <Image
                      src={review.userImage}
                      alt={review.userName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{review.userName}</span>

                    {review.verified && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Rating & Date */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {review.images.map((image, i) => (
                    <Image
                      key={i}
                      src={image}
                      alt={`Review photo ${i + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-24 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(image, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              {/* Helpful Button */}
              <button
                onClick={() => handleHelpfulVote(review._id!)}
                disabled={!currentUserId || review.helpfulVotes?.includes(currentUserId)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
                  review.helpfulVotes?.includes(currentUserId || "")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful || 0})
              </button>

              {/* Pending Review */}
              {review.status === "pending" && (
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  Pending Review
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outline"
            className="px-8"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Skeleton Loader */}
      {loading && reviews.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
