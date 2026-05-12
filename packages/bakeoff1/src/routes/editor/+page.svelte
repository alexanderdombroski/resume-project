<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const mode = $derived(data.mode);

  let draftTitle = $state(data.resume?.title ?? 'Untitled Resume');
  let draftSummary = $state(data.resume?.summary ?? '');

  const sectionCount = $derived(data.resume?.sections.length ?? 0);
  const itemCount = $derived(
    data.resume?.sections.reduce((total, section) => total + section.items.length, 0) ?? 0
  );
  const bulletCount = $derived(
    data.resume?.sections.reduce((total, section) => total + section.bullets.length, 0) ?? 0
  );
</script>

<main class="editor-shell">
  <section class="editor-canvas">
    {#if mode === 'edit' && data.resume}
      <header class="editor-header">
        <div>
          <p class="eyebrow">Editing Resume #{data.resume.id}</p>
          <input class="title-input" bind:value={draftTitle} aria-label="Resume title" />
          <p class="meta">Owner: User {data.resume.userId}</p>
        </div>

        <div class="header-actions">
          <button class="btn" type="button">Preview</button>
          <button class="btn" type="button">Duplicate</button>
          <button class="btn primary" type="button">Save Draft</button>
        </div>
      </header>

      <section class="summary-card">
        <label for="summary">Professional Summary</label>
        <textarea
          id="summary"
          bind:value={draftSummary}
          rows="4"
          placeholder="Add a concise summary tailored to your target role..."
        ></textarea>
      </section>

      <section class="section-list" aria-label="Resume sections">
        {#each data.resume.sections as section (section.id)}
          <article class="section-card">
            <header>
              <div>
                <p class="section-type">{section.type ?? 'General section'}</p>
                <h2>{section.title}</h2>
              </div>
              <span class="section-order">Order {section.order}</span>
            </header>

            <div class="section-body">
              <div class="column">
                <p class="label">Entries</p>
                {#if section.items.length > 0}
                  {#each section.items as item (item.id)}
                    <div class="entry">
                      <input value={item.label ?? ''} aria-label="Entry label" />
                      <input value={item.value ?? ''} aria-label="Entry value" />
                      <div class="triple">
                        <input
                          value={item.start_date ?? ''}
                          aria-label="Start date"
                          placeholder="Start"
                        />
                        <input
                          value={item.end_date ?? ''}
                          aria-label="End date"
                          placeholder="End"
                        />
                        <input
                          value={item.location ?? ''}
                          aria-label="Location"
                          placeholder="Location"
                        />
                      </div>
                      <textarea
                        rows="2"
                        aria-label="Entry description"
                        placeholder="Describe impact and scope">{item.description ?? ''}</textarea
                      >
                    </div>
                  {/each}
                {:else}
                  <p class="empty">No section items yet.</p>
                {/if}
              </div>

              <div class="column">
                <p class="label">Bullets</p>
                {#if section.bullets.length > 0}
                  {#each section.bullets as bullet (bullet.id)}
                    <div class="bullet-row">
                      <span class="dot" aria-hidden="true"></span>
                      <input value={bullet.content} aria-label="Bullet point" />
                    </div>
                  {/each}
                {:else}
                  <p class="empty">No bullet points yet.</p>
                {/if}
              </div>
            </div>
          </article>
        {/each}
      </section>
    {:else}
      <section class="blank-state">
        <p class="eyebrow">New Resume</p>
        <h1>Start your next tailored version</h1>
        <p>
          No resume was loaded. Create a title and summary, then add sections for experience,
          education, projects, and tailored achievements.
        </p>
        <div class="blank-actions">
          <button class="btn primary" type="button">Create Resume</button>
          <button class="btn" type="button">Load Existing</button>
        </div>
      </section>
    {/if}
  </section>

  <aside class="editor-rail" aria-label="Resume guidance">
    <section class="rail-card">
      <h3>Session Snapshot</h3>
      <dl>
        <div>
          <dt>Mode</dt>
          <dd>{mode === 'edit' ? 'Editing existing resume' : 'Creating new resume'}</dd>
        </div>
        <div>
          <dt>Sections</dt>
          <dd>{sectionCount}</dd>
        </div>
        <div>
          <dt>Entries</dt>
          <dd>{itemCount}</dd>
        </div>
        <div>
          <dt>Bullets</dt>
          <dd>{bulletCount}</dd>
        </div>
      </dl>
    </section>

    <section class="rail-card">
      <h3>Tailoring Checklist</h3>
      <ul>
        <li>Match section order to target role priorities</li>
        <li>Swap generic bullets for measurable outcomes</li>
        <li>Prioritize skills named in the job description</li>
        <li>Confirm one-page fit before final export</li>
      </ul>
    </section>
  </aside>
</main>

<style>
  .editor-shell {
    --ink: #201a14;
    --muted: #62594d;
    --line: #dfd2bf;
    --surface: #fffefb;
    --surface-2: #f8f3ea;
    --accent: #0f6f63;

    margin: 1rem auto 3rem;
    max-width: 1240px;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 1rem;
    color: var(--ink);
  }

  .editor-canvas,
  .rail-card,
  .section-card,
  .summary-card,
  .blank-state {
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--surface);
  }

  .editor-canvas {
    padding: 0.95rem;
    background:
      radial-gradient(circle at top right, rgb(196 239 232 / 35%) 0%, rgb(255 254 251 / 94%) 30%),
      var(--surface);
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 1rem;
    margin-bottom: 0.8rem;
  }

  .eyebrow {
    margin: 0;
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .title-input {
    margin-top: 0.35rem;
    font-size: clamp(1.45rem, 2.3vw, 2rem);
    font-family: var(--font-heading);
    font-weight: 650;
    border: none;
    background: transparent;
    width: 100%;
    color: var(--ink);
    padding: 0;
  }

  .title-input:focus {
    outline: none;
  }

  .meta {
    margin: 0.25rem 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    justify-content: end;
  }

  .btn {
    border: 1px solid #d2c5b2;
    background: #fff;
    border-radius: 10px;
    padding: 0.45rem 0.75rem;
    font-weight: 600;
    cursor: default;
  }

  .btn.primary {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
  }

  .summary-card {
    margin-top: 0.75rem;
    padding: 0.85rem;
  }

  label,
  .label {
    display: block;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #3f594f;
    margin-bottom: 0.4rem;
  }

  textarea,
  input {
    width: 100%;
    border: 1px solid #d9ccb8;
    border-radius: 8px;
    padding: 0.45rem 0.55rem;
    background: #fff;
    color: var(--ink);
  }

  .section-list {
    margin-top: 0.85rem;
    display: grid;
    gap: 0.75rem;
  }

  .section-card {
    padding: 0.8rem;
  }

  .section-card > header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }

  .section-type {
    margin: 0;
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3 {
    margin: 0.25rem 0 0;
  }

  .section-order {
    color: var(--muted);
    font-size: 0.85rem;
  }

  .section-body {
    margin-top: 0.7rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .column {
    background: var(--surface-2);
    border: 1px solid #eadfce;
    border-radius: 10px;
    padding: 0.65rem;
  }

  .entry,
  .bullet-row {
    margin-top: 0.5rem;
  }

  .entry {
    display: grid;
    gap: 0.45rem;
  }

  .triple {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.4rem;
  }

  .bullet-row {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.45rem;
  }

  .dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 999px;
    background: #75634b;
  }

  .empty {
    margin: 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .editor-rail {
    display: grid;
    gap: 0.75rem;
    align-self: start;
    position: sticky;
    top: 1rem;
  }

  .rail-card {
    padding: 0.85rem;
  }

  .rail-card h3 {
    margin: 0;
    font-size: 1.05rem;
  }

  dl {
    margin: 0.75rem 0 0;
    display: grid;
    gap: 0.55rem;
  }

  dl div {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    color: var(--muted);
    font-size: 0.92rem;
  }

  dt {
    font-weight: 600;
    color: #4f463b;
  }

  dd {
    margin: 0;
    text-align: right;
  }

  ul {
    margin: 0.7rem 0 0;
    padding-left: 1rem;
    color: #4f463b;
    display: grid;
    gap: 0.4rem;
  }

  .blank-state {
    padding: 1.2rem;
  }

  .blank-state p {
    color: var(--muted);
    max-width: 62ch;
  }

  .blank-actions {
    margin-top: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  @media (max-width: 1020px) {
    .editor-shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .editor-rail {
      position: static;
    }
  }

  @media (max-width: 720px) {
    .editor-header {
      flex-direction: column;
    }

    .header-actions {
      width: 100%;
      justify-content: start;
    }

    .section-body,
    .triple {
      grid-template-columns: 1fr;
    }

    .btn {
      width: 100%;
    }
  }
</style>
