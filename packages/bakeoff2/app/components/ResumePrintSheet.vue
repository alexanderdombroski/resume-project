<template>
  <section class="resume-print" :class="`mode-${mode}`">
    <template v-if="mode === 'full'">
      <div class="print-actions">
        <NuxtLink class="btn" :to="backLink">Back</NuxtLink>
        <button type="button" class="btn btn-primary" @click="printResume">Print</button>
        <p class="print-total" :class="{ 'print-total--warning': isWarningRange }">
          {{ totalLabel }}
        </p>
      </div>
    </template>

    <p
      v-else
      class="print-total print-total--compact"
      :class="{ 'print-total--warning': isWarningRange }"
    >
      {{ totalLabel }}
    </p>

    <div
      class="resume-scroll"
      :class="{ 'resume-scroll--hidden': mode === 'indicator' }"
      :aria-hidden="mode === 'indicator'"
    >
      <article ref="resumeSheetRef" class="resume-sheet">
        <h1>{{ resume.title }}</h1>
        <p v-if="resume.summary" class="summary">{{ resume.summary }}</p>

        <section v-for="section in resume.sections" :key="section.id" class="resume-section">
          <h2>{{ section.title }}</h2>

          <ul v-if="section.items.length" class="plain-list">
            <li v-for="item in section.items" :key="item.id">
              <strong>{{ item.label }}</strong>
              <span v-if="item.value"> - {{ item.value }}</span>
              <p v-if="item.description">{{ item.description }}</p>
            </li>
          </ul>

          <ul v-if="section.bullet_points.length" class="plain-list">
            <li v-for="bullet in section.bullet_points" :key="bullet.id">
              {{ bullet.content }}
            </li>
          </ul>
        </section>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
type SectionItem = {
  id: number;
  section_id: number;
  label: string;
  value: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  item_order: number;
};

type BulletPoint = {
  id: number;
  section_id: number;
  content: string;
  item_order: number;
};

type Section = {
  id: number;
  resume_id: number;
  title: string;
  item_order: number;
  type: string;
  items: SectionItem[];
  bullet_points: BulletPoint[];
};

type ResumeDetail = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  created_at: string;
  updated_at: string;
  sections: Section[];
};

type PretextModule = typeof import('@chenglou/pretext');

const props = defineProps<{
  resume: ResumeDetail;
  backLink?: string;
  mode?: 'full' | 'indicator';
}>();

const PX_PER_INCH = 96;
const REM_PX = 16;
const BODY_FONT_FAMILY = "'Inter', 'Avenir Next', 'Segoe UI', sans-serif";
const BODY_FONT_SIZE = 16;
const TITLE_FONT_SIZE = 30.4;
const SECTION_FONT_SIZE = 16.8;
const BODY_LINE_HEIGHT = 19.2;
const TITLE_LINE_HEIGHT = 36.48;
const SECTION_LINE_HEIGHT = 20.16;
const LIST_INDENT_PX = 19.2;
const SECTION_MARGIN_TOP_PX = 1 * REM_PX;
const SUMMARY_MARGIN_TOP_PX = 0.5 * REM_PX;
const LIST_MARGIN_TOP_PX = 0.45 * REM_PX;
const LIST_ITEM_MARGIN_PX = 0.2 * REM_PX;
const DESCRIPTION_MARGIN_TOP_PX = 0.1 * REM_PX;
const DESCRIPTION_MARGIN_BOTTOM_PX = 0.35 * REM_PX;

const resumeSheetRef = ref<HTMLElement | null>(null);
const pretextModule = shallowRef<PretextModule | null>(null);
const contentWidth = ref(0);
const mode = computed(() => props.mode ?? 'full');

function formatInches(value: number) {
  return `${value.toFixed(2)} in`;
}

function buildFont(weight: number, sizePx: number) {
  return `${weight} ${sizePx}px ${BODY_FONT_FAMILY}`;
}

function measureText(text: string, width: number, font: string, lineHeight: number) {
  const pretext = pretextModule.value;
  const normalized = text.trim();

  if (!pretext || !normalized || width <= 0) {
    return {
      heightPx: 0,
      heightInches: 0,
    };
  }

  const prepared = pretext.prepare(normalized, font, {
    whiteSpace: 'pre-wrap',
  });
  const result = pretext.layout(prepared, width, lineHeight);

  return {
    heightPx: result.height,
    heightInches: result.height / PX_PER_INCH,
  };
}

