<script>
  import { onMount } from 'svelte';
  let { children } = $props();
  onMount(() => { document.documentElement.dataset.fixtureHydrated = 'true'; });
</script>
{@render children()}
