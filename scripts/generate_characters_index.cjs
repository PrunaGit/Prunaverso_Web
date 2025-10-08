#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseTolerant(txt) {
  try {
    return JSON5.parse(txt);
  } catch (e) {
    // fallback: try to strip // comments and /**/ blocks (naive)
    const stripped = txt.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    return JSON.parse(stripped);
  }
}

function main() {
  const repoCharDir = path.resolve(__dirname, '..', 'data', 'characters');
  if (!fs.existsSync(repoCharDir)) {
    console.error('No characters folder found at', repoCharDir);
    process.exit(1);
  }

  const files = fs.readdirSync(repoCharDir).filter(f => f.endsWith('.json'));
  const index = files.map(f => {
    const full = path.join(repoCharDir, f);
    const txt = fs.readFileSync(full, 'utf8');
    let data = {};
    try { data = parseTolerant(txt); } catch (e) { data = { _parseError: e.message }; }
    const stat = fs.statSync(full);
    return {
      file: f,
      name: data.name || path.basename(f, '.json'),
      description: data.description || '',
      avatar: data.avatar || null,
      stats: data.stats || null,
      tags: data.tags || null,
      mtime: stat.mtimeMs,
      size: stat.size,
      parseError: data._parseError || null,
    };
  }).sort((a,b) => b.mtime - a.mtime);

  const outDir = path.resolve(__dirname, '..', 'public', 'data');
  ensureDir(outDir);
  const outPath = path.join(outDir, 'characters_index.json');
  fs.writeFileSync(outPath, JSON.stringify({ ok: true, count: index.length, characters: index }, null, 2), 'utf8');
  console.log('Wrote index to', outPath);
}

if (require.main === module) main();

module.exports = { main };
