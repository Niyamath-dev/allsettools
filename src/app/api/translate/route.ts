// src/app/api/translate/route.ts
import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

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
    }

    // 2. IP Rate Limiting
    const ip = getClientIp(request.headers);
    const limitCheck = rateLimit(ip, 60, 60000); // 60 requests per minute
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Please try again in ${limitCheck.reset} seconds.` },
        { status: 429 }
      );
    }

    // 3. Validate request payload
    const body = await request.json();
    const { text, from, to } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text to translate is required' }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ success: false, error: 'Text length exceeds maximum of 5000 characters' }, { status: 400 });
    }

    if (!from || typeof from !== 'string' || !to || typeof to !== 'string') {
      return NextResponse.json({ success: false, error: 'Source and target languages are required' }, { status: 400 });
    }

    // 4. Fetch from free translation API (Google GTX)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Translation service failed with status ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    // Parse Google Translate format:
    // data[0] contains array of sentences translation: [[translatedLine, sourceLine, ...]]
    if (!data || !Array.isArray(data[0])) {
      return NextResponse.json({ success: false, error: 'Invalid response from translation service' }, { status: 502 });
    }

    const translatedText = data[0]
      .map((item: any) => (item && Array.isArray(item) ? item[0] : ''))
      .join('');

    const detectedSource = data[2];

    return NextResponse.json({
      success: true,
      translatedText,
      detectedSource,
    });
  } catch (error: any) {
    console.error('Translation proxy route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
