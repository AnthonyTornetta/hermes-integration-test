import { MARKER } from '#lib/server/fixture.js';
export const prerender = true;
export function load() { return { marker: MARKER + ':prerendered' }; }
