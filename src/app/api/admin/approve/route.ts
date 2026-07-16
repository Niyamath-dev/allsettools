// src/app/api/admin/approve/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('allsettools_session');
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Validate admin authority
    const session = verifySession(sessionCookie.value);
    const isAuthorized = session && session.role === 'admin';

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const { id, action } = await request.json();
    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid parameters.' }, { status: 400 });
    }

    const isDbConfigured = !!process.env.DATABASE_URL;

    if (!isDbConfigured) {
      return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 500 });
    }

    // Fetch user details first
    let user;
    try {
      user = await prisma.registration.findUnique({
        where: { id },
        select: { email: true, name: true }
      });
    } catch (fetchError) {
      console.error('Fetch registration error:', fetchError);
      return NextResponse.json({ success: false, error: 'Database verification error.' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User registration request not found.' }, { status: 404 });
    }

    const userEmail = user.email;
    const userName = user.name;

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (action === 'approve') {
      // Approve user
      try {
        await prisma.registration.update({
          where: { id },
          data: { approved: true }
        });
      } catch (updateError) {
        console.error('Approve user error:', updateError);
        return NextResponse.json({ success: false, error: 'Failed to approve registration.' }, { status: 500 });
      }

      // Send confirmation email
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
            to: userEmail,
            subject: 'AllSetTools Account Approved',
            text: `Hello ${userName},\n\nYour AllSetTools registration request has been accepted and approved by the administrator!\n\nYou can now sign in at the Admin Portal (/admin) using your email and password.\n\nBest regards,\nAllSetTools Team`,
            html: `<p>Hello ${userName},</p><p>Your AllSetTools registration request has been accepted and approved by the administrator!</p><p>You can now sign in to the <a href="${request.headers.get('origin') || 'https://allsettools.com'}/admin">Admin Portal</a> using your email and password.</p><p>Best regards,<br>AllSetTools Team</p>`
          });
        } catch (mailError) {
          console.error('SMTP approval notification email failed:', mailError);
        }
      }

      return NextResponse.json({ success: true, message: 'Registration approved successfully.' });
    } else {
      // Reject user (delete request)
      try {
        await prisma.registration.delete({
          where: { id }
        });
      } catch (deleteError) {
        console.error('Delete user request error:', deleteError);
        return NextResponse.json({ success: false, error: 'Failed to reject registration request.' }, { status: 500 });
      }

      // Send rejection email
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
            to: userEmail,
            subject: 'AllSetTools Account Registration Update',
            text: `Hello ${userName},\n\nWe appreciate your interest in AllSetTools. Unfortunately, your registration request has been declined at this time.\n\nIf you believe this was an error, please reach out via our contact page.\n\nBest regards,\nAllSetTools Team`,
            html: `<p>Hello ${userName},</p><p>We appreciate your interest in AllSetTools. Unfortunately, your registration request has been declined at this time.</p><p>If you believe this was an error, please reach out via our contact page.</p><p>Best regards,<br>AllSetTools Team</p>`
          });
        } catch (mailError) {
          console.error('SMTP rejection notification email failed:', mailError);
        }
      }

      return NextResponse.json({ success: true, message: 'Registration request rejected and deleted.' });
    }
  } catch (error: any) {
    console.error('Admin approval API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
