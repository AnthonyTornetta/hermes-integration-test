<script>
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>
<h1>{data.marker}</h1>
<p>{data.hook}</p>
<p>{data.origin}</p>
<form method="POST" use:enhance data-testid="enhanced-form"><label>Value <input name="value" maxlength="64" value="fixture" /></label><label><input type="checkbox" name="unexpected" value="1" />Include unexpected field</label><button>Submit</button></form>
<form method="POST" data-testid="plain-form"><label>Plain value <input name="value" maxlength="64" value="plain" /></label><button>Plain submit</button></form>
{#if form?.value}<p>{form.value}</p>{/if}
{#if form?.error}<p>{form.error}</p>{/if}

<a href="/navigation" data-testid="navigation-link">Navigation fixture</a>
<img src="/_arvumi/image?url=%2Ffixture.png&amp;w=12&amp;q=75" alt="Fixture raster" width="12" height="6" />
