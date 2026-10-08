'use strict';
const {timingSafeEqual} = require('node:crypto');
exports.handler = async (request, {cache}) => {
  const supplied = Buffer.from(request.headers['x-fixture-token'] || '');
  const expected = Buffer.from(process.env.FIXTURE_SECRET || '');
  if (request.method !== 'POST' || !expected.length || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return {status: 401, body: 'unauthorized'};
  }
  const input = JSON.parse(request.isBase64Encoded ? Buffer.from(request.body, 'base64').toString() : request.body);
  const identity = {language: 'node', group: process.env.GROUP_A || process.env.GROUP_B,
    pid: process.pid, fixture: 'application-cache-v1', bothGroupsVisible: !!(process.env.GROUP_A && process.env.GROUP_B),
    platformEnv: Object.keys(process.env).filter(key => key.startsWith('ARVUMI_') || key === 'RUNTIME_TOKEN')};
  const headers = {'content-type': 'application/json', 'cache-control': 'no-store'};
  const done = value => ({status: 200, headers, body: {...identity, ...value}});
  const tags = input.tags || [];
  const data = () => Buffer.from(input.payload, 'base64');
  const write = observed => cache.write(observed, data(), {ttlSeconds: input.ttl || 60, tags});
  if (input.op === 'read') {
    const value = await cache.read(input.key, {tags});
    return done({value: value.value?.toString('base64') ?? null, ttl: value.ttlSeconds,
      writtenAt: value.writtenAt, serverTime: value.serverTime});
  }
  if (input.op === 'write') return done({stored: await write(await cache.read(input.key, {tags}))});
  if (input.op === 'invalidate') { await cache.invalidate(tags); return done({invalidated: true}); }
  if (input.op === 'cas' || input.op === 'stale') {
    const observed = await cache.read(input.key, {tags});
    if (input.op === 'stale') await cache.invalidate(tags);
    const stored = await write(observed);
    const second = input.op === 'cas' ? await write(observed) : null;
    return done({stored, second});
  }
  if (input.op === 'fence-stream') return {status: 200, headers, body: (async function* () {
    const observed = await cache.read(input.key, {tags});
    yield JSON.stringify({...identity, phase: 'read'}) + '\n';
    await new Promise(resolve => setTimeout(resolve, 1500));
    yield JSON.stringify({...identity, phase: 'write', stored: await write(observed)}) + '\n';
  })()};
  if (input.op === 'caught-failure') { try { await cache.read(''); } catch (_) {} return done({unexpected: true}); }
  if (input.op === 'stream-failure') return {status: 200, headers, body: (async function* () {
    yield JSON.stringify({...identity, phase: 'prefix'}) + '\n';
    cache.read('');
  })()};
  return {status: 400, body: 'unknown operation'};
};
