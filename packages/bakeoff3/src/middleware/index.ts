import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export const onRequest = clerkMiddleware(
  {
    signInUrl: '/sign-in',
  },
  (auth, context) => {
    const { isAuthenticated, redirectToSignIn } = auth();

    if (isProtectedRoute(context.request) && !isAuthenticated) {
      return redirectToSignIn();
    }
  }
);
