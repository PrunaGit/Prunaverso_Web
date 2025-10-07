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
  if (valid) {
    console.log('VALID: handshake passes schema validation.');
    process.exit(0);
  } else {
    console.error('INVALID: handshake failed validation.');
    console.error(validate.errors);
    process.exit(2);
  }
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(3);
}
