# 🪐 **PRUNAVERSO WEB — GAME DESIGN DOCUMENT (GDD)**

**Versión:** 1.0.0 – "Genesis Build"  
**Autor:** Alex Pruna (Dirección Creativa y Cognitiva)  
**Copiloto Técnico:** LLM-Dev  
**Fecha:** 08_10_25  
**Tipo de Proyecto:** Metaverso Web Interactivo / Videojuego Cognitivo  
**Motor Base:** React + Vite + Tailwind + shadcn/ui + Recharts  
**Repositorios:**
* [GitHub – Prunaverso_Web](https://github.com/PrunaGit/Prunaverso_Web)
* Local: `C:\Users\pruna\Documents\GITHUB\Prunaverso_Web`

---

## 🎯 1. INTRODUCCIÓN

El **Prunaverso Web** es una plataforma narrativa y cognitiva gamificada que combina exploración simbólica, aprendizaje experiencial y autoevaluación evolutiva.
El usuario no solo navega — **juega su propio proceso de comprensión**.
Cada acción otorga energía simbólica (XP), cada lente altera la realidad percibida y cada interacción amplía su madurez prunaversal.

---

## 🧠 2. CONCEPTO CENTRAL

**Core Loop:**
> Explorar → Descubrir → Reflexionar → Evolucionar

**Meta del jugador:**
> Despertar su percepción prunaversal, comprendiendo que la realidad digital también es una extensión de la consciencia.

**Tagline:**
> "No estás jugando un juego. Estás jugando contigo mismo."

---

## 🧩 3. CARACTERÍSTICAS PRINCIPALES

| Categoría               | Descripción                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| 🎭 Identidad Cognitiva  | Cada jugador comienza con un perfil detectado (Yo / Amigo / Desconocido).               |
| 🔮 Lentes Cognitivas    | Seis ciencias base: Psicología, Neurociencia, IA, Lingüística, Filosofía, Antropología. |
| 🧬 Sistema de Madurez   | Medición de evolución cognitiva (0–100%).                                               |
| 🕹️ Sistema XP          | Interacciones otorgan XP y desbloquean habilidades.                                     |
| 🧠 HUD Dinámico         | Visualización en ASCII, con datos vivos del jugador.                                    |
| 🪶 InfoOrbs             | Ayuda contextual flotante para cada elemento interactivo.                               |
| 🌌 Atmósfera Visual     | Cambia según las lentes activas y la energía simbólica.                                 |
| 🧾 Narrativa Ramificada | Basada en decisiones y curiosidad del jugador.                                          |
| 🧱 Arquitectura Fractal | Módulos autónomos interconectados (como células cognitivas).                            |

---

## 🗺️ 4. PLATAFORMA Y PÚBLICO OBJETIVO

* **Plataforma:** Web (Desktop y Mobile)
* **Audiencia:**
  * Curiosos cognitivos 🌱
  * Creativos y tecnólogos 🤖
  * Investigadores y filósofos 🧩
  * Jugadores introspectivos 🎮
* **Edad:** 16+
* **Estilo de juego:** Exploración / Simulación simbólica / Rol cognitivo

---

## 🧭 5. FLUJO GENERAL DE EXPERIENCIA

### 🔹 Fase 0 — **Despertar** (`/awakening`)

El usuario entra sin saber qué es el Prunaverso.
El HUD aparece → barras de XP → el sistema pregunta:

> "¿Qué es el Prunaverso?"
> "¿Por qué tengo barras de XP?"

**Timing narrativo:**
1. Detección consciencia (1.5s)
2. Escaneo cognitivo (2.5s) 
3. Identificación visitante (2s)
4. Protocolo activado (3s)
5. Sistema habla (2.5s)
6. Diálogo de elección (∞)

**Implementación:** `src/pages/AwakeningIntro.jsx`

---

### 🔹 Fase 1 — **Portal de Ingreso** (`/`)

Pantalla de bienvenida:
* Elección entre *empezar de 0* o *usar preconfiguración cognitiva*
* Activación de perfil y lente base
* Transición hacia el Portal Principal

**Implementación:** `src/pages/WelcomeScreenNew.jsx`

---

### 🔹 Fase 2 — **Portal Principal** (`/portal`)

Tres modos:
1. **Modo Casual** – Experiencia narrativa ligera.
2. **Modo Pro** – Interactivo, con HUD y progresión XP.
3. **Modo Dev** – Lenguaje prunaversal, acceso a la terminal simbólica.

**Implementación:** `src/portals/public/index.jsx` + `src/portals/private/index.jsx`

---

### 🔹 Fase 3 — **Exploración** (`/explore`)

* Secciones como niveles o "capas de realidad".
* Cada una corresponde a un eje cognitivo o simbólico.
* Se descubren personajes, textos, y mundos conceptuales.

**Sub-módulos implementados:**
- **Explorar tu Mente** (`/explore/mind`) - 4 secciones interactivas
- **Análisis Cognitivo** - Métricas en tiempo real
- **Visor de Lentes** - Cambio dinámico de perspectiva
- **Evolución Personal** - Tracking de progreso

---

### 🔹 Fase 4 — **Evolución** (`/evolution`)

* HUD refleja la madurez.
* Logros se desbloquean.
* Skill Trees se ramifican.
* Acceso a contenido avanzado o arquetípico.

---

## 🧩 6. MECÁNICAS DE JUEGO

| Mecánica                | Descripción                                                 | Implementación |
| ----------------------- | ----------------------------------------------------------- | -------------- |
| XP Cognitivo            | +1–100 XP por interacción significativa.                    | `src/system-core/prunalgoritm.js` |
| Multiplicadores de Flow | Si el usuario mantiene curiosidad activa.                   | Sistema de coherencia |
| Logros Ramificados      | Por descubrimientos, combinaciones, introspección.          | LocalStorage + eventos |
| Skill Trees             | Evolución del perfil en cinco ramas.                        | `cognitiveStateManager.js` |
| Madurez Prunaversal     | 7 fases: Llegada → Integración → Resonancia → Singularidad. | 11 niveles implementados |
| Lentes Activas          | Filtran textos, visuales y tono cognitivo.                  | `AtmosphereLensManager` |

---

## 🎨 7. ESTILO VISUAL Y SONORO

| Elemento       | Estilo                                                                     | Implementación |
| -------------- | -------------------------------------------------------------------------- | -------------- |
| 🎨 Visual      | Minimalista, simbólico, fractal, inspirado en interfaces retro-futuristas. | TailwindCSS + motion |
| 🖋️ Tipografía | Monoespaciada con variaciones por lente.                                   | Font families dinámicas |
| 🪐 Paleta      | Dinámica según lentes activas.                                             | CSS variables + lentes |
| 🎧 Sonido      | Ambiental binaural + feedback sutil al ganar XP.                           | Pendiente |
| 💫 Animaciones | Suaves, respiratorias, no invasivas.                                       | Framer Motion |

---

## 🧱 8. INTERFAZ DE USUARIO (UI / HUD)

### 🧠 **HUD Cognitivo** (`src/components/HUDCognitivo/`)

* HUD ASCII flotante (toggle "H").
* Muestra:
  * Vitalidad, Eutimia, Carga, Coherencia
  * Nivel actual (1-11)
  * XP total y progreso
  * Lente activa
  * Tiempo de sesión
* Reacciona al modo activo (Psicología, Filosofía, etc).
* **Estética terminal** con colores adaptativos

### 🪶 **InfoOrbs** (`src/components/InfoOrb/`)

* Ayuda contextual flotante
* Carga contenido desde `/data/config/*.md`
* Integración con sistema de lentes
* Animaciones suaves y no invasivas

---

## 🧩 9. SISTEMA DE PROGRESIÓN

| Nivel | Nombre           | Madurez % | Desbloqueos                  | XP Requerido |
| ----- | ---------------- | --------- | ---------------------------- | ------------ |
| 0     | Despertar        | 0%        | Tutorial Awakening           | 0            |
| 1     | Explorador       | 9%        | Lente secundaria             | 100          |
| 2     | Observador       | 18%       | HUD básico                   | 250          |
| 3     | Pensador         | 27%       | Skill Tree activado          | 450          |
| 4     | Analizador       | 36%       | Métricas avanzadas           | 700          |
| 5     | Sintetizador     | 45%       | HUD ampliado                 | 1000         |
| 6     | Visionario       | 54%       | Atmósfera dinámica           | 1350         |
| 7     | Arquitecto       | 63%       | Creación de contenido        | 1750         |
| 8     | Maestro          | 72%       | Lentes personalizadas        | 2200         |
| 9     | Sabio            | 81%       | Acceso total                 | 2700         |
| 10    | Omnicon Φ∞       | 90%       | Control del Prunaverso       | 3250         |
| 11    | Singularidad     | 100%      | Trascendencia completa       | 4000         |

---

## 🧩 10. SISTEMA DE LOGROS

**7 Rarezas:** Común, Raro, Épico, Legendario, Mítico, Divino, Φ.

### Ejemplos implementados:
* **"Primer despertar"** — ver el HUD por primera vez.
* **"Explorador Mental"** — completar "Explorar tu Mente"
* **"Cambio de Lente"** — usar 3 lentes diferentes
* **"Sesión Profunda"** — mantener coherencia >80% por 10min
* **"Desbloqueo doble lente"** — usar 2 lentes simultáneamente
* **"Llegar a 100% de madurez"** — alcanzar Singularidad
* **"Crear tu propio personaje arquetípico"** — modo creación

---

## 🔮 11. HERRAMIENTAS Y TECNOLOGÍA

| Herramienta    | Uso                                  | Estado |
| -------------- | ------------------------------------ | ------ |
| React + Vite   | Motor visual y enrutamiento.         | ✅ Activo |
| TailwindCSS    | Estilo y responsividad.              | ✅ Activo |
| shadcn/ui      | Componentes de alto nivel.           | ✅ Activo |
| Recharts       | Visualización de estadísticas.       | ✅ Activo |
| Framer Motion  | Animaciones y transiciones.          | ✅ Activo |
| LocalStorage   | Persistencia de datos.               | ✅ Activo |
| Express.js     | Servidor SPA + API routes.           | ✅ Activo |
| GitHub Actions | Auto-deploy continuo.                | ✅ Configurado |
| Markdown       | Contenido simbólico y texto modular. | ✅ Activo |
| JSON / PY      | Datos estructurados y ejecutables.   | ✅ Activo |

---

## 📅 12. PLAN DE DESARROLLO

| Fase     | Descripción                          | Estado         | Fecha Objetivo |
| -------- | ------------------------------------ | -------------- | -------------- |
| Fase I   | Núcleo del sistema + Portal dual     | ✅ **Completa** | Oct 2025       |
| Fase II  | AutoDeploy + Panel Evolutivo         | 🔄 **En progreso** | Oct 2025    |
| Fase III | Capas narrativas dinámicas           | ⏳ Planeada     | Nov 2025       |
| Fase IV  | Integración simbólica avanzada       | ⏳ Planeada     | Dic 2025       |
| Fase V   | Apertura pública y sandbox cognitivo | ⏳ Futuro       | 2026           |

### 🎯 **Estado Actual - Fase II**

**Completado en Fase I:**
- ✅ Sistema Operativo Cognitivo v2.0
- ✅ Prunalgoritm core (11 niveles)
- ✅ HUD Cognitivo terminal-style
- ✅ AtmosphereLensManager con 4 lentes
- ✅ AwakeningIntro con narrativa completa
- ✅ Portal Público con "Explorar tu Mente"
- ✅ InfoOrb system con contenido markdown
- ✅ Express server con SPA routing
- ✅ Sistema de persistencia localStorage

**En Progreso - Fase II:**
- 🔄 GDD documentación completa
- 🔄 Auto-deploy pipeline refinement
- 🔄 Panel de evolución avanzado
- 🔄 Sistema de logros expandido

---

## ⚙️ 13. REFERENCIAS Y TONO

**Inspirado por:**
* Journey (ThatGameCompany) - Exploración contemplativa
* Outer Wilds - Descubrimiento cíclico y revelación
* The Stanley Parable - Narrativa metacognitiva
* The Witness - Puzzles como metáfora de comprensión
* Control - Realidad alterada y documentos internos
* Interfaces retro de Ghost in the Shell + Matrix

**Tono:** Introspectivo, poético, experimental, pero accesible.

---

## 🧠 14. ARQUITECTURA TÉCNICA

### **Sistema Core** (`src/system-core/`)
```
prunalgoritm.js          # Algoritmo cognitivo central
cognitiveStateManager.js # Gestor de estado global
```

### **Componentes Principales** (`src/components/`)
```
HUDCognitivo/           # Terminal HUD con métricas
AtmosphereLensManager/  # Filtros visuales globales
InfoOrb/               # Sistema de ayuda contextual
```

### **Páginas** (`src/pages/`)
```
WelcomeScreenNew.jsx   # Portal de entrada
AwakeningIntro.jsx     # Experiencia de despertar
```

### **Portales** (`src/portals/`)
```
public/               # Portal público con exploración
private/              # Portal privado (futuro)
```

### **Datos** (`data/`)
```
config/              # Contenido markdown modular
saves/               # Estados guardados
characters/          # Arquetipos y personajes
```

---

## 🧾 15. ANEXOS Y DOCUMENTACIÓN

* **Manifiesto Prunaversal** → `PRUNAVERSO_MANIFIESTO.md`
* **Sistema XP** → `SISTEMA-PROGRESION-XP.md`
* **HUD Docs** → `HUD_README.md`
* **Arquitectura** → `README-ARCHITECTURE.md`
* **Deploy Guide** → `README-deploy.md`
* **Health Protocol** → `HEALTH-PROTOCOL.md`
* **Saves** → `/data/saves/`
* **Lentes cognitivas** → Integradas en componentes

---

## 🚀 16. MÉTRICAS DE ÉXITO

### **KPIs Técnicos:**
- Tiempo de carga < 2s
- Responsive en móvil
- 0 errores críticos en console
- Build exitoso en GitHub Actions

### **KPIs de Experiencia:**
- % usuarios que completan awakening
- Tiempo promedio de sesión
- Cambios de lente por sesión
- Progresión de niveles cognitivos

### **KPIs Cognitivos:**
- Coherencia promedio mantenida
- Patrones de exploración
- Contenido más resonante
- Feedback cualitativo

---

## 📋 17. NOTAS DE VERSIÓN

### **v1.0.0 "Genesis Build" - 08/10/25**
- ✅ Implementación completa del sistema cognitivo
- ✅ Experiencia de despertar narrativa
- ✅ Portal de exploración mental
- ✅ HUD terminal funcional
- ✅ Sistema de lentes visuales
- ✅ Persistencia de estado
- ✅ Servidor Express con routing SPA

### **Próxima v1.1.0 "Evolution Build"**
- 🔄 Sistema de logros expandido
- 🔄 Panel de estadísticas avanzado
- 🔄 Contenido narrativo adicional
- 🔄 Optimizaciones de performance

---

*"El Prunaverso no es solo un juego. Es un espejo cognitivo donde la tecnología refleja la consciencia."*

**— Alex Pruna, Octubre 2025**