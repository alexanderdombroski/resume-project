export type TemplateOption = {
  slug: string;
  name: string;
  bestFor: string;
  order: string[];
  summary: string;
  precreatedSections: string[];
};

export const templateOptions: TemplateOption[] = [
  {
    slug: 'classic-chronological',
    name: 'Classic Chronological',
    bestFor: 'traditional careers',
    order: ['Summary', 'Experience', 'Skills', 'Education'],
    summary: 'Highlights career progression with a clear, familiar work-history-first format.',
    precreatedSections: ['Experience', 'Skills', 'Certificates', 'Volunteer Experience'],
  },
  {
    slug: 'skills-first-functional',
    name: 'Skills-First / Functional',
    bestFor: 'career changers, employment gaps',
    order: ['Summary', 'Skills', 'Projects', 'Experience', 'Education'],
    summary:
      'Prioritizes transferable competencies before chronology to support pivots and reentry.',
    precreatedSections: ['Experience', 'Skills', 'Certificates', 'Volunteer Experience'],
  },
  {
    slug: 'technical-engineering',
    name: 'Technical / Engineering',
    bestFor: 'software, IT, and data roles',
    order: ['Technical Skills', 'Projects', 'Experience', 'Education'],
    summary:
      'Leads with stack depth and build outcomes, then reinforces impact through experience.',
    precreatedSections: ['Experience', 'Skills', 'Certificates', 'Volunteer Experience'],
  },
  {
    slug: 'executive-leadership',
    name: 'Executive / Leadership',
    bestFor: 'senior leadership roles',
    order: ['Executive Summary', 'Leadership Highlights', 'Experience', 'Education'],
    summary:
      'Centers strategic leadership and business impact for director-to-C-suite positioning.',
    precreatedSections: ['Experience', 'Skills', 'Certificates', 'Volunteer Experience'],
  },
];
