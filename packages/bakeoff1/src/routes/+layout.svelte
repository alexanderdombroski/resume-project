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

<Header />
{@render children()}
<Footer />
