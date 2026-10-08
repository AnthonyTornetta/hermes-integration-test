export const dynamic = 'force-dynamic';
export async function GET(){return new Response(`${Date.now()}:${Math.random()}`);}
