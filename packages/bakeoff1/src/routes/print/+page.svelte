<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function formatDateRange(startDate: unknown, endDate: unknown) {
    const start = startDate === null || startDate === undefined ? '' : String(startDate).trim();
    const end = endDate === null || endDate === undefined ? '' : String(endDate).trim();
    if (start && end) return `${start} - ${end}`;
    return start || end;
  }
</script>

<main class="print-page">
  <div class="toolbar">
    <button type="button" onclick={() => window.print()}>Print</button>
  </div>

  <article class="resume">
    <h1>{data.resume.title}</h1>

    {#if data.resume.summary?.trim()}
      <section>
        <h2>Professional Summary</h2>
        <p>{data.resume.summary}</p>
      </section>
    {/if}

    {#each data.resume.sections as section (section.id)}
      <section>
        <h2>{section.title}</h2>

        {#if section.items.length > 0}
          {#each section.items as item (item.id)}
            <div class="entry">
              <div class="entry-head">
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
              <div class="entry-meta">
                <span>{formatDateRange(item.start_date, item.end_date)}</span>
                <span>{item.location}</span>
              </div>
              {#if item.description?.trim()}
                <p>{item.description}</p>
              {/if}
            </div>
          {/each}
        {/if}

        {#if section.bullets.length > 0}
          <ul>
            {#each section.bullets as bullet (bullet.id)}
              {#if bullet.content.trim()}
                <li>{bullet.content}</li>
              {/if}
            {/each}
          </ul>
        {/if}
      </section>
    {/each}
  </article>
</main>

<style>
  .print-page {
    max-width: 850px;
    margin: 0 auto;
    padding: 1rem;
    color: #111;
    background: #fff;
  }

  .toolbar {
    margin-bottom: 1rem;
  }

  button {
    border: 1px solid #d2c6b7;
    background: #fff;
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
    color: #1f1b15;
  }

  .resume h1 {
    margin: 0 0 0.75rem;
    font-size: 2rem;
  }

  section {
    margin-top: 0.9rem;
  }

  h2 {
    margin: 0 0 0.45rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.2rem;
  }

  p {
    margin: 0.3rem 0;
    white-space: pre-wrap;
  }

  .entry {
    margin-bottom: 0.5rem;
  }

  .entry-head,
  .entry-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  ul {
    margin: 0.4rem 0 0;
    padding-left: 1.1rem;
  }

  @media print {
    @page {
      margin: 0.5in;
      size: auto;

      @top-center {
        content: '';
      }
      @bottom-center {
        content: '';
      }
    }

    :global(.contents > header),
    :global(.contents > footer) {
      display: none !important;
    }

    .toolbar {
      display: none;
    }

    .print-page {
      max-width: none;
      margin: 0;
      padding: 0;
    }
  }
</style>
