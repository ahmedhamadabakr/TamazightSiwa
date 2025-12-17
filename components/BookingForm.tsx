'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface BookingFormProps {
  tourId: string;
  tourTitle: string;
  destination: string;
  price: number;
  onSuccess?: () => void;
}

export default function BookingForm({ tourId, tourTitle, destination, price, onSuccess }: BookingFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [travelers, setTravelers] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'loading') {
      toast.error('Checking authentication...');
      return;
    }

    if (status === 'unauthenticated' || !session?.user) {
      toast.error('You must be logged in first');
      const callbackUrl = `/tours/${tourId}`;
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // Client-side validation
    if (!tourId) {
      toast.error('Error', {
        description: 'Tour ID not found'
      });
      return;
    }

    if (travelers < 1 || travelers > 5) {
      toast.error('Error', {
        description: 'Number of travelers must be between 1 and 5'
      });
      return;
    }

    if (!price || price <= 0) {
      toast.error('Error', {
        description: 'Tour price is invalid'
      });
      return;
    }

    setIsLoading(true);
    
    const bookingPayload = {
      tourId,
      numberOfTravelers: travelers,
      specialRequests,
      totalAmount: price * travelers
    };
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      setBookingData({
        bookingId: data.data._id,
        bookingReference: data.data.bookingReference,
        tourTitle,
        destination,
        travelers: data.data.travelers,
        totalAmount: price * travelers,
        status: data.data.status
      });
      setShowConfirmationModal(true);

      if (onSuccess) {
        onSuccess();
        toast.success('Booking successful!');
        const confirmationUrl = `/booking-confirmation/${data.data._id}`;
        router.push(confirmationUrl);
      }

    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred while processing your request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="travelers">Number of travelers</Label>
          <Input
            id="travelers"
            type="number"
            min="1"
            max="5"
            value={travelers}
            onChange={(e) => setTravelers(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special requests (optional)</Label>
          <textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px]"
            placeholder="Any special requests or food sensitivities?"
          />
        </div>

        <div className="pt-2 space-y-2">          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className={`h-4 w-4 animate-spin mr-2`} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className={`h-4 w-4 mr-2`} />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </form>

      {bookingData && (
        <BookingConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          bookingData={bookingData}
          onViewDetails={() => {
            setShowConfirmationModal(false);
            const confirmationUrl = `/booking-confirmation/${bookingData.bookingId}`;
            router.push(confirmationUrl);
          }}
        />
      )}
    </>
  );
}