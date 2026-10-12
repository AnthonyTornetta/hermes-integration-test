import { timingSafeEqual } from 'node:crypto';
export const MARKER = 'svelte-workspace';

export function cronAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get('authorization') ?? '';
  if (!secret || secret.length > 512 || supplied.length > 1024) return false;
  const expected = Buffer.from('Bearer ' + secret);
  const actual = Buffer.from(supplied);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function formValue(request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/x-www-form-urlencoded') return null;
  if (!request.body) return null;
  const reader = request.body.getReader();
  const parts = []; let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) { await reader.cancel(); return null; }
      parts.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  const form = new URLSearchParams(Buffer.concat(parts).toString('utf8'));
  if ([...form.keys()].some(key => key !== 'value') || form.getAll('value').length !== 1) return null;
  const value = form.get('value');
  return value.length <= 64 ? value : null;
}
