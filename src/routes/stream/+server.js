import { MARKER } from '#lib/server/fixture.js';
export function GET() {
  const encode = new TextEncoder();
  return new Response(new ReadableStream({ async start(controller) {
    controller.enqueue(encode.encode(MARKER + ':first\n'));
    await new Promise(resolve => setTimeout(resolve, 100));
    controller.enqueue(encode.encode(MARKER + ':second\n'));
    controller.close();
  } }), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
