export async function handler() {
  console.log('hi fro merror');
  throw new Error("500 endpoint hit");
}
