import { label, asset } from "@arvumi-fixture/shared";
export const dynamic = "force-dynamic";
export function GET() { return Response.json({label, asset: asset()}); }
