import errno
import os
import tempfile
from urllib.parse import parse_qs

calls = 0


def handler(req):
    global calls
    q = parse_qs(req['query'])
    op = q.get('op', ['probe'])[0]
    if op == 'fill':
        raw = q.get('mib', [''])[0]
        if not raw.isdigit() or not 1 <= int(raw) <= 128:
            return {'status': 400, 'body': 'bounded write required'}
        written, error = 0, None
        try:
            with open('/tmp/fill', 'wb', buffering=0) as f:
                chunk = b'x' * 1048576
                while written < int(raw) * len(chunk):
                    written += f.write(chunk)
                os.fsync(f.fileno())
        except OSError as e:
            error = errno.errorcode[e.errno]
        return {'status': 200, 'body': {'written': written, 'error': error}}
    if op == 'clear':
        try:
            os.unlink('/tmp/fill')
        except FileNotFoundError:
            pass
        return {'status': 200, 'body': {'cleared': True}}
    previous = None
    if os.path.exists('/tmp/state'):
        with open('/tmp/state') as f:
            previous = f.read()
    with open('/tmp/state', 'w') as f:
        f.write(q.get('value', ['marker'])[0])
    denied = []
    for target in [__file__, '/var/run/arvumi-auth/token']:
        alias = '/tmp/protected-link'
        os.symlink(target, alias)
        try:
            for path in [target, alias]:
                try:
                    with open(path, 'w') as f:
                        f.write('forbidden')
                except OSError as e:
                    if e.errno not in [errno.EROFS, errno.EACCES, errno.EPERM]:
                        raise
                    denied.append(path)
        finally:
            os.unlink(alias)
    with tempfile.TemporaryDirectory(dir='/tmp') as d:
        with open(d+'/a', 'w') as f:
            f.write('ok')
        os.rename(d+'/a', d+'/b')
        os.unlink(d+'/b')
    calls += 1
    return {'status': 200, 'body': {'previous': previous, 'calls': calls, 'pid': os.getpid(), 'denied': denied}}
