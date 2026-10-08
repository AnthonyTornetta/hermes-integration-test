let calls=0;
exports.handler=req=>{
 calls++;
 const run=req.headers['x-cron-run-id'];
 if(run && req.path!=='/api/cron')return {status:409,body:'cron retargeted'};
 if(run && req.headers.authorization!=='Bearer '+process.env.CRON_SECRET)return {status:401,body:'unauthorized'};
 const data={language:'node',path:req.path,query:req.query,method:req.method,calls,pid:process.pid,run:run||null,
  internal:Object.keys(req.headers).filter(k=>k.startsWith('x-arvumi-')||k.startsWith('x-edge-'))};
 if(req.query==='stream=1')return {status:200,headers:{'content-type':'application/octet-stream'},body:(async function*(){yield Buffer.from([0,255,65]);await new Promise(r=>setTimeout(r,800));yield Buffer.from([0,128,66]);})()};
 return {status:200,headers:{'content-type':'application/json','cache-control':'no-store'},body:data};
};
