// src/app/api/admin/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { verifySession } from '@/lib/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('allsettools_session');
    
    if (sessionCookie) {
      // Check signed DB user session
      const session = verifySession(sessionCookie.value);
      if (session) {
        return NextResponse.json({ loggedIn: true, email: session.email, role: session.role });
      }
    }
    
    return NextResponse.json({ loggedIn: false });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ loggedIn: false });
  }
}
