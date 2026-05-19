<script lang="ts">
  // Replace with your real auth state later
  let isLoggedIn = false;

  import { DropdownMenu } from 'bits-ui';
  // import Login from './Login.svelte';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="menu-trigger" aria-label="Open account menu">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      ><g data-name="Layer 2"
        ><g data-name="person"
          ><rect width="24" height="24" opacity="0" /><path
            d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"
          /><path d="M18 21a1 1 0 0 0 1-1 7 7 0 0 0-14 0 1 1 0 0 0 1 1z" /></g
        ></g
      ></svg
    >
  </DropdownMenu.Trigger>

  <DropdownMenu.Content class="menu-content" sideOffset={8}>
    <div class="menu-content-wrap">
      {#if isLoggedIn}
        <DropdownMenu.Item class="menu-item">Dashboard</DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item class="menu-item">Log out</DropdownMenu.Item>
      {:else}
        <DropdownMenu.Item class="menu-item">Register</DropdownMenu.Item>
        <DropdownMenu.Item class="menu-item">Login</DropdownMenu.Item>
        <!-- <DropdownMenu.Item><Login /></DropdownMenu.Item> -->
      {/if}
    </div>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<style>
  :global(.menu-trigger) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.45rem;
    cursor: pointer;
    transition: background-color 140ms ease;
  }

  .menu-trigger:hover {
    background: color-mix(in oklab, var(--color-text) 7%, transparent);
  }

  .menu-trigger:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--color-primary) 65%, white);
    outline-offset: 2px;
  }

  svg {
    width: 1.3rem;
    height: 1.3rem;
    fill: color-mix(in oklab, var(--color-text) 86%, var(--color-primary));
  }

  :global(.menu-content),
  :global([data-dropdown-menu-content]) {
    min-width: 10rem;
    padding: 0;
    border-radius: 0.75rem;
    border: 1px solid color-mix(in oklab, var(--color-text) 14%, transparent);
    background-color: white !important;
    opacity: 1;
    box-shadow:
      0 10px 24px color-mix(in oklab, black 14%, transparent),
      0 2px 5px color-mix(in oklab, black 8%, transparent);
  }

  .menu-content-wrap {
    padding: 0.35rem;
    border-radius: 0.75rem;
    background-color: color-mix(in oklab, var(--color-bg) 92%, white);
  }

  :global(.menu-item) {
    border-radius: 0.5rem;
    padding: 0.5rem 0.65rem;
    font-size: 0.95rem;
    line-height: 1.2;
    cursor: pointer;
    outline: none;
  }

  :global(.menu-item[data-highlighted]) {
    /* background: color-mix(in oklab, var(--color-primary) 14%, transparent); */
  }
</style>
