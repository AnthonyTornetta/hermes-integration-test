import {cookies,headers} from 'next/headers';
async function echo(request:Request) {
 const jar=await cookies(),h=await headers();
 return Response.json({method:request.method,body:await request.text(),url:request.url,header:h.get('x-proxy-request'),cookie:jar.get('proxy-cookie')?.value,replace:jar.get('replace-cookie')?.value,deleted:jar.get('delete-cookie')?.value}, {headers:{'set-cookie':'replace-cookie=downstream; Path=/'}});
}
export {echo as GET,echo as POST,echo as PUT};
