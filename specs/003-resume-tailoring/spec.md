# Feature Specification: Resume Tailoring Editor

**Feature Branch**: `003-resume-tailoring`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "create a new spec for `resume tailoring editor`. This page allows users to generate and customize resume variations from their master CV. Each tailored resume is a derived version of the master CV optimized for a specific job or purpose. Features: - Selectively include or exclude experiences, skills, and projects from the master CV - Rearrange sections for emphasis - Light inline editing that does not modify the master CV - Ability to create multiple tailored versions of the same master resume - Versioning of tailored resumes - Optional naming per tailored resume (e.g. "Frontend Engineer Application") This editor should clearly distinguish between: - Master CV data (read-only source) - Tailored resume modifications (local to this version only) **Update**: include visual indicator of page fit (e.g. whether content exceeds one page, two pages, etc.)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Tailored Variation (Priority: P1)

As a job seeker, I want to create a specific version of my resume for a particular job application so that I can highlight the most relevant information without losing my master data.

**Why this priority**: Core functionality of the feature. This is the primary value proposition of the "tailoring" concept.

**Independent Test**: User can initiate a "New Tailored Resume" from a master CV, name it, and save it as a separate entity.

**Acceptance Scenarios**:

1. **Given** a master CV, **When** I choose to create a tailored version, **Then** a new editable instance is created with a unique name (e.g., "Software Engineer - Google").
2. **Given** a tailored resume, **When** I view my list of resumes, **Then** I see the tailored version distinct from the master CV.

---

### User Story 2 - Selectively Include/Exclude Content (Priority: P1)

As a user, I want to toggle the visibility of specific experiences, skills, or projects so that my tailored resume is focused on the job requirements.

**Why this priority**: Essential for the "tailoring" process; allows users to filter out irrelevant details.

**Independent Test**: User toggles an item off in the tailoring editor and verifies it is hidden in the preview/saved version.

**Acceptance Scenarios**:

1. **Given** a tailored resume editor, **When** I uncheck a "Work Experience" entry from the master CV, **Then** it is hidden from the tailored version.
2. **Given** a hidden entry, **When** I re-check it, **Then** it reappears in its original relative position (or end of section).

---

### User Story 3 - Rearrange for Emphasis (Priority: P2)

As a user, I want to change the order of sections and entries in my tailored resume so that my most impressive qualifications appear first.

**Why this priority**: Important for optimizing the impact of the resume for specific roles.

**Independent Test**: User moves the "Skills" section above "Work Experience" and saves the tailored version.

**Acceptance Scenarios**:

1. **Given** the tailoring editor, **When** I drag the "Projects" section to the top, **Then** the layout of this specific tailored resume is updated.
2. **Given** rearranged sections in a tailored resume, **When** I view the master CV, **Then** the master CV's order remains unchanged.

---

### User Story 4 - Light Inline Overrides (Priority: P2)

As a user, I want to make minor tweaks to bullet points or descriptions in a tailored version without changing the master source.

**Why this priority**: Allows for fine-tuning wording (e.g., using keywords from a job description) for a specific application.

**Independent Test**: User edits a bullet point in the tailoring editor, saves, and verifies the master CV still has the original text.

**Acceptance Scenarios**:

1. **Given** a tailored resume, **When** I edit a field's text, **Then** the change is saved only to that version.
2. **Given** an edited field in a tailored resume, **When** I revert or "reset" the field, **Then** it pulls the latest text from the master CV.

---

### User Story 5 - Monitor Page Fit (Priority: P2)

As a user, I want to see a visual indicator of how much space my resume content takes up so that I can ensure it fits within a desired number of pages (e.g., one or two pages).

**Why this priority**: Resume length is a critical factor in job applications; users need real-time feedback to decide what to include or exclude to hit a specific page count.

**Independent Test**: User adds or removes content and observes the page fit indicator updating to reflect the current page count.

**Acceptance Scenarios**:

1. **Given** the tailoring editor, **When** I add enough content to exceed one page, **Then** a visual indicator clearly shows that the content has moved onto a second page.
2. **Given** content that is slightly over one page, **When** I exclude an entry, **Then** the indicator updates to show that the content now fits within one page.

---

### Edge Cases

- **Master CV Updates**: What happens to a tailored resume when the Master CV is updated? (Expected: Tailored version retains its overrides but prompts the user if they want to sync new master entries).
- **Deletion of Master Entry**: How does the system handle a tailored resume that references a master entry that has been deleted? (Expected: The entry is removed from the tailored version or marked as "orphaned").
- **Multiple Versions of Same Name**: How does the system handle naming conflicts? (Expected: Append a number or timestamp to ensure uniqueness).
- **Font/Spacing impact on Page Fit**: How does the system handle page fit if the user changes layout settings in the Master CV? (Expected: The indicator in the tailoring editor should reflect the latest layout settings applied to the tailored version).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create multiple "Tailored Resumes" derived from a single "Master CV".
- **FR-002**: System MUST provide a toggle to include/exclude any section or entry from the master CV.
- **FR-003**: System MUST support reordering of sections and entries specifically for the tailored version.
- **FR-004**: System MUST allow inline editing of text fields as "overrides" that do not affect the Master CV.
- **FR-005**: System MUST provide a clear visual distinction between data sourced from the Master CV and local overrides.
- **FR-006**: System MUST support naming each tailored resume.
- **FR-007**: System MUST maintain a version history (or simple "Save as new version" capability) for tailored resumes.
- **FR-008**: System MUST allow users to "Reset to Master" for any specific entry or the entire tailored resume.
- **FR-009**: System MUST provide a real-time visual indicator showing the current page count and "page fit" of the tailored resume content.

### Key Entities *(include if feature involves data)*

- **Tailored Resume**: A derived version of a CV. Attributes: Name, Master CV Link, Order/Visibility Settings (Map), Field Overrides (Map), Version Number.
- **Field Override**: A specific text change for a field in a tailored resume.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new tailored version and exclude 3 items in under 60 seconds.
- **SC-002**: Zero modifications to the Master CV occur when editing a tailored resume.
- **SC-003**: Tailored resumes load within 500ms, including the resolution of master data and local overrides.
- **SC-004**: Users can successfully "Reset" an overridden field to its master value with a single click.
- **SC-005**: The page fit indicator updates within 200ms of any content visibility or override change.

## Assumptions

- **Master CV Dependency**: A tailored resume cannot exist without a link to a Master CV.
- **Read-Only Master**: The tailoring editor interface will explicitly treat Master CV data as read-only, only allowing "overrides" to be saved.
- **Simple Versioning**: Versioning initially refers to saved snapshots or duplicates, not a full git-like diff system.
- **No Global Sync**: Changes made in a tailored resume never propagate back to the Master CV.
- **Page Calculation**: The system assumes a standard A4 or Letter page size for the fit indicator calculation.
