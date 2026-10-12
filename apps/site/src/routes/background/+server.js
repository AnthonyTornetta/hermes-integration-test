import { randomUUID } from 'node:crypto';
import { getCache } from '@arvumi/cache';
import { waitUntil } from '@arvumi/platform';
import { MARKER } from '#lib/server/fixture.js';
const KEY = 'svelte-fixture-background', TAG = 'svelte-fixture-background-tag';
export async function GET() {
  const value = await getCache().read(KEY, { tags: [TAG] });
  return Response.json({ marker: MARKER, hit: value.value !== null, value: value.value === null ? null : new TextDecoder().decode(value.value) });
}
export async function DELETE() { await getCache().invalidate([TAG]); return Response.json({ marker: MARKER, invalidated: true }); }
export async function POST() {
  const cache = getCache(), observation = await cache.read(KEY, { tags: [TAG] });
  const value = MARKER + ':background:' + randomUUID();
  waitUntil((async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await cache.write(observation, new TextEncoder().encode(value), { ttlSeconds: 300, tags: [TAG] });
  })());
  return Response.json({ accepted: true, expected: value });
}
