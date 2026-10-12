import { createHash } from 'node:crypto';
import { closeSync, mkdirSync, openSync, writeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

if (process.argv.length !== 2) throw new Error('This fixture accepts no arguments');
const output = new URL('./dist/', import.meta.url);
mkdirSync(output);
const files = [];
for (let index = 0; index < 4; index++) {
  const name = `part-${index}.bin`;
  const block = Buffer.alloc(1024 * 1024);
  for (let offset = 0; offset < block.length; offset++) {
    block[offset] = (index * 53 + offset * 17) % 256;
  }
  const digest = createHash('sha256');
  const fd = openSync(fileURLToPath(new URL(name, output)), 'wx', 0o644);
  try {
    for (let chunk = 0; chunk < 60; chunk++) {
      let offset = 0;
      while (offset < block.length) {
        const written = writeSync(fd, block, offset, block.length - offset);
        if (written <= 0) throw new Error('Incomplete fixture write');
        offset += written;
      }
      digest.update(block);
    }
  } finally {
    closeSync(fd);
  }
  files.push({ name, bytes: 60 * 1024 * 1024, sha256: digest.digest('hex') });
}
console.log(JSON.stringify({ version: 1, files, total_bytes: 240 * 1024 * 1024 }));
