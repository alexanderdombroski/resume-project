<template>
  <section v-if="feature" class="feature-detail">
    <header class="detail-header">
      <p class="eyebrow">Feature Detail</p>
      <h1>{{ feature.title }}</h1>
      <p class="summary">{{ feature.summary }}</p>
      <div class="badges">
        <span class="status" :class="`status-${feature.status}`">
          {{ featureStatusLabel(feature.status) }}
        </span>
        <span class="access" :class="`access-${feature.access}`">
          {{ featureAccessLabel(feature.access) }}
        </span>
      </div>
    </header>

    <section class="detail-body">
      <h2>What It Will Do</h2>
      <p v-for="paragraph in feature.explanation" :key="paragraph">{{ paragraph }}</p>
    </section>

    <section class="detail-body">
      <h2>Details</h2>
      <ul>
        <li v-for="item in feature.details" :key="item">{{ item }}</li>
      </ul>
    </section>

    <nav class="feature-nav" aria-label="Feature navigation">
      <NuxtLink v-if="previousFeature" :to="`/features/${previousFeature.slug}`" class="nav-btn">
        Previous: {{ previousFeature.title }}
      </NuxtLink>
      <span v-else class="nav-btn nav-btn-muted">Previous: None</span>

      <NuxtLink to="/features" class="back-btn">Back to Feature List</NuxtLink>

      <NuxtLink v-if="nextFeature" :to="`/features/${nextFeature.slug}`" class="nav-btn nav-btn-next">
        Next: {{ nextFeature.title }}
      </NuxtLink>
      <span v-else class="nav-btn nav-btn-muted">Next: None</span>
    </nav>
  </section>

  <section v-else class="feature-detail">
    <p>Feature not found.</p>
    <NuxtLink to="/features" class="back-btn">Back to Feature List</NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { featureAccessLabel, featureStatusLabel, features, getFeatureBySlug } from '../../data/features';

defineOptions({
  name: 'FeatureDetailPage',
});

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));
const feature = computed(() => getFeatureBySlug(slug.value));
const featureIndex = computed(() => features.findIndex((item) => item.slug === slug.value));
const previousFeature = computed(() => {
  if (featureIndex.value <= 0) return null;
  return features[featureIndex.value - 1];
});
const nextFeature = computed(() => {
  if (featureIndex.value < 0 || featureIndex.value >= features.length - 1) return null;
  return features[featureIndex.value + 1];
});
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

.badges {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
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
  width: fit-content;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  display: inline-flex;
}

.access {
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

.access-free {
  background: #dcfce7;
  color: #166534;
}

.access-paid {
  background: #fee2e2;
  color: #991b1b;
}

.back-btn {
  width: fit-content;
  border: 1px solid #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0.65rem;
  padding: 0.5rem 0.75rem;
}

.back-btn:hover {
  background: #dbeafe;
}

.feature-nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.7rem;
  align-items: center;
}

.nav-btn {
  text-decoration: none;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #1e293b;
  border-radius: 0.65rem;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  display: inline-flex;
  justify-self: start;
  width: fit-content;
}

.nav-btn:hover {
  background: #f8fafc;
}

.nav-btn-next {
  justify-self: end;
}

.nav-btn-muted {
  color: #94a3b8;
  background: #f8fafc;
  border-color: #e2e8f0;
}

@media (max-width: 900px) {
  .feature-nav {
    grid-template-columns: 1fr;
  }

  .nav-btn-next {
    justify-self: start;
  }
}
</style>
