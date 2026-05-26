<template>
  <section v-if="feature" class="feature-detail">
    <header class="detail-header">
      <p class="eyebrow">Feature Detail</p>
      <h1>{{ feature.title }}</h1>
      <p class="summary">{{ feature.summary }}</p>
      <span class="status" :class="`status-${feature.status}`">
        {{ featureStatusLabel(feature.status) }}
      </span>
    </header>

    <section class="detail-body">
      <h2>Details</h2>
      <ul>
        <li v-for="item in feature.details" :key="item">{{ item }}</li>
      </ul>
    </section>

    <NuxtLink to="/features" class="back-link">Back to all features</NuxtLink>
  </section>

  <section v-else class="feature-detail">
    <p>Feature not found.</p>
    <NuxtLink to="/features" class="back-link">Back to all features</NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { featureStatusLabel, getFeatureBySlug } from '../../data/features';

defineOptions({
  name: 'FeatureDetailPage',
});

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));
const feature = computed(() => getFeatureBySlug(slug.value));
</script>

<style scoped>
.feature-detail {
  display: grid;
  gap: 1rem;
}

.detail-header {
  border: 1px solid #c7d2fe;
  background: linear-gradient(140deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 1rem;
  padding: 1.2rem;
}

.eyebrow {
  margin: 0 0 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #3730a3;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

.summary {
  margin: 0.7rem 0 0;
  color: #334155;
}

.detail-body {
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  padding: 1rem;
}

.detail-body h2 {
  margin: 0 0 0.7rem;
  font-size: 1.1rem;
}

.detail-body ul {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.45rem;
  color: #334155;
}

.status {
  margin-top: 0.75rem;
  width: fit-content;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  display: inline-flex;
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

.back-link {
  color: #1d4ed8;
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
