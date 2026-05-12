<script lang="ts">
  import { resolve } from '$app/paths';
  import { AlertDialog, DropdownMenu } from 'bits-ui';
  import Editable from '$lib/components/Editable.svelte';
  import type { PageData } from './$types';

  type Resume = {
    id: string;
    title: string;
    kind: 'standard' | 'cv';
    lastUpdated: string;
    createdAt: string;
    tags: string[];
  };

  let { data }: { data: PageData } = $props();

  let resumes = $derived<Resume[]>(data.resumes);

  const highlightedResume = $derived(resumes.find((resume) => resume.kind === 'cv'));
  const standardResumes = $derived(resumes.filter((resume) => resume.kind !== 'cv'));

  async function renameResume(id: string, newTitle: string) {
    const previous = resumes;
    const fallbackTitle = previous.find((resume) => resume.id === id)?.title ?? '';
    const nextTitle = newTitle || fallbackTitle;

    resumes = resumes.map((resume) =>
      resume.id === id ? { ...resume, title: nextTitle } : resume
    );

    const formData = new FormData();
    formData.set('resumeId', id);
    formData.set('title', nextTitle);

    const response = await fetch('?/rename', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      resumes = previous;
    }
  }

  async function deleteResume(id: string) {
    const previous = resumes;
    resumes = resumes.filter((resume) => resume.id !== id);

    const formData = new FormData();
    formData.set('resumeId', id);

    const response = await fetch('?/delete', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      resumes = previous;
    }
  }

  function getEditorUrl(id?: string): string {
    const basePath = resolve('/editor');
    if (!id) return basePath;
    return `${basePath}?${new URLSearchParams({ resumeId: id }).toString()}`;
  }
</script>

