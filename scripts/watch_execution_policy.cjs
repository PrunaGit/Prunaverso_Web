const fs = require('fs');
const path = require('path');
const { loadPolicy } = require('./load_execution_policy.cjs');

const POLICY_PATH = path.resolve(__dirname, '..', 'data', 'config', 'execution_policy.json');
const logDir = path.resolve(__dirname, '..', 'data', 'logs', 'policy');

function writeLog(entry) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:]/g, '-');
    const p = path.join(logDir, `${ts}-policy.json`);
    fs.writeFileSync(p, JSON.stringify(entry, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write policy log', e && e.message ? e.message : e);
  }
}

console.log('Policy watcher starting, watching', POLICY_PATH);

// Initial load
try {
  const p = loadPolicy();
  console.log('Initial policy loaded:', p.policy_name, p.version);
  writeLog({ at: new Date().toISOString(), status: 'loaded', version: p.version, note: 'initial_load' });
} catch (err) {
  console.error('Initial policy load failed:', err.message);
  writeLog({ at: new Date().toISOString(), status: 'error', error: err.message });
}

fs.watchFile(POLICY_PATH, { interval: 1000 }, (curr, prev) => {
  if (curr.mtimeMs === prev.mtimeMs) return; // no change
  console.log('Policy file changed, reloading...');
  try {
    const p = loadPolicy();
    console.log('Policy reloaded:', p.policy_name, p.version);
    writeLog({ at: new Date().toISOString(), status: 'reloaded', version: p.version });
    process.emit && process.emit('policyUpdated', p);
  } catch (err) {
    console.error('Policy reload failed:', err.message);
    writeLog({ at: new Date().toISOString(), status: 'error', error: err.message });
    process.emit && process.emit('policyError', { error: err.message });
  }
});

// Keep process alive
process.stdin.resume();
