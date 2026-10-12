<script>
  let { data, form } = $props();
</script>
<h1>{data.marker}</h1>
<p>{data.hook}</p>
<p>{data.origin}</p>
<form method="POST"><label>Value <input name="value" maxlength="64" value="fixture" /></label><button>Submit</button></form>
{#if form?.value}<p>{form.value}</p>{/if}
{#if form?.error}<p>{form.error}</p>{/if}
