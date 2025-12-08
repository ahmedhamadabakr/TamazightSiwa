import nodemailer from 'nodemailer'

interface BookingEmailData {
  customerName: string
  bookingReference: string
  tourTitle: string
  destination: string
  startDate: string
  endDate: string
  travelers: number
  totalAmount: number
  specialRequests?: string
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function sendBookingConfirmationEmail(
  customerEmail: string,
  bookingData: BookingEmailData
) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        
        .content {
          padding: 30px;
        }
        
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #2563eb;
        }
        
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border-right: 4px solid #2563eb;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
        }
        
        .info-label {
          font-weight: bold;
          color: #374151;
        }
        
        .info-value {
          color: #6b7280;
        }
        
        .total-amount {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          text-align: center;
          padding: 15px;
          background: #eff6ff;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .footer {
          background: #f1f5f9;
          padding: 20px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        
        .contact-info {
          margin-top: 15px;
        }
        
        .contact-info p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Booking Reference: ${bookingData.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${bookingData.customerName},
          </div>
          
          <p>Thank you for choosing our tours! Your booking has been confirmed and here are your tour details:</p>
          
          <div class="section">
            <div class="section-title">Tour Details</div>
            <div class="info-row">
              <span class="info-label">Tour Title:</span>
              <span class="info-value">${bookingData.tourTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Destination:</span>
              <span class="info-value">${bookingData.destination}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Start Date:</span>
              <span class="info-value">${formatDate(bookingData.startDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Date:</span>
              <span class="info-value">${formatDate(bookingData.endDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of People:</span>
              <span class="info-value">${bookingData.travelers} People</span>
            </div>
          </div>
          
          ${bookingData.specialRequests ? `
          <div class="section">
            <div class="section-title">Special Requests</div>
            <p>${bookingData.specialRequests}</p>
          </div>
          ` : ''}
          
          <div class="total-amount">
            Total Amount: ${bookingData.totalAmount.toLocaleString()} Dollars
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-bottom: 10px;">Important Notes:</h3>
            <ul style="color: #92400e; margin: 0; padding-right: 20px;">
              <li>Please keep your booking reference for your records</li>
              <li>You can cancel the booking before 48 hours from the tour date</li>
              <li>We will contact you 24 hours before the tour date</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your trust!</strong></p>
          <div class="contact-info">
            <p>📞 For inquiries: +20 155 262 4123</p>
            <p>📧 Email: tamazight.siwa@gmail.com</p>
            <p>🌐 website: www.tamazight-siwa.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const emailText = `
Hello ${bookingData.customerName},

Thank you for choosing our tours! Your booking has been confirmed.

Booking Reference: ${bookingData.bookingReference}

Tour Details:
- Tour Title: ${bookingData.tourTitle}
- Destination: ${bookingData.destination}
- Start Date: ${formatDate(bookingData.startDate)}
- End Date: ${formatDate(bookingData.endDate)}
- Number of People: ${bookingData.travelers} People

${bookingData.specialRequests ? `Special Requests: ${bookingData.specialRequests}` : ''}

Total Amount: ${bookingData.totalAmount.toLocaleString()} Dollars

Important Notes:
- Please keep your booking reference for your records
- You can cancel the booking before 48 hours from the tour date
- We will contact you 24 hours before the tour date

For inquiries:
Phone: +20 155 262 4123
Email: tamazight.siwa@gmail.com

Thank you for your trust!
Tamazight Siwa Team
  `

  const mailOptions = {
    from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Confirmation - ${bookingData.bookingReference}`,
    text: emailText,
    html: emailHtml
  }

  await transporter.sendMail(mailOptions)
}

export async function sendBookingCancellationEmail(
  customerEmail: string,
  bookingData: BookingEmailData
) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const emailHtml = `
 <!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      font-family: Arial, sans-serif;
      direction: ltr;
    }

    .container {
      max-width: 650px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      padding: 30px;
      text-align: center;
      color: #fff;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }

    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }

    .content {
      padding: 30px;
      color: #374151;
    }

    .greeting {
      font-size: 20px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 20px;
    }

    /* Sections */
    .section {
      background: #f9fafb;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #2563eb;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #1e40af;
    }

    .row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }

    .label {
      font-weight: bold;
    }

    .value {
      color: #6b7280;
    }

    /* Total price */
    .total {
      text-align: center;
      padding: 18px;
      background: #eff6ff;
      color: #2563eb;
      font-size: 20px;
      font-weight: bold;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    /* Notes box */
    .notes {
      background: #fff7e6;
      padding: 18px;
      border-radius: 10px;
      border-left: 4px solid #d97706;
      margin-bottom: 25px;
    }

    .notes h3 {
      margin: 0 0 10px 0;
      color: #b45309;
      font-size: 17px;
    }

    .notes ul {
      margin: 0;
      padding-left: 20px;
      color: #b45309;
    }

    /* Footer */
    .footer {
      text-align: center;
      background: #f1f5f9;
      padding: 20px;
      font-size: 14px;
      color: #6b7280;
    }

    .footer p {
      margin: 6px 0;
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Booking Confirmation</h1>
      <p>Booking Reference: ${bookingData.bookingReference}</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hello ${bookingData.customerName},</div>
      <p>Thank you for choosing our tours! Your booking has been successfully confirmed. Below are the details:</p>

      <!-- Tour Details -->
      <div class="section">
        <div class="section-title">Tour Details</div>

        <div class="row"><span class="label">Tour Title:</span> <span class="value">${bookingData.tourTitle}</span></div>
        <div class="row"><span class="label">Destination:</span> <span class="value">${bookingData.destination}</span></div>
        <div class="row"><span class="label">Start Date:</span> <span class="value">${formatDate(bookingData.startDate)}</span></div>
        <div class="row"><span class="label">End Date:</span> <span class="value">${formatDate(bookingData.endDate)}</span></div>
        <div class="row"><span class="label">Number of Travelers:</span> <span class="value">${bookingData.travelers}</span></div>
      </div>

      <!-- Special Requests (optional) -->
      ${bookingData.specialRequests ? `
      <div class="section">
        <div class="section-title">Special Requests</div>
        <div class="value">${bookingData.specialRequests}</div>
      </div>
      ` : ''}

      <!-- Total -->
      <div class="total">Total Amount: ${bookingData.totalAmount.toLocaleString()} USD</div>

      <!-- Notes -->
      <div class="notes">
        <h3>Important Notes</h3>
        <ul>
          <li>Please keep your booking reference for future use.</li>
          <li>You can cancel your booking up to 48 hours before the tour date.</li>
          <li>Our team will contact you 24 hours before the tour begins.</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Thank you for choosing Tamazight Siwa!</strong></p>
      <p>📞 +20 155 262 4123</p>
      <p>📧 tamazight.siwa@gmail.com</p>
      <p>🌐 www.tamazight-siwa.com</p>
    </div>
  </div>
</body>
</html>`

  const emailText = `
Hello ${bookingData.customerName},

We regret to inform you that your booking has been cancelled.

Booking Reference: ${bookingData.bookingReference}

Cancelled Tour Details:
- Tour Title: ${bookingData.tourTitle}
- Destination: ${bookingData.destination}
- Start Date: ${formatDate(bookingData.startDate)}
- End Date: ${formatDate(bookingData.endDate)}
- Number of People: ${bookingData.travelers} People

Refund Information:
- Your refund will be processed within 5-7 business days
- The refund will be credited to your original payment method
- You will receive a confirmation email once the refund is processed

We apologize for any inconvenience caused. If you have any questions or would like to book another tour, please don't hesitate to contact us.

For inquiries:
Phone: +20 155 262 4123
Email: info@tamazight-siwa.com

We hope to serve you again soon!
Tamazight Siwa Team
  `

  const mailOptions = {
    from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Cancellation - ${bookingData.bookingReference}`,
    text: emailText,
    html: emailHtml
  }

  await transporter.sendMail(mailOptions)
}