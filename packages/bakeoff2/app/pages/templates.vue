<template>
  <section class="templates">
    <header class="templates-header">
      <p class="kicker">Templates</p>
      <h1>Choose a Resume Template</h1>
      <p>Select a top-down structure to start your resume.</p>
    </header>

    <ul class="template-grid">
      <li v-for="templateOption in templateOptions" :key="templateOption.slug" class="template-card">
        <div class="template-card-top">
          <h2>{{ templateOption.name }}</h2>
          <p class="best-for">Best for: {{ templateOption.bestFor }}</p>
          <p class="summary">{{ templateOption.summary }}</p>
        </div>

        <div class="template-details">
          <h3>Top-Down Order</h3>
          <ol>
            <li v-for="item in templateOption.order" :key="`${templateOption.slug}-${item}`">
              {{ item }}
            </li>
          </ol>
        </div>

        <div class="template-details">
          <h3>Precreated Sections</h3>
          <ul>
            <li
              v-for="section in templateOption.precreatedSections"
              :key="`${templateOption.slug}-pre-${section}`"
            >
              {{ section }}
            </li>
          </ul>
        </div>

        <NuxtLink class="btn btn-choose" :to="`/editor?template=${templateOption.slug}`">
          Choose Template
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { templateOptions } from '../data/templates';

defineOptions({
  name: 'ResumeTemplatesPage',
});
</script>

<style scoped>
.templates {
  display: grid;
  gap: 1rem;
}

.templates-header {
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

.templates-header p {
  margin: 0.7rem 0 0;
  color: #334155;
}

.template-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.template-card {
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  background: #fff;
  padding: 1rem;
  display: grid;
  gap: 0.8rem;
}

.template-card-top h2 {
  margin: 0;
  font-size: 1.1rem;
}

.best-for,
.summary {
  margin: 0.4rem 0 0;
  color: #334155;
}

.template-details h3 {
  margin: 0;
  font-size: 0.95rem;
}

.template-details ol,
.template-details ul {
  margin: 0.45rem 0 0;
  padding-left: 1.2rem;
  color: #334155;
}

.template-details li + li {
  margin-top: 0.2rem;
}

.btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  border-radius: 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 0.7rem;
}

.btn-choose {
  display: inline-flex;
  width: fit-content;
  text-decoration: none;
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}

.btn-choose:hover {
  background: #1e40af;
  border-color: #1e40af;
}

@media (max-width: 900px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
