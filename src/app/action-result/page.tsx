import { cookies } from 'next/headers';
export default async function Page() { const jar = await cookies(); return <h1 id="redirect-result">Redirect count: {jar.get('action-count')?.value || '0'}</h1>; }
