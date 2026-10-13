import { createHash } from 'node:crypto';
import { closeSync, constants, copyFileSync, lstatSync, mkdirSync, openSync, writeFileSync, writeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

if (process.argv.length !== 2) throw new Error('This fixture accepts no arguments');
const output = new URL('./dist/', import.meta.url);
const functions = new URL('./arvumi/functions/', import.meta.url);
for (const path of [output, new URL('./arvumi/', import.meta.url)]) {
  try {
    lstatSync(path);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  throw new Error('This fixture requires fresh output directories');
}
mkdirSync(output);
mkdirSync(new URL('./arvumi/', import.meta.url));
mkdirSync(functions);
const files = [];
for (let index = 0; index < 4; index++) {
  const name = `part-${index}.bin`;
  const block = Buffer.alloc(1024 * 1024);
  for (let offset = 0; offset < block.length; offset++) {
    block[offset] = (index * 53 + offset * 17) % 256;
  }
  const digest = createHash('sha256');
  const root = index < 2 ? 'out' : 'functions';
  const fd = openSync(fileURLToPath(new URL(name, index < 2 ? output : functions)), 'wx', 0o644);
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
  files.push({ name, root, bytes: 60 * 1024 * 1024, sha256: digest.digest('hex') });
}
copyFileSync(new URL('./transfer.cjs', import.meta.url), new URL('transfer.cjs', functions), constants.COPYFILE_EXCL);
const manifest = { version: 1, runtime: 'node', routes: [{ path: '/api/transfer', entrypoint: 'transfer.cjs', env: [] }] };
writeFileSync(new URL('arvumi-functions.json', functions), JSON.stringify(manifest) + '\n', { flag: 'wx', mode: 0o644 });
console.log(JSON.stringify({ version: 1, files, total_bytes: 240 * 1024 * 1024 }));
