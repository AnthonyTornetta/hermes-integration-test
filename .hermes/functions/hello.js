exports.handler = async (request) => {
  const query = new URLSearchParams(request.query ?? "");
  const name = query.get("name") ?? "world";

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: {
      message: `Hello, ${name}!`,
      method: request.method
    }
  };
};
