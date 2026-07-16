// src/app/api/admin/registrations/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

    // Return empty list if DB is not configured
    const isDbConfigured = !!process.env.DATABASE_URL;

    if (!isDbConfigured) {
      return NextResponse.json({ success: true, registrations: [] });
    }

    // Fetch all registration requests
    let registrations;
    try {
      registrations = await prisma.registration.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          approved: true,
          created_at: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });
    } catch (fetchError) {
      console.error('Fetch registrations error:', fetchError);
      return NextResponse.json({ success: false, error: 'Failed to query database.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, registrations });
  } catch (error: any) {
    console.error('Admin registrations error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
