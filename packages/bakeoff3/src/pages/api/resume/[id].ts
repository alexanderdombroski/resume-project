import type { APIRoute } from 'astro';
import { getAuthFromRequest } from '../../../utils/clerkAuth';
import { getFullResumeById, createResume, updateResume, deleteResume } from '../../../utils/resume';

export const prerender = false;

// GET a single resume by ID
export const GET = (async ({ request, params }) => {
  const auth = await getAuthFromRequest(request);
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const resumeId = Number(id);
  if (!id || isNaN(resumeId)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  const resume = await getFullResumeById(auth.sub, resumeId);
  if (!resume) return Response.json({ error: 'Resume not found' }, { status: 404 });

  return Response.json({ resume }, { status: 200 });
}) satisfies APIRoute;

// POST a new resume
export const POST = (async ({ request }) => {
  const auth = await getAuthFromRequest(request);
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const created = await createResume(auth.sub, data);
  return Response.json({ resume: created }, { status: 201 });
}) satisfies APIRoute;

// PUT update an existing resume
export const PUT = (async ({ request, params }) => {
  const auth = await getAuthFromRequest(request);
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const resumeId = Number(id);
  if (!id || isNaN(resumeId)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  const data = await request.json();
  const updated = await updateResume(auth.sub, resumeId, data);
  return Response.json({ updated }, { status: 200 });
}) satisfies APIRoute;

// DELETE a resume
export const DELETE = (async ({ request, params }) => {
  const auth = await getAuthFromRequest(request);
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const resumeId = Number(id);
  if (!id || isNaN(resumeId)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  await deleteResume(auth.sub, resumeId);
  return Response.json({ message: 'Deleted' }, { status: 200 });
}) satisfies APIRoute;
