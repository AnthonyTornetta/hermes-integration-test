import {unstable_cache,revalidatePath,revalidateTag,updateTag} from 'next/cache';
import {connection} from 'next/server';
const cached=unstable_cache(async()=>`${Date.now()}:${Math.random()}`,['isr-test-data'],{tags:['isr-data'],revalidate:3600});
async function invalidate(form:FormData) {
  'use server';
  const mode=form.get('mode');
  if(mode==='path')revalidatePath('/isr/seed');
  else if(mode==='max')revalidateTag('isr-data','max');
  else updateTag('isr-data');
}
export default async function Page(){await connection();const value=await cached();return <main><output id="data">{value}</output><form action={invalidate}><button name="mode" value="update">Update</button><button name="mode" value="max">Max</button><button name="mode" value="path">Path</button></form></main>;}
