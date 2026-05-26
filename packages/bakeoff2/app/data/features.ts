export type FeatureStatus = 'coming-soon' | 'in-development' | 'far-future';

export type FeatureItem = {
  slug: string;
  title: string;
  status: FeatureStatus;
  summary: string;
  access: 'free' | 'paid';
  explanation: string[];
  details: string[];
};

export const features: FeatureItem[] = [
  {
    slug: 'career-data-layer',
    title: 'Career Data Layer',
    status: 'in-development',
    summary: 'Store career facts once and assemble targeted resumes from structured data.',
    access: 'free',
    explanation: [
      'This feature turns your resume workflow into a reusable data system. Instead of rewriting achievements for every role, you maintain one source of truth for your experience, skills, and supporting context.',
      'From there, targeted resumes are assembled with the right slices of your background. That should reduce repetitive editing and make it easier to keep content accurate across all versions.',
    ],
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
    access: 'free',
    explanation: [
      'The tailoring engine is focused on speed and control when adapting a resume to a specific posting. You can quickly switch summaries, reorder sections, and tune which bullets are shown.',
      'Its goal is to keep customization lightweight so each application can be targeted without creating formatting debt or maintaining many disconnected documents.',
    ],
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
    access: 'paid',
    explanation: [
      'This system analyzes job descriptions and identifies what matters most for a target role, including required skills, language patterns, and expected responsibilities.',
      'It then recommends concrete resume updates, like missing keywords and stronger bullet selection, so tailoring decisions are guided by evidence instead of guesswork.',
    ],
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
    access: 'free',
    explanation: [
      'Inline editing lets you modify resume text exactly where it appears, without opening extra forms or context panels. This keeps editing fluid and reduces friction for quick revisions.',
    ],
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
    access: 'free',
    explanation: [
      'Rich text editing supports nuanced formatting and structure while preserving professional output quality. The focus is on making content expressive without introducing layout instability.',
    ],
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
    access: 'free',
    explanation: [
      'This feature enables rapid restructuring of your resume for different applications. By dragging sections into priority order, you can emphasize the most relevant experience in seconds.',
    ],
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
    access: 'free',
    explanation: [
      'Undo and redo provide confidence while iterating on wording and structure. You can test bold edits, then revert or restore without losing momentum.',
    ],
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
    access: 'free',
    explanation: [
      'Keyboard shortcuts are designed for high-frequency editing workflows. They reduce repetitive mouse actions so advanced users can move through draft refinement much faster.',
    ],
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
    access: 'free',
    explanation: [
      'Live preview keeps output visibility in sync with edits, which helps users spot formatting issues early. It shortens the cycle between writing, checking, and polishing.',
    ],
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
    access: 'free',
    explanation: [
      'Zoom modes improve readability and precision in both macro layout checks and detailed line-level edits. They are especially helpful for larger resumes and smaller screens.',
    ],
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
    access: 'free',
    explanation: [
      'Responsive editing adapts the interface for different device sizes while preserving core functionality. The goal is to keep the editing experience usable and consistent on mobile and desktop.',
    ],
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
    access: 'paid',
    explanation: [
      'This assistant reviews bullets for specificity and impact, then suggests stronger alternatives. It helps convert generic statements into evidence-driven achievements.',
    ],
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
    access: 'paid',
    explanation: [
      'Passive voice detection highlights wording that reduces clarity or ownership in accomplishments. Suggestions encourage active phrasing that reads more directly to hiring teams.',
    ],
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
    access: 'paid',
    explanation: [
      'This feature flags low-signal verbs and recommends action verbs with stronger hiring relevance. The intent is to improve perceived ownership and outcome orientation.',
    ],
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
    access: 'paid',
    explanation: [
      'Quantification prompts help users add numbers and business impact where possible. That improves credibility by turning responsibilities into measurable results.',
    ],
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
    access: 'free',
    explanation: [
      'Built-in grammar and spelling checks reduce avoidable errors before a resume is submitted. It acts as a final quality pass to improve polish and readability.',
    ],
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
    access: 'free',
    explanation: [
      'Print-to-PDF export uses optimized print styles to produce clean, consistent resume files. This keeps the delivery format practical for most application portals and recruiter workflows.',
    ],
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
    access: 'free',
    explanation: [
      'The height indicator warns when content exceeds intended page boundaries. It helps users maintain a concise layout and avoid surprise overflow in final exports.',
    ],
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
    access: 'free',
    explanation: [
      'OAuth linking ties resume data to secure user identities and enables persistent account ownership. It also establishes the foundation for safer multi-device access.',
    ],
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
    access: 'paid',
    explanation: [
      'Templates let users standardize visual structure for different job tracks. They speed up new resume creation while keeping formatting consistent across variants.',
    ],
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
    access: 'paid',
    explanation: [
      'Markdown export supports developer-oriented and documentation-based workflows. It enables easier version control and integration with text-first publishing pipelines.',
    ],
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
    access: 'paid',
    explanation: [
      'DOCX export provides editable documents for workflows that require Microsoft Word compatibility. This is useful for collaborative editing with coaches or recruiters.',
    ],
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
    access: 'paid',
    explanation: [
      'HTML export makes resumes easy to publish and share as web pages. It supports personal branding and direct-link distribution outside traditional document formats.',
    ],
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
    access: 'paid',
    explanation: [
      'LinkedIn import accelerates onboarding by turning existing profile content into editable resume drafts. It reduces startup effort for users who already maintain profile data.',
    ],
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
    access: 'paid',
    explanation: [
      'Shared team editing allows trusted collaborators to review and improve resume content together. It is intended for coaching, recruiting, and iterative feedback workflows.',
    ],
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

export function featureAccessLabel(access: FeatureItem['access']) {
  return access === 'paid' ? 'Paid Feature' : 'Free Feature';
}
