import type { APIRoute } from 'astro';
import { getAuthFromRequest } from '../../../utils/clerkAuth';

export const prerender = false;

export const GET = (async ({ request }) => {
  const auth = await getAuthFromRequest(request);

  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = auth.sub;
  const { getResumesForUser } = await import('../../../utils/resume');
  const resumes = await getResumesForUser(userId);

  return Response.json({ resumes }, { status: 200 });
}) satisfies APIRoute;
