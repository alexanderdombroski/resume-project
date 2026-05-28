import { withDB } from '../../utils/db';
import type { Db } from 'mongodb';

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

async function getNextId(db: Db, collectionName: string) {
  const highest = await db
    .collection<{ id: number }>(collectionName)
    .find({}, { projection: { _id: 0, id: 1 } })
    .sort({ id: -1 })
    .limit(1)
    .toArray();

  return (highest[0]?.id ?? 0) + 1;
}

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
    let nextBulletId: number | null = null;
    const persistedBulletIdsBySection = new Map<number, number[]>();

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
        if (bullet.id > 0) {
          const persistedIds = persistedBulletIdsBySection.get(section.id) ?? [];
          persistedIds.push(bullet.id);
          persistedBulletIdsBySection.set(section.id, persistedIds);

          await db.collection('bullet_point').updateOne(
            { id: bullet.id, section_id: section.id },
            {
              $set: {
                content: bullet.content,
                item_order: bullet.item_order,
              },
            }
          );
          continue;
        }

        if (nextBulletId === null) {
          nextBulletId = await getNextId(db, 'bullet_point');
        }

        const insertedBulletId = nextBulletId;
        await db.collection('bullet_point').insertOne({
          id: insertedBulletId,
          section_id: section.id,
          content: bullet.content,
          item_order: bullet.item_order,
        });

        const persistedIds = persistedBulletIdsBySection.get(section.id) ?? [];
        persistedIds.push(insertedBulletId);
        persistedBulletIdsBySection.set(section.id, persistedIds);

        nextBulletId += 1;
      }

      const persistedBulletIds = persistedBulletIdsBySection.get(section.id) ?? [];

      await db.collection('bullet_point').deleteMany({
        section_id: section.id,
        ...(persistedBulletIds.length ? { id: { $nin: persistedBulletIds } } : {}),
      });
    }

    return { ok: true, id, updated_at: now.toISOString() };
  });
});
