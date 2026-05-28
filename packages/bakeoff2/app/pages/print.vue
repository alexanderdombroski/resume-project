<template>
  <section class="print-page">
    <p v-if="pending" class="status">Loading resume...</p>
    <p v-else-if="error" class="status error">Could not load resume.</p>
    <p v-else-if="!resumeId" class="status error">Missing resumeId query param.</p>

    <ResumePrintSheet v-else-if="resume" :resume="resume" :back-link="backLink" />
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
</script>

<style scoped>
.print-page {
  display: grid;
  gap: 1rem;
  min-width: 0;
  overflow: hidden;
}

.status {
  margin: 0;
  color: #334155;
}

.status.error {
  color: #b91c1c;
}
</style>
