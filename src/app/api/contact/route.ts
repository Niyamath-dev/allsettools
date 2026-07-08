// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// XSS sanitization helper
function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Email format validator regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host') || '';

    if (origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ success: false, error: 'CSRF verification failed' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
      }
    } else if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.host !== host) {
          return NextResponse.json({ success: false, error: 'CSRF verification failed' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid referer header' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Missing security headers' }, { status: 403 });
    }

    // 2. IP Rate Limiting
    const ip = getClientIp(request.headers);
    const limitCheck = rateLimit(ip, 5, 60000); // Max 5 requests per minute
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Please try again in ${limitCheck.reset} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 3. Input Validation
    const rawName = body.name;
    const rawEmail = body.email;
    const rawSubject = body.subject;
    const rawMessage = body.message;

    if (!rawName || typeof rawName !== 'string' || rawName.trim().length < 2 || rawName.trim().length > 100) {
      return NextResponse.json({ success: false, error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    if (!rawEmail || typeof rawEmail !== 'string' || !emailRegex.test(rawEmail)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!rawSubject || typeof rawSubject !== 'string' || rawSubject.trim().length < 3 || rawSubject.trim().length > 150) {
      return NextResponse.json({ success: false, error: 'Subject must be between 3 and 150 characters.' }, { status: 400 });
    }

    if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim().length < 10 || rawMessage.trim().length > 5000) {
      return NextResponse.json({ success: false, error: 'Message must be between 10 and 5000 characters.' }, { status: 400 });
    }

    // 4. XSS Sanitization
    const name = sanitizeInput(rawName);
    const email = rawEmail.trim().toLowerCase();
    const subject = sanitizeInput(rawSubject);
    const message = sanitizeInput(rawMessage);

    // Resolve webhook URL from environment or custom client header
    let webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.CONTACT_SHEET_URL;
    const clientUrl = request.headers.get('x-sheet-url') || body.customSheetUrl;
    
    if (clientUrl) {
      // Validate clientUrl to prevent Server-Side Request Forgery (SSRF)
      try {
        const parsedUrl = new URL(clientUrl);
        if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('google.com') && !parsedUrl.hostname.endsWith('googleusercontent.com')) {
          return NextResponse.json({ success: false, error: 'Invalid Google Sheets webhook script URL format.' }, { status: 400 });
        }
        webhookUrl = clientUrl;
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid Sheets script webhook URL.' }, { status: 400 });
      }
    }

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Google Sheets webhook URL is not configured. Setup environment variables or configure it in the Admin Dashboard.' },
        { status: 400 }
      );
    }

    // Forward payload to the Google Apps Script Web App
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contact',
        id: body.id,
        name,
        email,
        subject,
        message,
        submittedAt: body.submittedAt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `Google Sheets Script responded with error: ${response.status} ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (data.status === 'success') {
      return NextResponse.json({ success: true, message: 'Message logged in Google Sheets successfully.' });
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'Google Sheets Script execution failed.' },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('Contact Google Sheet API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
