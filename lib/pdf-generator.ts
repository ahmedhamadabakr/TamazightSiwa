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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - ${booking.bookingReference}</title>
      <style>
        :root {
          --primary: #2563eb;
          --light: #f9fafb;
          --dark: #0f172a;
          --gray-200: #e5e7eb;
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', 'Tahoma', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #ffffff;
          padding: 20px;
          font-size: 14px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 2px solid #2563eb;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header p {
          font-size: 20px;
          opacity: 0.95;
          font-weight: 500;
        }
        
        .content {
          padding: 30px;
        }
        
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 22px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
          text-align: right;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .section {
          background: var(--light);
          border-radius: 10px;
          padding: 1.5rem;
          border-left: 4px solid var(--primary);
          box-shadow: var(--shadow);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .section:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary);
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .section-title::before {
          content: '';
          display: block;
          width: 6px;
          height: 18px;
          background: var(--primary);
          border-radius: 3px;
        }
        
        .info-item {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px dashed var(--gray-200);
        }
        
        .info-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .info-label {
          font-weight: 500;
          color: #475569;
          min-width: 140px;
          flex-shrink: 0;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .info-label i {
          color: #64748b;
          font-size: 1rem;
          width: 20px;
          text-align: center;
        }
        
        .info-value {
          color: #1e293b;
          flex: 1;
          font-weight: 500;
          word-break: break-word;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }
        
        .status-badge i {
          font-size: 0.7rem;
        }
        
        .status-confirmed {
          background-color: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        
        .status-pending {
          background-color: #fffbeb;
          color: #92400e;
          border: 1px solid #fcd34d;
        }
        
        .status-cancelled {
          background-color: #fef2f2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        
        .footer {
          background: var(--dark);
          color: #e2e8f0;
          padding: 1.5rem 2rem;
          text-align: center;
          font-size: 0.875rem;
          border-top: 4px solid #0f172a;
        }
        
        .footer p {
          margin: 0.5rem 0;
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .footer a {
          color: #93c5fd;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .footer a:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        .total-amount {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 1.75rem;
          border-radius: 10px;
          text-align: center;
          margin: 2rem 0;
          border: 2px dashed #cbd5e1;
          position: relative;
          overflow: hidden;
        }
        
        .total-amount::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        
        .total-amount .label {
          font-size: 1rem;
          color: #475569;
          margin-bottom: 0.5rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .total-amount .amount {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.2;
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .total-amount .subtext {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
        }
        
        .notes {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 1.25rem;
          border-radius: 8px;
          margin: 1.5rem 0;
          position: relative;
        }
        
        .notes h3 {
          margin: 0 0 0.75rem 0;
          color: #92400e;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .notes ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        
        .notes li {
          margin-bottom: 0.5rem;
          color: #92400e;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .notes li:last-child {
          margin-bottom: 0;
        }
        
        .qr-code {
          text-align: center;
          margin: 1.5rem 0;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow);
          display: inline-block;
        }
        
        .qr-code p {
          margin: 0.75rem 0 0;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }
        
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-size: 12px;
          }
          
          .container {
            margin: 0;
            box-shadow: none;
            border-radius: 0;
          }
          
          .section, .total-amount, .notes {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .section {
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .header {
            padding: 1.5rem;
          }
          
          .content {
            padding: 1.5rem;
          }
          
          .status-badge, .total-amount, .notes {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Tamazight Siwa Tours & Experiences</p>
          <div class="ref-badge">Reference: ${booking.bookingReference}</div>
        </div>
        
        <div class="content">
          <div class="info-grid">
            <div class="section">
              <h2 class="section-title">Tour Information</h2>
              
              <div class="info-item">
                <div class="info-label"><i class="fas fa-map-marked-alt"></i> Tour Name</div>
                <div class="info-value">${booking.tour.title}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label"><i class="fas fa-location-dot"></i> Destination</div>
                <div class="info-value">${booking.tour.destination}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Duration:</div>
                <div class="info-value">${booking.tour.duration} days</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Travelers:</div>
                <div class="info-value">${booking.travelers} people</div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Customer Information</h2>
              
              <div class="info-item">
                <div class="info-label">Name:</div>
                <div class="info-value">${booking.user.name}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Email:</div>
                <div class="info-value">${booking.user.email}</div>
              </div>
              
              ${booking.user.phone ? `
              <div class="info-item">
                <div class="info-label">Phone:</div>
                <div class="info-value">${booking.user.phone}</div>
              </div>
              ` : ''}
              
              <div class="info-item">
                <div class="info-label">Booking Status:</div>
                <div class="info-value">
                  <span class="status-badge status-${booking.status}">${booking.status}</span>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Payment Status:</div>
                <div class="info-value">
                  <span class="status-badge status-${booking.paymentStatus}">${booking.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
          
          ${booking.specialRequests ? `
          <div class="section">
            <h2 class="section-title">Special Requests</h2>
            <div class="special-requests">
              <h4>Special Requests Details:</h4>
              <p>${booking.specialRequests}</p>
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h2 class="section-title">Cost Summary</h2>
            <div class="price-summary">
              <div class="price-row">
                <span><strong>Price per person:</strong></span>
                <span><strong>${booking.tour.price.toLocaleString()} $</strong></span>
              </div>
              <div class="price-row">
                <span><strong>Number of people:</strong></span>
                <span><strong>${booking.travelers} people</strong></span>
              </div>
              <div class="price-total">
                <div>Total amount: ${booking.totalAmount.toLocaleString()} Dollars</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <h3>Important Notes</h3>
          <ul>
            <li>Please keep this confirmation for your records</li>
            <li>You can cancel the booking before 48 hours from the tour date</li>
            <li>For inquiries: +20 155 262 4123</li>
            <li>Email: tamazight.siwa@gmail.com</li>
            <li>Please verify the accuracy of all the information above</li>
            <li>In case of any error, please contact us immediately</li>
          </ul>
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
Price per person: ${booking.tour.price.toLocaleString()} $
Number of travelers: ${booking.travelers}
Total Amount: ${booking.totalAmount.toLocaleString()} $

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
