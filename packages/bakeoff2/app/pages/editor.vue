<template>
  <section class="editor">
    <header class="editor-header">
      <p class="kicker">Editor</p>
      <h1>{{ resume?.title ?? 'Resume Editor' }}</h1>
      <p v-if="resume">{{ resume.summary }}</p>
      <p v-else-if="!resumeId" class="status error">Missing resumeId query param.</p>
    </header>

    <p v-if="pending" class="status">Loading resume...</p>
    <p v-else-if="error" class="status error">Could not load resume.</p>

    <div v-else-if="resume" class="sections">
      <article v-for="section in resume.sections" :key="section.id" class="section-card">
        <h2>{{ section.title }}</h2>

        <ul v-if="section.items.length" class="item-list">
          <li v-for="item in section.items" :key="item.id">
            <strong>{{ item.label }}</strong>
            <span v-if="item.value"> · {{ item.value }}</span>
            <p v-if="item.description">{{ item.description }}</p>
          </li>
        </ul>

        <ul v-if="section.bullet_points.length" class="bullet-list">
          <li v-for="bullet in section.bullet_points" :key="bullet.id">
            {{ bullet.content }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ResumeEditorPage',
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

const apiPath = computed(() => (resumeId.value ? `/api/resumes/${resumeId.value}` : null));

const { data, pending, error } = await useFetch<ResumeDetail | null>(apiPath, {
  server: false,
  immediate: true,
  default: () => null,
});

const resume = computed(() => data.value);
</script>

<style scoped>
.editor {
  display: grid;
  gap: 1rem;
}

.editor-header {
  padding: 1.2rem;
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  background: #fff;
}

.kicker {
  margin: 0 0 0.6rem;
  color: #1d4ed8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
}

.editor-header p {
  margin: 0.7rem 0 0;
  color: #334155;
}

.status {
  margin: 0;
  color: #334155;
}

.status.error {
  color: #b91c1c;
}

.sections {
  display: grid;
  gap: 0.85rem;
}

.section-card {
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  padding: 1rem;
}

.section-card h2 {
  margin: 0 0 0.6rem;
  font-size: 1.1rem;
}

.item-list,
.bullet-list {
  margin: 0;
  padding-left: 1.2rem;
  color: #334155;
}

.item-list p {
  margin: 0.35rem 0 0.75rem;
}
</style>
