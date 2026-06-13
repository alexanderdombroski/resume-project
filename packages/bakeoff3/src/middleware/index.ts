import { defineMiddleware } from 'astro:middleware';
import { getAuthFromRequest } from '../utils/clerkAuth';

const protectedRoutes = ['/dashboard', '/editor'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip middleware for prerendered pages — they don't have server context
  if (context.isPrerendered) {
    return next();
  }

  const isProtected = protectedRoutes.some((route) => context.url.pathname.startsWith(route));

  if (!isProtected) {
    return next();
  }

  const auth = await getAuthFromRequest(context.request);

  if (!auth) {
    return Response.redirect(new URL('/?auth=sign-in', context.request.url), 302);
  }

  return next();
});
