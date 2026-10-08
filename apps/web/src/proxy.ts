import {NextRequest,NextResponse} from "next/server";
export function proxy(req:NextRequest) {
 const headers=new Headers(req.headers);headers.set('x-routing-middleware','present');
 return NextResponse.next({request:{headers}});
}
export const config={matcher:['/api/:path*']};
