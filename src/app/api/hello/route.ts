export async function GET() {
  return Response.json({
    message: "Hello from the API! (Webhook Worked)",
    timestamp: new Date().toISOString(),
  })
}
