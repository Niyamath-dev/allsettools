// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/hash';
import { signSession } from '@/lib/session';

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
    const limitCheck = rateLimit(ip, 5, 60000); // Max 5 login attempts per minute
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Please try again in ${limitCheck.reset} seconds.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // 3. Input Validation
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please provide a valid email.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Invalid login credentials.' }, { status: 400 });
    }
    
    const sanitizedEmail = email.trim().toLowerCase();

    // 4. Try Supabase Registered Users
    const isSupabaseConfigured = 
      (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const { data: user, error: dbError } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (dbError) {
      console.error('Supabase query error during login:', dbError);
      return NextResponse.json({ success: false, error: 'Authentication service error.' }, { status: 500 });
    }

    if (user) {
      // Verify password hash
      const isMatch = verifyPassword(password, user.password_hash, user.salt);
      if (isMatch) {
        // Enforce admin approval requirement
        if (!user.approved) {
          return NextResponse.json(
            { success: false, error: 'Access denied: Your account registration is pending administrator approval.' },
            { status: 403 }
          );
        }

        // Issue secure signed session cookie
        const token = signSession({ email: user.email, role: user.role || 'user' });
        const cookieStore = await cookies();
        cookieStore.set('allsettools_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
        });

        return NextResponse.json({ success: true, email: user.email, role: user.role || 'user' });
      }
    }
    
    return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
  } catch (error: any) {
    console.error('Login session error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
