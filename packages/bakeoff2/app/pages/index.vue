<template>
  <div class="landing">
    <section class="hero">
      <p class="eyebrow">Smart Resume Editor</p>
      <h1>Build a job-ready resume in minutes, not hours.</h1>
      <p class="lead">
        Endless Resume helps you write, tailor, and export polished resumes with
        confidence.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/dashboard">Start Editing</a>
        <a class="btn btn-ghost" href="/features">See Features</a>
      </div>
    </section>

    <section class="cta">
      <h2>Stop rewriting from scratch for every application.</h2>
      <p>Use Endless Resume to ship stronger resumes faster.</p>
      <a class="btn btn-primary" href="/templates">Create My Resume</a>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EndlessResumeLanding',
});
</script>

<style scoped>
.landing {
  display: grid;
  gap: 3rem;
  padding-bottom: 1.5rem;
}

.hero {
  padding: 2.5rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #e0e7ff 100%);
  border: 1px solid #bfdbfe;
}

.eyebrow {
  margin: 0 0 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e40af;
}

h1 {
  margin: 0;
  max-width: 18ch;
  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1.05;
}

.lead {
  margin: 1rem 0 0;
  max-width: 56ch;
  color: #334155;
  font-size: 1.03rem;
}

.hero-actions {
  margin-top: 1.4rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.72rem 1rem;
  border-radius: 0.7rem;
  text-decoration: none;
  font-weight: 700;
  border: 1px solid transparent;
}

.btn-primary {
  background: #1d4ed8;
  color: #fff;
}

.btn-primary:hover {
  background: #1e40af;
}

.btn-ghost {
  background: rgb(255 255 255 / 75%);
  color: #1e3a8a;
  border-color: #93c5fd;
}

.cta {
  border-radius: 1rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  padding: 1.5rem;
  display: grid;
  gap: 0.8rem;
  justify-items: start;
}

.cta h2,
.cta p {
  margin: 0;
}

@media (max-width: 900px) {
  .hero {
    padding: 1.4rem;
  }
}
</style>
