export async function GET() {
  console.log('Next js route run!');
  console.log(process.env);
  return Response.json({
    message: "Hello from the API! (Webhook Worked)",
    timestamp: new Date().toISOString(),
  })
}
