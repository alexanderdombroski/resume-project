<template>
  <section class="editor">
    <div class="editor-actions">
      <p v-if="resume" class="dirty-indicator" :class="hasUnsavedChanges ? 'dirty' : 'clean'">
        {{ hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved' }}
      </p>
      <button type="button" class="btn" :disabled="isSaving || !resume" @click="saveResume">
        {{ isSaving ? 'Saving...' : 'Save Resume' }}
      </button>
      <p v-if="saveError" class="status error">Could not save resume.</p>
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
          :bullets="section.bullet_points"
          @update="onBulletUpdate(section.id, $event)"
          @remove="onBulletRemove(section.id, $event)"
        />
        <button type="button" class="btn btn-add-bullet" @click="addBulletPoint(section.id)">
          Add bullet point
        </button>
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

const { data, pending, error } = await useAsyncData<ResumeDetail | null>(
  () => `resume-editor-${resumeId.value ?? 'missing'}`,
  () => {
    if (!resumeId.value) {
      return Promise.resolve(null);
    }

    return $fetch<ResumeDetail>(`/api/resumes/${resumeId.value}`);
  },
  {
    server: false,
    immediate: true,
    default: () => null,
  }
);

const resume = computed(() => data.value);
const isSaving = ref(false);
const saveError = ref(false);
const lastSavedSnapshot = ref<ResumeDetail | null>(null);

function cloneResume(value: ResumeDetail) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

const hasUnsavedChanges = computed(() => {
  if (!data.value || !lastSavedSnapshot.value) return false;
  return JSON.stringify(data.value) !== JSON.stringify(lastSavedSnapshot.value);
});

watch(
  () => data.value,
  (next, previous) => {
    if (!next || previous) return;
    lastSavedSnapshot.value = cloneResume(next);
  },
  { immediate: true }
);

async function saveResume() {
  if (!resumeId.value || !data.value || isSaving.value) return;

  isSaving.value = true;
  saveError.value = false;

  try {
    await $fetch(`/api/resumes/${resumeId.value}`, {
      method: 'PUT',
      body: data.value,
    });
    lastSavedSnapshot.value = cloneResume(data.value);
  } catch {
    saveError.value = true;
  } finally {
    isSaving.value = false;
  }
}

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

function addBulletPoint(sectionId: number) {
  if (!data.value) return;

  const nextTempId =
    Math.min(
      0,
      ...data.value.sections.flatMap((section) =>
        section.bullet_points.map((bullet) => bullet.id).filter((id) => id <= 0)
      )
    ) - 1;

  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        bullet_points: [
          ...section.bullet_points,
          {
            id: nextTempId,
            section_id: sectionId,
            content: 'New bullet point',
            item_order: section.bullet_points.length + 1,
          },
        ],
      };
    }),
  };
}

function onBulletRemove(sectionId: number, payload: { id: number }) {
  if (!data.value) return;

  data.value = {
    ...data.value,
    sections: data.value.sections.map((section) => {
      if (section.id !== sectionId) return section;
      const remainingBullets = section.bullet_points
        .filter((bullet) => bullet.id !== payload.id)
        .map((bullet, index) => ({ ...bullet, item_order: index + 1 }));
      return {
        ...section,
        bullet_points: remainingBullets,
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

.dirty-indicator {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
}

.dirty-indicator.dirty {
  color: #b45309;
}

.dirty-indicator.clean {
  color: #166534;
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

.btn-add-bullet {
  margin-top: 0.5rem;
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
