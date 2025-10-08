import React, { useEffect, useState } from 'react';

export default function InfoOrb({ 
  topic='que-es-el-prunaverso', 
  size=18, 
  align='right',
  style = {}
}) {
  const [open,setOpen]=useState(false);
  const [md,setMd]=useState('Cargando…');

  useEffect(()=>{
    if(!open) return;
    (async()=>{
      try{
        // Intentar cargar desde public/data/info/ primero
        let res = await fetch(`/data/info/${topic}.md`);
        if (!res.ok) {
          // Fallback a ruta de GitHub Pages
          res = await fetch(`/Prunaverso_Web/data/info/${topic}.md`);
        }
        setMd(res.ok ? await res.text() : 'No hay documento para este elemento.');
      }catch{ 
        setMd('No disponible offline.'); 
      }
    })();
  },[open, topic]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  // Cerrar clickeando fuera
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-info-orb]')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div 
      style={{position:'relative', display:'inline-block', ...style}}
      data-info-orb
    >
      <button
        onClick={(e)=>{
          e.stopPropagation();
          setOpen(o=>!o);
        }}
        aria-label={`Más información sobre ${topic}`}
        title="Información adicional (click para abrir)"
        style={{
          width:size, 
          height:size, 
          borderRadius:'50%',
          border:'1px solid rgba(158,252,158,.5)',
          background:'radial-gradient(circle at 30% 30%, #9efc9e, #1f2937)',
          color:'#021', 
          fontWeight:700, 
          fontSize:Math.max(10, size * 0.6), 
          lineHeight:`${size}px`,
          display:'inline-flex', 
          alignItems:'center', 
          justifyContent:'center',
          boxShadow:'0 2px 12px rgba(158,252,158,.3)', 
          cursor:'pointer',
          transition: 'all 0.2s ease',
          transform: open ? 'scale(1.1)' : 'scale(1)',
          opacity: open ? 1 : 0.8
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = open ? 'scale(1.1)' : 'scale(1)'}
      >i</button>

      {open && (
        <>
          {/* Backdrop para mobile */}
          <div 
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 69,
              display: window.innerWidth < 768 ? 'block' : 'none'
            }}
            onClick={() => setOpen(false)}
          />
          
          <div
            role="dialog"
            aria-labelledby="info-orb-title"
            style={{
              position: window.innerWidth < 768 ? 'fixed' : 'absolute',
              ...(window.innerWidth < 768 ? {
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw', maxWidth: '380px'
              } : {
                [align]: align === 'right' ? 20 : 'auto',
                [align === 'right' ? 'left' : 'right']: align === 'left' ? 20 : 'auto',
                top: -6,
                minWidth: 280, 
                maxWidth: 420
              }),
              zIndex: 70,
              background:'rgba(2,6,23,.94)', 
              color:'#e5fbe5',
              border:'1px solid rgba(158,252,158,.4)', 
              borderRadius:12,
              padding:'14px 16px', 
              boxShadow:'0 16px 48px rgba(0,0,0,.6)',
              backdropFilter:'blur(12px)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e)=>e.stopPropagation()}
          >
            <div 
              id="info-orb-title"
              style={{
                fontSize:11, 
                opacity:.7, 
                marginBottom:8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              📖 Info · {topic}
            </div>
            
            <div
              style={{
                fontFamily:'system-ui, -apple-system, sans-serif', 
                fontSize:14, 
                lineHeight:1.55, 
                whiteSpace:'pre-wrap'
              }}
              dangerouslySetInnerHTML={{__html: basicMd(md)}}
            />
            
            <div style={{
              textAlign:'right', 
              marginTop:12,
              paddingTop: 8,
              borderTop: '1px solid rgba(158,252,158,.2)'
            }}>
              <button 
                onClick={()=>setOpen(false)} 
                style={{
                  fontSize:12, 
                  opacity:.8,
                  background: 'none',
                  border: '1px solid rgba(158,252,158,.3)',
                  color: '#9efc9e',
                  padding: '4px 8px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
              >
                Cerrar (Esc)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Mini-renderer md→html (títulos, negrita, cursiva, code, links)
function basicMd(src=''){
  const esc = (s)=>s.replace(/[&<>]/g,(c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  let out = esc(src)
    .replace(/^### (.*)$/gm,'<h3 style="margin:12px 0 8px 0;color:#9efc9e;font-size:16px">$1</h3>')
    .replace(/^## (.*)$/gm,'<h2 style="margin:16px 0 10px 0;color:#9efc9e;font-size:18px">$1</h2>')
    .replace(/^# (.*)$/gm,'<h1 style="margin:20px 0 12px 0;color:#9efc9e;font-size:20px">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#9efc9e">$1</strong>')
    .replace(/\*(.+?)\*/g,'<em style="color:#c9fcc9">$1</em>')
    .replace(/`(.+?)`/g,'<code style="background:rgba(158,252,158,.1);padding:2px 4px;border-radius:3px;font-family:monospace">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" style="color:#9efc9e;text-decoration:underline" target="_blank" rel="noopener">$1</a>')
    .replace(/\n{2,}/g,'\n\n');
  
  out = out.split(/\n\n+/).map(p=>{
    if(/^<h\d/.test(p)) return p;
    return `<p style="margin:8px 0;line-height:1.55">${p}</p>`;
  }).join('\n');
  
  return out;
}