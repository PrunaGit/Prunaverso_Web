# scripts/apply_architecture_files.py
# Crea /docs/architecture.md + /src/pages/Architecture.jsx
# y parchea router.jsx y Portal.jsx para exponer la ruta /architecture

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
SRC = ROOT / "src"
PAGES = SRC / "pages"

ARCH_MD = DOCS / "architecture.md"
ARCH_JSX = PAGES / "Architecture.jsx"
ROUTER = SRC / "router.jsx"
PORTAL = SRC / "Portal.jsx"

ARCH_MD_CONTENT = r"""# Prunaverso — Arquitectura viva

El proyecto funciona como **organismo cognitivo distribuido**: UI (percepción) ↔ lógica (memoria/razón) ↔ scripts (acción) ↔ datos firmados (integridad).

## Capas (visión humanista)
- **Percepción (UI)**: páginas y componentes React (Portal, Characters, Monitor, Lentes…).
- **Lenguaje y sentido**: hooks y transformadores de texto (useCognitiveLens, textTransformer).
- **Memoria operativa**: datos públicos y logs (public/data/*).
- **Acción técnica**: scripts de Node/Python (guardado, monitor, firmas HMAC).
- **Integridad**: schema JSON, validadores, hooks de pre-commit.

## Flujo básico
```mermaid
flowchart LR
  A[Usuario] --> B[Portal / Router]
  B --> C[Pages: Characters, SessionStart, Monitor, ProfileDemo]
  C --> D[Components: FloatingCognitiveLens, CharacterSearch, ...]
  D --> E[Hooks: useCognitiveLens, useLoadLatestCheckpoint]
  E --> F[Utils: transformers, perfiles, políticas]
  C --> G[public/data/* (monitor, index personajes)]
  F --> H[scripts/* (save/verify/monitor)]
  H --> G
  H --> I[Integridad: schema+HMAC+precommit]
```

## Lentes cognitivas (meta-adaptación)

Según la **lente activa** la misma vista subraya distintos aspectos:

* **Psicología**: experiencia del jugador y bucles de feedback.
* **Neurociencia**: atención/flow y señales de estado.
* **IA**: capas de transformación y agentes.
* **Lingüística**: contratos semióticos y taxonomías.
* **Filosofía**: sentido/ética/criterios de verdad.
* **Antropología**: prácticas, tribu, rituales de uso.

> El mapa no es el territorio; esta guía te da ambas lecturas (narrativa y técnica) sin cambiar el fondo.
"""

