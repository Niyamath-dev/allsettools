// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import nodemailer from 'nodemailer';

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

    // 2. Rate Limiting
    const ip = getClientIp(request.headers);
    const limitCheck = rateLimit(ip, 3, 60000); // Max 3 requests per minute per IP
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Please try again in ${limitCheck.reset} seconds.` },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 3. Database Check
    const isSupabaseConfigured = 
      (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: false, error: 'Database service not configured.' }, { status: 500 });
    }

    // Verify user exists and is active
    const { data: user, error: userError } = await supabase
      .from('registrations')
      .select('id, name, approved')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (userError) {
      console.error('Database query error:', userError);
      return NextResponse.json({ success: false, error: 'Internal database error.' }, { status: 500 });
    }

    // To prevent email enumeration, we return success even if user doesn't exist
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${sanitizedEmail}`);
      return NextResponse.json({ success: true, message: 'Reset email dispatched if account exists.' });
    }

    if (!user.approved) {
      return NextResponse.json({ success: false, error: 'Your account is pending registration approval.' }, { status: 403 });
    }

    // 4. Generate Reset Token and Expiration (1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    // 5. Update user row
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        reset_token: token,
        reset_token_expires: expires
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update reset token:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to record reset link.' }, { status: 500 });
    }

    // 6. Send Email or Output to Console
    const resetLink = `http://${host}/reset-password?token=${token}&email=${encodeURIComponent(sanitizedEmail)}`;

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@allsettools.com',
          to: sanitizedEmail,
          subject: 'AllSetTools: Password Reset Link',
          text: `Hello ${user.name},\n\nYou requested a password reset for your AllSetTools account.\n\nPlease reset your password using the link below (valid for 1 hour):\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.`,
          html: `<p>Hello ${user.name},</p><p>You requested a password reset for your AllSetTools account.</p><p>Please reset your password using the link below (valid for 1 hour):</p><p><a href="${resetLink}">Reset Password</a></p><p>Or copy this link to your browser: ${resetLink}</p><p>If you did not request this, you can safely ignore this email.</p>`
        });
        console.log(`Reset email sent to: ${sanitizedEmail}`);
      } catch (mailError) {
        console.error('SMTP reset mail failed:', mailError);
        return NextResponse.json({ success: false, error: 'Failed to send reset email notification.' }, { status: 500 });
      }
    } else {
      console.log('\n========================================================================');
      console.log(`[DEV TESTING] PASSWORD RESET REQUESTED FOR: ${sanitizedEmail}`);
      console.log(`RESET LINK: ${resetLink}`);
      console.log('========================================================================\n');
    }

    return NextResponse.json({ success: true, message: 'Reset email dispatched if account exists.' });
  } catch (error: any) {
    console.error('Forgot password API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
