const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function loadKey() {
  const keyPath = path.resolve(__dirname, '..', '.secrets', 'prunaverso_hmac.key');
  if (!fs.existsSync(keyPath)) throw new Error('HMAC key not found: ' + keyPath);
  return fs.readFileSync(keyPath, 'utf8').trim();
}

function computeHmac(payload) {
  const key = loadKey();
  return crypto.createHmac('sha256', key).update(payload).digest('base64');
}

function sortObject(obj) {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((res, key) => {
      res[key] = sortObject(obj[key]);
      return res;
    }, {});
  }
  return obj;
}

function canonicalize(obj) {
  return JSON.stringify(sortObject(obj));
}

function main() {
  const instancePath = path.resolve(__dirname, '..', 'data', 'sync', 'handshake_prunaverso_v3.json');
  const instance = JSON.parse(fs.readFileSync(instancePath, 'utf8'));
  // Exclude agent_signature when computing signature
  delete instance.agent_signature;
  const payload = canonicalize(instance);
  const sig = computeHmac(payload);
  console.log(sig);
}

if (require.main === module) main();
module.exports = { computeHmac };
