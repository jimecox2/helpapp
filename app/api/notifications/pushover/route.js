
// app/api/notifications/pushover/route.js
import { NextResponse } from 'next/server';
import { verifyStrapiBearer } from '@/lib/auth/strapiLogin';

export async function GET(request) {
  if (!(await verifyStrapiBearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
/*     const token = authHeader.split(' ')[1];
    const decoded = await verifyJwt(token); // Implement your JWT verification
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    } */

    const appToken = process.env.PUSHOVER_APP_TOKEN;
    const userKey = process.env.PUSHOVER_USER_KEY;

    if (!appToken || !userKey) {
      return NextResponse.json(
        {
          error: 'Pushover configuration missing - check PUSHOVER_APP_TOKEN and PUSHOVER_USER_KEY',
          features: { pushover: false },
        },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.pushover.net/1/users/validate.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: appToken,
        user: userKey,
      }),
    });

    const result = await response.json();
    if (response.ok && result.status === 1) {
      return NextResponse.json({
        features: { pushover: true },
        status: 'Configured',
      });
    } else {
      return NextResponse.json(
        {
          error: result.errors ? result.errors.join(', ') : 'Invalid Pushover credentials',
          features: { pushover: false },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error checking Pushover configuration:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error.message,
        features: { pushover: false },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!(await verifyStrapiBearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
/*     const token = authHeader.split(' ')[1];
    const decoded = await verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    } */

    console.log('📧 Test Pushover endpoint called');
    
    const { message, title, priority, sound, url, url_title } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const appToken = process.env.PUSHOVER_APP_TOKEN;
    const userKey = process.env.PUSHOVER_USER_KEY;

    if (!appToken || !userKey) {
      return NextResponse.json({ 
        error: 'Pushover configuration missing - check PUSHOVER_APP_TOKEN and PUSHOVER_USER_KEY' 
      }, { status: 500 });
    }

    console.log('📧 Sending test Pushover notification directly to Pushover API...');

    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: appToken,
        user: userKey,
        message: message,
        title: title || 'Test Notification',
        priority: (priority || 0).toString(),
        sound: sound || 'pushover',
        url: url || '',
        url_title: url_title || ''
      })
    });

    const result = await response.json();

    if (response.ok && result.status === 1) {
      console.log('✅ Test Pushover notification sent successfully:', result.request);
      return NextResponse.json({
        success: true,
        messageId: result.request,
        message: 'Test notification sent successfully'
      });
    } else {
      console.error('❌ Pushover API error:', result);
      return NextResponse.json({
        error: result.errors ? result.errors.join(', ') : 'Failed to send notification'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error sending test Pushover notification:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}