const totalMeasuredHeightInches = computed(() => {
  const width = Math.max(0, contentWidth.value);

  if (!props.resume || !pretextModule.value || !width) {
    return 0;
  }

  const bodyFont = buildFont(400, BODY_FONT_SIZE);
  const titleFont = buildFont(700, TITLE_FONT_SIZE);
  const sectionFont = buildFont(700, SECTION_FONT_SIZE);
  const listWidth = Math.max(0, width - LIST_INDENT_PX);

  let totalPx = 0;

  totalPx += measureText(props.resume.title, width, titleFont, TITLE_LINE_HEIGHT).heightPx;

  if (props.resume.summary.trim()) {
    totalPx += SUMMARY_MARGIN_TOP_PX;
    totalPx += measureText(props.resume.summary, width, bodyFont, BODY_LINE_HEIGHT).heightPx;
  }

  props.resume.sections.forEach((section, sectionIndex) => {
    totalPx += SECTION_MARGIN_TOP_PX;
    totalPx += measureText(section.title, width, sectionFont, SECTION_LINE_HEIGHT).heightPx;

    if (section.items.length) {
      totalPx += LIST_MARGIN_TOP_PX;

      for (const item of section.items) {
        const itemLabel = item.value ? `${item.label} - ${item.value}` : item.label;
        totalPx += LIST_ITEM_MARGIN_PX;
        totalPx += measureText(itemLabel, width, bodyFont, BODY_LINE_HEIGHT).heightPx;

        if (item.description?.trim()) {
          totalPx += DESCRIPTION_MARGIN_TOP_PX;
          totalPx += measureText(item.description, width, bodyFont, BODY_LINE_HEIGHT).heightPx;
          totalPx += DESCRIPTION_MARGIN_BOTTOM_PX;
        }

        totalPx += LIST_ITEM_MARGIN_PX;
      }
    }

    if (section.bullet_points.length) {
      totalPx += LIST_MARGIN_TOP_PX;

      for (const bullet of section.bullet_points) {
        totalPx += LIST_ITEM_MARGIN_PX;
        totalPx += measureText(
          bullet.content,
          listWidth || width,
          bodyFont,
          BODY_LINE_HEIGHT
        ).heightPx;
        totalPx += LIST_ITEM_MARGIN_PX;
      }
    }

    if (sectionIndex < props.resume.sections.length - 1) {
      // Section spacing is already represented by the next section's top margin.
    }
  });

  return totalPx / PX_PER_INCH;
});

const isWarningRange = computed(
  () => totalMeasuredHeightInches.value > 10 && totalMeasuredHeightInches.value <= 13
);

const totalLabel = computed(() =>
  isWarningRange.value
    ? `>10 inches: two pages (${formatInches(totalMeasuredHeightInches.value)})`
    : `Total: ${formatInches(totalMeasuredHeightInches.value)}`
);

function updateContentWidth() {
  const el = resumeSheetRef.value;
  if (!el) {
    contentWidth.value = 0;
    return;
  }

  const styles = getComputedStyle(el);
  const horizontalPadding =
    Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
  contentWidth.value = Math.max(0, el.clientWidth - horizontalPadding);
}

function printResume() {
  window.print();
}

let resizeListener: (() => void) | null = null;

onMounted(async () => {
  pretextModule.value = await import('@chenglou/pretext');

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  await nextTick();
  updateContentWidth();

  resizeListener = () => {
    updateContentWidth();
  };

  window.addEventListener('resize', resizeListener);
});

watch(
  () => props.resume,
  async () => {
    await nextTick();
    updateContentWidth();
  }
);

onBeforeUnmount(() => {
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener);
  }
});
</script>

<style scoped>
.resume-print {
  display: grid;
  gap: 1rem;
  min-width: 0;
  overflow: hidden;
}

.mode-indicator {
  gap: 0.5rem;
}

.print-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.print-total {
  margin: 0 0 0 auto;
  color: #1d4ed8;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.print-total--warning {
  color: #b91c1c;
}

.print-total--compact {
  margin: 0;
}

.btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  border-radius: 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  border-color: #1d4ed8;
}

.resume-scroll {
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.resume-scroll--hidden {
  position: absolute;
  left: -10000px;
  top: 0;
  width: 8.5in;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
}

.resume-sheet {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  width: 8.5in;
  min-width: 8.5in;
  max-width: none;
  box-sizing: border-box;
}

h1 {
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.2;
}

.summary {
  margin: 0.5rem 0 0;
  color: #334155;
}

.resume-section {
  margin-top: 1rem;
}

h2 {
  margin: 0;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plain-list {
  margin: 0.45rem 0 0;
  padding-left: 1.2rem;
}

.plain-list li {
  margin: 0.2rem 0;
}

.plain-list p {
  margin: 0.1rem 0 0.35rem;
}

@media print {
  @page {
    margin: 0.5in;
    size: auto;

    @top-center {
      content: '';
    }

    @bottom-center {
      content: '';
    }
  }

  :global(body) {
    background: #fff;
    margin: 0;
  }

  :global(.site-header),
  :global(.site-footer),
  :global(.print-actions),
  :global(.measurement-panel) {
    display: none !important;
  }

  :global(.site-main) {
    width: 100% !important;
    margin: 0 !important;
  }

  .resume-sheet {
    border: 0;
    max-width: none;
    padding: 0;
  }
}
</style>
