<template>
  <section class="dashboard-stub">
    <p class="kicker">Dashboard</p>
    <h1>Welcome to Endless Resume</h1>
    <p>
      This is a starter dashboard page. Data connections and resume loading will
      be added next.
    </p>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ResumeDashboardPage',
});
</script>

<style scoped>
.dashboard-stub {
  padding: 1.5rem;
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

p {
  margin: 0.7rem 0 0;
  color: #334155;
}
</style>
