import { fail } from '@sveltejs/kit';
import { MARKER, formValue } from '#lib/server/fixture.js';
export function load({ locals, url }) { return { marker: MARKER, hook: locals.marker, origin: url.origin }; }
export const actions = { default: async ({ request }) => {
  const value = await formValue(request);
  return value === null ? fail(400, { error: 'invalid form' }) : { value: MARKER + ':posted:' + value };
} };
