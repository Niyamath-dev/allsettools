// src/lib/hash.ts
import crypto from 'crypto';

export interface HashResult {
  hash: string;
  salt: string;
}

/**
 * Hash a password securely using PBKDF2
 * @param password Raw text password
 */
export function hashPassword(password: string): HashResult {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify a password matches the stored hash and salt
 * @param password Raw text password
 * @param hash Stored hash hex string
 * @param salt Stored salt hex string
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}
