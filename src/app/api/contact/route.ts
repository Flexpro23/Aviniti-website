import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Contact form data interface
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

// Email sending function - uses Resend if available, otherwise logs
async function sendEmail(to: string, subject: string, html: string) {
  // Check if Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('📧 Email would be sent (Resend not configured):');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('---');
    return { success: true, simulated: true };
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Aviniti <noreply@aviniti.app>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }
    
    return { success: true, simulated: false };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    const { name, email, phone, company, subject, message } = data;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, and message are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Save to Firestore
    let firestoreDocId = null;
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'contacts'), {
          name,
          email,
          phone: phone || null,
          company: company || null,
          subject,
          message,
          createdAt: serverTimestamp(),
          status: 'new',
          source: 'contact-form'
        });
        firestoreDocId = docRef.id;
        console.log('✅ Contact saved to Firestore:', firestoreDocId);
      } catch (firestoreError) {
        console.error('Error saving to Firestore:', firestoreError);
        // Continue even if Firestore fails - we can still send the email
      }
    }
    
    // Send notification email to Aviniti team
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #35465d, #556b8b); padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #35465d;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #35465d;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><a href="mailto:${email}" style="color: #c08460;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #35465d;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #35465d;">Company:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #35465d;">Subject:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px;">
            <h3 style="color: #35465d; margin-bottom: 10px;">Message:</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div style="background: #35465d; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #9fb0c4; margin: 0; font-size: 12px;">
            Submitted via aviniti.app contact form${firestoreDocId ? ` • ID: ${firestoreDocId}` : ''}
          </p>
        </div>
      </div>
    `;
    
    // Send notification to Aviniti
    await sendEmail(
      'aliodat@aviniti.app',
      `New Contact: ${subject}`,
      notificationHtml
    );
    
    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #c08460, #a6714e); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <img src="https://aviniti.app/justLogo.png" alt="Aviniti" style="height: 50px; margin-bottom: 10px;" />
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="color: #35465d; font-size: 16px; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #556b8b; font-size: 16px; line-height: 1.6;">
            We've received your message and appreciate you taking the time to contact us. Our team typically responds within <strong>4 business hours</strong> during our working hours (Sunday-Thursday, 9 AM - 6 PM Jordan Time).
          </p>
          
          <div style="background: #f4f4f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #35465d; margin-top: 0;">While you wait, you might find these helpful:</h3>
            <ul style="color: #556b8b; padding-left: 20px;">
              <li style="margin-bottom: 10px;">
                <a href="https://aviniti.app/estimate" style="color: #c08460;">Get an instant AI project estimate</a>
              </li>
              <li style="margin-bottom: 10px;">
                <a href="https://aviniti.app/idea-lab" style="color: #c08460;">Explore your idea with our Idea Lab</a>
              </li>
              <li>
                <a href="https://aviniti.app/faq" style="color: #c08460;">Check our FAQ</a>
              </li>
            </ul>
          </div>
          
          <p style="color: #556b8b; font-size: 14px; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #35465d;">The Aviniti Team</strong>
          </p>
        </div>
        <div style="background: #35465d; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #9fb0c4; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} Aviniti. Your Ideas, Our Reality.
          </p>
          <p style="margin-top: 10px;">
            <a href="https://aviniti.app" style="color: #c08460; text-decoration: none; font-size: 12px;">aviniti.app</a>
          </p>
        </div>
      </div>
    `;
    
    await sendEmail(
      email,
      'Thank you for contacting Aviniti',
      confirmationHtml
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: firestoreDocId 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form. Please try again.' },
      { status: 500 }
    );
  }
}
