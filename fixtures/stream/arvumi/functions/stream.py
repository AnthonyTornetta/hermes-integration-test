import asyncio, os, time
calls=0
runs=[]
def handler(req):
 global calls
 calls+=1
 mode=(req['query'] or '').split('&')[0]
 run=req['headers'].get('x-cron-run-id')
 if run:
  if req['headers'].get('authorization')!='Bearer '+os.environ['CRON_SECRET']: return {'status':401,'body':'unauthorized'}
  runs.append(run)
  async def cron():
   yield '{"run":"'
   await asyncio.sleep(.1)
   yield run+'"}'
  return {'status':200,'body':cron()}
 if not mode: return {'status':200,'body':{'language':'python','pid':os.getpid(),'calls':calls,'run_ids':runs}}
 async def chunks():
  if mode=='exact':
   for _ in range(64): yield bytes([255])*65536
   return
  yield 'data: first\n\n' if mode=='sse' else bytes([0,255,65])
  await asyncio.sleep(10 if mode in ('cancel','timeout') else .8)
  if mode=='error': raise ValueError('fixture stream failed')
  if mode=='overflow':
   yield bytes(4*1024*1024)
   return
  yield 'data: last\n\n' if mode=='sse' else bytes([0,128,66])
 def sync():
  yield bytes([0,255,65])
  time.sleep(.8)
  yield bytes([0,128,66])
 return {'status':204 if mode=='204' else 304 if mode=='304' else 200,
  'body':sync() if mode=='sync' else chunks(),
  'headers':{'content-type':'text/event-stream' if mode=='sse' else 'application/octet-stream','cache-control':'no-store','x-fixture-pid':str(os.getpid())}}
