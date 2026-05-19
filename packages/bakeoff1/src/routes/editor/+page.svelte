<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  type ResumeSection = NonNullable<PageData['resume']>['sections'][number];

  const mode = $derived(data.mode);

  let draftTitle = $state('Untitled Resume');
  let draftSummary = $state('');
  let sections = $state<ResumeSection[]>([]);
  let nextTempBulletId = $state(-1);
  let saveState = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
  let savedMessageTimer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    draftTitle = data.resume?.title ?? 'Untitled Resume';
    draftSummary = data.resume?.summary ?? '';
    sections = (data.resume?.sections ?? []).map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        label: item.label ?? '',
        value: item.value ?? '',
        start_date: item.start_date ?? '',
        end_date: item.end_date ?? '',
        location: item.location ?? '',
        description: item.description ?? '',
      })),
      bullets: [...section.bullets],
    }));
  });

  function addBullet(sectionId: number) {
    sections = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            bullets: [
              ...section.bullets,
              {
                id: nextTempBulletId--,
                section_id: sectionId,
                content: '',
                item_order: section.bullets.length,
              },
            ],
          }
        : section
    );
  }

  function removeBullet(sectionId: number, bulletId: number) {
    sections = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            bullets: section.bullets.filter((bullet) => bullet.id !== bulletId),
          }
        : section
    );
  }

  function serializeSections(payloadSections: ResumeSection[]) {
    return JSON.stringify(
      payloadSections.map((section, sectionIndex) => ({
        id: section.id,
        items: section.items.map((item, itemIndex) => ({
          ...item,
          item_order: itemIndex,
        })),
        bullets: section.bullets.map((bullet, bulletIndex) => ({
          ...bullet,
          item_order: bulletIndex,
        })),
        item_order: sectionIndex,
      }))
    );
  }

  function handleEnhance() {
    saveState = 'saving';
    return async ({
      result,
      update,
    }: {
      result: { type: string };
      update: () => Promise<void>;
    }) => {
      if (result.type === 'success') {
        await update();
        saveState = 'saved';
        if (savedMessageTimer) clearTimeout(savedMessageTimer);
        savedMessageTimer = setTimeout(() => {
          saveState = 'idle';
        }, 2500);
        return;
      }

      saveState = 'error';
    };
  }
</script>

