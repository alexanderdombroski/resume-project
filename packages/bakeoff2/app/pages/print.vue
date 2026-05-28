<template>
  <section class="print-page">
    <div class="print-actions">
      <NuxtLink class="btn" :to="backLink">Back</NuxtLink>
      <button type="button" class="btn btn-primary" @click="printResume">Print</button>
    </div>

    <p v-if="pending" class="status">Loading resume...</p>
    <p v-else-if="error" class="status error">Could not load resume.</p>
    <p v-else-if="!resumeId" class="status error">Missing resumeId query param.</p>

    <article v-else-if="resume" class="resume-sheet">
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
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PrintResumePage',
});

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

const route = useRoute();
const resumeId = computed(() => {
  const raw = route.query.resumeId;
  const parsed = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(parsed) ? parsed : null;
});

const backLink = computed(() => {
  const rawFrom = route.query.from;
  const source = Array.isArray(rawFrom) ? rawFrom[0] : rawFrom;

  if (source === 'editor' && resumeId.value) {
    return `/editor?resumeId=${resumeId.value}`;
  }

  return '/dashboard';
});

const { data, pending, error } = await useAsyncData<ResumeDetail | null>(
  'print-resume',
  async () => {
    if (!resumeId.value) {
      return null;
    }

    return await $fetch<ResumeDetail>(`/api/resumes/${resumeId.value}`);
  },
  {
    server: false,
    immediate: true,
    watch: [resumeId],
    default: () => null,
  }
);

const resume = computed(() => data.value);

function printResume() {
  window.print();
}
</script>

<style scoped>
.print-page {
  display: grid;
  gap: 1rem;
}

.print-actions {
  display: flex;
  gap: 0.5rem;
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

.status {
  margin: 0;
  color: #334155;
}

.status.error {
  color: #b91c1c;
}

.resume-sheet {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  max-width: 850px;
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
    margin: 12mm;
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
  :global(.print-actions) {
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
