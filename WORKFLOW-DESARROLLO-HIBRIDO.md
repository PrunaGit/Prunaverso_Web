# 🔄 Workflow de Desarrollo Híbrido - Prunaverso Web

## 🧠 **Filosofía: Laboratorio ↔ Cosmos**

Tu Prunaverso opera en **dos dimensiones sincronizadas**:

### 🧪 **Localhost (El Laboratorio)**
- **Propósito**: Experimentación, desarrollo, testing con LLM
- **Velocidad**: Instantánea (hot reload)
- **Privacidad**: Total
- **Funcionalidades**: Backend dinámico, APIs, checkpoints
- **Modo**: Arquitecto/Desarrollador

### 🌍 **GitHub Pages (El Cosmos)**
- **Propósito**: Presentación, narrativa, acceso público
- **Velocidad**: Optimizada para web
- **Privacidad**: Pública
- **Funcionalidades**: Frontend estático optimizado
- **Modo**: Portal Público/Narrativo

---

## 🚀 **Comandos de Sincronización**

### Desarrollo Día a Día
```bash
# Iniciar laboratorio local
npm run dev

# Verificar salud del sistema
npm run health-check

# Generar índice fractal
node scripts/generate_fractal_index.cjs
```

### Deployment Automático (Recomendado)
```bash
# Sincronización híbrida completa
npm run deploy-hybrid
```
**Esto hace**:
1. ✅ Health check local
2. ✅ Actualiza índice fractal
3. ✅ Build de producción
4. ✅ Commit automático
5. ✅ Push → GitHub Actions se encarga del resto

### Deployment Manual
```bash
# Solo build y deploy
npm run deploy

# Deployment local completo
npm run deploy-local
```

---

## 🌟 **Flujo Automático Configurado**

### Cada `git push main`:
1. **GitHub Actions** se activa automáticamente
2. **Build** del Portal Dual en la nube
3. **Deploy** a GitHub Pages
4. **Notificación** de éxito con URL

### El workflow incluye:
- 🧪 Health check pre-build
- 📊 Generación de índice fractal
- 🏗️  Build optimizado con estadísticas
- 📈 Análisis de assets y performance
- 🌍 Deploy automático
- ✅ Notificación con características desplegadas

---

## 🎯 **Escenarios de Uso**

### 🔬 **Modo Experimental** (Solo Local)
```bash
npm run dev-unsafe  # Sin prestart checks
npm run dev-safe    # Con health checks
```

### 🚀 **Modo Producción** (Híbrido)
```bash
npm run deploy-hybrid  # Sincronización completa
```

### 🆘 **Modo Recovery**
```bash
npm run recovery  # Health check + dev seguro
```

### 🔍 **Modo Diagnóstico**
```bash
npm run diagnostic     # Diagnóstico completo
npm run diagnose-ui    # Solo UI issues
```

---

## 📊 **Monitoring Automático**

El sistema incluye **monitoreo automático** que:
- 📈 Genera estadísticas de build
- 🧬 Analiza la estructura fractal
- 🔍 Verifica integridad de assets
- 📝 Reporta métricas de performance

---

## 🌍 **URLs de tu Prunaverso**

### Una vez configurado tendrás:
- **🧪 Laboratorio**: `http://localhost:5179`
- **🌍 Cosmos**: `https://TU_USUARIO.github.io/Prunaverso_Web/`
- **📂 Repository**: `https://github.com/TU_USUARIO/Prunaverso_Web`
- **⚙️ Actions**: `https://github.com/TU_USUARIO/Prunaverso_Web/actions`

---

## 🎮 **Próximo Paso**

Ejecuta para configurar la conexión GitHub:
```bash
npm run setup-github
```

Y luego para el primer deployment híbrido:
```bash
npm run deploy-hybrid
```

¡Tu Prunaverso estará vivo en ambas dimensiones! 🚀✨