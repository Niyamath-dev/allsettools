// src/app/api/admin/registrations/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { verifySession } from '@/lib/session';
import { supabase } from '@/lib/supabase';

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

    // Return empty list if Supabase is not configured
    const isSupabaseConfigured = 
      (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: true, registrations: [] });
    }

    // Fetch all registration requests
    const { data: registrations, error: fetchError } = await supabase
      .from('registrations')
      .select('id, email, name, role, approved, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch registrations error:', fetchError);
      return NextResponse.json({ success: false, error: 'Failed to query database.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, registrations });
  } catch (error: any) {
    console.error('Admin registrations error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
