'use strict';
const { createHash } = require('node:crypto');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');

exports.handler = async request => {
  if (request.method !== 'GET') {
    return { status: 405, headers: { allow: 'GET' }, body: '' };
  }
  const files = [];
  for (const name of ['part-2.bin', 'part-3.bin']) {
    const digest = createHash('sha256');
    let bytes = 0;
    for await (const chunk of createReadStream(join(__dirname, name), { highWaterMark: 65536 })) {
      bytes += chunk.length;
      digest.update(chunk);
    }
    files.push({ name, bytes, sha256: digest.digest('hex') });
  }
  return {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ version: 1, files }),
  };
};
