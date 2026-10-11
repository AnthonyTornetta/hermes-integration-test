const fs = require('node:fs');
fs.mkdirSync('site', {recursive:true});
fs.writeFileSync('site/index.html', 'build-accounting-cp102\n');
// Keep the ordinary build observable without a CPU busy loop.
setTimeout(() => console.log('build-accounting-cp102 complete'), 70_000);