<main class="editor-page">
  <div class="editor-topbar">
    <p class="mode">
      {mode === 'edit' ? `Editing Resume #${data.resume?.id ?? ''}` : 'New Resume'}
    </p>
    <div class="topbar-actions">
      <button type="button" class="action">Preview</button>
      <button type="submit" class="action" form="resume-save-form">
        {saveState === 'saving' ? 'Saving...' : 'Save'}
      </button>
      {#if saveState === 'saved'}
        <span class="save-indicator" role="status" aria-live="polite">Saved</span>
      {:else if saveState === 'error'}
        <span class="save-indicator error" role="alert">Save failed</span>
      {/if}
    </div>
  </div>

  {#if mode === 'edit' && data.resume}
    <form id="resume-save-form" method="POST" action="?/save" use:enhance={handleEnhance}>
      <input type="hidden" name="resumeId" value={data.resume.id} />
      <input type="hidden" name="sections" value={serializeSections(sections)} />
      <article class="resume-sheet" aria-label="Resume editor">
        <header class="sheet-header">
          <input
            class="resume-title"
            bind:value={draftTitle}
            name="title"
            aria-label="Resume title"
          />
          <p class="sub-meta">Candidate profile for tailoring • User {data.resume.userId}</p>
        </header>

        <section class="summary" aria-label="Professional summary">
          <h2>Professional Summary</h2>
          <textarea
            bind:value={draftSummary}
            name="summary"
            rows="4"
            placeholder="Add a concise summary tailored to the role"
          ></textarea>
        </section>

        <section class="resume-sections" aria-label="Resume sections">
          {#each sections as section, sectionIndex (section.id)}
            <section class="resume-section">
              <header class="section-header">
                <h2>{section.title}</h2>
                <span>{section.type ?? 'Section'}</span>
              </header>

              {#if section.items.length > 0}
                <div class="entries">
                  {#each section.items as item, itemIndex (item.id)}
                    <article class="entry-row">
                      <div class="entry-head">
                        <input
                          bind:value={sections[sectionIndex].items[itemIndex].label}
                          aria-label="Entry label"
                          placeholder="Role or degree"
                        />
                        <input
                          bind:value={sections[sectionIndex].items[itemIndex].value}
                          aria-label="Entry value"
                          placeholder="Company or school"
                        />
                      </div>
                      <div class="entry-meta">
                        <input
                          bind:value={sections[sectionIndex].items[itemIndex].start_date}
                          aria-label="Start date"
                          placeholder="Start"
                        />
                        <input
                          bind:value={sections[sectionIndex].items[itemIndex].end_date}
                          aria-label="End date"
                          placeholder="End"
                        />
                        <input
                          bind:value={sections[sectionIndex].items[itemIndex].location}
                          aria-label="Location"
                          placeholder="Location"
                        />
                      </div>
                      <textarea
                        bind:value={sections[sectionIndex].items[itemIndex].description}
                        rows="2"
                        aria-label="Entry description"
                        placeholder="Scope and impact"
                      ></textarea>
                    </article>
                  {/each}
                </div>
              {/if}

              <div class="bullets">
                {#if section.bullets.length > 0}
                  {#each section.bullets as bullet, bulletIndex (bullet.id)}
                    <div class="bullet-line">
                      <span class="marker" aria-hidden="true">•</span>
                      <input
                        bind:value={sections[sectionIndex].bullets[bulletIndex].content}
                        aria-label="Bullet point"
                        placeholder="Achievement bullet"
                      />
                      <button
                        class="remove-bullet"
                        type="button"
                        aria-label="Remove bullet"
                        title="Remove bullet"
                        onclick={() => removeBullet(section.id, bullet.id)}
                      >
                        &minus;
                      </button>
                    </div>
                  {/each}
                {:else}
                  <p class="empty">No bullet points yet.</p>
                {/if}

                <button class="add-bullet" type="button" onclick={() => addBullet(section.id)}>
                  + Add bullet point
                </button>
              </div>
            </section>
          {/each}
        </section>
      </article>
    </form>
  {:else}
    <section class="empty-state">
      <h1>Start a New Resume</h1>
      <p>Load a resume from the dashboard or create a new one to begin tailoring.</p>
      <button type="button" class="action">Create Resume</button>
    </section>
  {/if}
</main>

<style>
  .editor-page {
    --paper: #fff;
    --bg: #f4f0e8;
    --ink: #1f1b15;
    --muted: #6c6154;
    --line: #ddd3c5;
    --accent: #0f6f63;

    min-height: calc(100vh - 12rem);
    background: linear-gradient(180deg, #f8f5ef 0%, #f2ece2 100%);
    padding: 1.25rem;
  }

  .editor-topbar {
    max-width: 860px;
    margin: 0 auto 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mode {
    margin: 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action {
    border: 1px solid #d2c6b7;
    background: #fff;
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
  }

  .save-indicator {
    color: var(--accent);
    font-size: 0.85rem;
    font-weight: 600;
  }

  .save-indicator.error {
    color: #b42318;
  }

  .resume-sheet {
    max-width: 860px;
    margin: 0 auto;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: 0 18px 40px rgb(31 27 21 / 10%);
    padding: 2rem 2.2rem;
  }

  .sheet-header {
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.8rem;
  }

  .resume-title {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--ink);
    font-family: var(--font-heading);
    font-size: clamp(1.8rem, 3vw, 2.3rem);
    font-weight: 650;
    padding: 0;
  }

  .resume-title:focus {
    outline: none;
  }

  .sub-meta {
    margin: 0.3rem 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .summary,
  .resume-section {
    margin-top: 1.2rem;
  }

  h2 {
    margin: 0;
    font-size: 1.04rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #3e362c;
  }

  .summary textarea,
  input,
  .entry-row textarea {
    width: 100%;
    border: 1px solid #e2d8cb;
    border-radius: 6px;
    padding: 0.45rem 0.55rem;
    background: #fff;
  }

  .summary textarea {
    margin-top: 0.45rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid #e8dfd3;
    padding-bottom: 0.35rem;
  }

  .section-header span {
    color: var(--muted);
    font-size: 0.82rem;
  }

  .entries {
    margin-top: 0.7rem;
    display: grid;
    gap: 0.75rem;
  }

  .entry-row {
    padding-bottom: 0.6rem;
    border-bottom: 1px dashed #e9dfd2;
  }

  .entry-head,
  .entry-meta {
    display: grid;
    gap: 0.45rem;
    margin-bottom: 0.45rem;
  }

  .entry-head {
    grid-template-columns: 1fr 1fr;
  }

  .entry-meta {
    grid-template-columns: repeat(3, 1fr);
  }

  .bullets {
    margin-top: 0.7rem;
  }

  .bullet-line {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.45rem;
    align-items: center;
    margin-top: 0.45rem;
  }

  .marker {
    color: #685b4b;
    font-size: 1rem;
  }

  .remove-bullet {
    width: 1.9rem;
    height: 1.9rem;
    border: 1px solid #e4c2c2;
    border-radius: 999px;
    background: #fff;
    color: #c02222;
    font-size: 1.1rem;
    line-height: 1;
  }

  .add-bullet {
    margin-top: 0.6rem;
    border: 1px dashed #cdbba4;
    background: #fbf8f2;
    color: #5b4f41;
    border-radius: 6px;
    padding: 0.42rem 0.58rem;
    font-size: 0.86rem;
  }

  .empty {
    margin: 0.45rem 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .empty-state {
    max-width: 860px;
    margin: 0 auto;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: #fff;
    padding: 1.2rem;
  }

  .empty-state h1 {
    margin: 0;
  }

  .empty-state p {
    color: var(--muted);
  }

  @media (max-width: 760px) {
    .resume-sheet {
      padding: 1.2rem;
    }

    .entry-head,
    .entry-meta,
    .editor-topbar {
      grid-template-columns: 1fr;
      display: grid;
      gap: 0.45rem;
    }

    .editor-topbar {
      justify-content: unset;
    }
  }
</style>
