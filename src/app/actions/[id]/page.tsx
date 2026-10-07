import { cookies } from 'next/headers';
import ActionClient from '../../action-client';
import { run } from '../../actions-static/actions';
import { onlyHere } from './actions';
export default async function Page({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params;
  const jar = await cookies();
  async function bound() { 'use server'; return `bound:${id}`; }
  return <main><h1>Dynamic actions {id}</h1><div id="cookie-count">{jar.get('action-count')?.value || '0'}</div>
    <ActionClient run={run} bound={bound}/><form action={async () => { 'use server'; await onlyHere(); }}><button>Only here</button></form></main>;
}
