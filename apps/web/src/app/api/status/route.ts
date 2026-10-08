import {state} from "@/lib/cron-state";
export async function GET(req: Request) {return Response.json({...state,worker:process.pid,host:new URL(req.url).host});}
