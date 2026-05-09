<script lang="ts">
  import { resolve } from '$app/paths';
  import AuthMenu from './auth/AuthMenu.svelte';
</script>

<header>
  <a href={resolve('/')}>
    <div role="img">ResumeSwapper</div>
  </a>
  <AuthMenu />
</header>
