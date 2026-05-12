<script lang="ts">
  type Props = {
    ariaLabel?: string;
    value: string;
    placeholder?: string;
    onsave?: (newValue: string) => void;
  };

  let {
    value = $bindable(''),
    placeholder = '...',
    ariaLabel = 'editable text',
    onsave,
  }: Props = $props();

  let editing = $state(false);
  let draft = $state(value);

  let textareaEl: HTMLTextAreaElement | null = $state(null);

  function startEditing() {
    editing = true;
    draft = value;

    // wait for DOM update then focus
    queueMicrotask(() => {
      textareaEl?.focus();
      textareaEl?.setSelectionRange(draft.length, draft.length);
    });
  }

  function save() {
    const newValue = draft.trim().replace(/\u200B/g, '');
    value = newValue;
    editing = false;
    onsave?.(newValue);
  }

  function cancel() {
    draft = value;
    editing = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }

    // optional UX: Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      save();
    }
  }
</script>

{#if editing}
  <textarea
    bind:this={textareaEl}
    bind:value={draft}
    aria-label={ariaLabel}
    {placeholder}
    onblur={save}
    onkeydown={handleKeydown}
    rows="1"
  ></textarea>
{:else}
  <div
    class:ghost-text={!value}
    role="textbox"
    tabindex="0"
    aria-label={ariaLabel}
    aria-readonly="true"
    onclick={startEditing}
    onkeydown={(e) => e.key === 'Enter' && startEditing()}
  >
    {value || placeholder}
  </div>
{/if}

<style>
  .ghost-text {
    color: #9ca3af; /* light gray */
    opacity: 1; /* override browser default fading */
    font-style: italic;
  }
</style>
