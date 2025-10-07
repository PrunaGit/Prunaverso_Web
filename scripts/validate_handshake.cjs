const fs = require('fs');
const Ajv = require('ajv');
const path = require('path');

const ajv = new Ajv({ allErrors: true, verbose: true });

const schemaPath = path.resolve(__dirname, '..', 'data', 'sync', 'schema', 'handshake.schema.json');
const instancePath = path.resolve(__dirname, '..', 'data', 'sync', 'handshake_prunaverso_v3.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

try {
  const schema = loadJson(schemaPath);
  const instance = loadJson(instancePath);
  const validate = ajv.compile(schema);
  const valid = validate(instance);
  if (!valid) {
    console.error('INVALID: handshake failed schema validation.');
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(2);
  }

  // HMAC verification for agent_signature
  const crypto = require('crypto');
  const keyPath = require('path').resolve(__dirname, '..', '.secrets', 'prunaverso_hmac.key');
  let key = null;
  if (require('fs').existsSync(keyPath)) {
    key = require('fs').readFileSync(keyPath, 'utf8').trim();
  }

  if (instance.agent_signature && key) {
    // Compute canonical payload by parsing, removing agent_signature, and sorting keys
    const raw = require('fs').readFileSync(instancePath, 'utf8');
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
    const expected = crypto.createHmac('sha256', key).update(canonical).digest('base64');
    // agent_signature format: "AgentName:SIG:base64"
    const parts = instance.agent_signature.split(':SIG:');
    const provided = parts.length === 2 ? parts[1] : instance.agent_signature;
    if (provided !== expected) {
      console.error('INVALID: agent_signature HMAC mismatch.');
      process.exit(4);
    }
  }

  console.log('VALID: handshake passes schema validation and HMAC signature.');
  process.exit(0);
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(3);
}
