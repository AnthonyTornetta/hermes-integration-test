import { MARKER } from '#lib/server/fixture.js';
export function GET({ cookies }) {
  const options = { path: '/', secure: true, httpOnly: true, sameSite: 'lax' };
  cookies.set('fixture-a', MARKER + ':a', options);
  cookies.set('fixture-b', MARKER + ':b', options);
  return Response.json({ marker: MARKER });
}
