export default async function Page({params}:{params:Promise<{name:string}>}){return <p>File: {(await params).name}</p>}
