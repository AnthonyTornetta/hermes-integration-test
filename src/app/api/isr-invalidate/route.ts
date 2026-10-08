import {revalidatePath,revalidateTag} from 'next/cache';
export async function POST(req:Request){const body=await req.json();if(body.path)revalidatePath(body.path);else revalidateTag(body.tag??'isr-data',body.mode==='max'?'max':{expire:0});return Response.json({ok:true});}
