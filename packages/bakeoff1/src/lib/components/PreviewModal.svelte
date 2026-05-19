<script lang="ts">
  type ResumeSection = {
    id: number;
    title: string;
    type: string | null;
    items: Array<{
      id: number;
      label: string | null;
      value: string | null;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      description: string | null;
    }>;
    bullets: Array<{
      id: number;
      content: string;
    }>;
  };

  let {
    open = false,
    title,
    summary,
    sections,
    onClose,
  }: {
    open?: boolean;
    title: string;
    summary: string;
    sections: ResumeSection[];
    onClose: () => void;
  } = $props();

  function normalizeText(value: unknown) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  function formatDateRange(startDate: unknown, endDate: unknown) {
    const start = normalizeText(startDate);
    const end = normalizeText(endDate);

    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    if (end) return end;
    return '';
  }
</script>

<svelte:window onkeydown={(event) => open && event.key === 'Escape' && onClose()} />

{#if open}
  <div class="preview-overlay" role="presentation">
    <button type="button" class="preview-backdrop" aria-label="Close preview" onclick={onClose}
    ></button>
    <div class="preview-modal" role="dialog" aria-modal="true" aria-label="Resume preview">
      <header class="preview-header">
        <h2>Resume Preview</h2>
        <button type="button" class="close" aria-label="Close preview" onclick={onClose}>×</button>
      </header>

      <article class="preview-sheet" aria-label="Resume preview content">
        <header class="sheet-top">
          <h1>{title || 'Untitled Resume'}</h1>
        </header>

        {#if summary.trim()}
          <section class="preview-section">
            <h3>Professional Summary</h3>
            <p>{summary}</p>
          </section>
        {/if}

        {#each sections as section (section.id)}
          <section class="preview-section">
            <h3>{section.title}</h3>

            {#if section.items.length > 0}
              <div class="preview-entries">
                {#each section.items as item (item.id)}
                  <article class="preview-entry">
                    <div class="entry-main">
                      <p class="entry-title">{item.label}</p>
                      <p class="entry-value">{item.value}</p>
                    </div>
                    <div class="entry-meta">
                      <span>{formatDateRange(item.start_date, item.end_date)}</span>
                      <span>{item.location}</span>
                    </div>
                    {#if item.description?.trim()}
                      <p class="entry-description">{item.description}</p>
                    {/if}
                  </article>
                {/each}
              </div>
            {/if}

            {#if section.bullets.length > 0}
              <ul class="preview-bullets">
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
    </div>
  </div>
{/if}

<style>
  .preview-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 1000;
  }

  .preview-backdrop {
    position: absolute;
    inset: 0;
    border: none;
    background: rgb(0 0 0 / 52%);
  }

  .preview-modal {
    position: relative;
    width: min(940px, 100%);
    max-height: 94vh;
    overflow: auto;
    background: #f7f2e8;
    border-radius: 10px;
    border: 1px solid #d7ccbc;
    box-shadow: 0 22px 48px rgb(15 17 23 / 24%);
  }

  .preview-header {
    position: sticky;
    top: 0;
    background: #f7f2e8;
    border-bottom: 1px solid #ddd1c0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1rem;
  }

  .preview-header h2 {
    margin: 0;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .close {
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    border: 1px solid #d0c2af;
    background: #fff;
    font-size: 1.2rem;
    line-height: 1;
  }

  .preview-sheet {
    margin: 1rem;
    background: #fff;
    border: 1px solid #ddd3c5;
    border-radius: 8px;
    padding: 1.4rem;
  }

  .sheet-top h1 {
    margin: 0;
    font-size: 2rem;
  }

  .preview-section {
    margin-top: 1.15rem;
  }

  .preview-section h3 {
    margin: 0;
    font-size: 0.94rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5ded2;
    padding-bottom: 0.28rem;
  }

  .preview-section p {
    margin: 0.45rem 0 0;
    white-space: pre-wrap;
  }

  .preview-entries {
    margin-top: 0.55rem;
    display: grid;
    gap: 0.6rem;
  }

  .preview-entry {
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed #e6ddd0;
  }

  .entry-main {
    display: flex;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .entry-title,
  .entry-value {
    margin: 0;
    font-weight: 600;
  }

  .entry-meta {
    margin-top: 0.2rem;
    color: #665c4e;
    display: flex;
    justify-content: space-between;
    gap: 0.8rem;
    font-size: 0.9rem;
  }

  .entry-description {
    margin-top: 0.35rem;
    color: #2b241d;
  }

  .preview-bullets {
    margin: 0.55rem 0 0;
    padding-left: 1rem;
    display: grid;
    gap: 0.28rem;
  }

  @media (max-width: 760px) {
    .preview-sheet {
      margin: 0.7rem;
      padding: 1rem;
    }

    .entry-main,
    .entry-meta {
      flex-direction: column;
      gap: 0.15rem;
    }
  }
</style>
