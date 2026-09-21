exports.handler = async (request) => {
  const query = new URLSearchParams(request.query ?? "");
  const name = query.get("name") ?? "world";

  console.log(process.env);

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: {
      message: JSON.stringify(process.env),
      method: request.method
    }
  };
};
