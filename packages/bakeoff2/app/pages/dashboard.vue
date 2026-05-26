<template>
  <section class="dashboard">
    <header class="dashboard-header">
      <div>
        <p class="kicker">Dashboard</p>
        <h1>Your Resumes</h1>
        <p>Choose a resume to continue editing.</p>
      </div>
      <NuxtLink to="/templates" class="btn btn-create-new">Create New</NuxtLink>
    </header>

    <p v-if="pending" class="status">Loading resumes...</p>
    <p v-else-if="error" class="status error">Could not load resumes.</p>

    <ul v-else class="resume-list">
      <li v-for="resume in resumes" :key="resume.id" class="resume-card">
        <div class="resume-card-top">
          <h2>{{ resume.title }}</h2>
          <div class="resume-actions">
            <NuxtLink class="btn btn-edit" :to="`/editor?resumeId=${resume.id}`">Edit</NuxtLink>
            <NuxtLink class="btn btn-print" :to="`/print?resumeId=${resume.id}`">Print</NuxtLink>
            <button
              type="button"
              class="btn btn-delete"
              :disabled="deletingId === resume.id"
              @click="onDelete(resume.id)"
            >
              {{ deletingId === resume.id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
        <p>{{ resume.summary }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ResumeDashboardPage',
});

type Resume = {
  id: number;
  user_id: number;
  title: string;
  summary: string;
  created_at: string;
  updated_at: string;
};

const { data, pending, error } = await useFetch<Resume[]>('/api/resumes', {
  server: false,
});
const resumes = computed(() => data.value ?? []);
const deletingId = ref<number | null>(null);

async function onDelete(id: number) {
  if (!confirm('Delete this resume? This cannot be undone.')) {
    return;
  }

  deletingId.value = id;

  try {
    await $fetch(`/api/resumes/${id}`, { method: 'DELETE' });

    if (data.value) {
      data.value = data.value.filter((resume) => resume.id !== id);
    }
  } finally {
    deletingId.value = null;
  }
}
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 1rem;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
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

.dashboard-header p {
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

.resume-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.85rem;
}

.resume-card {
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  padding: 1rem;
}

.resume-card-top {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.resume-card h2 {
  margin: 0;
  font-size: 1.05rem;
}

.resume-actions {
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
}

.btn:hover:enabled {
  border-color: #94a3b8;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-delete {
  border-color: #fecaca;
  color: #b91c1c;
}

.btn-create-new {
  text-decoration: none;
  white-space: nowrap;
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}

.btn-create-new:hover {
  background: #1e40af;
  border-color: #1e40af;
}

.resume-card p {
  margin: 0.5rem 0 0;
  color: #334155;
}

@media (max-width: 640px) {
  .dashboard-header {
    flex-direction: column;
  }
}
</style>
