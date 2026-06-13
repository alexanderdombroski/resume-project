import type { APIRoute } from 'astro';
import { getAuthFromRequest } from '../../../utils/clerkAuth';
import { createResume } from '../../../utils/resume';

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

// POST a new resume
export const POST = (async ({ request }) => {
  const auth = await getAuthFromRequest(request);
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const created = await createResume(auth.sub, data);
  return Response.json({ resume: created }, { status: 201 });
}) satisfies APIRoute;
