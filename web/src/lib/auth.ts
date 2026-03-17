import jwt from 'jsonwebtoken';

export const AUTH_COOKIE_NAME = 'edubot_token';

export interface AuthTokenPayload {
  sub: string;
  usuario: string;
  nombre: string;
  rol: 'usuario' | 'admin';
}

export interface PublicUser {
  id: string;
  usuario: string;
  nombre: string;
  esNuevo: boolean;
  rol: 'usuario' | 'admin';
  ultimoAcceso?: Date;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing env var: JWT_SECRET');
  return secret;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === 'string') return null;
    return decoded as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

