"use client";
import { useState } from 'react';
export default function ActionClient({ run, bound }: { run: (value: string) => Promise<string>, bound: () => Promise<string> }) {
  const [result, setResult] = useState('idle');
  return <section><button id="run-action" onClick={async () => setResult(await run('client'))}>Run action</button>
    <button id="bound-action" onClick={async () => setResult(await bound())}>Bound action</button>
    <output id="result">{result}</output></section>;
}
