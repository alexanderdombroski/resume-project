<script lang="ts">
  import '../css/global.css';
  import favicon from '$lib/assets/favicon.png';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="contents">
  <Header />
  {@render children()}
  <Footer />
</div>

<style>
  .contents {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &:nth-last-child(2) {
      margin-bottom: 4rem;
    }
  }
</style>
