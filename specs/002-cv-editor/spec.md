# Feature Specification: Master CV Editor

**Feature Branch**: `002-cv-editor`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "create a new spec for `master resume cv editor`. This is the core structured CV editor and acts as the single source of truth for all resume data. The master CV editor should allow users to build and maintain a structured career database including: - Work experience entries - Education history - Skills list - Projects and achievements - Optional sections (certifications, awards, etc.) Editing experience: - Double click fields to edit using rich text editing - Ability to reorder sections and entries - Section-level formatting controls (spacing, layout density) - Recommended font selection at the document level - Not using autosave for now This editor is NOT a resume layout tool. It stores canonical structured data that downstream resume variations will use."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintain Career Database (Priority: P1)

As a professional, I want to record and manage my entire career history in one structured place so that I have a single source of truth for all my resume data.

**Why this priority**: This is the core purpose of the feature. Without the ability to store and manage data, the editor has no value.

**Independent Test**: User can add, edit, and delete entries for Work Experience, Education, and Skills, and see them reflected in the master list.

**Acceptance Scenarios**:

1. **Given** an empty master CV, **When** I add a Work Experience entry with job title and company, **Then** it is saved and appears in the list.
2. **Given** an existing entry, **When** I double-click a field, **Then** it becomes editable with rich text controls.
3. **Given** multiple entries, **When** I use the reorder mechanism, **Then** the sequence of entries is updated according to my preference.

---

### User Story 2 - Section Management and Formatting (Priority: P2)

As a user, I want to organize my CV sections and control their basic formatting so that the structured data is presented in a logical and readable way.

**Why this priority**: Presentation and organization are key to managing a large career database effectively.

**Independent Test**: User can reorder top-level sections (e.g., move Skills above Education) and adjust section spacing.

**Acceptance Scenarios**:

1. **Given** a CV with multiple sections, **When** I drag a section to a new position, **Then** the entire section and its contents move accordingly.
2. **Given** a section, **When** I adjust its "layout density" setting, **Then** the vertical spacing between entries in that section changes.
3. **Given** a need for a specific section (e.g., Certifications), **When** I add an "Optional Section", **Then** I can choose the section type and add entries to it.

---

### User Story 3 - Document-Level Styling (Priority: P3)

As a user, I want to select a global font for my master CV so that it has a consistent and professional look during the editing process.

**Why this priority**: Consistent styling improves the editing experience and helps visualize the final data.

**Independent Test**: User selects a font from a recommended list and the entire document updates to use that font.

**Acceptance Scenarios**:

1. **Given** the editor, **When** I select "Roboto" from the font selection menu, **Then** all text in the CV editor is rendered in Roboto.

---

### Edge Cases

- **Large Datasets**: How does the editor handle a user with 50+ work experience entries? (Expected: Smooth scrolling and performant reordering).
- **Manual Save Failure**: What happens if the network fails when the user clicks "Save"? (Expected: Error message informing the user that changes were not saved and providing an option to retry).
- **Complex Rich Text**: What happens if a user tries to paste complex HTML or images into a field? (Expected: Strip unsupported formatting/content and keep only basic text formatting).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a structured interface to manage Work Experience, Education, Skills, and Projects.
- **FR-002**: System MUST allow users to add "Optional Sections" such as Certifications and Awards.
- **FR-003**: System MUST support double-click to edit for all text fields within entries.
- **FR-004**: System MUST provide rich text editing controls (Bold, Italic, Lists) for multi-line fields (e.g., job descriptions).
- **FR-005**: System MUST allow manual reordering of sections and individual entries within sections.
- **FR-006**: System MUST provide section-level controls for spacing and layout density (e.g., Compact, Normal, Spacious).
- **FR-007**: System MUST allow document-wide font selection from a curated list of professional fonts.
- **FR-008**: System MUST NOT use autosave; changes are only persisted when the user explicitly clicks a "Save" button.
- **FR-009**: System MUST ensure that the data stored is structured (canonical) and independent of any specific resume layout or template.

### Key Entities *(include if feature involves data)*

- **Master CV**: The root entity representing the user's career database.
- **Section**: A top-level container (e.g., "Work Experience", "Skills"). Attributes: Title, Type, Order, Formatting Settings.
- **Entry**: A single data point within a section (e.g., a specific job). Attributes: Fields (mapped to section type), Order, Content (Rich Text).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new work experience entry and save it in under 30 seconds.
- **SC-002**: Reordering a section or entry is reflected in the UI instantly (under 100ms).
- **SC-003**: The system correctly strips non-supported rich text elements (like images or tables) on save while preserving basic formatting.
- **SC-004**: Users are warned if they attempt to navigate away from the editor with unsaved changes.

## Assumptions

- **Data Persistence**: A backend API exists or will be created to store and retrieve the structured CV data.
- **Rich Text Scope**: Only basic formatting (Bold, Italic, Bullets) is required for the "Master CV" phase.
- **Section Types**: Optional sections will use a set of predefined templates (e.g., "List", "Title/Date/Description").
- **Font List**: The initial "recommended" list will include common web-safe and professional fonts like Arial, Roboto, and Times New Roman.
