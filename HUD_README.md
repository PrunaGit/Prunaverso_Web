# 🖥️ HUD y InfoOrbs - Prunaverso Web

Sistema de interfaces contextuales para el Prunaverso Web que proporciona información en tiempo real y ayuda contextual.

## 🎛️ HUD ASCII

### Activación
- **Tecla H**: Toggle on/off
- **Persistencia**: Preferencia guardada en localStorage
- **Ubicación**: Esquina inferior izquierda

### Información Mostrada

#### Base (Siempre visible)
```
┌────────── PRUNAVERSO HUD ──────────┐
│ Lentes: ai + philosophy  Perfil: —
│ Modo: público   FPS~60
├────────────────────────────────────┤
│ Input: click                       
│ Trace: 8f3a2c1b  Sig: prv4d2
└────────────────────────────────────┘
```

#### Módulos por Lente Cognitiva

**Psicología**:
```
╔═ PSICOLOGÍA ═══════════════════════╗
║ arousal:6/10  valencia:8/10        
║ foco:75%  flow:68%                 
╚════════════════════════════════════╝
```

**AI/ML**:
```
<AI> policy:aligned  temp:0.7  top_p:0.9
ctx:2048 toks  cache:on
```

**Hacker**:
```
[HACK] target:localhost  exploit:social_eng
shells:3  privesc:sudo  stealth:87%
```

**Arte**:
```
{ART} paleta:cian/púrpura  composición:regla_tercios
textura:suave  luz:dramática  armonía:73%
```

**Música**:
```
♪ tempo:120bpm  key:Am  time:4/4
dynamics:mf  mood:contemplativo
```

### Implementación

```jsx
import HUDAscii from './components/HUDAscii';

// En App.jsx o layout raíz
<HUDAscii />
```

## 🔮 InfoOrbs

### Características
- **Diseño**: Orb verde luminoso con "i"
- **Interacción**: Click para abrir tooltip
- **Contenido**: Markdown con renderizado básico
- **Mobile**: Modal responsivo
- **Controles**: Escape, click fuera para cerrar

### Uso Básico

```jsx
import InfoOrb from '../components/InfoOrb';

<h2>
  Mi Título 
  <InfoOrb topic="mi-tema" size={18} align="right" />
</h2>
```

### Props

- `topic`: Nombre del archivo .md (sin extensión)
- `size`: Tamaño del orb en px (default: 18)
- `align`: 'left' o 'right' para posición del tooltip
- `style`: Estilos CSS adicionales

### Contenido

Los archivos `.md` se ubican en:
- **Desarrollo**: `/public/data/info/`
- **Producción**: `/Prunaverso_Web/data/info/`

Ejemplo (`public/data/info/mi-tema.md`):
```markdown
# Mi Tema

Descripción del tema con **negrita**, *cursiva* y `código`.

## Subsección

- Lista de elementos
- Otro elemento

[Link externo](https://ejemplo.com)
```

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── HUDAscii.jsx          # HUD ASCII principal
│   └── InfoOrb.jsx           # Orbs informativos
└── App.jsx                   # Integración del HUD

public/
└── data/
    └── info/
        ├── que-es-el-prunaverso.md
        ├── lentes-cognitivas.md
        └── hud-ascii.md
```

## 🎨 Personalización

### HUD ASCII
- **Colores**: Modificar en style object
- **Posición**: Cambiar left/bottom en CSS
- **Nuevas lentes**: Añadir templates en `TEMPLATES`
- **Datos**: Conectar valores reales en `ctx`

### InfoOrbs
- **Tema visual**: Ajustar colores en gradient y borders
- **Posicionamiento**: Mobile vs desktop responsivo
- **Markdown**: Extender `basicMd()` para más elementos

## 🚀 Características Avanzadas

### Auto-activación HUD
```jsx
// HUD se activa automáticamente en modo dev
const isDevMode = window.location.search.includes('dev=true');
const [show, setShow] = useState(isDevMode);
```

### Eventos del Sistema
```jsx
// Escuchar interacciones para mostrar en HUD
window.addEventListener('prunaverso:interaction', handleInteraction);
```

### Cache de Contenido
```jsx
// Los InfoOrbs cachean contenido markdown automáticamente
// No hay necesidad de implementación adicional
```

## 📱 Compatibilidad

- **Desktop**: Tooltips posicionados absolutamente
- **Mobile**: Modals centrados con backdrop
- **Responsive**: Breakpoint en 768px
- **A11y**: ARIA labels, navegación por teclado
- **Performance**: FPS counter real, cache inteligente

## 🔧 Debugging

### Variables Globales
```js
window.__PRV_TRACE__  // ID de trace del sistema
window.__PRV_SIG__    // Signature del sistema
```

### localStorage
```js
localStorage.getItem('prv:hud')  // 'on' | 'off'
```

### Logs
- Errors de carga de markdown en console
- FPS real calculado cada segundo
- Interacciones registradas automáticamente

---

**Tecla H** para toggle del HUD | **Click en (i)** para información contextual