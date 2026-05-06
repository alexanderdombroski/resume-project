<script>
  import Editable from '$lib/components/Editable.svelte';
  import Topbar from '$lib/components/Topbar.svelte';

  let value = $state('');
</script>

<Topbar />
<Editable {value} />
<p>editor</p>
