<script lang="ts">
  import { resolve } from '$app/paths';
  import AuthMenu from './auth/AuthMenu.svelte';
</script>

<header class="site-header">
  <a href={resolve('/')} class="logo">
    <p class="brand" role="img">EndlessResume</p>
  </a>
  <AuthMenu />
</header>

<style>
  .site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid color-mix(in oklab, var(--color-text) 14%, transparent);
    background:
      radial-gradient(
        120% 180% at 0% -30%,
        color-mix(in oklab, var(--color-primary) 12%, transparent),
        transparent
      ),
      var(--color-bg);
  }

  .logo {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    border-radius: 0.65rem;
    padding: 0.25rem 0.5rem;
    transition: background-color 120ms ease;

    &:hover {
      background: color-mix(in oklab, var(--color-text) 6%, transparent);
    }

    .brand {
      font-weight: 700;
      align-content: center;
      font-family: var(--font-logo);
      letter-spacing: 0.01em;
      font-size: clamp(1.15rem, 1.8vw, 1.35rem);
      line-height: 1.1;
      margin: 0;
      color: color-mix(in oklab, var(--color-text) 90%, var(--color-primary));
    }
  }

  @media (max-width: 480px) {
    .site-header {
      padding-inline: 0.75rem;
    }
  }
</style>
