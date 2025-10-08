#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getKey() {
  if (process.env.PRUNAVERSO_HMAC_KEY) return process.env.PRUNAVERSO_HMAC_KEY;
  const keyPath = path.resolve(__dirname, '..', '.secrets', 'prunaverso_hmac.key');
  if (fs.existsSync(keyPath)) return fs.readFileSync(keyPath, 'utf8').trim();
  return null;
}

function computeHmac(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest('base64');
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node load_checkpoint.cjs <path-to-checkpoint.json>');
    process.exit(2);
  }

  if (!fs.existsSync(input)) {
    console.error('File not found:', input);
    process.exit(3);
  }

  const txt = fs.readFileSync(input, 'utf8');
  let obj = null;
  try { obj = JSON.parse(txt); } catch (e) { console.error('Invalid JSON:', e.message); process.exit(4); }

  console.log('Loaded checkpoint:', input);
  console.log('Content preview:', JSON.stringify(obj, null, 2).slice(0, 800));

  const sigPath = input + '.sig';
  if (fs.existsSync(sigPath)) {
    const sig = fs.readFileSync(sigPath, 'utf8').trim();
    const key = getKey();
    if (!key) { console.warn('Signature present but no HMAC key available to verify.'); process.exit(0); }
    const expected = computeHmac(key, txt);
    if (sig === expected) console.log('Signature valid ✅'); else console.error('Signature INVALID ❌ (expected', expected, 'got', sig, ')');
  } else {
    console.log('No .sig file found for this checkpoint.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
