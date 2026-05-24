<template>
  <section class="dashboard">
    <header class="dashboard-header">
      <p class="kicker">Dashboard</p>
      <h1>Your Resumes</h1>
      <p>Choose a resume to continue editing.</p>
    </header>

    <p v-if="pending" class="status">Loading resumes...</p>
    <p v-else-if="error" class="status error">Could not load resumes.</p>

    <ul v-else class="resume-list">
      <li v-for="resume in resumes" :key="resume.id" class="resume-card">
        <h2>{{ resume.title }}</h2>
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
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 1rem;
}

.dashboard-header {
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

.resume-card h2 {
  margin: 0;
  font-size: 1.05rem;
}

.resume-card p {
  margin: 0.5rem 0 0;
  color: #334155;
}
</style>
