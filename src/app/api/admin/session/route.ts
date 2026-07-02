// src/app/api/admin/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@allsettools.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123';
    
    // Expected token signature
    const expectedToken = crypto.createHmac('sha256', adminPassword)
      .update(adminEmail + '-session-auth-2026')
      .digest('hex');
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('allsettools_session');
    
    if (sessionCookie && sessionCookie.value === expectedToken) {
      return NextResponse.json({ loggedIn: true });
    }
    
    return NextResponse.json({ loggedIn: false });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ loggedIn: false });
  }
}
