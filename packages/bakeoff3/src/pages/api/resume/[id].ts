import type { APIRoute } from 'astro';
import { getResumeById, createResume, updateResume, deleteResume } from '../../../utils/resume';

export const prerender = false;

// GET a single resume by ID
export const GET = (async ({ locals, params }) => {
  const { isAuthenticated, userId } = locals.auth();
  if (!isAuthenticated || !userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const resumeId = Number(id);
  if (!id || isNaN(resumeId)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  const resume = await getResumeById(userId, resumeId);
  if (!resume) {
    return Response.json({ error: 'Resume not found' }, { status: 404 });
  }

  return Response.json({ resume }, { status: 200 });
}) satisfies APIRoute;

// POST a new resume with the given ID
export const POST = (async ({ locals, request }) => {
  const { isAuthenticated, userId } = locals.auth();
  if (!isAuthenticated || !userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const created = await createResume(userId, data);
  return Response.json({ resume: created }, { status: 201 });
}) satisfies APIRoute;

// PUT update an existing resume
export const PUT = (async ({ locals, request, params }) => {
  const { isAuthenticated, userId } = locals.auth();
  if (!isAuthenticated || !userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const resumeId = Number(id);
  if (!id || isNaN(resumeId)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  const data = await request.json();
  const updated = await updateResume(userId, resumeId, data);
  return Response.json({ updated }, { status: 200 });
}) satisfies APIRoute;

// DELETE a resume
export const DELETE = (async ({ locals, params }) => {
  const { isAuthenticated, userId } = locals.auth();
  if (!isAuthenticated || !userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const resumeId = Number(id);
  if (!id || isNaN(resumeId)) {
    return Response.json({ error: 'Invalid resume ID' }, { status: 400 });
  }

  await deleteResume(userId, resumeId);
  return Response.json({ message: 'Deleted' }, { status: 200 });
}) satisfies APIRoute;
