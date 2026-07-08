// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/hash';
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
    } else {
      return NextResponse.json({ success: false, error: 'Missing security headers' }, { status: 403 });
    }

    // 2. Rate Limiting
    const ip = getClientIp(request.headers);
    const limitCheck = rateLimit(ip, 5, 60000); // Max 5 verification attempts per minute per IP
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Please try again in ${limitCheck.reset} seconds.` },
        { status: 429 }
      );
    }

    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing parameters.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 3. Database Check
    const isSupabaseConfigured = 
      (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: false, error: 'Database service not configured.' }, { status: 500 });
    }

    // Fetch user with matching email and reset token
    const { data: user, error: userError } = await supabase
      .from('registrations')
      .select('id, reset_token_expires')
      .eq('email', sanitizedEmail)
      .eq('reset_token', token)
      .maybeSingle();

    if (userError) {
      console.error('Database query error:', userError);
      return NextResponse.json({ success: false, error: 'Internal database verification failed.' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid reset token or email address.' }, { status: 400 });
    }

    // 4. Expiration check
    if (user.reset_token_expires) {
      const expires = new Date(user.reset_token_expires);
      if (expires.getTime() < Date.now()) {
        return NextResponse.json({ success: false, error: 'Your password reset token has expired. Please request a new link.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid verification parameters.' }, { status: 400 });
    }

    // 5. Update user password and clear token columns
    const { hash, salt } = hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        password_hash: hash,
        salt,
        reset_token: null,
        reset_token_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase password reset update error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to save new password in database.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully!' });
  } catch (error: any) {
    console.error('Reset password API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
