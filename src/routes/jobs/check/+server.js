import { MARKER, cronAuthorized } from '#lib/server/fixture.js';
export function GET({ request, locals, getClientAddress }) {
  if (!cronAuthorized(request)) return new Response('unauthorized', { status: 401 });
  return Response.json({ marker: MARKER, hook: locals.marker, clientAddress: getClientAddress(), authorized: true });
}
