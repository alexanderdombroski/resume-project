import type { APIRoute } from 'astro';

export const prerender = false;

export const GET = (async ({ locals }) => {
  const { isAuthenticated, userId } = locals.auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { getResumesForUser } = await import('../../../utils/resume');
  const resumes = await getResumesForUser(userId);

  return Response.json({ resumes }, { status: 200 });
}) satisfies APIRoute;
