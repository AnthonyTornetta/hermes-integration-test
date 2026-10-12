import { MARKER } from '#lib/server/fixture.js';
export async function GET({ locals }) {
  const { proof } = await import('@arvumi-fixture/data');
  return Response.json({ marker: MARKER, hook: locals.marker, ...proof() });
}
