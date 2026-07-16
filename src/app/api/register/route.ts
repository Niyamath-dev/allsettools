// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import nodemailer from 'nodemailer';

// Email format validator
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
    const limitCheck = rateLimit(ip, 5, 60000); // Max 5 registration attempts per minute per IP
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Please try again in ${limitCheck.reset} seconds.` },
        { status: 429 }
      );
    }

    const { name, email, password } = await request.json();

    // 3. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ success: false, error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json({ success: false, error: 'Password must be between 6 and 128 characters.' }, { status: 400 });
    }

    // 4. Check if email already exists in Database
    const sanitizedEmail = email.trim().toLowerCase();

    // Safety check: if Database is not configured, warn
    const isDbConfigured = !!process.env.DATABASE_URL;

    if (!isDbConfigured) {
      return NextResponse.json(
        { success: false, error: 'Database is not configured. Setup environment variables to enable registration.' },
        { status: 500 }
      );
    }

    let existingUser;
    try {
      existingUser = await prisma.registration.findUnique({
        where: { email: sanitizedEmail },
        select: { id: true },
      });
    } catch (checkError) {
      console.error('Database query error:', checkError);
      return NextResponse.json({ success: false, error: 'Database verification failed.' }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email address is already registered.' }, { status: 400 });
    }

    // Check if registrations table is empty to auto-approve first admin
    let isFirstUser = false;
    try {
      const count = await prisma.registration.count();
      if (count === 0) {
        isFirstUser = true;
      }
    } catch (e) {
      console.error('Failed to count registrations:', e);
    }

    // 5. Hash Password & Insert
    const { hash, salt } = hashPassword(password);
    try {
      await prisma.registration.create({
        data: {
          email: sanitizedEmail,
          password_hash: hash,
          salt,
          name: name.trim(),
          role: isFirstUser ? 'admin' : 'user',
          approved: isFirstUser ? true : false,
        },
      });
    } catch (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json({ success: false, error: 'Failed to save registration request.' }, { status: 500 });
    }

    // 6. SMTP Email Notification to Admin
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || 'support@allsettools.com';

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
          to: adminEmail,
          subject: 'AllSetTools: New Account Approval Request',
          text: `Hello Administrator,\n\nA new user has registered and is pending approval.\n\nUser Details:\nName: ${name.trim()}\nEmail: ${sanitizedEmail}\n\nPlease sign in to the Admin Panel (/admin) to approve or reject this request.`,
          html: `<p>Hello Administrator,</p><p>A new user has registered and is pending approval.</p><p><strong>User Details:</strong><br>Name: ${name.trim()}<br>Email: ${sanitizedEmail}</p><p>Please sign in to the <a href="https://${host}/admin">Admin Panel</a> to approve or reject this request.</p>`
        });

        console.log(`Notification email sent to admin: ${adminEmail}`);
      } catch (mailError) {
        // Log mail error but do not fail the registration request
        console.error('SMTP notification email failed:', mailError);
      }
    } else {
      console.log('SMTP environment variables not configured. Skipping email notification to admin.');
    }

    return NextResponse.json({ success: true, message: 'Registration request logged. Pending admin approval.' });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
