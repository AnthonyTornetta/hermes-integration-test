const worker = require('node:crypto').randomUUID();
let calls = 0;
const runIds = [];
exports.handler = async request => {
  if (!process.env.CRON_SECRET || request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return { status: 401, body: 'Unauthorized' };
  const runId = request.headers['x-cron-run-id'];
  if (runId) { runIds.push(runId); if (runIds.length > 32) runIds.shift(); }
  return { status: 200, headers: { 'content-type': 'application/json' }, body: { language: 'node', worker, run_ids: [...runIds], calls: ++calls, run_id: request.headers['x-cron-run-id'] ?? null } };
};
