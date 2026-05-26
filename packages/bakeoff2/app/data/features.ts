export type FeatureStatus = 'coming-soon' | 'in-development' | 'far-future';

export type FeatureItem = {
  slug: string;
  title: string;
  status: FeatureStatus;
  summary: string;
  details: string[];
};

export const features: FeatureItem[] = [
  {
    slug: 'career-data-layer',
    title: 'Career Data Layer',
    status: 'in-development',
    summary: 'Store career facts once and assemble targeted resumes from structured data.',
    details: [
      'Central profile for contact info, summary, skills, education, certifications, and publications.',
      'Rich experience entries including responsibilities, achievements, metrics, keywords, and project context.',
      'Resume output generated from reusable career data instead of rewriting per application.',
    ],
  },
  {
    slug: 'resume-builder-tailoring-engine',
    title: 'Resume Builder / Tailoring Engine',
    status: 'in-development',
    summary: 'Create and tailor resume variants quickly from your CV database.',
    details: [
      'Create resumes from saved career data with section-level control.',
      'Instantly include/exclude bullets and reorder sections.',
      'Swap summaries, skills, and page-length variants by company or role.',
    ],
  },
  {
    slug: 'job-targeting-system',
    title: 'Job Targeting System',
    status: 'far-future',
    summary: 'Ingest job postings and recommend targeted resume changes.',
    details: [
      'Supports pasted descriptions and imported posting URLs.',
      'Extract required and preferred skills, responsibilities, ATS phrases, and seniority signals.',
      'Suggest missing keywords, summary rewrites, and relevant bullets to prioritize.',
    ],
  },
  {
    slug: 'double-click-inline-editing',
    title: 'Double-click Inline Editing',
    status: 'coming-soon',
    summary: 'Direct, in-place editing for faster iteration in resume sections.',
    details: [
      'Edit text where it appears without opening separate modal workflows.',
      'Reduce context switching while revising bullets and section copy.',
    ],
  },
  {
    slug: 'rich-text-editing',
    title: 'Rich Text Editing',
    status: 'in-development',
    summary: 'Format and refine resume content with richer text controls.',
    details: [
      'Supports nuanced content updates beyond plain text entry.',
      'Designed to preserve clean, professional export formatting.',
    ],
  },
  {
    slug: 'drag-reorder-sections',
    title: 'Drag Reorder Sections',
    status: 'coming-soon',
    summary: 'Rearrange resume structure quickly with drag-and-drop controls.',
    details: [
      'Change section order based on each job target.',
      'Make structural adjustments without rewriting content.',
    ],
  },
  {
    slug: 'undo-redo',
    title: 'Undo / Redo',
    status: 'coming-soon',
    summary: 'Safe editing workflow with fast change reversal.',
    details: [
      'Undo accidental edits and redo intentional updates.',
      'Encourages experimentation while preserving control.',
    ],
  },
  {
    slug: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    status: 'coming-soon',
    summary: 'Power-user controls for faster editing and navigation.',
    details: [
      'Reduce mouse-heavy interactions in common editing flows.',
      'Accelerate repetitive actions for high-volume tailoring.',
    ],
  },
  {
    slug: 'live-preview',
    title: 'Live Preview',
    status: 'in-development',
    summary: 'See how content changes affect final presentation instantly.',
    details: [
      'Preview output while editing content and structure.',
      'Reduce export-revise loops during finalization.',
    ],
  },
  {
    slug: 'zoom-modes',
    title: 'Zoom Modes',
    status: 'far-future',
    summary: 'Scale workspace and preview for dense or detailed edits.',
    details: [
      'Support multiple zoom levels for layout checks.',
      'Improve readability across large and compact displays.',
    ],
  },
  {
    slug: 'responsive-editing',
    title: 'Desktop + Mobile Responsive Editing',
    status: 'in-development',
    summary: 'Edit resumes reliably across desktop and mobile viewports.',
    details: [
      'Adapt workspace interactions to smaller screens.',
      'Maintain editing clarity without sacrificing controls.',
    ],
  },
  {
    slug: 'bullet-strength-suggestions',
    title: 'Bullet Strength Suggestions',
    status: 'far-future',
    summary: 'Identify weak bullets and recommend stronger phrasing patterns.',
    details: [
      'Highlight opportunities for higher-impact language.',
      'Guide users toward clearer, outcome-oriented writing.',
    ],
  },
  {
    slug: 'passive-voice-detection',
    title: 'Passive Voice Detection',
    status: 'far-future',
    summary: 'Flag passive phrasing that weakens resume impact.',
    details: [
      'Encourage direct, active voice in bullets and summaries.',
      'Improve readability and confidence of final copy.',
    ],
  },
  {
    slug: 'weak-verb-detection',
    title: 'Weak Verb Detection',
    status: 'far-future',
    summary: 'Detect low-impact verbs and suggest stronger alternatives.',
    details: [
      'Spot generic phrasing in repetitive bullet patterns.',
      'Promote action-focused language tailored to outcomes.',
    ],
  },
  {
    slug: 'quantify-achievements-prompts',
    title: 'Quantify Achievements Prompts',
    status: 'far-future',
    summary: 'Prompt users to add metrics and measurable outcomes.',
    details: [
      'Help convert responsibilities into quantifiable achievements.',
      'Encourage stronger evidence in hiring-facing content.',
    ],
  },
  {
    slug: 'grammar-and-spelling-checks',
    title: 'Grammar and Spelling Checks',
    status: 'coming-soon',
    summary: 'Catch writing errors before exporting resumes.',
    details: [
      'Spot common grammar and spelling mistakes in editor flow.',
      'Improve polish before sharing with recruiters.',
    ],
  },
  {
    slug: 'print-to-pdf-export',
    title: 'Print-to-PDF Export',
    status: 'in-development',
    summary: 'Export resumes to PDF using browser print styles.',
    details: [
      'Use print-first styling to generate recruiter-ready PDFs.',
      'Preserve layout fidelity for common application workflows.',
    ],
  },
  {
    slug: 'resume-height-indicator',
    title: 'Resume Height Indicator',
    status: 'coming-soon',
    summary: 'Show whether output fits expected one-page or two-page bounds.',
    details: [
      'Measure printed layout against physical page constraints.',
      'Warn when content overflows target document length.',
    ],
  },
  {
    slug: 'oauth-account-linking',
    title: 'OAuth Account Linking',
    status: 'coming-soon',
    summary: 'Associate resumes with authenticated user accounts.',
    details: [
      'Provide secure ownership of resume collections.',
      'Enable persistent user-specific resume management.',
    ],
  },
  {
    slug: 'resume-templates',
    title: 'Resume Templates',
    status: 'far-future',
    summary: 'Save and reuse layout and style presets across resumes.',
    details: [
      'Create template baselines for different job families.',
      'Apply consistent visual structure across versions.',
    ],
  },
  {
    slug: 'markdown-export',
    title: 'Markdown Export',
    status: 'far-future',
    summary: 'Export resume content in Markdown format.',
    details: [
      'Enable text-first workflows and version control compatibility.',
      'Support publishing or conversion pipelines.',
    ],
  },
  {
    slug: 'docx-export',
    title: 'DOCX Export',
    status: 'far-future',
    summary: 'Generate downloadable DOCX resume files.',
    details: [
      'Offer editable document output for external collaboration.',
      'Support employer workflows that prefer Word documents.',
    ],
  },
  {
    slug: 'html-export',
    title: 'HTML Export',
    status: 'far-future',
    summary: 'Publish shareable HTML versions of resumes.',
    details: [
      'Create web-viewable resume pages for quick sharing.',
      'Enable personal hosted resume experiences.',
    ],
  },
  {
    slug: 'import-from-linkedin',
    title: 'Import Bullets from LinkedIn',
    status: 'far-future',
    summary: 'Bootstrap resume drafts by importing profile data.',
    details: [
      'Pull experience bullets as a starting point for editing.',
      'Reduce first-draft setup effort for new users.',
    ],
  },
  {
    slug: 'shared-team-editing',
    title: 'Shared Team Editing',
    status: 'far-future',
    summary: 'Enable collaborative editing for coaches and recruiters.',
    details: [
      'Support multi-user access for feedback and iteration.',
      'Enable shared workflows for career support teams.',
    ],
  },
];

export function getFeatureBySlug(slug: string) {
  return features.find((feature) => feature.slug === slug);
}

export function featureStatusLabel(status: FeatureStatus) {
  if (status === 'in-development') return 'In Development';
  if (status === 'coming-soon') return 'Coming Soon';
  return 'Far Future';
}
