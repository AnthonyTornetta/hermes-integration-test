import { MARKER } from '#lib/server/fixture.js';
export async function handle({ event, resolve }) {
  event.locals.marker = MARKER + ':hook';
  const response = await resolve(event);
  response.headers.set('x-fixture-hook', MARKER);
  return response;
}
