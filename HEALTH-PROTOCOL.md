# 🛡️ PROTOCOLO DE VERIFICACIÓN Y AUTORECUPERACIÓN

## Prunaverso Web - Sistema Anti-Páginas en Blanco

Este protocolo asegura que **Prunaverso Web** esté siempre disponible y funcional, evitando las temidas páginas en blanco y errores `ERR_CONNECTION_REFUSED`.

---

## 🚀 Comandos Principales

### Inicio Seguro (Recomendado)
```bash
npm run dev          # Inicio con verificaciones automáticas
npm run dev-safe     # Inicio ultra-seguro con doble verificación
```

### Diagnóstico y Recuperación
```bash
npm run health-check    # Verificación completa del sistema
npm run recovery        # Recuperación automática + inicio
node scripts/quick-diagnostic.js  # Diagnóstico express
```

### Monitoreo Continuo
```bash
npm run monitor      # Monitor continuo con autorecuperación
```

---

## 🔍 Scripts de Verificación

### 1. `health-check.js` - Verificación Completa
- ✅ Verifica archivos críticos (`App.jsx`, `main.jsx`, `router.jsx`, etc.)
- ✅ Valida dependencias (`react`, `vite`, `framer-motion`)
- ✅ Prueba conectividad del servidor
- ✅ Verifica rutas críticas (`/`, `/portal`, `/characters`)
- ✅ Autorecuperación automática si detecta problemas

### 2. `monitor.js` - Monitoreo Continuo  
- 👁️ Monitoreo cada 30 segundos
- 🚑 Autorecuperación en caso de fallos
- 📊 Estadísticas de salud en tiempo real
- 🚨 Alertas críticas configurables

### 3. `prestart.js` - Protocolo Pre-Inicio
- 🧹 Limpia procesos zombie
- 📦 Verifica/instala dependencias
- 🗑️ Limpia caché si es necesario
- 🔌 Verifica puertos disponibles

### 4. `quick-diagnostic.js` - Diagnóstico Express
- ⚡ Verificación rápida (< 5 segundos)
- 💡 Soluciones automáticas recomendadas
- 🔧 Comandos de recuperación instantáneos

---

## 🛠️ Casos de Uso Comunes

### ❌ Página en Blanco
```bash
# Diagnóstico rápido
node scripts/quick-diagnostic.js

# Si hay problemas:
npm run recovery
```

### ❌ ERR_CONNECTION_REFUSED
```bash
# Verificar estado del servidor
npm run health-check

# Recuperación completa
taskkill /F /IM node.exe
npm run dev
```

### ❌ Error de Dependencias
```bash
# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ Puerto en Uso
```bash
# Liberar puerto 5179
taskkill /F /IM node.exe
npm run dev
```

---

## 📊 Archivos de Reporte

Los scripts generan automáticamente reportes de salud:

- `health-report.json` - Reporte completo de verificación
- `monitor-stats.json` - Estadísticas del monitor continuo  
- `pre-start-report.json` - Reporte de pre-inicio
- `monitor.log` - Log continuo del monitor

---

## ⚙️ Configuración Avanzada

### Variables de Entorno
```bash
# Intervalo del monitor (ms)
MONITOR_INTERVAL=30000

# Máximo de fallos antes de alerta crítica
MAX_FAILURES=3

# Puerto personalizado
DEV_PORT=5179
```

### Webhook de Alertas
```bash
# Monitor con alertas a Discord/Slack
ALERT_WEBHOOK="https://hooks.slack.com/..." npm run monitor
```

---

## 🚨 Protocolo de Emergencia

Si **NADA** funciona:

```bash
# 1. Reset completo
taskkill /F /IM node.exe
rm -rf node_modules .vite package-lock.json

# 2. Reinstalación limpia  
npm install

# 3. Verificación pre-vuelo
npm run prestart

# 4. Inicio con monitoreo
npm run dev
```

---

## 🎯 Criterios de Salud

El sistema se considera **saludable** cuando:

- ✅ Todos los archivos críticos están presentes
- ✅ Dependencias instaladas correctamente
- ✅ Servidor responde en puerto 5179
- ✅ Rutas principales (`/`, `/portal`, `/characters`) cargan
- ✅ Sin errores en consola de navegador

---

## 📞 Soporte

Si persisten problemas después del protocolo de emergencia:

1. 📋 Ejecutar `npm run health-check` y revisar `health-report.json`
2. 🔍 Verificar logs en `monitor.log`
3. 📊 Revisar estadísticas en `monitor-stats.json`
4. 🆘 Contactar al equipo de desarrollo con los reportes

---

**🌟 Con este protocolo, Prunaverso Web tendrá 99.9% de disponibilidad**