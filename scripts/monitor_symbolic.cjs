const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const validationDir = path.join(root, 'data', 'logs', 'validation');
const monitorDir = path.join(root, 'data', 'logs', 'monitor-reports');
const alertsDir = path.join(root, 'data', 'logs', 'alerts');
const syncDir = path.join(root, 'data', 'sync');
const policyLogDir = path.join(root, 'data', 'logs', 'policy');

function readJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ name: f, path: path.join(dir, f), content: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }));
}

function summarizeValidations(validationFiles) {
  const report = { total_logs: validationFiles.length, total_validations: 0, total_valid: 0, total_invalid: 0, invalid_details: [] };
  for (const vf of validationFiles) {
    const s = vf.content.summary || { total: 0, valid: 0, invalid: 0 };
    report.total_validations += s.total || 0;
    report.total_valid += s.valid || 0;
    report.total_invalid += s.invalid || 0;
    if (vf.content.results && Array.isArray(vf.content.results)) {
      for (const r of vf.content.results) {
        if (!r.valid) {
          report.invalid_details.push({ file: r.file, errors: r.errors || null, signature_error: r.signature_error || null, log: vf.name });
        }
      }
    }
  }
  return report;
}

function collectHandshakes(syncDir) {
  if (!fs.existsSync(syncDir)) return [];
  return fs.readdirSync(syncDir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(syncDir, f), 'utf8'));
        return { name: f, actor: content.actor || null, trace_id: content.trace_id || null, signature: content.agent_signature || null };
      } catch (e) { return { name: f, error: e.message }; }
    });
}

function buildActorStats(handshakes) {
  const byActor = {};
  for (const h of handshakes) {
    if (h.actor) byActor[h.actor] = (byActor[h.actor] || 0) + 1;
  }
  return byActor;
}

(function main() {
  try {
    const validations = readJsonFiles(validationDir);
    const handshakes = collectHandshakes(syncDir);
    const summary = summarizeValidations(validations);
    const actorStats = buildActorStats(handshakes);
    const recentTraceIds = handshakes.filter(h => h.trace_id).slice(-20).map(h => h.trace_id);

    const report = {
      generated_at: new Date().toISOString(),
      validation_logs: validations.map(v => ({ file: v.name, timestamp: v.content.timestamp || null, summary: v.content.summary || null })),
      metrics: {
        total_logs: summary.total_logs,
        total_validations: summary.total_validations,
        total_valid: summary.total_valid,
        total_invalid: summary.total_invalid
      },
      invalid_details: summary.invalid_details,
      actor_stats: actorStats,
      recent_trace_ids: recentTraceIds
    };

    // Include recent policy reload logs
    const policyReloads = [];
    if (fs.existsSync(policyLogDir)) {
      const files = fs.readdirSync(policyLogDir).filter(f => f.endsWith('.json')).slice(-20);
      for (const f of files) {
        try { policyReloads.push(JSON.parse(fs.readFileSync(path.join(policyLogDir, f), 'utf8'))); } catch (e) {}
      }
    }
    report.policy_reloads = policyReloads;

    // ensure dirs
    fs.mkdirSync(monitorDir, { recursive: true });
    fs.mkdirSync(alertsDir, { recursive: true });

    const ts = new Date().toISOString().replace(/[:]/g, '-');
    const reportJsonPath = path.join(monitorDir, `${ts}-report.json`);
    const reportMdPath = path.join(monitorDir, `${ts}-report.md`);

    fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2), 'utf8');
    // Also write a public copy for the frontend to consume
    try {
      const publicDir = path.join(root, 'public', 'data');
      fs.mkdirSync(publicDir, { recursive: true });
      const publicPath = path.join(publicDir, 'monitor-latest.json');
      fs.writeFileSync(publicPath, JSON.stringify(report, null, 2), 'utf8');
    } catch (e) { /* ignore public write errors */ }

    // Write simple markdown summary
    const mdLines = [];
    mdLines.push(`# Monitor simbólico — reporte ${new Date().toISOString()}`);
    mdLines.push('');
    mdLines.push('## Métricas');
    mdLines.push('');
    mdLines.push(`- logs analizados: ${report.metrics.total_logs}`);
    mdLines.push(`- validaciones totales: ${report.metrics.total_validations}`);
    mdLines.push(`- validadas: ${report.metrics.total_valid}`);
    mdLines.push(`- inválidas: ${report.metrics.total_invalid}`);
    mdLines.push('');
    mdLines.push('## Actores detectados');
    for (const [a, c] of Object.entries(report.actor_stats)) mdLines.push(`- ${a}: ${c}`);
    mdLines.push('');
    mdLines.push('## Últimos trace_id');
    for (const t of report.recent_trace_ids) mdLines.push(`- ${t}`);
    mdLines.push('');
    if (report.invalid_details.length) {
      mdLines.push('## Detalles de invalidaciones');
      for (const d of report.invalid_details) {
        mdLines.push(`- archivo: ${d.file} (log: ${d.log})`);
        if (d.signature_error) mdLines.push(`  - signature_error: ${d.signature_error}`);
        if (d.errors) mdLines.push(`  - errors: ${JSON.stringify(d.errors)}`);
      }
    }

    fs.writeFileSync(reportMdPath, mdLines.join('\n'), 'utf8');

    // If there are invalids, create an alert
    if (report.metrics.total_invalid > 0) {
      const alertPath = path.join(alertsDir, `${ts}-alert.json`);
      const alert = { at: new Date().toISOString(), reason: 'validation_failures', invalid_count: report.metrics.total_invalid, report: reportJsonPath };
      fs.writeFileSync(alertPath, JSON.stringify(alert, null, 2), 'utf8');
      console.log('Monitor: report created with ALERT ->', reportJsonPath);
      process.exit(0);
    }

    console.log('Monitor: report created ->', reportJsonPath);
    process.exit(0);
  } catch (err) {
    console.error('Monitor error:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
