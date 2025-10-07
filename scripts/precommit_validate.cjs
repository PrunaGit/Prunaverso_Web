const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const root = path.resolve(__dirname, '..');
const syncDir = path.join(root, 'data', 'sync');
const schemaPath = path.join(syncDir, 'schema', 'handshake.schema.json');
const logDir = path.join(root, 'data', 'logs', 'validation');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function findHandshakeFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && f.startsWith('handshake_'))
    .map(f => path.join(dir, f));
}

(async function main() {
  try {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    const schema = loadJson(schemaPath);
    const validate = ajv.compile(schema);

    const files = findHandshakeFiles(syncDir);
    const results = [];

    for (const fp of files) {
      const instance = loadJson(fp);
      const valid = validate(instance);
      let sigMismatch = false;
      // HMAC check
      const keyPath = path.join(root, '.secrets', 'prunaverso_hmac.key');
      if (instance.agent_signature && fs.existsSync(keyPath)) {
        const key = fs.readFileSync(keyPath, 'utf8').trim();
        const raw = fs.readFileSync(fp, 'utf8');
        const parsed = JSON.parse(raw);
        delete parsed.agent_signature;
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
        const canonical = JSON.stringify(sortObject(parsed));
        const crypto = require('crypto');
        const expected = crypto.createHmac('sha256', key).update(canonical).digest('base64');
        const parts = instance.agent_signature.split(':SIG:');
        const provided = parts.length === 2 ? parts[1] : instance.agent_signature;
        if (provided !== expected) {
          sigMismatch = true;
        }
      }

      const entry = { file: path.relative(root, fp), valid: valid && !sigMismatch, errors: valid ? null : validate.errors };
      if (sigMismatch) entry.signature_error = 'HMAC mismatch';
      results.push(entry);
    }

    // Prepare log
    fs.mkdirSync(logDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const logPath = path.join(logDir, `${timestamp}-validation.json`);
    const summary = { total: results.length, valid: results.filter(r => r.valid).length, invalid: results.filter(r => !r.valid).length };
    const out = { timestamp: new Date().toISOString(), summary, results };
    fs.writeFileSync(logPath, JSON.stringify(out, null, 2), 'utf8');

    // Output
    if (summary.invalid > 0) {
      console.error(`PRE-COMMIT VALIDATION FAILED: ${summary.invalid}/${summary.total} invalid. Log: ${path.relative(root, logPath)}`);
      for (const r of results.filter(r => !r.valid)) {
        console.error(`\nFile: ${r.file}`);
        console.error(JSON.stringify(r.errors, null, 2));
      }
      process.exit(1);
    } else {
      console.log(`PRE-COMMIT VALIDATION PASSED: ${summary.valid}/${summary.total} valid. Log: ${path.relative(root, logPath)}`);
      process.exit(0);
    }

  } catch (err) {
    console.error('ERROR in precommit validator:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
