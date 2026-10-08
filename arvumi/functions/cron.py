import os, uuid
worker = str(uuid.uuid4())
calls = 0
def handler(request):
    global calls
    secret = os.environ.get('CRON_SECRET')
    if not secret or request['headers'].get('authorization') != 'Bearer ' + secret:
        return {'status':401, 'body':'Unauthorized'}
    calls += 1
    return {'status':200, 'headers':{'content-type':'application/json'}, 'body':{'language':'python','worker':worker,'calls':calls,'run_id':request['headers'].get('x-cron-run-id')}}
