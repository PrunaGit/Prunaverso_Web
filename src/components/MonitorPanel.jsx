import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import atmosphereManager from '../system-core/atmosphereManager';

function usePolling(url, interval = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let timer = null;

    async function fetchOnce() {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Fetch error: ' + res.status);
        const json = await res.json();
        if (mounted.current) setData(json);
      } catch (err) {
        if (mounted.current) setError(err.message);
      }
    }

    fetchOnce();
    timer = setInterval(fetchOnce, interval);
    return () => { mounted.current = false; if (timer) clearInterval(timer); };
  }, [url, interval]);

  return { data, error };
}

// Hook para usar el atmosphereManager en componentes React
function useAtmosphere() {
  const [currentTheme, setCurrentTheme] = useState(atmosphereManager.getActiveAtmosphere());
  const [currentPalette, setCurrentPalette] = useState(atmosphereManager.getCurrentPalette());

  useEffect(() => {
    const handleAtmosphereChange = (event) => {
      setCurrentTheme(event.detail.theme);
      setCurrentPalette(event.detail.palette);
    };

    window.addEventListener('atmosphereChange', handleAtmosphereChange);
    
    return () => {
      window.removeEventListener('atmosphereChange', handleAtmosphereChange);
    };
  }, []);

  return { currentTheme, currentPalette };
}

