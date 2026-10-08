import {NextRequest,NextResponse} from "next/server";
export function proxy(req:NextRequest) {
  if(req.nextUrl.pathname === "/api/cron/blocked") return new Response("Blocked by middleware",{status:403});
  const headers=new Headers(req.headers); headers.set("x-cron-middleware","present");
  return NextResponse.next({request:{headers}});
}
export const config={matcher:["/api/cron/:path*"]};
