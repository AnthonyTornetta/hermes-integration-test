let calls=0;
export async function GET(req:Request) {
 calls++;
 const url=new URL(req.url),run=req.headers.get('x-cron-run-id');
 if(run && url.pathname!=='/api/cron')return new Response('cron retargeted',{status:409});
 if(run && req.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return new Response('unauthorized',{status:401});
 if(url.search==='?stream=1')return new Response(new ReadableStream({async start(controller){controller.enqueue(new Uint8Array([0,255,65]));await new Promise(r=>setTimeout(r,800));controller.enqueue(new Uint8Array([0,128,66]));controller.close();}}),{headers:{'content-type':'application/octet-stream'}});
 return Response.json({language:'next',path:url.pathname,query:url.search.slice(1),method:req.method,calls,pid:process.pid,run,middleware:req.headers.get('x-routing-middleware'),internal:[...req.headers.keys()].filter(k=>k.startsWith('x-arvumi-')||k.startsWith('x-edge-'))},{headers:{'cache-control':'no-store'}});
}
export const POST=GET;
