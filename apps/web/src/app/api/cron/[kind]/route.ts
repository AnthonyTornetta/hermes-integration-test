import { state } from "@/lib/cron-state";
export async function GET(req: Request, ctx: {params: Promise<{kind:string}>}) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new Response("Unauthorized",{status:401});
  const {kind} = await ctx.params;
  const middleware = req.headers.get("x-cron-middleware");
  if (middleware !== "present") return new Response("Missing middleware",{status:412});
  state.runs.push({id:req.headers.get("x-cron-run-id"),kind,at:new Date().toISOString(),middleware});
  state.runs.splice(0,Math.max(0,state.runs.length-100));
  if (kind === "redirect") return Response.redirect(new URL("/api/cron/redirect-target",req.url),302);
  if (kind === "fail") return new Response("Intentional failure",{status:500});
  if (kind === "slow") await new Promise(resolve=>setTimeout(resolve,10_000));
  if (kind === "large") return new Response("x".repeat(1024*1024+1));
  return Response.json({ok:true,worker:process.pid,kind,id:req.headers.get("x-cron-run-id")});
}
