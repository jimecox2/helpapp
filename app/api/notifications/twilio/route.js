// app/api/notifications/twilio/route.js

import { NextResponse } from 'next/server';
import { verifyStrapiBearer } from '@/lib/auth/strapiLogin';

export async function GET(request) {
  if (!(await verifyStrapiBearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        {
          error: 'Twilio configuration missing - check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER',
          features: { sms: false },
        },
        { status: 500 }
      );
    }

    // Optionally, validate Twilio credentials by making a test API call
    // For simplicity, we just check if env vars are set
    return NextResponse.json({
      features: { sms: true },
      status: 'Configured',
    });
  } catch (error) {
    console.error('Error checking Twilio configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message, features: { sms: false } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!(await verifyStrapiBearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    console.log('📱 Test Twilio endpoint called');
    
    const { to, message } = await request.json();

    // Validate required fields
    if (!to || !to.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({ 
        error: 'Twilio configuration missing - check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER' 
      }, { status: 500 });
    }

    console.log(`📱 Sending test SMS to ${to} directly via Twilio API...`);

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    // Prepare the payload
    const payload = new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: message,
    });

    // Send SMS via Twilio API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Test SMS sent successfully:', result.sid);
      return NextResponse.json({
        success: true,
        messageId: result.sid,
        status: result.status,
        to: result.to,
        from: result.from,
        message: 'Test SMS sent successfully',
      });
    } else {
      console.error('❌ Twilio API error:', result);
      return NextResponse.json({
        error: result.message || 'Failed to send SMS',
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error sending test SMS:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message,
    }, { status: 500 });
  }
}