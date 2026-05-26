import { withDB } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid resume id.',
    });
  }

  return withDB(async (db) => {
    const result = await db.collection('resume').deleteOne({ id });

    if (!result.deletedCount) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Resume not found.',
      });
    }

    return { ok: true };
  });
});
