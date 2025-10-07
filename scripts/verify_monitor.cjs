#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Ajv = require('ajv');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function resolvePossible(p) {
  // Accept both forward and backslashes in stored paths
  const candidate = path.resolve(__dirname, '..', p.replace(/\\/g, path.sep));
  if (fs.existsSync(candidate)) return candidate;
  // Also try relative to repo root
  const alt = path.resolve(__dirname, '..', p);
  if (fs.existsSync(alt)) return alt;
  return null;
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

function loadKey() {
  // Priority: env PRUNAVERSO_HMAC_KEY, then .secrets/prunaverso_hmac.key
  if (process.env.PRUNAVERSO_HMAC_KEY) return process.env.PRUNAVERSO_HMAC_KEY.trim();
  const keyPath = path.resolve(__dirname, '..', '.secrets', 'prunaverso_hmac.key');
  if (fs.existsSync(keyPath)) return fs.readFileSync(keyPath, 'utf8').trim();
  return null;
}

function computeHmacBase64(obj, key) {
  const canonical = JSON.stringify(sortObject(obj));
  return crypto.createHmac('sha256', key).update(canonical).digest('base64');
}

// Entrypoint
try {
  const repoRoot = path.resolve(__dirname, '..');
  const monitorPath = path.resolve(repoRoot, 'public', 'data', 'monitor-latest.json');
  if (!fs.existsSync(monitorPath)) {
    console.error('❌ monitor file not found:', monitorPath);
    process.exit(2);
  }

  const monitor = loadJson(monitorPath);
  console.log('Loaded monitor:', monitorPath);
  const checks = [];

  // Basic structural checks
  const generatedAt = monitor.generated_at;
  try { new Date(generatedAt).toISOString(); checks.push({ok: true, msg: 'generated_at valid ISO8601'}); }
  catch (e) { checks.push({ok: false, msg: 'generated_at invalid'}); }

  if (!Array.isArray(monitor.validation_logs)) {
    checks.push({ok: false, msg: 'validation_logs is not an array'});
  } else {
    checks.push({ok: true, msg: `validation_logs length ${monitor.validation_logs.length}`} );
  }

  // Basic consistency checks using metrics
  if (monitor.metrics) {
    const m = monitor.metrics;
    const cg = (m.total_logs === monitor.validation_logs.length);
    checks.push({ok: cg, msg: `metrics.total_logs === validation_logs.length (${m.total_logs} === ${monitor.validation_logs.length})`});
  } else {
    checks.push({ok: false, msg: 'metrics missing'});
  }

  // Load handshake schema to validate any referenced handshake instances
  const schemaPath = path.resolve(repoRoot, 'data', 'sync', 'schema', 'handshake.schema.json');
  let ajv = null;
  let schema = null;
  if (fs.existsSync(schemaPath)) {
    try {
      schema = loadJson(schemaPath);
      ajv = new Ajv({ allErrors: true, verbose: true });
      var validateHandshake = ajv.compile(schema);
      console.log('Using handshake schema:', schemaPath);
    } catch (err) {
      console.warn('⚠️  Could not load handshake schema:', err.message);
    }
  } else {
    console.warn('⚠️  handshake.schema.json not found, skipping instance schema checks');
  }

  const key = loadKey();
  if (!key) console.warn('⚠️  PRUNAVERSO_HMAC_KEY not found (env or .secrets/prunaverso_hmac.key) — HMAC checks will be skipped');

  // Collect instance file paths from invalid_details and validation_logs if possible
  const referenced = new Set();
  if (Array.isArray(monitor.invalid_details)) {
    monitor.invalid_details.forEach(d => { if (d.file) referenced.add(d.file); });
  }
  // Also include any actor-reported files from logs (some monitors include file paths)
  if (Array.isArray(monitor.validation_logs)) {
    monitor.validation_logs.forEach(l => { if (l.file && l.file.endsWith('-validation.json') && l.log_payload && l.log_payload.file) referenced.add(l.log_payload.file); });
  }

  const results = [];
  for (const rel of referenced) {
    const resolved = resolvePossible(rel);
    if (!resolved) {
      results.push({ file: rel, ok: false, reason: 'file not found' });
      continue;
    }
    let inst = null;
    try { inst = loadJson(resolved); }
    catch (err) { results.push({ file: rel, ok: false, reason: 'invalid json: ' + err.message }); continue; }

    // Schema validation (if available)
    if (validateHandshake) {
      const valid = validateHandshake(inst);
      if (!valid) {
        results.push({ file: rel, ok: false, reason: 'schema_invalid', errors: validateHandshake.errors });
        continue;
      }
    }

    // HMAC verification (if key present)
    if (key) {
      const provided = (inst.agent_signature && String(inst.agent_signature).includes(':SIG:')) ? String(inst.agent_signature).split(':SIG:')[1] : inst.agent_signature;
      if (!provided) {
        results.push({ file: rel, ok: false, reason: 'missing_agent_signature' });
        continue;
      }
      // Compute expected
      const copy = Object.assign({}, inst);
      delete copy.agent_signature;
      const expected = computeHmacBase64(copy, key);
      if (expected !== provided) {
        results.push({ file: rel, ok: false, reason: 'hmac_mismatch', expected, provided });
        continue;
      }
    }

    results.push({ file: rel, ok: true });
  }

  // Verify any stable_pv index files in nodo_central_versions (HMAC)
  const indexChecks = [];
  try {
    const versionsDir = path.resolve(repoRoot, 'a_stabledversions', 'nodo_central_versions');
    if (fs.existsSync(versionsDir)) {
      const files = fs.readdirSync(versionsDir);
      files.forEach(f => {
        if (f.endsWith('_index.json')) {
          const idxPath = path.join(versionsDir, f);
          const base = f.replace('_index.json', '');
          const sigPath = path.join(versionsDir, `${base}_index.sig`);
          try {
            const idx = loadJson(idxPath);
            if (key) {
              if (!fs.existsSync(sigPath)) {
                indexChecks.push({ file: idxPath, ok: false, reason: 'missing_sig' });
              } else {
                const provided = fs.readFileSync(sigPath, 'utf8').trim();
                const expected = computeHmacBase64(idx, key);
                if (provided !== expected) indexChecks.push({ file: idxPath, ok: false, reason: 'sig_mismatch', expected, provided });
                else indexChecks.push({ file: idxPath, ok: true });
              }
            } else {
              // No key available: report presence but skip verification
              indexChecks.push({ file: idxPath, ok: true, note: 'no_key_skipped' });
            }
          } catch (err) {
            indexChecks.push({ file: idxPath, ok: false, reason: 'invalid_json' });
          }
        }
      });
    }
  } catch (err) {
    console.warn('⚠️  Could not inspect nodo_central_versions:', err.message);
  }

  // Print summary
  console.log('\nChecks:');
  checks.forEach(c => console.log(c.ok ? '✅' : '❌', c.msg));

  console.log('\nInstance validation results:');
  let failCount = 0;
  results.forEach(r => {
    if (r.ok) console.log('✅', r.file);
    else {
      failCount++;
      console.log('❌', r.file, '-', r.reason);
      if (r.errors) console.log(JSON.stringify(r.errors, null, 2));
      if (r.expected) console.log('expected HMAC:', r.expected, 'provided:', r.provided);
    }
  });

  if (failCount === 0 && checks.every(c => c.ok)) {
    console.log('\nAll checks passed ✅');
    process.exit(0);
  }

  console.error('\nSome checks failed ❌');
  process.exit(1);

} catch (err) {
  console.error('ERROR:', err && err.message ? err.message : err);
  process.exit(3);
}
