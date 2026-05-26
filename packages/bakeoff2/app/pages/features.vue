<template>
  <section class="features-page">
    <header class="features-header">
      <p class="eyebrow">Product Features</p>
      <h1>Everything you need to ship better resumes.</h1>
      <p>
        Endless Resume combines guided editing, version control, and export tools
        so you can move faster for every job application.
      </p>
    </header>

    <ul class="features-grid">
      <li v-for="feature in features" :key="feature.title" class="feature-card">
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.description }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'FeaturesPage',
});

const features = [
  {
    title: 'Focused Editing',
    description: 'Edit each resume section with a clean workspace optimized for speed and clarity.',
  },
  {
    title: 'Version Duplication',
    description: 'Clone an existing resume and quickly tailor it to a specific role or industry.',
  },
  {
    title: 'Impact Bullet Guidance',
    description: 'Structure achievements with stronger action and measurable outcomes.',
  },
  {
    title: 'Live Save Workflow',
    description: 'Keep updates current while you iterate and refine your resume content.',
  },
  {
    title: 'Recruiter-Friendly Output',
    description: 'Produce clean, readable formatting designed for both people and hiring workflows.',
  },
  {
    title: 'Collection Dashboard',
    description: 'Manage all resumes from one dashboard with quick access to edit and delete actions.',
  },
  {
    title: 'Fast Loading UI',
    description: 'Navigate quickly through a lightweight interface that stays responsive as you work.',
  },
  {
    title: 'Simple Data Model',
    description: 'Keep titles, summaries, and revision timestamps organized in a straightforward format.',
  },
  {
    title: 'Scalable Foundation',
    description: 'Built with Nuxt so you can extend into templates, authentication, and richer exports.',
  },
];
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
  padding: 1rem;
}

.feature-card h2 {
  margin: 0 0 0.45rem;
  font-size: 1.03rem;
}

.feature-card p {
  margin: 0;
  line-height: 1.45;
  color: #334155;
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
