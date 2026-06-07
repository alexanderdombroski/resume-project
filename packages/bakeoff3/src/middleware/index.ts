import { clerkMiddleware } from '@clerk/astro/server';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const req = new URL(context.url.pathname);
  if (context.isPrerendered || !req.pathname.startsWith('/api')) {
    return next();
  }

  const res = clerkMiddleware();
  return res(context, next);
});
