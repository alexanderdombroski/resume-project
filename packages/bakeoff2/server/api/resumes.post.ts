import { templateOptions } from '../../app/data/templates';
import type { Db } from 'mongodb';
import { withDB } from '../utils/db';

type ResumeDoc = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  created_at: Date;
  updated_at: Date;
};

type SectionDoc = {
  id: number;
  resume_id: number;
  title: string;
  item_order: number;
  type: string;
};

type CreateResumeBody = {
  template?: string;
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
  const body = (await readBody<CreateResumeBody>(event)) ?? {};
  const templateSlug = body.template;

  if (!templateSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing template slug.',
    });
  }

  const selectedTemplate = templateOptions.find((entry) => entry.slug === templateSlug);

  if (!selectedTemplate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid template slug.',
    });
  }

  return withDB(async (db) => {
    const now = new Date();
    const resumeId = await getNextId(db, 'resume');
    let nextSectionId = await getNextId(db, 'section');

    const resume: ResumeDoc = {
      id: resumeId,
      user_id: 1,
      title: `${selectedTemplate.name} Resume`,
      summary: selectedTemplate.summary,
      created_at: now,
      updated_at: now,
    };

    const sectionTitles = [...selectedTemplate.order];
    for (const baseSection of selectedTemplate.precreatedSections) {
      if (!sectionTitles.some((entry) => entry.toLowerCase() === baseSection.toLowerCase())) {
        sectionTitles.push(baseSection);
      }
    }

    const sections: SectionDoc[] = sectionTitles.map((title, index) => ({
      id: nextSectionId++,
      resume_id: resumeId,
      title,
      item_order: index + 1,
      type: 'section',
    }));

    await db.collection<ResumeDoc>('resume').insertOne(resume);
    if (sections.length) {
      await db.collection<SectionDoc>('section').insertMany(sections);
    }

    return {
      id: resumeId,
      template: selectedTemplate.slug,
    };
  });
});
