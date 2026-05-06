<script lang="ts">
  type Props = {
    tag?: 'p' | 'span' | 'li';
    /** Bindable string */
    value: string;
    placeholder?: string;
  };

  let { tag = 'p', value, placeholder = 'double click to edit' }: Props = $props();

  let editing = $state(false);
  let ghostText = $derived(placeholder);

  function initEditing() {
    ghostText = '';
    editing = true;
  }

  function save(e: Event) {
    const target = e.target as HTMLElement;
    const newValue = target.textContent.trim().replace(/\u200B/g, '');
    console.log('blur', newValue, !newValue);
    value = newValue;
    if (!newValue) {
      // target.textContent = ""
      ghostText = placeholder;
      console.log('inserting', placeholder, !value);
    }
    editing = false;
  }
</script>

<svelte:element
  this={tag}
  contenteditable={editing}
  ondblclick={initEditing}
  onblur={save}
  role="textbox"
  tabindex="0"
  class:ghost-text={!value}
>
  {value || ghostText}
</svelte:element>

<style>
  .ghost-text[contenteditable='false'] {
    color: #9ca3af; /* light gray */
    opacity: 1; /* override browser default fading */
    font-style: italic;
  }
</style>
