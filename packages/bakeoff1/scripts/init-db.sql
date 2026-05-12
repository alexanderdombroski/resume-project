DROP TABLE IF EXISTS "BULLET_POINT" CASCADE;
DROP TABLE IF EXISTS "SECTION_ITEM" CASCADE;
DROP TABLE IF EXISTS "SECTION" CASCADE;
DROP TABLE IF EXISTS "RESUME" CASCADE;
DROP TABLE IF EXISTS "USER" CASCADE;

-- =========================
-- USER
-- =========================
CREATE TABLE IF NOT EXISTS "USER" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL
);

-- =========================
-- RESUME
-- =========================
CREATE TABLE IF NOT EXISTS "RESUME" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_resume_user
        FOREIGN KEY (userId)
        REFERENCES "USER"(id)
        ON DELETE CASCADE
);

-- =========================
-- SECTION
-- =========================
CREATE TABLE IF NOT EXISTS "SECTION" (
    id SERIAL PRIMARY KEY,
    resumeId INTEGER NOT NULL,
    title TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    type TEXT,

    CONSTRAINT fk_section_resume
        FOREIGN KEY (resumeId)
        REFERENCES "RESUME"(id)
        ON DELETE CASCADE
);

-- =========================
-- BULLET_POINT
-- =========================
CREATE TABLE IF NOT EXISTS "BULLET_POINT" (
    id SERIAL PRIMARY KEY,
    sectionId INTEGER NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT fk_bullet_section
        FOREIGN KEY (sectionId)
        REFERENCES "SECTION"(id)
        ON DELETE CASCADE
);

-- =========================
-- SECTION_ITEM
-- =========================
CREATE TABLE IF NOT EXISTS "SECTION_ITEM" (
    id SERIAL PRIMARY KEY,
    sectionId INTEGER NOT NULL,
    label TEXT,
    value TEXT,
    startDate DATE,
    endDate DATE,
    location TEXT,
    description TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT fk_section_item_section
        FOREIGN KEY (sectionId)
        REFERENCES "SECTION"(id)
        ON DELETE CASCADE
);

-- ==================================================
-- MOCK DATA - RESUMES (userId = 0)
-- ==================================================

INSERT INTO "USER" (id, email, passwordHash)
VALUES (0, 'testperson@example.com', 'test_hash');

INSERT INTO "RESUME" (id, userId, title, summary)
VALUES
    (1, 0, 'Software Engineer Resume', 'Backend-focused engineer with experience in distributed systems, APIs, and cloud infrastructure.'),
    (2, 0, 'Full Stack Product Engineer Resume', 'Product-minded full stack developer with strong UX instincts and data-informed delivery.'),
    (3, 0, 'Data Engineer Resume', 'Data engineer specializing in analytics pipelines, orchestration, and warehouse modeling.');

INSERT INTO "SECTION" (id, resumeId, title, "order", type)
VALUES
    -- Resume 1
    (1, 1, 'Experience', 1, 'experience'),
    (2, 1, 'Projects', 2, 'project'),
    (3, 1, 'Skills', 3, 'skills'),
    (4, 1, 'Education', 4, 'education'),
    -- Resume 2
    (5, 2, 'Summary', 1, 'summary'),
    (6, 2, 'Experience', 2, 'experience'),
    (7, 2, 'Projects', 3, 'project'),
    (8, 2, 'Skills', 4, 'skills'),
    -- Resume 3
    (9, 3, 'Experience', 1, 'experience'),
    (10, 3, 'Certifications', 2, 'certification'),
    (11, 3, 'Projects', 3, 'project'),
    (12, 3, 'Education', 4, 'education');