// Lightweight, dependency-free markdown -> HTML renderer for the bitácora modal.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMarkdownToHtml(md) {
  if (!md) return '';
  // Extract code fences first
  const codeBlocks = [];  
  md = md.replace(/```[\s\S]*?```/g, (m) => {  
    codeBlocks.push(m.replace(/^```\s*\w*\n?/, '').replace(/```$/, ''));
    return `{{CODEBLOCK_${codeBlocks.length - 1}}}`;
  });

  // Split into paragraphs by blank lines
  const paras = md.split(/\n\s*\n/).map((p) => {
    // Headings
    if (/^###\s+/.test(p)) return `<h3>${escapeHtml(p.replace(/^###\s+/, ''))}</h3>`;
    if (/^##\s+/.test(p)) return `<h2>${escapeHtml(p.replace(/^##\s+/, ''))}</h2>`;
    if (/^#\s+/.test(p)) return `<h1>${escapeHtml(p.replace(/^#\s+/, ''))}</h1>`;

    // Inline code
    p = p.replace(/`([^`]+)`/g, (_, g) => `<code>${escapeHtml(g)}</code>`);
    // Bold
    p = p.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic (simple)
    p = p.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Links
    p = p.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Preserve newlines inside a paragraph
    p = escapeHtml(p).replace(/\n/g, '<br/>');
    // We've already escaped, but replace placeholders for inline tags
    p = p.replace(/&lt;(strong|em|code|a|\/a|\/strong|\/em|br)(&gt;)?/g, '<$1>');
    return `<p>${p}</p>`;
  });

  let html = paras.join('');
  // Restore code blocks
  html = html.replace(/{{CODEBLOCK_(\d+)}}/g, (_, idx) => {
    const code = escapeHtml(codeBlocks[Number(idx)] || '');
    return `<pre style="background:#031218;padding:8px;border-radius:6px;color:#dffaff;overflow:auto"><code>${code}</code></pre>`;
  });

  return html;
}

const stylesCss = `
  .ficha-card{position:relative; overflow:visible}
  .ficha-card::before{content:''; position:absolute; inset:-2px; border-radius:10px; pointer-events:none;
    background:linear-gradient(90deg, rgba(126,231,255,0.06), rgba(255,215,0,0.03));
    filter:blur(8px); opacity:0.7; transform:translateZ(0);
    animation: holoShift 6s linear infinite;
  }
  @keyframes holoShift{0%{transform:translateX(-6px)}50%{transform:translateX(6px)}100%{transform:translateX(-6px)}}

  .ficha-avatar { width:56px; height:56px; display:inline-block; border-radius:10px; overflow:visible; }
  .ficha-avatar svg { display:block }
  .spin-slow { animation: spinSlow 28s linear infinite; transform-origin: 50% 50%; }
  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .holo-pulse { animation: pulseGlow 3.8s ease-in-out infinite; }
  @keyframes pulseGlow{0%{box-shadow:0 0 6px rgba(126,231,255,0.02)}50%{box-shadow:0 0 18px rgba(126,231,255,0.06)}100%{box-shadow:0 0 6px rgba(126,231,255,0.02)}}

  .agent-state-chip { padding:4px 8px; border-radius:999px; font-size:12px; font-weight:600 }
  .agent-state-sync { background:rgba(127,242,255,0.06); color:#9fffb3 }
  .agent-state-alert { background:rgba(255,80,90,0.06); color:#ffbebf }
  .pulse-ring { position: absolute; left: -6px; top: -6px; width: 68px; height: 68px; border-radius: 12px; pointer-events: none; }
  .pulse-ring .ring { position: absolute; inset: 0; border-radius: 10px; box-shadow: 0 0 0 2px rgba(126,231,255,0.06); opacity: 0; }
  .pulse-ring.active .ring { animation: ringPulse 1.4s ease-out forwards; }
  @keyframes ringPulse { 0%{ opacity:0.9; transform: scale(0.8); box-shadow: 0 0 0 2px rgba(126,231,255,0.18);} 60%{ opacity:0.55; transform: scale(1.08); box-shadow: 0 0 24px 8px rgba(126,231,255,0.06);} 100%{ opacity:0; transform: scale(1.25); box-shadow: 0 0 40px 16px rgba(126,231,255,0.02);} }
  /* Bitacora (markdown) styling */
  .bitacora-root{ color:#dffaff; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height:1.5; }  
  .bitacora-root h1{ font-size:18px; margin:8px 0 6px; color:#fff }  
  .bitacora-root h2{ font-size:16px; margin:6px 0; color:#dffaff }  
  .bitacora-root h3{ font-size:14px; margin:6px 0; color:#bfe6ff }  
  .bitacora-root p{ margin:6px 0; color:#cfeeff }  
  .bitacora-root a{ color:#7ee7ff; text-decoration:underline; }  
  .bitacora-root code{ background: rgba(3,18,24,0.6); padding:2px 6px; border-radius:6px; color:#dffaff; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace; }  
  .bitacora-root pre{ background: rgba(3,18,24,0.9); padding:10px; border-radius:8px; overflow:auto; color:#dffaff; }  
  .bitacora-root ul, .bitacora-root ol{ margin:6px 0 6px 18px }  
  .bitacora-root a:hover{ filter:brightness(1.1) }  
  .bitacora-enter { animation: bitacoraIn 360ms cubic-bezier(.2,.9,.2,1); }  
  @keyframes bitacoraIn { from{ transform: translateY(6px) scale(.995); opacity:0 } to{ transform:none; opacity:1 } }  
`;

export default function MonitorPanel({ src = '/data/monitor-latest.json', poll = 5000 }) {
  const { data } = usePolling(src, poll);
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState('v006');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pulse, setPulse] = useState(false);
  const [mdContent, setMdContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const prevSnapshot = useRef(null);

  // Theme selector hook
  const [theme, setTheme] = useState(() => localStorage.getItem('pruna_theme') || 'pruna');
  useEffect(() => {
    try { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('pruna_theme', theme); } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      const snapshot = JSON.stringify({ recent: data && data.recent_trace_ids ? data.recent_trace_ids.slice(0, 6) : null });
      if (prevSnapshot.current && snapshot !== prevSnapshot.current) {
        setPulse(true);
        const t = setTimeout(() => setPulse(false), 1400);
        return () => clearTimeout(t);
      }
      prevSnapshot.current = snapshot;
    } catch (e) {}
  }, [data]);

  // Load available stable snapshots from public data folder
  useEffect(() => {
    let mounted = true;
    async function loadList() {
      try {
        const resV5 = await fetch('/data/nodo_central_versions/stable_pv_v005_index.json', { cache: 'no-store' });
        const resV6 = await fetch('/data/nodo_central_versions/stable_pv_v006_index.json', { cache: 'no-store' });
        const list = [];
        if (resV5.ok) list.push({ ver: 'v005', json: await resV5.json() });
        if (resV6.ok) list.push({ ver: 'v006', json: await resV6.json() });
        if (mounted) setAvailable(list);
        // default selected index data
        if (list.length > 0) {
          const pick = list.find(x => x.ver === 'v006') || list[0];
          setSelected(pick.ver);
          setSelectedIndex(pick.json);
        }
      } catch (e) {
        // ignore
      }
    }
    loadList();
    return () => { mounted = false };
  }, []);

  async function openBitacora() {
    try {
      const res = await fetch('/data/sync/protocol_integrity_v1.md', { cache: 'no-store' });
      const text = res.ok ? await res.text() : 'No se pudo cargar la bitácora.';
      setMdContent(text);
    } catch (e) {
      setMdContent('Error cargando bitácora.');
    }
    setShowModal(true);
  }

  async function viewSelectedIndex(ver) {
    try {
      const res = await fetch(`/data/nodo_central_versions/stable_pv_${ver}_index.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error('No index');
      const j = await res.json();
      setMdContent(JSON.stringify(j, null, 2));
      setShowModal(true);
    } catch (e) {
      setMdContent('No se pudo cargar el índice.');
      setShowModal(true);
    }
  }

  return (
    <div style={{ padding: 12, borderRadius: 8 }}>
      <style dangerouslySetInnerHTML={{ __html: stylesCss }} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          {pulse && (
            <div className="pulse-ring" style={{ position: 'absolute', inset: '-6px' }} aria-hidden>
              <div className="ring" />
            </div>
          )}
          {/* simple svg avatar */}
          <svg width="56" height="56" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
            <rect x="2" y="2" width="60" height="60" rx="10" fill="#062634" />
            <circle cx="32" cy="28" r="10" fill="#7ee7ff" opacity="0.9" />
          </svg>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#dffaff' }}>Prunaverso</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={openBitacora} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#cfeeff', padding: '6px 8px', borderRadius: 6 }}>Ver bitácora</button>
              <span style={{ marginLeft: 8 }} />
              {available.length > 0 && (
                <select value={selected} onChange={(e) => { setSelected(e.target.value); viewSelectedIndex(e.target.value); }} style={{ background: 'transparent', color: '#cfeeff', border: '1px solid rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: 6 }}>
                  {available.map(a => <option key={a.ver} value={a.ver}>{a.ver}</option>)}
                </select>
              )}
              <button onClick={() => viewSelectedIndex(selected)} style={{ marginLeft: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#cfeeff', padding: '6px 8px', borderRadius: 6 }}>Ver índice</button>
              {/* Theme selector */}
              <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ marginLeft: 8, background: 'transparent', color: '#cfeeff', border: '1px solid rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: 6 }}>
                <option value="pruna">Prunaverso</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cupcake">Cupcake</option>
                <option value="dracula">Dracula</option>
              </select>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowModal(false)}>
          <div style={{ width: '80%', maxHeight: '80%', overflow: 'auto', background: '#071424', padding: 16, borderRadius: 8, border: '1px solid rgba(126,231,255,0.06)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#dffaff' }}>Bitácora — protocol_integrity_v1.md</h3>
            <div style={{ marginTop: 8 }}>
              {mdContent ? (
                // if mdContent looks like JSON, show in <pre>, else render as markdown
                (/^\s*\{/.test(mdContent)) ? (
                  <pre style={{ background: 'rgba(3,18,24,0.9)', padding: 10, borderRadius: 6, color: '#dffaff', overflow: 'auto' }}>{mdContent}</pre>
                ) : (
                  <div className="bitacora-root bitacora-enter" dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(mdContent) }} />
                )
              ) : (
                <div style={{ color: '#8fb1cd' }}>Cargando bitácora…</div>
              )}
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#cfeeff', padding: '6px 8px', borderRadius: 6 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  // minimal styles kept for compatibility if other code references `styles`.
  container: {},
};
