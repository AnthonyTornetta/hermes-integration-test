"use server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export async function run(value: string): Promise<string> {
  const jar = await cookies();
  const count = Number(jar.get('action-count')?.value || '0') + 1;
  jar.set('action-count', String(count), { httpOnly: true, sameSite: 'lax', path: '/' });
  return `action:${value}:${count}`;
}
export async function submit(data: FormData) {
  await run(String(data.get('name')));
  redirect('/action-result');
}
export async function go() { redirect('/action-result'); }
