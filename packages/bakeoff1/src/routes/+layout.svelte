<script lang="ts">
  import '../css/global.css';
  import favicon from '$lib/assets/favicon.png';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Endless Resume | Build once, tailor forever.</title>
  <meta
    name="description"
    content="Endless Resume helps you build one complete CV and instantly tailor many targeted resumes, with one-page fit guidance built in."
  />
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