ARCH_JSX_CONTENT = r"""import React, { useMemo, useState } from "react";
import { useCognitiveLens } from "../hooks/useCognitiveLens";

/**
 * Mapa interactivo de arquitectura (sin dependencias extra).
 * * Cambia descripciones según la lente cognitiva activa.
 * * Nodos clicables con tooltip.
 * * Estilos Tailwind.
 */
export default function Architecture() {
  const { cognitiveLenses } = useCognitiveLens?.() || { cognitiveLenses: ['ai'] };
  const primary = cognitiveLenses?.[0] || "ai";

  const tone = useMemo(() => ({
    psychology: {
      title: "Arquitectura enfocada en experiencia",
      blurb: "Observa los bucles de feedback y la carga cognitiva.",
      color: "from-sky-500/20 to-sky-700/10",
      chip: "🧠 Psicología",
    },
    neuroscience: {
      title: "Arquitectura orientada a señales",
      blurb: "Flujo, atención y estados; entradas-salidas discretas.",
      color: "from-violet-500/20 to-violet-700/10",
      chip: "⚡ Neuro",
    },
    ai: {
      title: "Arquitectura por capas de agentes",
      blurb: "Transformadores, validadores, monitores; contratos claros.",
      color: "from-emerald-500/20 to-emerald-700/10",
      chip: "🤖 IA",
    },
    linguistics: {
      title: "Arquitectura semiótica",
      blurb: "Taxonomías, esquemas y trazabilidad narrativa ↔ técnica.",
      color: "from-fuchsia-500/20 to-fuchsia-700/10",
      chip: "💬 Ling",
    },
    philosophy: {
      title: "Arquitectura de sentido",
      blurb: "Ética, criterios de verdad y reversibilidad.",
      color: "from-amber-500/20 to-amber-700/10",
      chip: "🧩 Fil",
    },
    anthropology: {
      title: "Arquitectura situada",
      blurb: "Prácticas de la tribu y rituales de uso.",
      color: "from-teal-500/20 to-teal-700/10",
      chip: "🌍 Antro",
    },
  }[primary] || {
    title: "Arquitectura por capas",
    blurb: "Visión neutral de módulos y flujos.",
    color: "from-zinc-500/20 to-zinc-700/10",
    chip: "◻︎ Neutral",
  }), [primary]);

  const nodes = [
    { id: "PORTAL", label: "Portal / Router", desc: "Entrada del sistema y navegación.", x: 15, y: 20 },
    { id: "PAGES", label: "Pages", desc: "Characters, SessionStart, Monitor, ProfileDemo…", x: 40, y: 20 },
    { id: "COMP", label: "Components", desc: "UI reusables: Lentes, Search, Details…", x: 65, y: 20 },
    { id: "HOOKS", label: "Hooks", desc: "useCognitiveLens, useLoadLatestCheckpoint", x: 40, y: 55 },
    { id: "UTILS", label: "Utils", desc: "Transformers, perfiles, políticas", x: 65, y: 55 },
    { id: "PUBLIC", label: "public/data", desc: "monitor-latest.json, characters_index.json", x: 15, y: 55 },
    { id: "SCRIPTS", label: "scripts", desc: "save/verify/monitor, server, schema/HMAC", x: 40, y: 85 },
    { id: "INTEGRITY", label: "Integridad", desc: "AJV+Schema, HMAC, pre-commit", x: 65, y: 85 },
  ];

  const links = [
    ["PORTAL","PAGES"],["PAGES","COMP"],["COMP","HOOKS"],["HOOKS","UTILS"],
    ["PAGES","PUBLIC"],["SCRIPTS","PUBLIC"],["SCRIPTS","INTEGRITY"],["UTILS","SCRIPTS"]
  ];

  const [focus, setFocus] = useState(null);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${tone.color} via-black text-gray-200`}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              🧩 Mapa del Sistema — <span className="opacity-80">{tone.title}</span>
            </h1>
            <p className="mt-2 opacity-80">{tone.blurb}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">{tone.chip}</span>
        </header>

        <section className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Panel izquierdo: SVG/diagrama */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <svg viewBox="0 0 100 100" className="w-full h-[380px]">
              {/* links */}
              {links.map(([a,b],i) => {
                const A = nodes.find(n=>n.id===a), B = nodes.find(n=>n.id===b);
                if(!A||!B) return null;
                return (
                  <line key={i}
                        x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                        stroke="url(#g)" strokeWidth={focus && (focus!==a && focus!==b) ? 0.5 : 1.4}
                        opacity={focus && (focus!==a && focus!==b) ? 0.35 : 0.9}/>
                );
              })}
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#77eaff"/>
                  <stop offset="100%" stopColor="#b48cff"/>
                </linearGradient>
              </defs>
              {/* nodes */}
              {nodes.map(n => (
                <g key={n.id}
                   onMouseEnter={()=>setFocus(n.id)} onMouseLeave={()=>setFocus(null)}
                   onClick={()=>setFocus(n.id)} style={{cursor:"pointer"}}>
                  <circle cx={n.x} cy={n.y} r={focus===n.id?6.8:6}
                          fill={focus===n.id?"#0ea5e9":"#1f2937"} stroke="#77eaff" strokeWidth="0.6"/>
                  <text x={n.x+8} y={n.y+1.5} fontSize="4" fill="#e5e7eb">{n.label}</text>
                </g>
              ))}
            </svg>
            {/* tooltip */}
            <div className="mt-3 text-sm min-h-[3.5rem]">
              {focus ? (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="font-semibold mb-1">{nodes.find(n=>n.id===focus)?.label}</div>
                  <div className="opacity-80">{nodes.find(n=>n.id===focus)?.desc}</div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-black/20 border border-white/10 opacity-80">
                  Pasa el ratón por un nodo para ver su función. Haz clic para fijarlo.
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho: lectura contextual */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 space-y-4">
            <h2 className="text-xl font-bold">Lectura contextual</h2>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li><b>Portal/Router</b>: controla navegación y entrada simbólica.</li>
              <li><b>Pages</b>: superficies de interacción (Characters, Monitor, etc.).</li>
              <li><b>Components</b>: UI modular; la lente flotante orquesta el tono.</li>
              <li><b>Hooks</b>: estado cognitivo, carga/restauración de partidas.</li>
              <li><b>Utils</b>: transformaciones de texto y perfiles.</li>
              <li><b>public/data</b>: datos expuestos a UI (monitor, índice de personajes).</li>
              <li><b>scripts</b>: automatización, checkpoints, firmas; puente con integridad.</li>
              <li><b>Integridad</b>: schema AJV, HMAC, pre-commit; evita despliegues corruptos.</li>
            </ul>

            <div className="pt-2">
              <a href="/docs/architecture.md"
                 className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10">
                📖 Ver documento narrativo
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-xs opacity-60">
          Prunaverso · arquitectura viva · canal base + lentes cognitivas
        </footer>
      </div>
    </div>
  );
}
"""

