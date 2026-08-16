export async function GET() {
  return Response.json({
    message: "Hello from the API! (Changed!)",
    timestamp: new Date().toISOString(),
  })
}
