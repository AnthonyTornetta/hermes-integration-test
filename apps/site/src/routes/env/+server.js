import { readFile } from 'node:fs/promises';
import { MARKER } from '#lib/server/fixture.js';
export async function GET({ locals }) {
  return Response.json({ marker: MARKER, hook: locals.marker, environment: process.env.FIXTURE_MARKER ?? null, secretAvailable: Boolean(process.env.FIXTURE_SECRET), runtimeFile: (await readFile('fixtures/runtime.txt', 'utf8')).trim() });
}
