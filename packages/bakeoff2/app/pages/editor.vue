<template>
  <section class="editor">
    <div class="editor-actions">
      <button type="button" class="btn" :disabled="isSaving || !resume" @click="saveResume">
        {{ isSaving ? 'Saving...' : 'Save Resume' }}
      </button>
      <p v-if="saveStatus === 'success'" class="status success">Resume saved.</p>
      <p v-else-if="saveStatus === 'error'" class="status error">Could not save resume.</p>
    </div>

    <header class="editor-header">
      <p class="kicker">Editor</p>
      <h1 v-if="resume">
        <EditableInlineText
          :model-value="resume.title"
          placeholder="Resume title"
          @update:model-value="onResumeTitleUpdate"
        />
      </h1>
      <h1 v-else>Resume Editor</h1>
      <p v-if="resume">
        <EditableInlineText
          :model-value="resume.summary"
          placeholder="Add overall resume summary"
          @update:model-value="onResumeSummaryUpdate"
        />
      </p>
      <p v-else-if="!resumeId" class="status error">Missing resumeId query param.</p>
    </header>

    <p v-if="pending" class="status">Loading resume...</p>
    <p v-else-if="error" class="status error">Could not load resume.</p>

    <div v-if="resume" class="sections">
      <article v-for="section in resume.sections" :key="section.id" class="section-card">
        <h2>
          <EditableInlineText
            :model-value="section.title"
            @update:model-value="onSectionTitleUpdate(section.id, $event)"
          />
        </h2>

        <ul v-if="section.items.length" class="item-list">
          <li v-for="item in section.items" :key="item.id">
            <strong>
              <EditableInlineText
                :model-value="item.label"
                placeholder="Subsection title"
                @update:model-value="onSubsectionTitleUpdate(section.id, item.id, $event)"
              />
            </strong>
            <span>
              ·
              <EditableInlineText
                :model-value="item.value ?? ''"
                placeholder="Add location or subtitle"
                @update:model-value="onSubsectionValueUpdate(section.id, item.id, $event)"
              />
            </span>
            <p>
              <EditableInlineText
                :model-value="item.description ?? ''"
                placeholder="Add subsection description"
                @update:model-value="onSubsectionDescriptionUpdate(section.id, item.id, $event)"
              />
            </p>
          </li>
        </ul>

        <EditableBulletList
          v-if="section.bullet_points.length"
          :bullets="section.bullet_points"
          @update="onBulletUpdate(section.id, $event)"
        />
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
const isSaving = ref(false);
const saveStatus = ref<'idle' | 'success' | 'error'>('idle');
let saveSuccessTimer: ReturnType<typeof setTimeout> | null = null;

async function saveResume() {
  if (!resumeId.value || !data.value || isSaving.value) return;

  if (saveSuccessTimer) {
    clearTimeout(saveSuccessTimer);
    saveSuccessTimer = null;
  }

  isSaving.value = true;
  saveStatus.value = 'idle';

  try {
    await $fetch(`/api/resumes/${resumeId.value}`, {
      method: 'PUT',
      body: data.value,
    });
    saveStatus.value = 'success';
    saveSuccessTimer = setTimeout(() => {
      saveStatus.value = 'idle';
      saveSuccessTimer = null;
    }, 3000);
  } catch {
    saveStatus.value = 'error';
  } finally {
    isSaving.value = false;
  }
}

onBeforeUnmount(() => {
  if (saveSuccessTimer) {
    clearTimeout(saveSuccessTimer);
  }
});

function onResumeTitleUpdate(title: string) {
  if (!data.value) return;
  data.value = {
    ...data.value,
    title,
  };
}

function onResumeSummaryUpdate(summary: string) {
  if (!data.value) return;
  data.value = {
    ...data.value,
    summary,
  };
}

function onBulletUpdate(sectionId: number, payload: { id: number; content: string }) {
  if (!data.value) return;

  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        bullet_points: section.bullet_points.map((bullet) =>
          bullet.id === payload.id ? { ...bullet, content: payload.content } : bullet
        ),
      };
    }),
  };
}

function onSectionTitleUpdate(sectionId: number, title: string) {
  if (!data.value) return;

  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) =>
      section.id === sectionId ? { ...section, title } : section
    ),
  };
}

function onSubsectionTitleUpdate(sectionId: number, itemId: number, label: string) {
  if (!data.value) return;

  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: section.items.map((item) => (item.id === itemId ? { ...item, label } : item)),
      };
    }),
  };
}

function onSubsectionValueUpdate(sectionId: number, itemId: number, value: string) {
  if (!data.value) return;

  const nextValue = value || null;
  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? { ...item, value: nextValue } : item
        ),
      };
    }),
  };
}

function onSubsectionDescriptionUpdate(sectionId: number, itemId: number, description: string) {
  if (!data.value) return;

  const nextDescription = description || null;
  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? { ...item, description: nextDescription } : item
        ),
      };
    }),
  };
}
</script>

<style scoped>
.editor {
  display: grid;
  gap: 1rem;
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  justify-content: flex-end;
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
}

.btn:hover {
  border-color: #94a3b8;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.status.success {
  color: #166534;
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

.item-list {
  margin: 0;
  padding-left: 1.2rem;
  color: #334155;
}

.item-list p {
  margin: 0.35rem 0 0.75rem;
}
</style>
