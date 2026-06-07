import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {
  const { isAuthenticated } = auth();

  if (isProtectedRoute(context.request) && !isAuthenticated) {
    return Response.redirect(new URL('/?auth=sign-in', context.request.url), 302);
  }
});
