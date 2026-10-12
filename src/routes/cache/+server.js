import { getCache } from '@arvumi/cache';
import { MARKER } from '#lib/server/fixture.js';
const KEY = 'svelte-fixture-value', TAG = 'svelte-fixture-tag';
export async function GET() {
  const value = await getCache().read(KEY, { tags: [TAG] });
  return Response.json({ marker: MARKER, hit: value.value !== null, value: value.value === null ? null : new TextDecoder().decode(value.value) });
}
export async function POST() {
  const cache = getCache(), value = await cache.read(KEY, { tags: [TAG] });
  const written = await cache.write(value, new TextEncoder().encode(MARKER + ':cache'), { ttlSeconds: 300, tags: [TAG] });
  return Response.json({ marker: MARKER, written });
}
export async function DELETE() { await getCache().invalidate([TAG]); return Response.json({ marker: MARKER, invalidated: true }); }
