<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Topbar from '$lib/components/Topbar.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="topbar-area">
  <Topbar />
</div>

<aside class="sidebar-area">
  <Sidebar />
</aside>

<main class="editor-main">
  {#if data.mode === 'edit' && data.resume}
    <h1>{data.resume.title}</h1>
    <p class="meta">Editing resume #{data.resume.id} for user {data.resume.userId}</p>

    <section class="sections">
      {#each data.resume.sections as section (section.id)}
        <article class="section-card">
          <h2>{section.title}</h2>
          <p class="meta">type: {section.type ?? 'n/a'} | order: {section.order}</p>
          <p class="meta">items: {section.items.length} | bullets: {section.bullets.length}</p>
        </article>
      {/each}
    </section>
  {:else}
    <h1>New Resume</h1>
    <p class="meta">No `resumeId` provided. Starting a new resume editor session.</p>
  {/if}
</main>

<style>
  .editor-main {
    margin-left: 300px;
    margin-top: 88px;
    padding: 1.25rem;
  }

  h1 {
    margin: 0;
    font-size: 1.7rem;
  }

  .meta {
    color: #5d5d5d;
  }

  .sections {
    margin-top: 1rem;
    display: grid;
    gap: 0.75rem;
  }

  .section-card {
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 0.8rem 1rem;
    background: #fff;
  }
</style>
