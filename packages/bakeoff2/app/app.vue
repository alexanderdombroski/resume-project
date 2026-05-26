<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />

    <header class="site-header">
      <div class="header-inner">
        <NuxtLink to="/" class="brand-link" aria-label="Go to home page">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true">ER</span>
            <div class="brand-copy">
              <p class="brand-name">Endless Resume</p>
              <p class="brand-tagline">Resume Editor</p>
            </div>
          </div>
        </NuxtLink>

        <nav class="site-nav" aria-label="Primary navigation">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/features" class="nav-link">Features</NuxtLink>
          <NuxtLink to="/dashboard" class="nav-link">Dashboard</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <p>Endless Resume</p>
      <p>Craft clear resumes, faster.</p>
    </footer>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Inter', 'Avenir Next', 'Segoe UI', sans-serif;
  background: radial-gradient(circle at top left, #f8fafc 0%, #eef2ff 45%, #e2e8f0 100%);
  color: #0f172a;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.site-header {
  border-bottom: 1px solid #dbeafe;
  background: rgb(255 255 255 / 85%);
  backdrop-filter: blur(8px);
  padding: 1rem 1.25rem;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-mark {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.55rem;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #ffffff;
  background: linear-gradient(140deg, #1d4ed8 0%, #2563eb 45%, #3b82f6 100%);
  box-shadow: 0 4px 14px rgb(37 99 235 / 28%);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.brand-name {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1;
  letter-spacing: 0.01em;
  font-weight: 800;
  font-family: 'Avenir Next Condensed', 'Franklin Gothic Medium', 'Arial Narrow', sans-serif;
}

.brand-tagline {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #475569;
  font-weight: 600;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-link {
  text-decoration: none;
  color: #1e293b;
  font-weight: 700;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  padding: 0.4rem 0.7rem;
}

.nav-link:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.nav-link.router-link-active {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1e3a8a;
}

.site-main {
  width: min(1100px, calc(100% - 2.5rem));
  margin: 2rem auto;
}

.site-footer {
  border-top: 1px solid #dbeafe;
  background: rgb(248 250 252 / 90%);
  padding: 1rem 1.25rem 1.25rem;
  color: #334155;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
}

.site-footer p {
  margin: 0;
}

@media (max-width: 640px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand-name {
    font-size: 1.15rem;
  }

  .site-main {
    width: min(1100px, calc(100% - 1.5rem));
    margin: 1.25rem auto;
  }

  .site-footer {
    flex-direction: column;
  }
}
</style>
