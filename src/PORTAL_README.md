Portal component (React + Tailwind)

Files:
- `src/Portal.jsx` — prototipo wireframe del menú principal Prunaverso v0.06.

Uso:
1. Importa y monta `Portal` en tu `App.jsx` o `main.jsx`:

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import Portal from './Portal'

createRoot(document.getElementById('root')).render(<Portal />)
```

2. Asegúrate de tener Tailwind configurado (el proyecto ya lo incluye en `package.json`).
3. Para animaciones usamos `framer-motion` (ya en dependencias).

Este componente es un prototipo con botones placeholder (alerts). Conectar a tus endpoints es directo: sustituye los `onClick` por llamadas `fetch()` a tus rutas (`/session/start`, `/character/select`, etc.).
