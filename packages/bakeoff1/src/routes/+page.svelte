<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<main class="landing">
  <section class="hero">
    <p class="eyebrow">Endless Resume</p>
    <h1>Build once, tailor forever.</h1>
    <p class="lead">
      Endless Resume is a resume editor and tailoring tool that turns one deep career source into
      multiple targeted resumes for different roles, companies, and industries.
    </p>

    <div class="hero-cta">
      <a class="btn primary" href={resolve('/dashboard')}>Open Dashboard</a>
      <a class="btn" href={resolve('/editor')}>Start from CV</a>
    </div>

    <blockquote>“Build once, tailor forever.”</blockquote>
  </section>

  <section class="panel value-grid" aria-label="Core value">
    <article>
      <h2>One Master CV, Many Tailored Resumes</h2>
      <p>
        Keep a rich, long-form CV or career database in one place. Generate and refine role-specific
        resume versions without rewriting your story from scratch each time.
      </p>
    </article>
    <article>
      <h2>Tailoring at Scale</h2>
      <p>
        Apply job-focused framing across many resume variants quickly. Instead of editing one
        document over and over, manage a portfolio of resumes from a single source of truth.
      </p>
    </article>
  </section>

  <section class="panel workflow" aria-label="How it works">
    <h2>How Endless Resume Works</h2>
    <ol>
      <li>
        <strong>Build your endless CV:</strong>
        Add full career history, projects, achievements, and context once.
      </li>
      <li>
        <strong>Create targeted versions:</strong>
        Spin up tailored resumes for specific roles, domains, or hiring priorities.
      </li>
      <li>
        <strong>Check one-page fit:</strong>
        Use the resume length indicator to catch overflows and stay within one-page goals when needed.
      </li>
    </ol>
  </section>

  <section class="panel compare" aria-label="Why it stands out">
    <h2>Why It Stands Out</h2>
    <p>
      Some tools offer light tailoring in paid tiers. Endless Resume is designed around deep
      source-first editing and repeatable tailoring as the core workflow.
    </p>
    <ul>
      <li>Central career database instead of disconnected resume files</li>
      <li>Fast resume variant creation from one source</li>
      <li>One-page fit feedback to keep tailored outputs submission-ready</li>
    </ul>
  </section>

  <section class="final-cta">
    <h2>Turn your full career story into job-ready versions.</h2>
    <p>Stop rebuilding resumes from zero. Build your master CV once and tailor with precision.</p>
    <a class="btn primary" href={resolve('/dashboard')}>Get Started</a>
  </section>
</main>

<style>
  .landing {
    --ink: #1f1c17;
    --muted: #5e564b;
    --line: #ddd1c0;
    --surface: #fffaf2;
    --surface-2: #fff;
    --accent: #0f6f63;

    max-width: 1040px;
    margin: 0 auto 4rem;
    padding: 1rem 1.25rem 0;
    color: var(--ink);
  }

  .hero {
    background:
      radial-gradient(circle at 85% 15%, rgb(196 239 232 / 45%) 0%, rgb(255 250 242 / 95%) 42%),
      var(--surface);
    border: 1px solid var(--line);
    border-radius: 1.2rem;
    padding: 2rem;
    box-shadow: 0 10px 28px rgb(31 28 23 / 8%);
  }

  .eyebrow {
    margin: 0;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.78rem;
    font-weight: 700;
  }

  h1 {
    margin: 0.45rem 0 0;
    font-size: clamp(2rem, 4vw, 3rem);
    max-width: 16ch;
  }

  .lead {
    margin: 0.9rem 0 0;
    color: var(--muted);
    max-width: 62ch;
    font-size: 1.05rem;
  }

  .hero-cta {
    margin-top: 1.2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cfc2af;
    border-radius: 0.65rem;
    background: #fff;
    color: var(--ink);
    padding: 0.52rem 0.85rem;
    text-decoration: none;
    font-weight: 600;
  }

  .btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  blockquote {
    margin: 1rem 0 0;
    padding-left: 0.8rem;
    border-left: 3px solid rgb(15 111 99 / 40%);
    color: #2f5e57;
    font-style: italic;
  }

  .panel {
    margin-top: 1rem;
    border: 1px solid var(--line);
    border-radius: 1rem;
    background: var(--surface-2);
    padding: 1.25rem;
  }

  .value-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.3rem, 2.5vw, 1.6rem);
  }

  .panel p {
    margin: 0.65rem 0 0;
    color: var(--muted);
  }

  .workflow ol {
    margin: 0.8rem 0 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.65rem;
    color: #372f24;
  }

  .compare ul {
    margin: 0.75rem 0 0;
    padding-left: 1.1rem;
    display: grid;
    gap: 0.35rem;
    color: #3f372c;
  }

  .final-cta {
    margin-top: 1rem;
    border-radius: 1rem;
    border: 1px solid #cfeae4;
    background: linear-gradient(145deg, #ecfaf7 0%, #f8fdfc 100%);
    padding: 1.25rem;
  }

  .final-cta h2 {
    max-width: 22ch;
  }

  .final-cta p {
    margin: 0.6rem 0 0.95rem;
    color: #385f59;
    max-width: 60ch;
  }

  @media (max-width: 680px) {
    .hero {
      padding: 1.25rem;
    }

    .btn {
      width: 100%;
    }
  }
</style>
