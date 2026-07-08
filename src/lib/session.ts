// src/lib/session.ts
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || 'fallback-session-secret-key-2026';

export interface SessionData {
  email: string;
  role: string;
}

/**
 * Encodes and signs a session payload
 */
export function signSession(data: SessionData): string {
  const payload = JSON.stringify(data);
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

/**
 * Verifies a signed session token and returns the payload if valid
 */
export function verifySession(token: string): SessionData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const payloadBase64 = parts[0];
    const signature = parts[1];
    
    const payloadStr = Buffer.from(payloadBase64, 'base64').toString();
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    return JSON.parse(payloadStr) as SessionData;
  } catch {
    return null;
  }
}
