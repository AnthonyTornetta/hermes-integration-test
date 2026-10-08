import { randomUUID } from "node:crypto";
const worker = randomUUID();
let calls = 0;
export async function GET(req: Request) {
  calls++;
  const mode = new URL(req.url).searchParams.get("mode") ?? "warm";
  if (mode === "slow") await new Promise(resolve => setTimeout(resolve, 650));
  const body = {worker, calls, mode, forgedHeaderVisible: req.headers.has("x-arvumi-worker-state")};
  const headers = {"cache-control":"no-store", "x-arvumi-worker-state":"cold"};
  if (mode === "stream") {
    const encoder = new TextEncoder();
    return new Response(new ReadableStream({async start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify(body)+"\n"));
      await new Promise(resolve => setTimeout(resolve, 800));
      controller.enqueue(encoder.encode("done\n"));
      controller.close();
    }}), {headers});
  }
  return Response.json(body, {status:mode === "error" ? 500 : 200, headers});
}
