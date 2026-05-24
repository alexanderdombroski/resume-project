import { withDB } from '../utils/db';

type Resume = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  created_at: Date;
  updated_at: Date;
};

export default defineEventHandler(async () => {
  return withDB(async (db) => {
    const resumes = await db
      .collection<Resume>('resume')
      .find({}, { projection: { _id: 0 } })
      .sort({ updated_at: -1 })
      .toArray();

    return resumes;
  });
});
