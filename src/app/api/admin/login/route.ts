// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@allsettools.dev';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123';
    
    if (email === adminEmail && password === adminPassword) {
      // Generate a signed session token unique to these credentials
      const token = crypto.createHmac('sha256', adminPassword)
        .update(adminEmail + '-session-auth-2026')
        .digest('hex');
      
      const cookieStore = await cookies();
      cookieStore.set('allsettools_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
  } catch (error: any) {
    console.error('Login session error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
