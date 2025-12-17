'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Star, Plus, MessageSquare } from 'lucide-react';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Review, ReviewStats as ReviewStatsType } from '@/models/Review';
import Link from 'next/link';
import Image from 'next/image';

interface TourReviewsProps {
  tourId: string;
  currentUserId?: string;
  className?: string;
}

const ReviewItem = memo(({ review }: { review: any }) => (
  <div className="border-b border-gray-100 py-4">
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={review.userImage || '/default-avatar.png'}
          alt={review.userName}
          width={40}
          height={40}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <div>
        <h4 className="font-medium">{review.userName}</h4>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
    <p className="mt-2 text-gray-700">{review.comment}</p>
  </div>
));

ReviewItem.displayName = 'ReviewItem';

export default function TourReviews({ tourId, currentUserId, className = '' }: TourReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState<any>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}/reviews?includeStats=true`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [tourId]);

  const checkReviewEligibility = useCallback(async () => {
    if (!currentUserId) {
      setReviewEligibility({
        canReview: false,
        reason: 'not_logged_in',
        message: 'Please log in to add a review'
      });
      return;
    }

    try {
      const response = await fetch(`/api/tours/${tourId}/can-review`);
      const data = await response.json();
      if (data.success) {
        setReviewEligibility(data.data);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  }, [tourId, currentUserId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [reviewsRes, eligibilityRes] = await Promise.all([
          fetch(`/api/tours/${tourId}/reviews?includeStats=true`).then(r => r.json()),
          currentUserId
            ? fetch(`/api/tours/${tourId}/can-review`).then(r => r.json())
            : Promise.resolve({
              success: true,
              data: {
                canReview: false,
                reason: 'not_logged_in',
                message: 'Please log in to add a review'
              }
            })
        ]);

        if (reviewsRes.success) {
          setReviews(reviewsRes.data.reviews);
          setStats(reviewsRes.data.stats);
        }

        if (eligibilityRes.success) {
          setReviewEligibility(eligibilityRes.data);
        }

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    loadData();
  }, [tourId, currentUserId]);

  const eligibility = useMemo(() => reviewEligibility, [reviewEligibility]);

  const handleSubmitReview = useCallback(
    async (reviewData: { rating: number; title: string; comment: string; images: string[] }) => {
      setSubmitting(true);
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId, ...reviewData }),
        });

        const data = await response.json();

        if (data.success) {
          setShowReviewForm(false);
          await fetchReviews();
          await checkReviewEligibility();
          alert('Review submitted successfully! It will be reviewed soon.');
        } else {
          alert(data.message || 'Failed to submit review');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
      } finally {
        setSubmitting(false);
      }
    },
    [tourId, fetchReviews, checkReviewEligibility]
  );

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="bg-gray-300 rounded-lg h-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Reviews</h3>
        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Review
          </button>
        )}
      </div>

      <div className="min-h-[300px] transition-all duration-300">
        {showReviewForm && (
          <ReviewForm
            tourId={tourId}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
            isSubmitting={submitting}
          />
        )}
      </div>

      <div className="min-h-[80px] transition-all duration-300">
        {eligibility && !eligibility.canReview && !showReviewForm && (
          <div
            className={`border rounded-lg p-4 ${eligibility.reason === 'not_logged_in'
              ? 'bg-blue-50 border-blue-200'
              : eligibility.reason === 'already_reviewed'
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
              }`}
          >
            <div className="flex items-center gap-2">
              {eligibility.reason === 'not_logged_in' && (
                <>
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-800">
                    <Link href={'/login'} className="font-medium hover:underline">
                      Log in
                    </Link>{' '}
                    to add a review for this tour
                  </p>
                </>
              )}

              {eligibility.reason === 'already_reviewed' && (
                <>
                  <Star className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">
                      Thank you! You have already reviewed this tour
                    </p>
                    {eligibility.existingReview && (
                      <p className="text-green-700 text-sm mt-1">
                        Your review: {eligibility.existingReview.rating} stars -{' '}
                        {eligibility.existingReview.title}
                        {eligibility.existingReview.status === 'pending' &&
                          ' (pending review)'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {eligibility?.canReview && (
          <div
            className={`border rounded-lg p-4 ${eligibility.hasBooking
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
              }`}
          >
            <div className="flex items-center gap-2">
              <Star
                className={`h-5 w-5 ${eligibility.hasBooking ? 'text-green-600' : 'text-blue-600'}`}
              />
              <div>
                <p
                  className={`font-medium ${eligibility.hasBooking ? 'text-green-800' : 'text-blue-800'}`}
                >
                  {eligibility.message}
                </p>

                {eligibility.hasBooking && eligibility.bookingStatus && (
                  <p className="text-green-700 text-sm mt-1">
                    Booking status:{' '}
                    {eligibility.bookingStatus === 'confirmed'
                      ? 'Confirmed'
                      : 'Completed'}{' '}
                    • Your review will be verified
                  </p>
                )}

                {!eligibility.hasBooking && (
                  <p className="text-blue-700 text-sm mt-1">
                    You can add a review based on your knowledge of the tour
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {stats && <ReviewStats stats={stats} />}

        <div className="mt-6">
          <ReviewsList
            tourId={tourId}
            currentUserId={currentUserId}
            initialReviews={reviews}
            showFilters={true}
          />
        </div>
      </div>
    </div>
  );
}
