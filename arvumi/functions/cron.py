import os, uuid
worker = str(uuid.uuid4())
calls = 0
run_ids = []
def handler(request):
    global calls
    secret = os.environ.get('CRON_SECRET')
    if not secret or request['headers'].get('authorization') != 'Bearer ' + secret:
        return {'status':401, 'body':'Unauthorized'}
    run_id = request['headers'].get('x-cron-run-id')
    if run_id:
        run_ids.append(run_id)
        del run_ids[:-32]
    calls += 1
    return {'status':200, 'headers':{'content-type':'application/json'}, 'body':{'language':'python','worker':worker,'run_ids':list(run_ids),'calls':calls,'run_id':request['headers'].get('x-cron-run-id')}}
