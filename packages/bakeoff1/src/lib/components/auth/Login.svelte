<script>
  import { Dialog } from 'bits-ui';
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <button type="button"> Log in </button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay />

    <Dialog.Content>
      <Dialog.Title>Log in</Dialog.Title>

      <Dialog.Description>Enter your credentials to log in.</Dialog.Description>

      <form>
        <div>
          <label for="email">Email</label>
          <input id="email" type="email" />
        </div>

        <div>
          <label for="password">Password</label>
          <input id="password" type="password" />
        </div>

        <div>
          <button type="submit"> Submit </button>
        </div>
      </form>

      <Dialog.Close>
        <button type="button"> Close </button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
