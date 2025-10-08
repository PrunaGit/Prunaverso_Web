# 🌟 PRUNAVERSO - ARQUITECTURA DE NAVEGACIÓN INMERSIVA

## Flow Completo del Juego Mental Interactivo

```
📍 ENTRADA PRINCIPAL
│
├── 🚪 WELCOME SCREEN (Primer contacto)
│   ├── Animación de bienvenida atmosférica
│   ├── "Entrar al Prunaverso" → PORTAL PRINCIPAL
│   └── "¿Qué es esto?" → TUTORIAL
│
├── 🌌 PORTAL PRINCIPAL (Hub central)
│   ├── 🎮 "Descubrir mi Arquetipo" → SELECTOR RPG
│   ├── 🧠 "Explorar Personajes" → GALERÍA CARACTERES
│   ├── 🎵 "Experiencia Inmersiva" → MODO ATMOSFÉRICO
│   └── ⚙️ "Configuración" → SETTINGS
│
├── 🎮 SELECTOR DE ARQUETIPOS RPG
│   ├── Vista Casual → Resultados simples → PERFIL ARQUETIPO
│   ├── Vista Avanzada → Stats detalladas → PERFIL COMPLETO
│   └── "Volver al Portal" → PORTAL PRINCIPAL
│
├── 👤 PERFIL DE ARQUETIPO (Resultado)
│   ├── Mostrar arquetipo calculado
│   ├── Stats RPG visualizadas
│   ├── Pros/Contras detallados
│   ├── "Explorar otros" → SELECTOR RPG
│   ├── "Compartir resultado" → SHARE MODAL
│   └── "Volver al Portal" → PORTAL PRINCIPAL
│
├── 🎭 GALERÍA DE PERSONAJES
│   ├── Grid de todos los arquetipos
│   ├── Click en personaje → DETALLE PERSONAJE
│   └── "Hacer mi test" → SELECTOR RPG
│
├── 📱 DETALLE DE PERSONAJE
│   ├── Bio completa del arquetipo
│   ├── "Soy como este" → CONFIRMAR ARQUETIPO
│   ├── "Ver otros" → GALERÍA PERSONAJES
│   └── "Hacer mi test" → SELECTOR RPG
│
├── 🎵 MODO ATMOSFÉRICO
│   ├── Controles de audio inmersivo
│   ├── Visualizador de frecuencias
│   ├── "Hacer test con música" → SELECTOR RPG + AUDIO
│   └── "Volver" → PORTAL PRINCIPAL
│
└── ⚙️ CONFIGURACIÓN
    ├── Toggle breathing mode
    ├── Volumen atmosférico
    ├── Modo visual (casual/avanzado)
    └── "Guardar y volver" → PORTAL PRINCIPAL
```

## 🎯 FLUJO DE PRIMERA VISITA:

```
1. USUARIO ENTRA → WelcomeScreen
   ├── "¡Bienvenido al Prunaverso!"
   ├── Breve explicación (30 segundos)
   └── [BOTÓN: "Entrar al Portal"]

2. CLICK "Entrar" → PortalMain  
   ├── Hub visual con 4 opciones principales
   ├── Heartbeat visible (sistema activo)
   └── [DESTACADO: "Descubrir mi Arquetipo"]

3. CLICK "Descubrir" → CharacterSelectorRPG
   ├── "¿Modo casual o avanzado?"
   ├── Formulario de personalidad
   └── [BOTÓN: "Calcular mi Arquetipo"]

4. SUBMIT formulario → ArchetypeResult
   ├── "¡Eres un [ARQUETIPO]!"
   ├── Stats visuales + descripción
   ├── [BOTÓN: "Explorar otros arquetipos"]
   └── [BOTÓN: "Compartir resultado"]

5. Loop infinito → Exploración libre
```

## 🔄 NAVEGACIÓN CÍCLICA:

- **Siempre visible**: Portal button (home)
- **Breadcrumbs**: Mostrar dónde estás
- **Back buttons**: Volver al paso anterior
- **Deep linking**: URLs amigables para compartir

## 📱 RUTAS PROPUESTAS:

```
/ → WelcomeScreen (primera vez) o PortalMain (return)
/portal → PortalMain (hub)
/selector → CharacterSelectorRPG  
/resultado/:arquetipo → ArchetypeResult
/galeria → CharacterGallery
/personaje/:id → CharacterDetail
/atmosfera → AtmosphericMode
/config → Settings
```

---

# Prunaverso — Arquitectura viva

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
