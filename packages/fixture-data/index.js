import { readFileSync } from 'node:fs';
export function proof() { return { dependency: 'svelte-workspace-dependency', data: readFileSync(new URL('./data.txt', import.meta.url), 'utf8').trim() }; }
