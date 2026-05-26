import { withDB } from '../../utils/db';

type Resume = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  created_at: Date;
  updated_at: Date;
};

type Section = {
  id: number;
  resume_id: number;
  title: string;
  item_order: number;
  type: string;
};

type SectionItem = {
  id: number;
  section_id: number;
  label: string;
  value: string | null;
  start_date: Date | null;
  end_date: Date | null;
  location: string | null;
  description: string | null;
  item_order: number;
};

type BulletPoint = {
  id: number;
  section_id: number;
  content: string;
  item_order: number;
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

  return withDB(async (db) => {
    const resume = await db
      .collection<Resume>('resume')
      .findOne({ id }, { projection: { _id: 0 } });

    if (!resume) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Resume not found.',
      });
    }

    const sections = await db
      .collection<Section>('section')
      .find({ resume_id: id }, { projection: { _id: 0 } })
      .sort({ item_order: 1 })
      .toArray();

    const sectionIds = sections.map((section) => section.id);

    const [items, bullets] =
      sectionIds.length > 0
        ? await Promise.all([
            db
              .collection<SectionItem>('section_item')
              .find({ section_id: { $in: sectionIds } }, { projection: { _id: 0 } })
              .sort({ item_order: 1 })
              .toArray(),
            db
              .collection<BulletPoint>('bullet_point')
              .find({ section_id: { $in: sectionIds } }, { projection: { _id: 0 } })
              .sort({ item_order: 1 })
              .toArray(),
          ])
        : [[], []];

    const itemsBySection = new Map<number, SectionItem[]>();
    for (const item of items) {
      const current = itemsBySection.get(item.section_id) ?? [];
      current.push(item);
      itemsBySection.set(item.section_id, current);
    }

    const bulletsBySection = new Map<number, BulletPoint[]>();
    for (const bullet of bullets) {
      const current = bulletsBySection.get(bullet.section_id) ?? [];
      current.push(bullet);
      bulletsBySection.set(bullet.section_id, current);
    }

    return {
      ...resume,
      sections: sections.map((section) => ({
        ...section,
        items: itemsBySection.get(section.id) ?? [],
        bullet_points: bulletsBySection.get(section.id) ?? [],
      })),
    };
  });
});
