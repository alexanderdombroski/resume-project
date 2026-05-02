# Feature Specification: Navigation Dashboard

**Feature Branch**: `005-navigation-dashboard`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "create a new spec for `navigation dashboard`. This is the main entry point of the application and provides an overview of all resumes. It functions as a resume library. Features: - Grid view of all resumes (master CV and tailored resumes) - Clear visual distinction between: - Master CV (primary source document) - Tailored resumes (derived versions) - Actions per resume: - Open editor - Rename - Duplicate - Delete - Export (shortcut to viewer) - Create new resume / create new tailored version from master CV - Basic status indicators (e.g. draft, ready for export) This page is focused on navigation and organization, not editing content."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Resume Library (Priority: P1)

As a user, I want to see all my resumes in a single dashboard so that I can easily navigate between my master career data and my specific job applications.

**Why this priority**: This is the central hub of the application. Without it, users cannot access or organize their work.

**Independent Test**: User logs in and sees a grid of their existing resumes, correctly categorized.

**Acceptance Scenarios**:

1. **Given** a user with one Master CV and two Tailored Resumes, **When** they view the dashboard, **Then** all three items are displayed in a grid view.
2. **Given** the dashboard grid, **Then** the Master CV is visually distinguished from the Tailored Resumes (e.g., different border, badge, or separate section).

---

### User Story 2 - Quick Resume Actions (Priority: P1)

As a user, I want to perform common tasks like duplicating or deleting resumes directly from the dashboard so that I can manage my library efficiently.

**Why this priority**: Core management functions that allow for rapid iteration on resume versions.

**Independent Test**: User clicks an action (e.g., Duplicate) on a resume card and verifies the result in the grid.

**Acceptance Scenarios**:

1. **Given** a resume card, **When** I select "Duplicate", **Then** a new copy appears in the grid with "(Copy)" appended to the name.
2. **Given** a resume card, **When** I select "Delete" and confirm, **Then** the resume is removed from the grid.
3. **Given** a resume card, **When** I select "Rename", **Then** I can edit the name directly or in a modal.

---

### User Story 3 - Rapid Tailoring Entry (Priority: P2)

As a user, I want to create a new tailored version of my Master CV directly from the dashboard so that I can quickly start customizing a resume for a new job lead.

**Why this priority**: Streamlines the primary workflow of the application (creating variations from a master).

**Independent Test**: User clicks "Create Tailored Version" on the Master CV card and is taken to the tailoring editor.

**Acceptance Scenarios**:

1. **Given** the Master CV card, **When** I click "Create Tailored Version", **Then** a new tailored resume is initialized and the editor opens.

---

### User Story 4 - Status Overview (Priority: P3)

As a user, I want to see the status of each resume (e.g., "Draft" or "Ready") at a glance so that I know which ones require more work before they are ready for use.

**Why this priority**: Provides useful metadata that helps users track their progress across multiple applications.

**Independent Test**: Resume cards display visible status badges.

**Acceptance Scenarios**:

1. **Given** a resume that was recently edited, **Then** its card displays a "Draft" status indicator.
2. **Given** a resume that meets export criteria, **Then** its card displays a "Ready for Export" status indicator.

---

### Edge Cases

- **Empty State**: What does the dashboard look like when a user has no resumes? (Expected: Call to action to "Create your first Master CV").
- **Large Library**: How does the grid handle 20+ resumes? (Expected: Responsive grid with pagination or lazy loading).
- **Naming Conflicts**: What happens if a user renames a resume to a name that already exists? (Expected: Validation error or automatic suffixing).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a grid-based dashboard view showing all user resumes.
- **FR-002**: System MUST clearly distinguish between the "Master CV" and "Tailored Resumes" using visual cues.
- **FR-003**: System MUST support "Open Editor", "Rename", "Duplicate", "Delete", and "Export" actions for each resume.
- **FR-004**: System MUST allow creating a new Master CV if none exists.
- **FR-005**: System MUST allow creating a new Tailored Resume derived from an existing Master CV.
- **FR-006**: System MUST display basic status indicators (e.g., Draft, Ready) on each resume card.
- **FR-007**: System MUST provide a shortcut to the "Resume Viewer" via the "Export" action.
- **FR-008**: System MUST prevent editing resume content directly on the dashboard page.

### Key Entities *(include if feature involves data)*

- **Resume Library**: The collection of all Resume entities (Master and Tailored) belonging to a user.
- **Resume Card**: The UI representation of a single resume on the dashboard.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate from the dashboard to any resume editor in under 2 clicks.
- **SC-002**: Duplicating a resume takes less than 2 seconds to reflect in the UI.
- **SC-003**: 100% of resumes are correctly categorized as either "Master" or "Tailored" in the grid view.
- **SC-004**: Users report that they can distinguish between resume types in under 1 second of viewing the dashboard.

## Assumptions

- **Existing Data**: Assumes a backend service exists to fetch the list of resumes and their metadata.
- **No Search/Filter**: Search and filtering functionality are out of scope for the initial version of the dashboard.
- **Thumbnail Preview**: Resume cards may show a small visual preview, but this is an aesthetic choice and not a strict requirement for the first iteration.
