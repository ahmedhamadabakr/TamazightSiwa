'use client';

import { FC, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingData {
  bookingReference: string;
  tour: {
    title: string;
    destination: string;
  };
  user: {
    name: string;
  };
  // Add other booking data here
}

const BookingConfirmationPage: FC = () => {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        const data = await response.json();
        if (data.success) {
          setBooking(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch booking data.');
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
      <div className="printable-area">
        <Card>
          <CardHeader>
            <CardTitle>Booking Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Booking Reference:</strong> {booking.bookingReference}</p>
            <p><strong>Tour:</strong> {booking.tour.title}</p>
            <p><strong>Destination:</strong> {booking.tour.destination}</p>
            <p><strong>Name:</strong> {booking.user.name}</p>
            {/* Add other booking details here */}
          </CardContent>
        </Card>
      </div>
      <Button onClick={handlePrint} className="mt-4 no-print">
        Print Confirmation
      </Button>
    </div>
  );
};

export default BookingConfirmationPage;
