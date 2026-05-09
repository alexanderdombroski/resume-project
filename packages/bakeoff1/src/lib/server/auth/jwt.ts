import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'session';

type JwtPayload = {
  id: string;
  email: string;
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(cookies: Cookies, token: string) {
  cookies.set(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, {
    path: '/',
  });
}

export function getToken(cookies: Cookies) {
  return cookies.get(COOKIE_NAME);
}
