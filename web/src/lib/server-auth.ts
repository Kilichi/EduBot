import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, AuthTokenPayload, verifyAuthToken } from '@/lib/auth';

export async function getAuthPayload(): Promise<AuthTokenPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export async function requireAuth(): Promise<AuthTokenPayload> {
  const payload = await getAuthPayload();
  if (!payload) {
    throw new Error('UNAUTHORIZED');
  }
  return payload;
}

