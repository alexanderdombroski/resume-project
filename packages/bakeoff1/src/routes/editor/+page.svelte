<script>
  import Editable from '$lib/components/Editable.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Topbar from '$lib/components/Topbar.svelte';

  let name = $state('John Doe');
  let title = $state('Senior Software Engineer');
  let contact = $state('john.doe@example.com | 123-456-7890 | LinkedIn: johndoe');
  let summary = $state(
    'Passionate engineer with 10+ years experience building scalable web applications.'
  );
</script>

<div class="editor-container">
  <div class="topbar-area">
    <Topbar />
  </div>

  <aside class="sidebar-area">
    <Sidebar />
  </aside>

  <main class="main-content">
    <div class="resume-paper">
      <header class="resume-header">
        <h1 class="name">
          <Editable bind:value={name} placeholder="Full Name" />
        </h1>
        <p class="title">
          <Editable bind:value={title} placeholder="Job Title" />
        </p>
        <div class="contact-info">
          <Editable bind:value={contact} placeholder="Contact Information" />
        </div>
      </header>

      <section class="resume-section">
        <h2>Summary</h2>
        <div class="section-content">
          <Editable bind:value={summary} placeholder="Professional Summary" />
        </div>
      </section>

      <section class="resume-section">
        <h2>Experience</h2>
        <div class="placeholder-item">
          <p>Double click to edit experience items...</p>
        </div>
      </section>

      <section class="resume-section">
        <h2>Education</h2>
        <div class="placeholder-item">
          <p>Double click to edit education items...</p>
        </div>
      </section>

      <section class="resume-section">
        <h2>Skills</h2>
        <div class="placeholder-item">
          <p>Double click to edit skills...</p>
        </div>
      </section>
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f3f4f6;
  }

  .editor-container {
    display: grid;
    grid-template-areas:
      'topbar topbar'
      'sidebar main';
    grid-template-rows: auto 1fr;
    grid-template-columns: 260px 1fr;
    height: 100vh;
  }

  .topbar-area {
    grid-area: topbar;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    z-index: 10;
  }

  .sidebar-area {
    grid-area: sidebar;
    background: white;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
  }

  .main-content {
    grid-area: main;
    padding: 40px;
    overflow-y: auto;
    display: flex;
    justify-content: center;
  }

  .resume-paper {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
  }

  .resume-header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #374151;
    padding-bottom: 1rem;
  }

  .name {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 800;
    color: #111827;
  }

  .title {
    margin: 0.5rem 0;
    font-size: 1.25rem;
    color: #4b5563;
    font-weight: 500;
  }

  .contact-info {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .resume-section {
    margin-bottom: 1.5rem;
  }

  .resume-section h2 {
    font-size: 1.125rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0.75rem;
    padding-bottom: 0.25rem;
  }

  .section-content {
    color: #374151;
    line-height: 1.5;
  }

  .placeholder-item {
    color: #9ca3af;
    font-style: italic;
    font-size: 0.875rem;
  }
</style>
