<template>
  <section class="templates">
    <header class="templates-header">
      <p class="kicker">Templates</p>
      <h1>Choose a Resume Template</h1>
      <p>Template options will be added here.</p>
    </header>
  </section>
</template>

<script setup lang="ts">
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
</style>
