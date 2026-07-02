// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Resolve webhook URL from environment or custom client header
    let webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.CONTACT_SHEET_URL;
    const clientUrl = request.headers.get('x-sheet-url') || body.customSheetUrl;
    
    if (clientUrl) {
      webhookUrl = clientUrl;
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
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
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
