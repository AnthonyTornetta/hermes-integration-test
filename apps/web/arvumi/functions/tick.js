const result=require('./build-result.json');let runs=[];
exports.handler=async request=>{
 const headers=request.headers||{};
 if(headers.authorization!=='Bearer '+process.env.CRON_SECRET)return {status:401,body:'unauthorized'};
 if(headers['x-cron-run-id'])runs.push(headers['x-cron-run-id']);runs=runs.slice(-32);
 return {status:200,headers:{'content-type':'application/json'},body:JSON.stringify({...result,runs,method:request.method})};
};
