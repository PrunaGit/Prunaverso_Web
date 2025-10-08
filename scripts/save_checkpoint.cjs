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

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Save a checkpoint object to disk. Returns an object with paths.
 * @param {Object} obj - checkpoint object
 * @returns {{ filePath: string, sigPath?: string }}
 */
function saveCheckpoint(obj) {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const name = `checkpoint-${stamp}.json`;
  const dir = path.resolve(__dirname, '..', 'data', 'sync', 'checkpoints');
  ensureDir(dir);

  const jsonText = JSON.stringify(obj, null, 2);
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, jsonText, 'utf8');

  const key = getKey();
  let sigPath = null;
  if (key) {
    const sig = computeHmac(key, jsonText);
    sigPath = filePath + '.sig';
    fs.writeFileSync(sigPath, sig, 'utf8');
  }
  return { filePath, sigPath };
}

// CLI entry for backward compatibility
if (require.main === module) {
  (async () => {
    const input = process.argv[2];
    if (!input) {
      console.error('Usage: node save_checkpoint.cjs <json-string-or-path-to-json>');
      process.exit(2);
    }
    let obj = null;
    try {
      if (fs.existsSync(input)) {
        const txt = fs.readFileSync(input, 'utf8');
        obj = JSON.parse(txt);
      } else {
        obj = JSON.parse(input);
      }
    } catch (e) {
      console.error('Invalid JSON input:', e.message);
      process.exit(3);
    }

    try {
      const { filePath, sigPath } = saveCheckpoint(obj);
      console.log('Wrote checkpoint:', filePath);
      if (sigPath) console.log('Wrote signature:', sigPath);
      else console.log('No HMAC key found; skipped signature. Provide PRUNAVERSO_HMAC_KEY or .secrets/prunaverso_hmac.key');
    } catch (e) {
      console.error('Failed to save checkpoint:', e.message || e);
      process.exit(1);
    }
  })();
}

module.exports = saveCheckpoint;
