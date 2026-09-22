export async function GET() {
  console.log('Next js route run!');
  return Response.json({
    message: "Hello from the API! (Webhook Worked)",
    timestamp: new Date().toISOString(),
  })
}
