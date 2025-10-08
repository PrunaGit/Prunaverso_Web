# 🚀 Guía Completa de Deployment - Prunaverso Web GitHub Pages

## 📋 **Estado Actual del Sistema**
- ✅ **Vite configurado** para GitHub Pages (`base: '/Prunaverso_Web/'`)
- ✅ **Scripts de deployment** agregados al `package.json`
- ✅ **GitHub Actions workflow** configurado automático
- ✅ **Dependencia gh-pages** instalada
- ✅ **Sistema Dual Portal** implementado
- ⚠️  **Pendiente**: Conectar repositorio local con GitHub

---

## 🔧 **Paso 1: Crear Repositorio en GitHub**

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en **"New"** para crear un nuevo repositorio
3. Configura:
   - **Repository name**: `Prunaverso_Web`
   - **Description**: `🌍 Portal cognitivo del Prunaverso - Sistema dual de conciencia narrativa`
   - **Visibility**: Public (para usar GitHub Pages gratis)
   - **NO** inicializar con README, .gitignore o license

---

## 🔗 **Paso 2: Conectar Repositorio Local**

Ejecuta en PowerShell desde la raíz del proyecto:

```powershell
# Agregar el remote de GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/Prunaverso_Web.git

# Crear y cambiar a rama main
git checkout -b main

# Hacer commit de todos los cambios
git add .
git commit -m "🌍 Configuración inicial del Prunaverso Web - Sistema Dual Portal"

# Subir a GitHub
git push -u origin main
```

---

## 🌐 **Paso 3: Activar GitHub Pages**

1. Ve a tu repositorio en GitHub
2. Clic en **"Settings"** (en la barra superior del repo)
3. Scroll hacia abajo hasta **"Pages"** (en el menú lateral izquierdo)
4. En **"Source"**: selecciona `Deploy from a branch`
5. En **"Branch"**: selecciona `gh-pages` (se creará automáticamente)
6. En **"Folder"**: deja `/ (root)`
7. Clic en **"Save"**

---

## 🚀 **Métodos de Deployment**

### Método 1: Automático con GitHub Actions (Recomendado)
```powershell
# Cada push a main disparará el deployment automático
git add .
git commit -m "🌟 Actualización del Prunaverso"
git push origin main
```

### Método 2: Deployment Manual Simple
```powershell
npm run deploy
```

### Método 3: Deployment Manual Completo
```powershell
npm run deploy-local
```

---

## 📊 **URLs y Verificación**

### Después del deployment tendrás:
- **🌍 Tu Prunaverso Web**: `https://TU_USUARIO.github.io/Prunaverso_Web/`
- **📂 Repositorio**: `https://github.com/TU_USUARIO/Prunaverso_Web`
- **⚙️ Actions**: `https://github.com/TU_USUARIO/Prunaverso_Web/actions`

### Scripts de verificación:
```powershell
# Verificar configuración actual
npm run setup-github

# Health check del sistema
npm run health-check

# Test de build local
npm run build

# Preview del build
npm run preview
```

---

## 🧬 **Características del Deployment Optimizado**

### Build de Producción:
- ✅ **Code splitting**: Chunks separados (vendor, router, motion)
- ✅ **Minificación**: Archivos comprimidos con Terser
- ✅ **Assets optimizados**: Imágenes y recursos comprimidos
- ✅ **Source maps**: Deshabilitados para mejor performance

### GitHub Actions Automático:
- ✅ **Health check** antes del build
- ✅ **Generación automática** del índice fractal
- ✅ **Cache de dependencias** para builds rápidos
- ✅ **Deployment automático** sin intervención manual

### Sistema Dual Portal:
- ✅ **Portal Dev**: Interfaz terminal/matriz para desarrolladores
- ✅ **Portal Público**: Experiencia narrativa para visitantes
- ✅ **Detección automática** de tipo de usuario
- ✅ **Gaming Controls**: Controles PlayStation + PC integrados

---

## 🔄 **Workflow de Desarrollo Recomendado**

### Para desarrollo día a día:
1. **Desarrollo local**: `npm run dev` (puerto 5179)
2. **Test funcionalidad**: Verificar en navegador
3. **Verificar build**: `npm run build` (sin errores)
4. **Commit cambios**: `git add . && git commit -m "descripción"`
5. **Deploy automático**: `git push origin main`

### Para deployment urgente:
```powershell
npm run deploy-local
```

---

## 🆘 **Solución de Problemas**

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/Prunaverso_Web.git
```

### Error: "gh-pages branch not found"
```powershell
# Normal en primer deploy, se crea automáticamente
npm run deploy
```

### Error de build:
```powershell
# Limpiar caché y reinstalar
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm run build
```

### Verificar estado completo:
```powershell
npm run health-check; npm run build; echo "✅ Sistema listo para deploy"
```

---

## 🎯 **Lista de Verificación Final**

Antes del primer deployment:

- [ ] **Paso 1**: Repositorio creado en GitHub
- [ ] **Paso 2**: Remote origin configurado
- [ ] **Paso 3**: GitHub Pages activado
- [ ] **Test local**: `npm run build` funciona
- [ ] **Health check**: `npm run health-check` pasa
- [ ] **Primer deploy**: `npm run deploy`
- [ ] **Verificación**: Sitio accesible en GitHub Pages

---

## 🌟 **¡Tu Prunaverso Web Estará Vivo!**

Una vez completados todos los pasos, tendrás:

- 🌍 **Sitio web público** accesible desde cualquier lugar
- 🤖 **Deployment automático** con cada actualización
- 🧠 **Sistema dual de portales** funcionando
- 🎮 **Controles gaming** integrados
- 📊 **Monitoreo automático** del sistema
- 🔄 **CI/CD completo** con GitHub Actions

¡El Prunaverso Web estará disponible para que cualquier persona en el mundo pueda explorar su propia conciencia cognitiva! 🚀✨