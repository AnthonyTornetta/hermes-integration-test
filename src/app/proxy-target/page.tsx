import {cookies,headers} from 'next/headers';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string>>}) {
 const jar=await cookies(), h=await headers(), params=await searchParams;
 return <pre id="proxy-result">{JSON.stringify({cookie:jar.get('proxy-cookie')?.value,replace:jar.get('replace-cookie')?.value,deleted:jar.get('delete-cookie')?.value,header:h.get('x-proxy-request'),rewritten:params.rewritten??null})}</pre>;
}