def ensure_text(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"✅ wrote {path.relative_to(ROOT)}")

def patch_router():
    if not ROUTER.exists():
        print("⚠️ src/router.jsx no existe; omito parche.")
        return
    txt = ROUTER.read_text(encoding="utf-8")
    changed = txt
    
    # import
    if "Architecture" not in changed:
        changed = re.sub(r'(\nimport .+?\n)(?=export )',
                        r"\1import Architecture from './pages/Architecture.jsx';\n",
                        changed, count=1)
    
    # route
    if "/architecture" not in changed:
        changed = re.sub(r'(<Route\s+path=[\'"][^\'"]*[\'"].*?/>\s*\n)(\s*</Routes>)',
                        r"\1        <Route path=\"/architecture\" element={<Architecture />} />\n\2",
                        changed, count=1)
    
    if changed != txt:
        ROUTER.write_text(changed, encoding="utf-8")
        print("🔧 patched src/router.jsx (added /architecture)")
    else:
        print("ℹ️ router.jsx ya contenía la ruta/import.")

def patch_portal():
    if not PORTAL.exists():
        print("⚠️ src/Portal.jsx no existe; omito parche.")
        return
    txt = PORTAL.read_text(encoding="utf-8")
    if "/architecture" in txt:
        print("ℹ️ Portal ya enlaza a /architecture.")
        return
    
    # intenta insertar un botón extra en el primer bloque con links
    changed = re.sub(
        r'(<div[^>]*className=.*?(?:grid|flex).*?>)(.*?)(</div>)',
        lambda m: m.group(1) + m.group(2) + 
        '\n              <a href="/architecture"><Button variant="primary">🧭 Mapa del Sistema</Button></a>\n            ' + m.group(3),
        txt, count=1, flags=re.DOTALL
    )
    
    if changed != txt:
        PORTAL.write_text(changed, encoding="utf-8")
        print("🔧 patched src/Portal.jsx (added link to /architecture)")
    else:
        print("ℹ️ No pude insertar automáticamente el botón en Portal.jsx (estructura distinta). Añádelo a mano: <a href=\"/architecture\">🧭 Mapa del Sistema</a>")

def main():
    ensure_text(ARCH_MD, ARCH_MD_CONTENT)
    ensure_text(ARCH_JSX, ARCH_JSX_CONTENT)
    patch_router()
    patch_portal()
    print("\n🎉 Listo. Abre /architecture en tu dev server.")

if __name__ == "__main__":
    main()