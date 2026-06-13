import { jwtVerify, createRemoteJWKSet } from 'jose';

// Clerk's JWKS endpoint — derived from the publishable key's domain
// e.g. pk_live_Y2xlcmsuZXhhbXBsZS5jb20k -> clerk.example.com
function getClerkJwksUrl(): URL {
  const key = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  if (!key) {
    throw new Error('MISSING CLERK CLIENT KEY');
  }
  // The publishable key encodes the frontend API host in base64 after the prefix
  // Format: pk_live_<base64(frontendApiHost)>  or pk_test_<base64(frontendApiHost)>
  const b64 = key.replace(/^pk_(live|test)_/, '');
  // Clerk appends a trailing '$' before base64-encoding; strip that from the decoded value
  const frontendApi = atob(b64).replace(/\$$/, '');
  return new URL(`https://${frontendApi}/.well-known/jwks.json`);
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(getClerkJwksUrl());
  }
  return jwks;
}

export type ClerkPayload = {
  sub: string; // userId
  sid: string; // sessionId
  [key: string]: unknown;
};

/**
 * Verifies a Clerk session token (JWT) and returns its payload.
 * Accepts the raw token string (without "Bearer " prefix).
 */
export async function verifyClerkToken(token: string): Promise<ClerkPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      clockTolerance: 5, // seconds of leeway
    });
    return payload as ClerkPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the Clerk session token from a Request's cookies or
 * Authorization header. Returns the payload (including userId as `sub`) or null.
 */
export async function getAuthFromRequest(request: Request): Promise<ClerkPayload | null> {
  // 1. Try Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization') ?? '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return verifyClerkToken(token);
  }

  // 2. Try __session cookie (Clerk's default session cookie name)
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/(?:^|;\s*)__session=([^;]+)/);
  if (match) {
    return verifyClerkToken(decodeURIComponent(match[1]));
  }

  return null;
}
