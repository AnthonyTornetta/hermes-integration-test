import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
export function proxy(req: NextRequest, event: NextFetchEvent) {
  const path = req.nextUrl.pathname;
  if (path === '/proxy-error') throw new Error('fixture proxy failure');
  if (path === '/proxy-wait-error') { event.waitUntil(Promise.reject(new Error('fixture background failure'))); return NextResponse.next(); }
  if (path === '/proxy-large') return new Response('x'.repeat(1024*1024+1));
  if (path === '/proxy-direct') return new Response(`direct:${req.method}:${req.headers.get('host')}`, {status: 202, headers:{'x-proxy':'direct'}});
  if (path === '/proxy-body') return req.text().then(body=>new Response(`${req.method}:${body}`, {headers:{'x-proxy':'body'}}));
  if (path === '/proxy-redirect') return NextResponse.redirect(new URL('/actions-static', req.url));
  if (path === '/image-alias') return NextResponse.rewrite(new URL('/sample.png', req.url));
  if (path === '/image-redirect') return NextResponse.redirect(new URL('/sample.png', req.url));
  if (path === '/image-direct') return new Response('not an image');
  if (path === '/protected.png' && req.cookies.get('proxy-auth')?.value !== 'yes') return new Response('image auth required', {status:401});
  if (path === '/proxy-external') return NextResponse.rewrite(new URL('https://example.com/'));
  if (path === '/proxy-to-slash') return NextResponse.rewrite(new URL('/proxy-target/?rewritten=yes', req.url));
  if (path === '/proxy-to-static') return NextResponse.rewrite(new URL('/actions-static', req.url));
  if (path === '/proxy-to-api') return NextResponse.rewrite(new URL('/api/proxy-echo?rewritten=yes', req.url));
  if (path === '/proxy-to-dynamic') return NextResponse.rewrite(new URL('/proxy-target?rewritten=yes', req.url));
  if ((path.startsWith('/actions') || path.startsWith('/files/') || path === '/protected.txt') && req.cookies.get('proxy-auth')?.value !== 'yes') {
    return new Response('proxy auth required', {status:401, headers:{'x-proxy':'blocked'}});
  }
  if (path === '/conditional' || path === '/host-match' || path.startsWith('/files/')) return new Response('matcher invoked', {status:403});
  const headers = new Headers(req.headers);
  headers.set('x-proxy-request','present');
  if(path === '/proxy-overrides') {
    headers.delete('origin');headers.delete('next-action');headers.set('content-type','changed');
    headers.set('host','attacker.invalid');headers.set('x-arvumi-invoke-token','forged');
    headers.set('x-middleware-subrequest','middleware');
  }
  const res = path === '/proxy-overrides' ? NextResponse.rewrite(new URL('/api/proxy-echo',req.url),{request:{headers}}) : NextResponse.next({request:{headers}});
  res.headers.set('x-proxy','passed');
  if (path === '/proxy-target' || path === '/api/proxy-echo') {
    res.cookies.set('proxy-cookie','fresh');res.cookies.set('replace-cookie','new');res.cookies.delete('delete-cookie');
  }
  if(path === '/proxy-wait') event.waitUntil(new Promise(resolve=>setTimeout(resolve,200)));
  return res;
}
export const config = {matcher:['/protected.png', '/image-alias', '/image-redirect', '/image-direct', 
  '/actions-static', '/actions/:path*', '/action-result', '/protected.txt', '/proxy-(.*)', '/api/proxy-echo', '/files/secret',
  {source:'/conditional',has:[{type:'header',key:'x-condition',value:'yes'}],missing:[{type:'cookie',key:'skip-proxy'}]},
  {source:'/host-match',has:[{type:'host',value:'.+'}]},
]};