INSERT INTO "SECTION_ITEM" (id, sectionId, label, value, startDate, endDate, location, description, "order")
VALUES
    -- Resume 1: Experience
    (1, 1, 'Senior Backend Engineer', 'Northwind Labs', '2022-03-01', NULL, 'Boise, ID', 'Led API platform modernization and reliability initiatives.', 1),
    (2, 1, 'Software Engineer', 'Pinecone Systems', '2019-06-01', '2022-02-28', 'Remote', 'Built internal developer tooling and observability services.', 2),
    -- Resume 1: Projects
    (3, 2, 'Event Stream Processor', 'Kafka + Go', '2023-01-01', '2023-08-01', NULL, 'Designed a high-throughput event processor with idempotent consumers.', 1),
    (4, 2, 'Incident Bot', 'TypeScript + Slack API', '2022-09-01', '2022-12-01', NULL, 'Automated incident triage and escalation workflows.', 2),
    -- Resume 1: Education
    (5, 4, 'B.S. Computer Science', 'Boise State University', '2015-08-15', '2019-05-10', 'Boise, ID', NULL, 1),

    -- Resume 2: Summary
    (6, 5, 'Profile', NULL, NULL, NULL, NULL, 'Full stack engineer shipping customer-facing features from concept to production.', 1),
    -- Resume 2: Experience
    (7, 6, 'Product Engineer', 'Acorn Health Tech', '2021-04-01', NULL, 'Denver, CO', 'Owned onboarding flow, billing UI, and experimentation framework.', 1),
    (8, 6, 'Frontend Engineer', 'Studio Orbit', '2018-07-01', '2021-03-31', 'Austin, TX', 'Built and maintained design system consumed across three products.', 2),
    -- Resume 2: Projects
    (9, 7, 'A/B Testing Dashboard', 'SvelteKit + Postgres', '2024-02-01', '2024-05-01', NULL, 'Created experiment analytics dashboard used by product and growth teams.', 1),
    (10, 7, 'Checkout Redesign', 'React + Stripe', '2023-06-01', '2023-11-01', NULL, 'Improved conversion through multi-step checkout and robust validation.', 2),

    -- Resume 3: Experience
    (11, 9, 'Senior Data Engineer', 'Helios Retail', '2020-01-01', NULL, 'Seattle, WA', 'Managed ELT platform and dimensional models for finance and operations.', 1),
    (12, 9, 'Analytics Engineer', 'Blue Harbor', '2017-05-01', '2019-12-31', 'Portland, OR', 'Developed dbt models and reporting definitions for business teams.', 2),
    -- Resume 3: Certifications
    (13, 10, 'Google Cloud Professional Data Engineer', 'Google Cloud', '2021-09-01', NULL, NULL, NULL, 1),
    (14, 10, 'dbt Analytics Engineering Certification', 'dbt Labs', '2022-11-01', NULL, NULL, NULL, 2),
    -- Resume 3: Projects
    (15, 11, 'Customer 360 Model', 'dbt + BigQuery', '2023-03-01', '2023-10-01', NULL, 'Unified customer entities and attribution logic for lifecycle analytics.', 1),
    (16, 11, 'Pipeline Cost Optimizer', 'Airflow + Python', '2024-01-01', '2024-04-01', NULL, 'Reduced warehouse compute spend by reworking schedule and partitioning.', 2),
    -- Resume 3: Education
    (17, 12, 'B.S. Information Systems', 'University of Oregon', '2013-09-15', '2017-06-15', 'Eugene, OR', NULL, 1);

INSERT INTO "BULLET_POINT" (id, sectionId, content, "order")
VALUES
    -- Resume 1: Experience bullets
    (1, 1, 'Reduced p95 API latency by 38 percent by introducing query caching and connection pooling.', 1),
    (2, 1, 'Cut production incidents by 45 percent via service-level objectives and on-call runbooks.', 2),
    (3, 1, 'Mentored 4 junior engineers through weekly design and code review sessions.', 3),
    -- Resume 1: Skills bullets
    (4, 3, 'Go, TypeScript, Node.js, PostgreSQL, Redis', 1),
    (5, 3, 'Docker, Kubernetes, Terraform, AWS, CI/CD', 2),
    (6, 3, 'System design, observability, incident response', 3),

    -- Resume 2: Experience bullets
    (7, 6, 'Increased onboarding completion by 22 percent after redesigning the first-run experience.', 1),
    (8, 6, 'Implemented feature flagging strategy that reduced risky releases and rollback time.', 2),
    -- Resume 2: Skills bullets
    (9, 8, 'SvelteKit, React, TypeScript, Tailwind, Vitest', 1),
    (10, 8, 'REST APIs, accessibility, analytics instrumentation', 2),
    (11, 8, 'Product discovery, experimentation, stakeholder communication', 3),

    -- Resume 3: Experience bullets
    (12, 9, 'Migrated 120+ scheduled jobs to Airflow with lineage tracking and alerting.', 1),
    (13, 9, 'Improved dashboard trust by adding data quality tests across critical marts.', 2),
    -- Resume 3: Projects bullets
    (14, 11, 'Implemented incremental models to shrink daily processing windows by 60 percent.', 1),
    (15, 11, 'Standardized metric definitions used by BI and experimentation pipelines.', 2);
