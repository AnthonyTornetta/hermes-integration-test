const fs = require('node:fs');
let calls = 0;
exports.handler = req => {
  const q = new URLSearchParams(req.query), op = q.get('op') || 'probe';
  if (op === 'fill') {
    const mib = Number(q.get('mib'));
    if (!Number.isInteger(mib) || mib < 1 || mib > 128) return {status:400, body:'bounded write required'};
    let written = 0, error = null;
    const fd = fs.openSync('/tmp/fill', 'w');
    try {
      const chunk = Buffer.alloc(1024 * 1024, 120);
      while (written < mib * chunk.length) {
        const count = fs.writeSync(fd, chunk, 0, Math.min(chunk.length, mib * chunk.length - written));
        if (!count) throw new Error('zero-progress write');
        written += count;
      }
      fs.fsyncSync(fd);
    } catch (e) { error = e.code; } finally { fs.closeSync(fd); }
    return {status:200, body:{written, error}};
  }
  if (op === 'clear') {
    try { fs.unlinkSync('/tmp/fill'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    return {status:200, body:{cleared:true}};
  }
  const previous = fs.existsSync('/tmp/state') ? fs.readFileSync('/tmp/state','utf8') : null;
  fs.writeFileSync('/tmp/state', q.get('value') || 'marker');
  const denied = [];
  for (const target of [__filename, '/var/run/arvumi-auth/token']) {
    const alias = '/tmp/protected-link';
    fs.symlinkSync(target, alias);
    try {
      for (const path of [target, alias]) {
        try { fs.writeFileSync(path,'forbidden'); }
        catch (e) { if (!['EROFS','EACCES','EPERM'].includes(e.code)) throw e; denied.push(path); }
      }
    } finally { fs.unlinkSync(alias); }
  }
  const dir = fs.mkdtempSync('/tmp/lifecycle-');
  fs.writeFileSync(dir+'/a','ok'); fs.renameSync(dir+'/a',dir+'/b');
  fs.unlinkSync(dir+'/b'); fs.rmdirSync(dir);
  return {status:200, body:{previous, calls:++calls, pid:process.pid, denied}};
};
