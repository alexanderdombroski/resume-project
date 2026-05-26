<template>
  <section class="features-page">
    <header class="features-header">
      <p class="eyebrow">Product Features</p>
      <h1>Feature Roadmap</h1>
      <p>
        Browse all planned features. Click a feature to view details and current
        delivery status.
      </p>
    </header>

    <ul class="features-grid">
      <li v-for="feature in features" :key="feature.title" class="feature-card">
        <NuxtLink :to="`/features/${feature.slug}`" class="feature-link">
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.summary }}</p>
          <span class="status" :class="`status-${feature.status}`">
            {{ featureStatusLabel(feature.status) }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { featureStatusLabel, features } from '../../data/features';

defineOptions({
  name: 'FeaturesPage',
});
</script>

<style scoped>
.features-page {
  display: grid;
  gap: 1.25rem;
}

.features-header {
  border: 1px solid #c7d2fe;
  background: linear-gradient(140deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 1rem;
  padding: 1.4rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #3730a3;
}

h1 {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  line-height: 1.08;
  max-width: 20ch;
}

.features-header p {
  margin: 0.7rem 0 0;
  color: #334155;
  max-width: 64ch;
}

.features-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.feature-card {
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  overflow: hidden;
}

.feature-link {
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 0.6rem;
  padding: 1rem;
  height: 100%;
}

.feature-link:hover {
  background: #f8fafc;
}

.feature-card h2 {
  margin: 0;
  font-size: 1.03rem;
}

.feature-card p {
  margin: 0;
  line-height: 1.45;
  color: #334155;
}

.status {
  width: fit-content;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}

.status-in-development {
  background: #dbeafe;
  color: #1e3a8a;
}

.status-coming-soon {
  background: #fef3c7;
  color: #92400e;
}

.status-far-future {
  background: #ede9fe;
  color: #5b21b6;
}

@media (max-width: 1000px) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
