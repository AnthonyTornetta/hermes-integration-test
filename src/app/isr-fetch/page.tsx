import {headers} from 'next/headers';
export default async function Page(){const h=await headers();const proto=h.get('x-forwarded-proto')??'http';const value=await fetch(`${proto}://${h.get('host')}/api/isr-origin`,{cache:'force-cache',next:{tags:['isr-fetch'],revalidate:3600}}).then(r=>r.text());return <output id="fetch">{value}</output>;}
