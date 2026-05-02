# Feature Specification: Resume Viewer

**Feature Branch**: `004-resume-viewer`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "create a new spec for `resume viewer`. This page is responsible for previewing, printing, and exporting resumes. It renders a resume in a print-accurate layout and ensures it matches final PDF output. Features: - Print-accurate resume preview using print styles - Export to PDF via browser print functionality - Layout density controls (spacing between sections) - Font rendering preview (must match printed output exactly) This page is read-only and does not allow content editing beyond layout adjustments for export formatting."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Print-Accurate Preview (Priority: P1)

As a job seeker, I want to see an exact preview of how my resume will look when printed or saved as a PDF so that I can ensure the formatting is perfect before sending it to employers.

**Why this priority**: Core functionality of the viewer. Users need confidence that the digital preview matches the physical or exported output.

**Independent Test**: User opens the viewer and sees a rendered resume that visually matches the output produced by the browser's "Print to PDF" function.

**Acceptance Scenarios**:

1. **Given** a finished resume, **When** I open the Resume Viewer, **Then** the layout is presented in a page-based format (e.g., A4 or Letter).
2. **Given** a multi-page resume, **When** I scroll through the viewer, **Then** page breaks are clearly indicated and correspond to where they will occur in the final PDF.

---

### User Story 2 - Export to PDF (Priority: P1)

As a user, I want to export my resume to a high-quality PDF file so that I can upload it to job portals or send it via email.

**Why this priority**: Essential for the actual use of the resume in the real world.

**Independent Test**: User clicks "Export" or "Print" and successfully receives a PDF file that preserves all layout, fonts, and styling from the preview.

**Acceptance Scenarios**:

1. **Given** the viewer, **When** I click the "Print/Export" button, **Then** the browser's print dialog opens with the resume correctly formatted for PDF output.
2. **Given** the exported PDF, **When** opened in a PDF reader, **Then** all links and text remain searchable and correctly rendered.

---

### User Story 3 - Adjust Layout Density (Priority: P2)

As a user, I want to adjust the spacing between sections in the viewer so that I can optimize the fit of my content on the page(s) without editing the content itself.

**Why this priority**: Allows for fine-tuning the visual "weight" and fit of the resume without modifying the canonical data.

**Independent Test**: User adjusts a "Density" or "Spacing" slider and observes the sections moving closer together or further apart in real-time.

**Acceptance Scenarios**:

1. **Given** a resume that slightly exceeds one page, **When** I decrease the "Layout Density", **Then** the sections contract and the content fits on a single page.
2. **Given** a dense resume, **When** I increase the density, **Then** white space between sections increases, improving readability.

---

### User Story 4 - High-Fidelity Font Preview (Priority: P3)

As a user, I want the fonts in the preview to render exactly as they will in the PDF so that there are no surprises with character spacing or line breaks in the final document.

**Why this priority**: Ensures total visual fidelity and prevents layout shifts between the web view and the PDF.

**Independent Test**: Overlaying a screenshot of the preview with the exported PDF shows identical text positioning.

**Acceptance Scenarios**:

1. **Given** a selected professional font, **When** viewed in the editor, **Then** line wraps occur at the exact same words as they do in the exported PDF.

---

### Edge Cases

- **Broken Images/Avatars**: How does the viewer handle a missing user avatar? (Expected: Graceful fallback to a placeholder that doesn't break the layout).
- **Extremely Long Content**: What happens if a single section entry is longer than a whole page? (Expected: Clean split across pages or a warning to the user).
- **Unsupported Fonts**: How does the viewer handle fonts that might not be available on the user's system during PDF generation? (Expected: Use of embedded web fonts to ensure consistency across all devices).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the resume using CSS print media queries to ensure a "What You See Is What You Get" (WYSIWYG) experience.
- **FR-002**: System MUST provide a mechanism to trigger the browser's print functionality for PDF export.
- **FR-003**: System MUST include controls to adjust global section spacing (layout density) without modifying the source CV data.
- **FR-004**: System MUST ensure the viewer is read-only; no text editing or content removal is permitted on this page.
- **FR-005**: System MUST use identical font-face declarations for both the web preview and the print output.
- **FR-006**: System MUST support standard page sizes (A4, Letter) as the basis for the preview container.
- **FR-007**: System MUST provide a toggle or slider for layout density (e.g., Compact, Normal, Relaxed).

### Key Entities *(include if feature involves data)*

- **Resume Preview**: A read-only representation of a Master or Tailored CV.
- **Layout Configuration**: Temporary settings for the viewer session (Density, Font Size Scale).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The digital preview and the exported PDF must have 100% visual parity (layout, fonts, spacing).
- **SC-002**: Users can trigger a PDF export in under 2 clicks from the viewer page.
- **SC-003**: Layout density adjustments must be reflected in the preview in under 100ms.
- **SC-004**: The viewer must load and render a 2-page resume in under 750ms.

## Assumptions

- **Browser Capability**: The system relies on modern browser print-to-PDF capabilities rather than a server-side PDF engine for v1.
- **CSS-Based Layout**: Layout is controlled via standard CSS (Flexbox/Grid) with print-specific overrides.
- **No Persistence**: Layout density adjustments made in the viewer are for export formatting only and are not saved back to the CV entity unless explicitly specified in future updates.
