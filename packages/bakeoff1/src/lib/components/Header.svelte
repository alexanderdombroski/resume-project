<script lang="ts">
  import { resolve } from '$app/paths';
  import AuthMenu from './auth/AuthMenu.svelte';
</script>

<header>
  <a href={resolve('/')} class="logo">
    <p role="img">EndlessResume</p>
  </a>
  <AuthMenu />
</header>

<style>
  .logo {
    text-decoration: none;

    p {
      font-weight: bold;
      align-content: center;
      font-family: var(--font-logo);
      letter-spacing: 0.02em;
      font-size: 1.35rem;
      margin: 0;
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 1rem;
  }
</style>
