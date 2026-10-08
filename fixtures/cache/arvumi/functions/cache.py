import asyncio
import base64
import hmac
import json
import os

async def handler(request, *, context):
    cache = context.cache
    expected = os.environ.get('FIXTURE_SECRET', '')
    if request['method'] != 'POST' or not expected or not hmac.compare_digest(request['headers'].get('x-fixture-token', '').encode(), expected.encode()):
        return {'status': 401, 'body': 'unauthorized'}
    raw = base64.b64decode(request['body']) if request.get('isBase64Encoded') else request['body']
    value = json.loads(raw)
    identity = {'language': 'python', 'group': os.environ.get('GROUP_A') or os.environ.get('GROUP_B'),
                'pid': os.getpid(), 'fixture': 'application-cache-v1',
                'bothGroupsVisible': bool(os.environ.get('GROUP_A') and os.environ.get('GROUP_B')),
                'platformEnv': [key for key in os.environ if key.startswith('ARVUMI_') or key == 'RUNTIME_TOKEN']}
    headers = {'content-type': 'application/json', 'cache-control': 'no-store'}
    def done(result):
        return {'status': 200, 'headers': headers, 'body': {**identity, **result}}
    tags = value.get('tags', [])
    def write(observed):
        return cache.write(observed, base64.b64decode(value['payload'], validate=True), ttl_seconds=value.get('ttl', 60), tags=tags)
    op = value['op']
    if op == 'read':
        observed = await cache.read(value['key'], tags=tags)
        return done({'value': base64.b64encode(observed.value).decode() if observed.value is not None else None,
                     'ttl': observed.ttl_seconds, 'writtenAt': observed.written_at, 'serverTime': observed.server_time})
    if op == 'write':
        return done({'stored': await write(await cache.read(value['key'], tags=tags))})
    if op == 'invalidate':
        await cache.invalidate(tags)
        return done({'invalidated': True})
    if op in ('cas', 'stale'):
        observed = await cache.read(value['key'], tags=tags)
        if op == 'stale': await cache.invalidate(tags)
        stored = await write(observed)
        second = await write(observed) if op == 'cas' else None
        return done({'stored': stored, 'second': second})
    if op == 'fence-stream':
        async def body():
            observed = await cache.read(value['key'], tags=tags)
            yield json.dumps({**identity, 'phase': 'read'}) + '\n'
            await asyncio.sleep(1.5)
            yield json.dumps({**identity, 'phase': 'write', 'stored': await write(observed)}) + '\n'
        return {'status': 200, 'headers': headers, 'body': body()}
    if op == 'caught-failure':
        try: await cache.read('')
        except Exception: pass
        return done({'unexpected': True})
    if op == 'stream-failure':
        async def body():
            yield json.dumps({**identity, 'phase': 'prefix'}) + '\n'
            cache.read('')
        return {'status': 200, 'headers': headers, 'body': body()}
    return {'status': 400, 'body': 'unknown operation'}
