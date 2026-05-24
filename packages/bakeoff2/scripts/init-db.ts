import { MongoClient } from 'mongodb';

// Example:
// node --env-file=.env scripts/init-db.ts
// Requires MONGO_URI with the database name in the URI path.

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing required env var: MONGO_URI');
  process.exit(1);
}

const appUsers = [{ id: 1, email: 'testperson@example.com', password_hash: 'test_hash' }];

const resumes = [
  {
    id: 1,
    user_id: 1,
    title: 'Software Engineer Resume',
    summary:
      'Backend-focused engineer with experience in distributed systems, APIs, and cloud infrastructure.',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'Full Stack Product Engineer Resume',
    summary:
      'Product-minded full stack developer with strong UX instincts and data-informed delivery.',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Data Engineer Resume',
    summary:
      'Data engineer specializing in analytics pipelines, orchestration, and warehouse modeling.',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const sections = [
  { id: 1, resume_id: 1, title: 'Experience', item_order: 1, type: 'experience' },
  { id: 2, resume_id: 1, title: 'Projects', item_order: 2, type: 'project' },
  { id: 3, resume_id: 1, title: 'Skills', item_order: 3, type: 'skills' },
  { id: 4, resume_id: 1, title: 'Education', item_order: 4, type: 'education' },
  { id: 5, resume_id: 2, title: 'Summary', item_order: 1, type: 'summary' },
  { id: 6, resume_id: 2, title: 'Experience', item_order: 2, type: 'experience' },
  { id: 7, resume_id: 2, title: 'Projects', item_order: 3, type: 'project' },
  { id: 8, resume_id: 2, title: 'Skills', item_order: 4, type: 'skills' },
  { id: 9, resume_id: 3, title: 'Experience', item_order: 1, type: 'experience' },
  { id: 10, resume_id: 3, title: 'Certifications', item_order: 2, type: 'certification' },
  { id: 11, resume_id: 3, title: 'Projects', item_order: 3, type: 'project' },
  { id: 12, resume_id: 3, title: 'Education', item_order: 4, type: 'education' },
];

const sectionItems = [
  {
    id: 1,
    section_id: 1,
    label: 'Senior Backend Engineer',
    value: 'Northwind Labs',
    start_date: new Date('2022-03-01'),
    end_date: null,
    location: 'Boise, ID',
    description: 'Led API platform modernization and reliability initiatives.',
    item_order: 1,
  },
  {
    id: 2,
    section_id: 1,
    label: 'Software Engineer',
    value: 'Pinecone Systems',
    start_date: new Date('2019-06-01'),
    end_date: new Date('2022-02-28'),
    location: 'Remote',
    description: 'Built internal developer tooling and observability services.',
    item_order: 2,
  },
  {
    id: 3,
    section_id: 2,
    label: 'Event Stream Processor',
    value: 'Kafka + Go',
    start_date: new Date('2023-01-01'),
    end_date: new Date('2023-08-01'),
    location: null,
    description: 'Designed a high-throughput event processor with idempotent consumers.',
    item_order: 1,
  },
  {
    id: 4,
    section_id: 2,
    label: 'Incident Bot',
    value: 'TypeScript + Slack API',
    start_date: new Date('2022-09-01'),
    end_date: new Date('2022-12-01'),
    location: null,
    description: 'Automated incident triage and escalation workflows.',
    item_order: 2,
  },
  {
    id: 5,
    section_id: 4,
    label: 'B.S. Computer Science',
    value: 'Boise State University',
    start_date: new Date('2015-08-15'),
    end_date: new Date('2019-05-10'),
    location: 'Boise, ID',
    description: null,
    item_order: 1,
  },
  {
    id: 6,
    section_id: 5,
    label: 'Profile',
    value: null,
    start_date: null,
    end_date: null,
    location: null,
    description:
      'Full stack engineer shipping customer-facing features from concept to production.',
    item_order: 1,
  },
  {
    id: 7,
    section_id: 6,
    label: 'Product Engineer',
    value: 'Acorn Health Tech',
    start_date: new Date('2021-04-01'),
    end_date: null,
    location: 'Denver, CO',
    description: 'Owned onboarding flow, billing UI, and experimentation framework.',
    item_order: 1,
  },
  {
    id: 8,
    section_id: 6,
    label: 'Frontend Engineer',
    value: 'Studio Orbit',
    start_date: new Date('2018-07-01'),
    end_date: new Date('2021-03-31'),
    location: 'Austin, TX',
    description: 'Built and maintained design system consumed across three products.',
    item_order: 2,
  },
  {
    id: 9,
    section_id: 7,
    label: 'A/B Testing Dashboard',
    value: 'SvelteKit + Postgres',
    start_date: new Date('2024-02-01'),
    end_date: new Date('2024-05-01'),
    location: null,
    description: 'Created experiment analytics dashboard used by product and growth teams.',
    item_order: 1,
  },
  {
    id: 10,
    section_id: 7,
    label: 'Checkout Redesign',
    value: 'React + Stripe',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-11-01'),
    location: null,
    description: 'Improved conversion through multi-step checkout and robust validation.',
    item_order: 2,
  },
  {
    id: 11,
    section_id: 9,
    label: 'Senior Data Engineer',
    value: 'Helios Retail',
    start_date: new Date('2020-01-01'),
    end_date: null,
    location: 'Seattle, WA',
    description: 'Managed ELT platform and dimensional models for finance and operations.',
    item_order: 1,
  },
  {
    id: 12,
    section_id: 9,
    label: 'Analytics Engineer',
    value: 'Blue Harbor',
    start_date: new Date('2017-05-01'),
    end_date: new Date('2019-12-31'),
    location: 'Portland, OR',
    description: 'Developed dbt models and reporting definitions for business teams.',
    item_order: 2,
  },
  {
    id: 13,
    section_id: 10,
    label: 'Google Cloud Professional Data Engineer',
    value: 'Google Cloud',
    start_date: new Date('2021-09-01'),
    end_date: null,
    location: null,
    description: null,
    item_order: 1,
  },
  {
    id: 14,
    section_id: 10,
    label: 'dbt Analytics Engineering Certification',
    value: 'dbt Labs',
    start_date: new Date('2022-11-01'),
    end_date: null,
    location: null,
    description: null,
    item_order: 2,
  },
  {
    id: 15,
    section_id: 11,
    label: 'Customer 360 Model',
    value: 'dbt + BigQuery',
    start_date: new Date('2023-03-01'),
    end_date: new Date('2023-10-01'),
    location: null,
    description: 'Unified customer entities and attribution logic for lifecycle analytics.',
    item_order: 1,
  },
  {
    id: 16,
    section_id: 11,
    label: 'Pipeline Cost Optimizer',
    value: 'Airflow + Python',
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-04-01'),
    location: null,
    description: 'Reduced warehouse compute spend by reworking schedule and partitioning.',
    item_order: 2,
  },
  {
    id: 17,
    section_id: 12,
    label: 'B.S. Information Systems',
    value: 'University of Oregon',
    start_date: new Date('2013-09-15'),
    end_date: new Date('2017-06-15'),
    location: 'Eugene, OR',
    description: null,
    item_order: 1,
  },
];

const bulletPoints = [
  {
    id: 1,
    section_id: 1,
    content:
      'Reduced p95 API latency by 38 percent by introducing query caching and connection pooling.',
    item_order: 1,
  },
  {
    id: 2,
    section_id: 1,
    content:
      'Cut production incidents by 45 percent via service-level objectives and on-call runbooks.',
    item_order: 2,
  },
  {
    id: 3,
    section_id: 1,
    content: 'Mentored 4 junior engineers through weekly design and code review sessions.',
    item_order: 3,
  },
  { id: 4, section_id: 3, content: 'Go, TypeScript, Node.js, PostgreSQL, Redis', item_order: 1 },
  { id: 5, section_id: 3, content: 'Docker, Kubernetes, Terraform, AWS, CI/CD', item_order: 2 },
  {
    id: 6,
    section_id: 3,
    content: 'System design, observability, incident response',
    item_order: 3,
  },
  {
    id: 7,
    section_id: 6,
    content:
      'Increased onboarding completion by 22 percent after redesigning the first-run experience.',
    item_order: 1,
  },
  {
    id: 8,
    section_id: 6,
    content: 'Implemented feature flagging strategy that reduced risky releases and rollback time.',
    item_order: 2,
  },
  {
    id: 9,
    section_id: 8,
    content: 'SvelteKit, React, TypeScript, Tailwind, Vitest',
    item_order: 1,
  },
  {
    id: 10,
    section_id: 8,
    content: 'REST APIs, accessibility, analytics instrumentation',
    item_order: 2,
  },
  {
    id: 11,
    section_id: 8,
    content: 'Product discovery, experimentation, stakeholder communication',
    item_order: 3,
  },
  {
    id: 12,
    section_id: 9,
    content: 'Migrated 120+ scheduled jobs to Airflow with lineage tracking and alerting.',
    item_order: 1,
  },
  {
    id: 13,
    section_id: 9,
    content: 'Improved dashboard trust by adding data quality tests across critical marts.',
    item_order: 2,
  },
  {
    id: 14,
    section_id: 11,
    content: 'Implemented incremental models to shrink daily processing windows by 60 percent.',
    item_order: 1,
  },
  {
    id: 15,
    section_id: 11,
    content: 'Standardized metric definitions used by BI and experimentation pipelines.',
    item_order: 2,
  },
];

const client = new MongoClient(MONGO_URI);

try {
  console.log('Initializing MongoDB database from MONGO_URI...');

  await client.connect();
  const db = client.db();

  const appUserCollection = db.collection('app_user');
  const resumeCollection = db.collection('resume');
  const sectionCollection = db.collection('section');
  const sectionItemCollection = db.collection('section_item');
  const bulletPointCollection = db.collection('bullet_point');

  await Promise.all([
    appUserCollection.deleteMany({}),
    resumeCollection.deleteMany({}),
    sectionCollection.deleteMany({}),
    sectionItemCollection.deleteMany({}),
    bulletPointCollection.deleteMany({}),
  ]);

  await Promise.all([
    appUserCollection.createIndex({ id: 1 }, { unique: true }),
    appUserCollection.createIndex({ email: 1 }, { unique: true }),
    resumeCollection.createIndex({ id: 1 }, { unique: true }),
    resumeCollection.createIndex({ user_id: 1 }),
    sectionCollection.createIndex({ id: 1 }, { unique: true }),
    sectionCollection.createIndex({ resume_id: 1 }),
    sectionItemCollection.createIndex({ id: 1 }, { unique: true }),
    sectionItemCollection.createIndex({ section_id: 1 }),
    bulletPointCollection.createIndex({ id: 1 }, { unique: true }),
    bulletPointCollection.createIndex({ section_id: 1 }),
  ]);

  await appUserCollection.insertMany(appUsers);
  await resumeCollection.insertMany(resumes);
  await sectionCollection.insertMany(sections);
  await sectionItemCollection.insertMany(sectionItems);
  await bulletPointCollection.insertMany(bulletPoints);

  console.log('MongoDB seed complete.');
} catch (error) {
  console.error('Error initializing MongoDB database:', error);
  process.exitCode = 1;
} finally {
  await client.close();
}
