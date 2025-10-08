#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json({ limit: '2mb' }));

function getKey() {
  if (process.env.PRUNAVERSO_HMAC_KEY) return process.env.PRUNAVERSO_HMAC_KEY;
  const keyPath = path.resolve(__dirname, '..', '.secrets', 'prunaverso_hmac.key');
  if (fs.existsSync(keyPath)) return fs.readFileSync(keyPath, 'utf8').trim();
  return null;
}

const saveCheckpoint = require('./save_checkpoint.cjs');

// 🫀 ENDPOINTS DE PERCEPCIÓN EMPÍRICA
// Ping endpoint para verificar que el motor simbólico está vivo
app.get('/api/ping', (req, res) => {
  res.json({ 
    ok: true, 
    t: Date.now(),
    status: 'motor-simbolico-activo',
    server: 'prunaverso-checkpoint-server'
  });
});

// Render alive endpoint para notificación de UI montada
app.post('/api/render-alive', (req, res) => {
  const renderInfo = req.body || {};
  console.log('🟢 UI Render Detectado:', {
    timestamp: new Date().toISOString(),
    url: renderInfo.url || 'unknown',
    viewport: renderInfo.viewport || 'unknown',
    elements: renderInfo.elementCount || 'unknown'
  });
  res.json({ 
    ok: true, 
    message: 'render-alive-received',
    serverTime: Date.now()
  });
});

app.post('/api/save-checkpoint', async (req, res) => {
  try {
    const result = saveCheckpoint(req.body);
    res.status(200).json({ ok: true, file: result.filePath, sig: result.sigPath });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.get('/api/load-latest-checkpoint', (req, res) => {
  const dir = path.resolve(__dirname, '..', 'data', 'sync', 'checkpoints');
  if (!fs.existsSync(dir)) return res.status(404).json({ ok: false, error: 'no-checkpoints-dir' });

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  if (!files.length) return res.status(404).json({ ok: false, error: 'no-checkpoints' });

  const latest = path.join(dir, files[0].f);
  try {
    const txt = fs.readFileSync(latest, 'utf8');
    const parsed = JSON.parse(txt);

    const sigPath = latest + '.sig';
    let sigValid = null;
    if (fs.existsSync(sigPath)) {
      const sig = fs.readFileSync(sigPath, 'utf8').trim();
      const key = getKey();
      if (key) {
        const expected = crypto.createHmac('sha256', key).update(txt).digest('base64');
        sigValid = sig === expected;
      } else {
        sigValid = 'no-key';
      }
    }

    return res.json({ ok: true, file: path.basename(latest), checkpoint: parsed, sigValid });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'read-error', message: e.message });
  }
});

function listCheckpoints() {
  const dir = path.resolve(__dirname, '..', 'data', 'sync', 'checkpoints');
  if (!fs.existsSync(dir)) return [];
  const items = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      const txt = fs.readFileSync(full, 'utf8');
      const sigPath = full + '.sig';
      const hasSig = fs.existsSync(sigPath);
      let sig = null;
      let sigValid = null;
      if (hasSig) {
        sig = fs.readFileSync(sigPath, 'utf8').trim();
        const key = getKey(); // reuse getKey() from file (PRUNAVERSO_HMAC_KEY or .secrets)
        if (key) {
          const expected = crypto.createHmac('sha256', key).update(txt).digest('base64');
          sigValid = sig === expected;
        } else {
          sigValid = 'no-key';
        }
      }
      return {
        file: f,
        mtime: stat.mtimeMs,
        size: stat.size,
        sig: sig ? true : false,
        sigValid,
      };
    })
    .sort((a,b) => b.mtime - a.mtime);
  return items;
}

app.get('/api/list-checkpoints', (req, res) => {
  try {
    const list = listCheckpoints();
    res.json({ ok: true, checkpoints: list });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Characters endpoint: reads character JSON files from local folder
app.get('/api/characters', (req, res) => {
  try {
    // Prefer in-repo characters folder, fall back to external path for backward compat
    const repoCharDir = path.resolve(__dirname, '..', 'data', 'characters');
    const extCharDir = path.resolve('C:/Users/pruna/Documents/GITHUB/Prunaverso/personajes');
    const charDir = fs.existsSync(repoCharDir) ? repoCharDir : extCharDir;
    if (!fs.existsSync(charDir)) {
      return res.status(404).json({ ok: false, error: 'No existe la carpeta de personajes' });
    }

    const files = fs.readdirSync(charDir).filter(f => f.endsWith('.json'));
    const characters = files.map(f => {
      const fullPath = path.join(charDir, f);
      const txt = fs.readFileSync(fullPath, 'utf8');
      let data = {};
      try { data = JSON.parse(txt); } catch (e) { data = {}; }
      return {
        file: f,
        name: data.name || path.basename(f, '.json'),
        avatar: data.avatar || null,
        description: data.description || '',
        stats: data.stats || {},
      };
    });

    res.json({ ok: true, count: characters.length, characters });
  } catch (e) {
    console.error('Error leyendo personajes:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET single character by filename (safe: use basename to avoid traversal)
app.get('/api/character/:file', (req, res) => {
  try {
    const file = path.basename(req.params.file);
    const charDir = path.resolve('C:/Users/pruna/Documents/GITHUB/Prunaverso/personajes');
    const full = path.join(charDir, file);
    if (!fs.existsSync(full)) return res.status(404).json({ ok: false, error: 'not-found' });
    const txt = fs.readFileSync(full, 'utf8');
    const data = JSON.parse(txt);
    return res.json({ ok: true, file, data });
  } catch (e) {
    console.error('Error reading character:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.SAVE_SERVER_PORT || 4001;
app.listen(port, () => console.log(`✅ save-checkpoint server listening on http://localhost:${port}`));
