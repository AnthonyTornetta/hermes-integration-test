import {connection} from 'next/server';
export default async function Page(){
  await connection();
  // The execution firewall deliberately denies calls back to platform IPs.
  const response=await fetch('https://httpbingo.org/uuid',{cache:'force-cache',next:{tags:['isr-fetch'],revalidate:3600}});
  if(!response.ok)throw new Error('Fetch cache test origin unavailable');
  const value=await response.json();
  return <output id="fetch">{value.uuid}</output>;
}
