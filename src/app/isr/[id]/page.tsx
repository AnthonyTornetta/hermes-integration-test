export const revalidate = 5;
export async function generateStaticParams() { return [{id:'seed'}]; }
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  return <main><h1>ISR {id}</h1><output id="stamp">{Date.now()}:{Math.random()}</output></main>;
}
