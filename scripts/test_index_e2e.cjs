#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const child = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const versionsDir = path.join(repoRoot, 'a_stabledversions', 'nodo_central_versions');
if (!fs.existsSync(versionsDir)) fs.mkdirSync(versionsDir, { recursive: true });

const key = 'testkey123';
const base = 'stable_pv_test';
const idxPath = path.join(versionsDir, `${base}_index.json`);
const sigPath = path.join(versionsDir, `${base}_index.sig`);

const payload = {
  version: 'test',
  generated_at: new Date().toISOString(),
  source_dir: 'a_stabledversions/saved_chats/saved_chats_test',
  entries: []
};

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

function computeHmacBase64(obj, key) {
  const canonical = JSON.stringify(sortObject(obj));
  return crypto.createHmac('sha256', key).update(canonical).digest('base64');
}

fs.writeFileSync(idxPath, JSON.stringify(payload, null, 2), 'utf8');
const sig = computeHmacBase64(payload, key);
fs.writeFileSync(sigPath, sig, 'utf8');

console.log('Wrote test index:', idxPath);
console.log('Wrote test sig:', sigPath);

try {
  const env = Object.assign({}, process.env, { PRUNAVERSO_HMAC_KEY: key });
  console.log('\nRunning verifier...');
  const out = child.execFileSync('node', [path.join(__dirname, 'verify_monitor.cjs')], { env: env, stdio: 'inherit' });
} catch (err) {
  // verifier will print to stdout/stderr
  process.exit(err.status || 1);
}
