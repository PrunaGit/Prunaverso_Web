const fs = require('fs');
const path = require('path');

const POLICY_PATH = path.resolve(__dirname, '..', 'data', 'config', 'execution_policy.json');

function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) throw new Error('Execution policy not found at ' + POLICY_PATH);
  const raw = fs.readFileSync(POLICY_PATH, 'utf8');
  let policy;
  try {
    policy = JSON.parse(raw);
  } catch (err) {
    throw new Error('Invalid JSON in execution policy: ' + err.message);
  }

  // Minimal validation
  if (!policy.policy_name || !policy.version || !policy.rules) {
    throw new Error('Execution policy missing required top-level fields (policy_name, version, rules)');
  }

  // Normalize allowed paths key (some policies may use numeric prefixes)
  if (!policy.rules.allowed_paths && policy.rules['8_allowed_paths']) {
    policy.rules.allowed_paths = policy.rules['8_allowed_paths'];
  }

  // Ensure logging and backup dirs exist
  const root = path.resolve(__dirname, '..');
  if (policy.rules && policy.rules.backup_location) {
    const backupDir = path.join(root, policy.rules.backup_location.replace(/^[\/]/, ''));
    try { fs.mkdirSync(backupDir, { recursive: true }); } catch (e) {}
  }
  if (policy.rules && policy.rules.logging && policy.rules.logging.location) {
    const logDir = path.join(root, policy.rules.logging.location.replace(/^[\/]/, ''));
    try { fs.mkdirSync(logDir, { recursive: true }); } catch (e) {}
  }

  return policy;
}

function isPathAllowed(policy, targetPath) {
  if (!policy || !policy.rules || !policy.rules.allowed_paths) return false;
  const allowed = policy.rules.allowed_paths.map(p => p.replace(/^[\\/]+|[\\/]+$/g, ''));
  // normalize target path relative to repo root
  const rel = path.relative(path.resolve(__dirname, '..'), path.resolve(targetPath)).replace(/\\/g, '/').replace(/^[\\/]+|[\\/]+$/g, '');
  return allowed.some(a => rel === a || rel.startsWith(a + '/'));
}

function shouldBackup(policy) {
  return !!(policy && policy.rules && policy.rules.backup_location);
}

// Export functions for use by agents
module.exports = { loadPolicy, isPathAllowed, shouldBackup, POLICY_PATH };

// If run directly, print a summary
if (require.main === module) {
  try {
    const p = loadPolicy();
    console.log('Execution policy loaded:');
    console.log(`- name: ${p.policy_name}`);
    console.log(`- version: ${p.version}`);
    console.log(`- description: ${p.description || '(none)'}`);
    if (p.rules) {
      console.log('- rules summary:');
      Object.keys(p.rules).forEach(k => {
        if (typeof p.rules[k] === 'object') console.log(`  - ${k}: (object)`);
        else console.log(`  - ${k}: ${String(p.rules[k])}`);
      });
    }
    process.exit(0);
  } catch (err) {
    console.error('ERROR loading policy:', err.message);
    process.exit(2);
  }
}
