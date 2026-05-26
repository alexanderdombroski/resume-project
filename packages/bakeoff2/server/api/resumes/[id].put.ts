import { withDB } from '../../utils/db';

type SectionItemPayload = {
  id: number;
  section_id: number;
  label: string;
  value: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  item_order: number;
};

type BulletPointPayload = {
  id: number;
  section_id: number;
  content: string;
  item_order: number;
};

type SectionPayload = {
  id: number;
  resume_id: number;
  title: string;
  item_order: number;
  type: string;
  items: SectionItemPayload[];
  bullet_points: BulletPointPayload[];
};

type ResumeUpdateBody = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  sections: SectionPayload[];
};

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid resume id.',
    });
  }

  const body = await readBody<ResumeUpdateBody | null>(event);

  if (!body || body.id !== id || !Array.isArray(body.sections)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid resume payload.',
    });
  }

  return withDB(async (db) => {
    const now = new Date();

    const resumeResult = await db.collection('resume').updateOne(
      { id },
      {
        $set: {
          title: body.title,
          summary: body.summary,
          updated_at: now,
        },
      }
    );

    if (!resumeResult.matchedCount) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Resume not found.',
      });
    }

    for (const section of body.sections) {
      if (section.resume_id !== id) continue;

      await db.collection('section').updateOne(
        { id: section.id, resume_id: id },
        {
          $set: {
            title: section.title,
            item_order: section.item_order,
            type: section.type,
          },
        }
      );

      for (const item of section.items ?? []) {
        await db.collection('section_item').updateOne(
          { id: item.id, section_id: section.id },
          {
            $set: {
              label: item.label,
              value: item.value,
              start_date: item.start_date ? new Date(item.start_date) : null,
              end_date: item.end_date ? new Date(item.end_date) : null,
              location: item.location,
              description: item.description,
              item_order: item.item_order,
            },
          }
        );
      }

      for (const bullet of section.bullet_points ?? []) {
        await db.collection('bullet_point').updateOne(
          { id: bullet.id, section_id: section.id },
          {
            $set: {
              content: bullet.content,
              item_order: bullet.item_order,
            },
          }
        );
      }
    }

    return { ok: true, id, updated_at: now.toISOString() };
  });
});