<section class="dashboard">
  <header class="hero">
    <div>
      <p class="eyebrow">Resume Dashboard</p>
      <h1>All Resumes</h1>
      <p class="subtitle">
        Manage documents at a high level. Editing happens in the dedicated editor flow.
      </p>
    </div>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="btn primary" href={getEditorUrl()}>Create</a>
  </header>

  {#if highlightedResume}
    <article class="highlight-card" aria-label="Highlighted endless resume">
      <div class="badge">Highlighted CV</div>
      <div class="highlight-head">
        <h2>
          <Editable
            ariaLabel="Rename endless resume title"
            value={highlightedResume.title}
            onsave={(newTitle) => renameResume(highlightedResume.id, newTitle)}
          />
        </h2>
        <p class="meta">ID: {highlightedResume.id}</p>
      </div>
      <p class="description">
        This endless resume is your full-length CV profile that can hold complete career history,
        publications, projects, and extended context.
      </p>
      <div class="tag-list">
        {#each highlightedResume.tags as tag (tag)}
          <span>{tag}</span>
        {/each}
      </div>
      <div class="timestamps">
        <span><strong>Created:</strong> {highlightedResume.createdAt}</span>
        <span><strong>Updated:</strong> {highlightedResume.lastUpdated}</span>
      </div>

      <div class="actions" aria-label="Endless resume operations">
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a class="btn" href={getEditorUrl(highlightedResume.id)}>Edit</a>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger class="btn menu-trigger">More</DropdownMenu.Trigger>
          <DropdownMenu.Content class="menu-content" sideOffset={8}>
            <DropdownMenu.Item>Edit</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </article>
  {/if}

  <section class="resume-grid" aria-label="Standard resumes">
    {#each standardResumes as resume (resume.id)}
      <article class="resume-card">
        <div class="card-top">
          <div>
            <h3>
              <Editable
                ariaLabel={`Rename ${resume.title}`}
                value={resume.title}
                onsave={(newTitle) => renameResume(resume.id, newTitle)}
              />
            </h3>
            <p class="meta">ID: {resume.id}</p>
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger class="menu-dot" aria-label={`Open actions for ${resume.title}`}>
              •••
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="menu-content" sideOffset={8}>
              <DropdownMenu.Item>Edit</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <div class="tag-list compact">
          {#each resume.tags as tag (tag)}
            <span>{tag}</span>
          {/each}
        </div>

        <div class="timestamps compact">
          <span><strong>Created:</strong> {resume.createdAt}</span>
          <span><strong>Updated:</strong> {resume.lastUpdated}</span>
        </div>

        <div class="actions compact" aria-label={`${resume.title} operations`}>
          <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
          <a class="btn" href={getEditorUrl(resume.id)}>Edit</a>
          <AlertDialog.Root>
            <AlertDialog.Trigger class="btn danger">Delete</AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay class="dialog-overlay" />
              <AlertDialog.Content class="dialog-content">
                <AlertDialog.Title>Delete Resume?</AlertDialog.Title>
                <AlertDialog.Description>
                  This will permanently delete "{resume.title}" and all associated sections.
                </AlertDialog.Description>
                <div class="dialog-actions">
                  <AlertDialog.Cancel class="btn">Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action class="btn danger" onclick={() => deleteResume(resume.id)}>
                    Delete Resume
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </article>
    {/each}
  </section>
</section>

<style>
  .dashboard {
    --bg: #f6f3ee;
    --surface: #fffaf2;
    --surface-2: #ffffff;
    --ink: #1f1c17;
    --muted: #5f5649;
    --accent: #0f6f63;
    --accent-2: #c4efe8;
    --danger: #9f2f2f;
    --line: #e3d8c8;

    max-width: 1080px;
    margin: 2.5rem auto 4rem;
    padding: 0 1.25rem;
    color: var(--ink);
  }

  .hero {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .eyebrow {
    margin: 0;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    font-size: 0.8rem;
  }

  h1 {
    margin: 0.25rem 0;
    font-size: clamp(1.75rem, 3vw, 2.3rem);
  }

  .subtitle {
    margin: 0;
    color: var(--muted);
    max-width: 52ch;
  }

  .highlight-card,
  .resume-card {
    border: 1px solid var(--line);
    border-radius: 1rem;
    background: var(--surface-2);
    box-shadow: 0 6px 20px rgb(31 28 23 / 8%);
  }

  .highlight-card {
    background:
      radial-gradient(circle at top right, rgb(196 239 232 / 85%) 0%, rgb(255 250 242 / 90%) 45%),
      var(--surface);
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .badge {
    width: fit-content;
    border-radius: 999px;
    border: 1px solid rgb(15 111 99 / 35%);
    color: var(--accent);
    background: rgb(255 255 255 / 70%);
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .highlight-head {
    margin-top: 0.8rem;
  }

  h2,
  h3 {
    margin: 0;
    line-height: 1.2;
  }

  h2 :global([role='textbox']),
  h3 :global([role='textbox']) {
    cursor: text;
    border-radius: 0.45rem;
    padding: 0.15rem 0.2rem;
  }

  h2 :global([role='textbox']:focus),
  h3 :global([role='textbox']:focus) {
    outline: 2px solid rgb(15 111 99 / 30%);
    outline-offset: 2px;
  }

  h2 :global(textarea),
  h3 :global(textarea) {
    width: 100%;
    font: inherit;
    color: inherit;
    border: 1px solid var(--line);
    border-radius: 0.45rem;
    padding: 0.2rem 0.35rem;
    resize: none;
    background: #fff;
  }

  .description {
    margin: 0.7rem 0 0;
    color: #3a3328;
    max-width: 70ch;
  }

  .meta {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: var(--muted);
  }

  .tag-list {
    margin-top: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .tag-list span {
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgb(255 255 255 / 65%);
    padding: 0.2rem 0.55rem;
    font-size: 0.8rem;
  }

  .timestamps {
    margin-top: 0.95rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: #4f473c;
    font-size: 0.9rem;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cfc2af;
    background: #fff;
    color: var(--ink);
    border-radius: 0.65rem;
    padding: 0.46rem 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
  }

  .btn.primary {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
  }

  :global(.btn.danger) {
    border-color: rgb(159 47 47 / 35%);
    color: var(--danger);
  }

  :global(.dialog-overlay) {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 45%);
    z-index: 1000;
  }

  :global(.dialog-content) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(92vw, 440px);
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 0.9rem;
    box-shadow: 0 20px 40px rgb(0 0 0 / 18%);
    padding: 1rem;
    z-index: 1001;
  }

  :global(.dialog-content h2),
  :global(.dialog-content h3) {
    margin: 0;
  }

  :global(.dialog-content p) {
    margin: 0.6rem 0 0;
    color: var(--muted);
  }

  .dialog-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: end;
    gap: 0.55rem;
  }

  .resume-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.9rem;
  }

  .resume-card {
    padding: 0.95rem;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 0.65rem;
  }

  .menu-dot,
  .menu-trigger {
    font-weight: 700;
    line-height: 1;
  }

  .menu-dot {
    border: 1px solid var(--line);
    border-radius: 0.55rem;
    background: #fff;
    min-width: 2rem;
    height: 2rem;
    cursor: default;
  }

  :global(.menu-content) {
    background: #fff;
    border: 1px solid #d7cab6;
    border-radius: 0.7rem;
    padding: 0.3rem;
    min-width: 10.5rem;
    box-shadow: 0 10px 30px rgb(31 28 23 / 16%);
  }

  :global(.menu-content [data-menu-item]) {
    border-radius: 0.5rem;
    padding: 0.45rem 0.6rem;
    font-size: 0.9rem;
  }

  :global(.menu-content [data-menu-item][data-highlighted]) {
    background: #f3efe7;
  }

  :global(.menu-content [data-menu-separator]) {
    height: 1px;
    background: #ece2d4;
    margin: 0.2rem 0;
  }

  .compact.actions {
    margin-top: 0.8rem;
  }

  .compact.timestamps {
    margin-top: 0.75rem;
    font-size: 0.84rem;
  }

  .compact.tag-list {
    margin-top: 0.7rem;
  }

  @media (max-width: 680px) {
    .hero {
      flex-direction: column;
      align-items: start;
    }

    .btn.primary {
      width: 100%;
    }
  }
</style>
