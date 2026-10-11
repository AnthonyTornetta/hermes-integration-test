import asyncio
import base64
import hmac
import json
import os

HEADERS = {'content-type': 'application/json', 'cache-control': 'no-store'}
KEY = 'image-acceptance-application-cache-v1'
PAYLOAD = bytes([0, 255, 128, 65])


async def handler(request, *, context):
    identity = {'fixture': 'platform-images-v1', 'language': 'python', 'pid': os.getpid(),
                'platformEnv': [k for k in os.environ if k.startswith('ARVUMI_') or k == 'RUNTIME_TOKEN']}
    if request['method'] == 'GET' and not request.get('query'):
        return {'status': 200, 'headers': HEADERS, 'body': identity}
    if request['method'] == 'GET' and request.get('query') == 'stream':
        async def stream():
            yield json.dumps({**identity, 'phase': 'first'}) + '\n'
            await asyncio.sleep(.25)
            yield json.dumps({**identity, 'phase': 'last'}) + '\n'
        return {'status': 200, 'headers': HEADERS, 'body': stream()}
    expected = os.environ.get('FIXTURE_SECRET', '')
    actual = request['headers'].get('x-fixture-token', '')
    if request['method'] != 'POST' or not expected or not hmac.compare_digest(actual.encode(), expected.encode()):
        return {'status': 401, 'headers': HEADERS, 'body': 'unauthorized'}
    try:
        raw = base64.b64decode(request.get('body') or '', validate=True).decode() if request.get('isBase64Encoded') else request.get('body')
        if not isinstance(raw, str) or len(raw.encode()) > 256:
            raise ValueError()
        value = json.loads(raw)
        if not isinstance(value, dict) or set(value) != {'op'} or value['op'] not in ('read', 'write'):
            raise ValueError()
    except (ValueError, UnicodeError):
        return {'status': 400, 'headers': HEADERS, 'body': 'invalid operation'}
    observed = await context.cache.read(KEY, tags=[])
    if value['op'] == 'write':
        result = {'stored': await context.cache.write(observed, PAYLOAD, ttl_seconds=60, tags=[])}
    else:
        result = {'value': base64.b64encode(observed.value).decode() if observed.value is not None else None,
                  'writtenAt': observed.written_at, 'serverTime': observed.server_time, 'ttl': observed.ttl_seconds}
    return {'status': 200, 'headers': HEADERS, 'body': {**identity, **result}}
