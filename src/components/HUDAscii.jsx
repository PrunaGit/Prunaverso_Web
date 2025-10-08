import React, { useEffect, useMemo, useState } from 'react';
import { useCognitiveLens } from '../hooks/useCognitiveLens';

const TEMPLATES = {
  base: (ctx)=>[
`┌────────── PRUNAVERSO HUD ──────────┐`,
`│ Lentes: ${ctx.lenses.join(' + ') || 'ninguna'}${ctx.profile?`  Perfil: ${ctx.profile}`:''}`,
`│ Modo: ${ctx.mode}   FPS~${ctx.fps.toString().padStart(2,' ')}`,
`├────────────────────────────────────┤`,
`│ Input: ${ctx.lastAction || '—'}                               `,
`│ Trace: ${ctx.traceId?.slice(0,8) || '—'}  Sig: ${ctx.sig?.slice(-6) || '—'}`,
`└────────────────────────────────────┘`,
].join('\n'),
  psychology: (c)=>[
`╔═ PSICOLOGÍA ═══════════════════════╗`,
`║ arousal:${c.arousal}/10  valencia:${c.valence}/10              `,
`║ foco:${c.focus}%  flow:${c.flow}%                              `,
`╚════════════════════════════════════╝`,
].join('\n'),
  neuroscience: (c)=>[
`[NEURO] θ:${c.theta} α:${c.alpha} β:${c.beta} γ:${c.gamma}`,
`HRV:${c.hrv}  Resp:${c.breaths}/min  Pupila:${c.pupil}mm`,
].join('\n'),
  ai: (c)=>[
`<AI> policy:${c.policy}  temp:${c.temp}  top_p:${c.topP}`,
`ctx:${c.tokens} toks  cache:${c.cache?'on':'off'}`,
].join('\n'),
  linguistics: (c)=>[
`{LING} acto:${c.speechAct}  registro:${c.register}`,
`dialecto:${c.variety}  estilo:${c.style}`,
].join('\n'),
  philosophy: ()=>`(Φ) modo: fenomenología · criterio: coherencia/claridad`,
  anthropology: ()=>`(ANT) contexto: micro/meso/macro · rito: onboarding`,
  hacker: (c)=>[
`[HACK] target:${c.target}  exploit:${c.exploit}`,
`shells:${c.shells}  privesc:${c.privesc}  stealth:${c.stealth}%`,
].join('\n'),
  art: (c)=>[
`{ART} paleta:${c.palette}  composición:${c.composition}`,
`textura:${c.texture}  luz:${c.lighting}  armonía:${c.harmony}%`,
].join('\n'),
  music: (c)=>[
`♪ tempo:${c.tempo}bpm  key:${c.key}  time:${c.timeSignature}`,
`dynamics:${c.dynamics}  mood:${c.mood}`,
].join('\n')
};

export default function HUDAscii({
  zIndex=60, 
  opacity=0.9, 
  mono='ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
}) {
  const { cognitiveLenses = [], activeProfile } = useCognitiveLens();
  const [show, setShow] = useState(() => {
    return localStorage.getItem('prv:hud') === 'on' || false;
  });
  const [fps, setFps] = useState(60);
  const [lastAction, setLastAction] = useState(null);

  // Toggle con tecla H
  useEffect(()=>{
    const onKey=(e)=>{ 
      if(e.key.toLowerCase()==='h' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setShow(s=>{
          const newState = !s;
          localStorage.setItem('prv:hud', newState ? 'on' : 'off');
          return newState;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[]);

  // FPS counter
  useEffect(()=>{
    let f=0, t=performance.now();
    let raf;
    const loop=()=>{
      const now=performance.now();
      f++; 
      if(now-t>1000){ 
        setFps(Math.round(f * 1000 / (now - t))); 
        f=0; 
        t=now; 
      }
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return ()=> cancelAnimationFrame(raf);
  },[]);

  // Escuchar interacciones del sistema
  useEffect(() => {
    const handleInteraction = (e) => {
      setLastAction(e.detail?.type || e.type || 'unknown');
    };
    
    window.addEventListener('click', () => setLastAction('click'));
    window.addEventListener('keydown', (e) => setLastAction(`key:${e.key}`));
    window.addEventListener('prunaverso:interaction', handleInteraction);
    
    return () => {
      window.removeEventListener('click', () => setLastAction('click'));
      window.removeEventListener('keydown', (e) => setLastAction(`key:${e.key}`));
      window.removeEventListener('prunaverso:interaction', handleInteraction);
    };
  }, []);

  const ctx = useMemo(()=>({
    lenses: cognitiveLenses,
    profile: activeProfile || null,
    mode: window.location.search.includes('dev=true') ? 'dev' : 'público',
    fps,
    lastAction,
    traceId: window.__PRV_TRACE__ || Math.random().toString(36).substr(2, 8),
    sig: window.__PRV_SIG__ || 'prv' + Date.now().toString(36),
    // valores simbólicos mock (se pueden cablear más adelante)
    arousal: Math.floor(Math.random() * 6) + 4, 
    valence: Math.floor(Math.random() * 6) + 4, 
    focus: Math.floor(Math.random() * 40) + 60, 
    flow: Math.floor(Math.random() * 40) + 50,
    theta:'↑', alpha:'↔', beta:'↗', gamma:'↘', 
    hrv: Math.floor(Math.random() * 20) + 50, 
    breaths: Math.floor(Math.random() * 8) + 8, 
    pupil: (Math.random() * 2 + 2).toFixed(1),
    policy:'aligned', temp:0.7, topP:0.9, tokens:2048, cache:true,
    speechAct:'directivo', register:'cercano', variety:'ES', style:'prunaversal',
    target:'localhost', exploit:'social_eng', shells:3, privesc:'sudo', stealth:87,
    palette:'cian/púrpura', composition:'regla_tercios', texture:'suave', lighting:'dramática', harmony: 73,
    tempo: 120, key:'Am', timeSignature:'4/4', dynamics:'mf', mood:'contemplativo'
  }),[cognitiveLenses, activeProfile, fps, lastAction]);

  const sheet = useMemo(()=>{
    const blocks = [TEMPLATES.base(ctx)];
    
    // Mapear lentes a templates
    const lensMap = {
      'psychology': 'psychology',
      'ai': 'ai', 
      'linguistics': 'linguistics',
      'philosophy': 'philosophy',
      'anthropology': 'anthropology',
      'hacker': 'hacker',
      'art': 'art',
      'music': 'music',
      'data_science': 'neuroscience', // mapear data science a neuro
      'cybersecurity': 'hacker' // mapear cybersecurity a hacker
    };
    
    for(const lens of cognitiveLenses){
      const templateKey = lensMap[lens];
      if(TEMPLATES[templateKey]) {
        blocks.push(TEMPLATES[templateKey](ctx));
      }
    }
    return blocks.join('\n');
  },[ctx, cognitiveLenses]);

  if(!show) return null;
  
  return (
    <pre
      aria-label="Prunaverso HUD - Presiona H para toggle"
      style={{
        position:'fixed', 
        left:16, 
        bottom:16, 
        zIndex,
        background:'rgba(2,6,23,0.85)', 
        color:'#9efc9e',
        border:'1px solid rgba(158,252,158,0.4)',
        borderRadius:12, 
        padding:'10px 12px', 
        lineHeight:1.15,
        fontFamily:mono, 
        fontSize:12, 
        whiteSpace:'pre',
        backdropFilter:'blur(8px)', 
        boxShadow:'0 8px 32px rgba(0,0,0,.45)',
        opacity,
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    >{sheet}</pre>
  );
}