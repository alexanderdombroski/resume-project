<script lang="ts">
  import { resolve } from '$app/paths';
  import AuthMenu from './auth/AuthMenu.svelte';
</script>

<header>
  <a href={resolve('/')} class="logo">
    <p role="img">ResumeSwapper</p>
  </a>
  <AuthMenu />
</header>

<style>
  .logo {
    text-decoration: none;

    p {
      font-weight: bold;
      align-content: center;
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 1rem;
  }
</style>
