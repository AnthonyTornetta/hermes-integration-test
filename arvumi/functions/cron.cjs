const worker = require('node:crypto').randomUUID();
let calls = 0;
exports.handler = async request => {
  if (!process.env.CRON_SECRET || request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return { status: 401, body: 'Unauthorized' };
  return { status: 200, headers: { 'content-type': 'application/json' }, body: { language: 'node', worker, calls: ++calls, run_id: request.headers['x-cron-run-id'] ?? null } };
};
