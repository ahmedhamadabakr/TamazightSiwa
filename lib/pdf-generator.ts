interface BookingData {
  _id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  tour: {
    _id: string
    title: string
    destination: string
    duration: number
    price: number
  }
  travelers: number
  specialRequests?: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand'
  bookingReference: string
  createdAt: string
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmed'
    case 'pending': return 'Pending'
    case 'cancelled': return 'Cancelled'
    case 'completed': return 'Completed'
    case 'paid': return 'Paid'
    case 'on-demand': return 'On-demand'
    case 'refunded': return 'Refunded'
    case 'failed': return 'Failed'
    default: return status
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateBookingHTML(booking: BookingData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Booking Confirmation - ${booking.bookingReference}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { width: 100%; max-width: 800px; margin: 0 auto; border: 1px solid #eee; }
        .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f8f8f8; }
        .total { font-weight: bold; font-size: 1.2em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Reference: ${booking.bookingReference}</p>
        </div>
        <div class="content">
          <h2>Tour Information</h2>
          <table>
            <tr><th>Tour Name</th><td>${booking.tour.title}</td></tr>
            <tr><th>Destination</th><td>${booking.tour.destination}</td></tr>
            <tr><th>Duration</th><td>${booking.tour.duration} days</td></tr>
            <tr><th>Travelers</th><td>${booking.travelers} people</td></tr>
          </table>

          <h2>Customer Information</h2>
          <table>
            <tr><th>Name</th><td>${booking.user.name}</td></tr>
            <tr><th>Email</th><td>${booking.user.email}</td></tr>
            ${booking.user.phone ? `<tr><th>Phone</th><td>${booking.user.phone}</td></tr>` : ''}
          </table>

          <h2>Booking Details</h2>
          <table>
            <tr><th>Booking Status</th><td>${getStatusText(booking.status)}</td></tr>
            <tr><th>Payment Status</th><td>${getStatusText(booking.paymentStatus)}</td></tr>
            <tr><th>Booking Date</th><td>${formatDate(booking.createdAt)}</td></tr>
          </table>

          ${booking.specialRequests ? `
          <h2>Special Requests</h2>
          <p>${booking.specialRequests}</p>
          ` : ''}

          <h2>Cost Summary</h2>
          <table>
            <tr><th>Price per person</th><td>$${booking.tour.price.toLocaleString()}</td></tr>
            <tr><th>Number of travelers</th><td>${booking.travelers}</td></tr>
            <tr class="total"><th>Total Amount</th><td>$${booking.totalAmount.toLocaleString()}</td></tr>
          </table>
        </div>
        <div class="footer">
          <p>Thank you for booking with Tamazight Siwa Tours. For any inquiries, please contact us at tamazight.siwa@gmail.com or +20 155 262 4123.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateSimplePDFContent(booking: BookingData): string {
  return `
BOOKING CONFIRMATION
====================

Booking Reference: ${booking.bookingReference}

CUSTOMER INFORMATION
--------------------
Name: ${booking.user.name}
Email: ${booking.user.email}
${booking.user.phone ? `Phone: ${booking.user.phone}` : ''}

TOUR INFORMATION
----------------
Tour Name: ${booking.tour.title}
Destination: ${booking.tour.destination}
Duration: ${booking.tour.duration} days
Number of Travelers: ${booking.travelers} persons

${booking.specialRequests ? `
SPECIAL REQUESTS
----------------
${booking.specialRequests}
` : ''}

PRICE SUMMARY
-------------
Price per person: $${booking.tour.price.toLocaleString()}
Number of travelers: ${booking.travelers}
Total Amount: $${booking.totalAmount.toLocaleString()}

BOOKING STATUS
--------------
Booking Status: ${getStatusText(booking.status)}
Payment Status: ${getStatusText(booking.paymentStatus)}
Booking Date: ${formatDate(booking.createdAt)}

IMPORTANT NOTES
---------------
• Please keep this confirmation for your records
• Cancellation allowed up to 48 hours before tour date
• For inquiries: +966501234567
• Email: tamazight.siwa@gmail.com
 
Thank you for choosing our services!
  `
}
