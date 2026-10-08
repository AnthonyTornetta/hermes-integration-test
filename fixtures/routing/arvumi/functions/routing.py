import asyncio, os
calls=0
def handler(req):
 global calls
 calls+=1
 run=req['headers'].get('x-cron-run-id')
 if run and req['headers'].get('authorization')!='Bearer '+os.environ['CRON_SECRET']: return {'status':401,'body':'unauthorized'}
 data={'language':'python','path':req['path'],'query':req['query'],'method':req['method'],'calls':calls,'pid':os.getpid(),'run':run,'internal':[k for k in req['headers'] if k.startswith(('x-arvumi-','x-edge-'))]}
 if req['query']=='stream=1':
  async def chunks():
   yield bytes([0,255,65])
   await asyncio.sleep(.8)
   yield bytes([0,128,66])
  return {'status':200,'headers':{'content-type':'application/octet-stream'},'body':chunks()}
 return {'status':200,'headers':{'content-type':'application/json','cache-control':'no-store'},'body':data}
