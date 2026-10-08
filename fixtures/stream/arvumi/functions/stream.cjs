const {Readable}=require('node:stream');
let calls=0, runs=[];
exports.handler=req=>{
 calls++;
 const mode=(req.query||'').split('&')[0];
 const run=req.headers['x-cron-run-id'];
 if(run){
  if(req.headers.authorization!=='Bearer '+process.env.CRON_SECRET)return {status:401,body:'unauthorized'};
  runs.push(run);
  return {status:200,body:(async function*(){yield '{"run":"';await new Promise(r=>setTimeout(r,100));yield run+'"}';})()};
 }
 if(!mode)return {status:200,body:{language:'node',pid:process.pid,calls,run_ids:runs}};
 async function* chunks(){
  if(mode==='exact'){for(let i=0;i<64;i++)yield Buffer.alloc(65536,255);return;}
  yield mode==='sse'?'data: first\n\n':Buffer.from([0,255,65]);
  await new Promise(r=>setTimeout(r,['cancel','timeout'].includes(mode)?10000:800));
  if(mode==='error')throw new Error('fixture stream failed');
  if(mode==='overflow'){yield Buffer.alloc(4*1024*1024);return;}
  yield mode==='sse'?'data: last\n\n':Buffer.from([0,128,66]);
 }
 let body=chunks();
 if(mode==='node')body=Readable.from(body);
 if(mode==='web'||mode==='native')body=Readable.toWeb(Readable.from(body));
 const headers={'content-type':mode==='sse'?'text/event-stream':'application/octet-stream','cache-control':'no-store','x-fixture-pid':String(process.pid)};
 if(mode==='native')return new Response(body,{headers});
 return {status:mode==='204'?204:mode==='304'?304:200,body,headers};
};
