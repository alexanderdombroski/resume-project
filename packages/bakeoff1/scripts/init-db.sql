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