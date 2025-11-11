import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ CONFIRMED: Admin email for TNR request notifications
const ADMIN_EMAIL = 'SouthernPetsAnimalRescue@gmail.com';
const FROM_EMAIL = 'SPAR <noreply@southernpetsanimalrescue.org>'; // Verify domain in Resend dashboard

// Supabase client for analytics logging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  let requestId: string | null = null;
  let analyticsId: string | null = null;
  
  try {
    const formData = await request.json();
    
    // Get request ID if provided (from form submission)
    requestId = formData._requestId || null;
    
    // Get analytics ID if provided
    analyticsId = formData._analyticsId || null;

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #4b5563; }
            .value { margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 New TNR Request</h1>
            </div>
            <div class="content">
              <div class="section">
                <div class="label">Contact Information</div>
                <div class="value">
                  <strong>${formData.requester_name}</strong><br>
                  Email: ${formData.requester_email}<br>
                  Phone: ${formData.requester_phone}
                </div>
              </div>
              
              <div class="section">
                <div class="label">Address</div>
                <div class="value">
                  ${formData.street_address}<br>
                  ${formData.city}, ${formData.state} ${formData.zip_code}
                </div>
              </div>
              
              <div class="section">
                <div class="label">Colony Details</div>
                <div class="value">
                  Estimated Cats: ${formData.estimated_cat_count}<br>
                  ${formData.colony_location_description ? `Location: ${formData.colony_location_description}<br>` : ''}
                  ${formData.feeding_schedule ? `Feeding Schedule: ${formData.feeding_schedule}<br>` : ''}
                  Friendly: ${formData.cats_friendly ? 'Yes' : 'No'}<br>
                  Has Shelter: ${formData.cats_have_shelter ? 'Yes' : 'No'}<br>
                  Previous TNR: ${formData.previous_tnr ? 'Yes' : 'No'}
                </div>
              </div>
              
              ${formData.special_circumstances ? `
              <div class="section">
                <div class="label">Special Circumstances</div>
                <div class="value">${formData.special_circumstances}</div>
              </div>
              ` : ''}
              
              <div class="section">
                <div class="label">Preferences</div>
                <div class="value">
                  Preferred Contact: ${formData.preferred_contact_method}<br>
                  ${formData.preferred_appointment_time ? `Preferred Time: ${formData.preferred_appointment_time}` : ''}
                </div>
              </div>
              
              <div class="footer">
                <p>Submitted: ${new Date().toLocaleString()}</p>
                <p>Southern Pets Animal Rescue | 337-581-7562</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // User confirmation email
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 Thank You!</h1>
            </div>
            <div class="content">
              <p>Dear ${formData.requester_name},</p>
              
              <p>Thank you for submitting your TNR request to Southern Pets Animal Rescue. We've received your information and will review it shortly.</p>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your request</li>
                <li>We'll contact you via your preferred method (${formData.preferred_contact_method})</li>
                <li>We'll schedule a time that works for you</li>
              </ul>
              
              <p>If you have any questions or need to update your request, please call us at <strong>337-581-7562</strong>.</p>
              
              <p>Thank you for helping the animals of Acadia Parish!</p>
              
              <p>Best regards,<br>
              Southern Pets Animal Rescue</p>
              
              <div class="footer">
                <p>Southern Pets Animal Rescue<br>
                337-581-7562<br>
                Acadia Parish, Louisiana</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send both emails
    const [adminResult, userResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New TNR Request from ${formData.requester_name}`,
        html: adminEmailHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: formData.requester_email,
        subject: 'TNR Request Received - Southern Pets Animal Rescue',
        html: userEmailHtml,
      }),
    ]);

    // Log analytics (update existing analytics entry if requestId provided)
    if (requestId || analyticsId) {
      try {
        const updateData: any = {
          submission_status: 'success',
          admin_email_sent: adminResult.data ? true : false,
          admin_email_id: adminResult.data?.id || null,
          admin_email_error: adminResult.error ? JSON.stringify(adminResult.error) : null,
          user_email_sent: userResult.data ? true : false,
          user_email_id: userResult.data?.id || null,
          user_email_error: userResult.error ? JSON.stringify(userResult.error) : null,
        };

        if (analyticsId) {
          // Update existing analytics entry
          await supabase
            .from('submission_analytics')
            .update(updateData)
            .eq('id', analyticsId);
        } else if (requestId) {
          // Update by request_id
          await supabase
            .from('submission_analytics')
            .update(updateData)
            .eq('request_id', requestId);
        }
      } catch (analyticsError) {
        // Don't fail the request if analytics logging fails
        console.error('Analytics logging error:', analyticsError);
      }
    }

    const responseData = {
      success: true,
      adminEmailId: adminResult.data?.id,
      userEmailId: userResult.data?.id,
      adminEmailSent: !!adminResult.data,
      userEmailSent: !!userResult.data,
    };

    // Send analytics to InnerAnimalMedia dashboard (non-blocking)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'email_sent',
          form_type: 'tnr-request',
          request_id: requestId,
          admin_email_sent: responseData.adminEmailSent,
          user_email_sent: responseData.userEmailSent,
          admin_email_id: responseData.adminEmailId,
          user_email_id: responseData.userEmailId,
        }),
      }).catch(() => {
        // Silently fail - analytics is secondary
      });
    } catch {
      // Ignore webhook errors
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Log failure in analytics if we have the IDs
    if (requestId || analyticsId) {
      try {
        const updateData: any = {
          submission_status: 'failed',
          submission_error: error instanceof Error ? error.message : 'Unknown error',
        };

        if (analyticsId) {
          await supabase
            .from('submission_analytics')
            .update(updateData)
            .eq('id', analyticsId);
        } else if (requestId) {
          await supabase
            .from('submission_analytics')
            .update(updateData)
            .eq('request_id', requestId);
        }
      } catch (analyticsError) {
        console.error('Analytics logging error:', analyticsError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to send notification emails' },
      { status: 500 }
    );
  }
}

