<script lang="ts">
  // Replace with your real auth state later
  let isLoggedIn = true;

  import { DropdownMenu } from 'bits-ui';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Account</DropdownMenu.Trigger>

  <DropdownMenu.Content>
    {#if isLoggedIn}
      <DropdownMenu.Item>Dashboard</DropdownMenu.Item>

      <DropdownMenu.Separator />

      <DropdownMenu.Item>Log out</DropdownMenu.Item>
    {:else}
      <DropdownMenu.Item>Register</DropdownMenu.Item>

      <DropdownMenu.Item>Log in</DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
