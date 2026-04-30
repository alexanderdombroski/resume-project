# Feature Specification: Resume Viewer & Formatting

**Feature Branch**: `002-resume-viewer`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "add documentation for the resume viewer feature: The webpage will show the resume and the user can customize whitespace preferences and format. The site will use print styles so it can be edited and printed directly from the website."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Print Preview (Priority: P1)

As a job seeker, I want to see my resume exactly as it will appear when printed, so that I can ensure the layout fits perfectly on a single page.

**Why this priority**: The core requirement is "print styles". Users need high confidence that the web view matches the physical output.

**Independent Test**: Can be tested by comparing the screen view with the browser's "Print Preview" (Ctrl+P) and verifying 1:1 visual parity.

**Acceptance Scenarios**:

1. **Given** a resume with content, **When** viewed on the site, **Then** it is rendered within a fixed-width container mimicking A4/Letter paper dimensions.
2. **Given** a visible resume, **When** the user triggers the browser print command, **Then** all UI elements (buttons, navigation) are hidden, leaving only the resume content.

---

### User Story 2 - Whitespace & Formatting Controls (Priority: P1)

As a job seeker, I want to adjust margins, line spacing, and font sizes through a simple interface, so that I can optimize the use of space without manually editing CSS.

**Why this priority**: Users often need to "squeeze" content to fit one page or "stretch" it to fill white space.

**Independent Test**: Can be tested by changing a margin slider and observing the resume content shifting in real-time.

**Acceptance Scenarios**:

1. **Given** the viewer, **When** the user changes "Section Spacing", **Then** the gaps between experience entries increase/decrease immediately.
2. **Given** the viewer, **When** the user selects a different "Font Theme", **Then** the typography of the entire resume updates instantly.

---

### User Story 3 - Direct Content Editing (Priority: P2)

As a job seeker, I want to make minor text edits directly on the viewer page, so that I don't have to navigate back to a "Master Resume" form for small tweaks.

**Why this priority**: Streamlines the final "polishing" phase of resume creation.

**Independent Test**: Can be tested by clicking a bullet point, typing new text, and verifying the change is saved.

**Acceptance Scenarios**:

1. **Given** a rendered resume, **When** the user clicks on a job description, **Then** the text becomes editable in-place.
2. **Given** an edited field, **When** the user clicks away, **Then** the changes are persisted to that specific tailored version.

---

### Edge Cases

- **Overflow**: What happens when the user's content exceeds one page? Should the system warn them or automatically shrink fonts?
- **Mobile Printing**: How does the "print-ready" view handle narrow mobile screens?
- **Browser Print Limitations**: How do we handle browsers that inject headers/footers (dates, URLs) by default during printing?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Print View" container with standard paper dimensions (A4/Letter).
- **FR-002**: System MUST use CSS @media print styles to remove all non-resume web elements (menus, sidebars) during printing.
- **FR-003**: System MUST provide controls for: Page Margins, Section Spacing, Line Height, and Font Size.
- **FR-004**: System MUST provide a combination of formatting sliders (margins, spacing) and layout presets, starting with one standard "Professional" preset in v1.
- **FR-005**: System MUST allow inline editing of resume content directly on the "paper" preview.
- **FR-006**: System MUST rely on the browser's native print engine and "Save as PDF" functionality for document generation.
- **FR-008**: System MUST detect and warn the user if the current content and formatting selections exceed the boundaries of a single page when printing.
- **FR-007**: System MUST allow users to toggle between different font pairings (Serif vs Sans-Serif).

### Key Entities *(include if feature involves data)*

- **Formatting Profile**: A set of user preferences for margins, fonts, and spacing.
- **Resume Layout**: The visual arrangement of resume sections.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The printed output matches the on-screen preview with >98% visual accuracy (no unexpected page breaks).
- **SC-002**: Users can toggle between 3 different "Layout Formats" with a single click.
- **SC-003**: Formatting changes (e.g. margin adjustments) reflect on screen in under 200ms.

## Assumptions

- **Single Page Bias**: Most users aim for a 1-page resume; the system will prioritize optimizing for this constraint.
- **Browser Support**: Modern Evergreen browsers (Chrome, Firefox, Safari) are the target for print style reliability.
- **Data Source**: This feature assumes a "Tailored Resume" object already exists with content to display.
