import bcryptjs from 'bcryptjs';

const saltRounds = 10;

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Validate admin credentials
 */
export async function validateAdminCredentials(
  email: string,
  password: string,
  hashedPassword: string | null
): Promise<boolean> {
  if (!hashedPassword) {
    return false;
  }
  return comparePassword(password, hashedPassword);
}
