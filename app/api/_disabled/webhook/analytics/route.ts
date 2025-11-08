import { NextResponse } from 'next/server';

/**
 * Webhook endpoint to send analytics to InnerAnimalMedia dashboard
 * Called automatically after form submissions and email sends
 */

const INNERANIMALMEDIA_WEBHOOK_URL = process.env.INNERANIMALMEDIA_WEBHOOK_URL || 'https://inneranimalmedia.com/api/webhooks/project-analytics';
const INNERANIMALMEDIA_API_KEY = process.env.INNERANIMALMEDIA_API_KEY || '';

export async function POST(request: Request) {
  try {
    const analyticsData = await request.json();

    // Don't block if webhook fails - analytics is secondary
    try {
      const response = await fetch(INNERANIMALMEDIA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${INNERANIMALMEDIA_API_KEY}`,
          'X-Project-ID': 'spar', // Project identifier
          'X-Project-Name': 'Southern Pets Animal Rescue',
        },
        body: JSON.stringify({
          project_id: 'spar',
          project_name: 'Southern Pets Animal Rescue',
          project_url: 'https://inneranimal.github.io/spar/',
          timestamp: new Date().toISOString(),
          ...analyticsData,
        }),
      });

      if (!response.ok) {
        console.warn('Webhook to InnerAnimalMedia failed:', response.statusText);
      }
    } catch (webhookError) {
      // Silently fail - don't break the main flow
      console.warn('Webhook error (non-critical):', webhookError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook route error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

