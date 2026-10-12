import { MARKER } from '#lib/server/fixture.js';
export function load({ locals }) { return { marker: MARKER + ':navigation', hook: locals.marker }; }
