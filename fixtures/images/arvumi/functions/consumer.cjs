'use strict';
const {timingSafeEqual} = require('node:crypto');
const headers = {'content-type':'application/json', 'cache-control':'no-store'};
const key = 'image-acceptance-application-cache-v1';
const payload = Buffer.from([0, 255, 128, 65]);
exports.handler = async (request, {cache}) => {
  const identity = {fixture:'platform-images-v1', language:'node', pid:process.pid,
    platformEnv:Object.keys(process.env).filter(k => k.startsWith('ARVUMI_') || k === 'RUNTIME_TOKEN')};
  if (request.method === 'GET' && !request.query) return {status:200, headers, body:identity};
  if (request.method === 'GET' && request.query === 'stream') {
    return {status:200, headers, body:(async function* () {
      yield JSON.stringify({...identity, phase:'first'}) + '\n';
      await new Promise(resolve => setTimeout(resolve, 250));
      yield JSON.stringify({...identity, phase:'last'}) + '\n';
    })()};
  }
  const actual = Buffer.from(request.headers['x-fixture-token'] || '');
  const expected = Buffer.from(process.env.FIXTURE_SECRET || '');
  if (request.method !== 'POST' || !expected.length || actual.length !== expected.length
      || !timingSafeEqual(actual, expected)) return {status:401, headers, body:'unauthorized'};
  let input;
  try {
    const raw = request.isBase64Encoded ? Buffer.from(request.body || '', 'base64').toString() : request.body;
    if (typeof raw !== 'string' || Buffer.byteLength(raw) > 256) throw new Error();
    input = JSON.parse(raw);
    if (!input || Array.isArray(input) || Object.keys(input).join() !== 'op'
        || !['read','write'].includes(input.op)) throw new Error();
  } catch { return {status:400, headers, body:'invalid operation'}; }
  const observed = await cache.read(key, {tags:[]});
  const value = input.op === 'write'
    ? {stored:await cache.write(observed, payload, {ttlSeconds:60, tags:[]})}
    : {value:observed.value?.toString('base64') ?? null, writtenAt:observed.writtenAt,
       serverTime:observed.serverTime, ttl:observed.ttlSeconds};
  return {status:200, headers, body:{...identity, ...value}};
};
