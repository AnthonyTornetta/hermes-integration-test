'use strict';
// Fixed bounded fault source. No arbitrary destination, file, delay or payload.
const cases = new Set(['exit-api','exit-nbg1','exit-hel1','deadline-api','deadline-nbg1','deadline-hel1']);
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAIAAABChommAAAAEUlEQVR42mNQWPCAIGIYVQQA7l+cAQTztX4AAAAASUVORK5CYII=', 'base64');
exports.handler = async request => {
  const match = /^case=(warmup-)?([a-z0-9-]{1,32})$/.exec(request.query || '');
  if (request.method !== 'GET' || !match || !cases.has(match[2])) {
    return {status:400, headers:{'cache-control':'no-store'}, body:'invalid fixture case'};
  }
  console.log(JSON.stringify({fixture:'platform-images-origin-v1', phase:'start',
    case:(match[1] || '') + match[2], pid:process.pid, at:Date.now()}));
  await new Promise(resolve => setTimeout(resolve, 5000));
  return {status:200, headers:{'content-type':'image/png','cache-control':'no-store'},
    body:png, isBase64Encoded:false};
};
