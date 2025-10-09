#!/usr/bin/env node
// Script de emergency fix para GitHub Pages sync

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY GITHUB PAGES SYNC PROTOCOL 🚨\n');

// 1. Limpiar todo
console.log('1️⃣ Limpiando builds anteriores...');
try {
  execSync('Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue', { shell: 'powershell' });
  execSync('Remove-Item -Recurse -Force .vite -ErrorAction SilentlyContinue', { shell: 'powershell' });
  console.log('✅ Cache limpio');
} catch (e) {
  console.log('⚠️ Error limpiando, continuando...');
}

// 2. Build desde cero
console.log('\n2️⃣ Generando build completamente nuevo...');
try {
  const buildOutput = execSync('npm run build', { encoding: 'utf8' });
  console.log('✅ Build exitoso');
  console.log(buildOutput);
} catch (e) {
  console.log('❌ Build falló:', e.message);
  process.exit(1);
}

// 3. Verificar assets generados
console.log('\n3️⃣ Verificando assets generados...');
const distPath = path.join(process.cwd(), 'dist');
const assetsPath = path.join(distPath, 'assets');

if (!fs.existsSync(distPath)) {
  console.log('❌ Carpeta dist no existe');
  process.exit(1);
}

if (!fs.existsSync(assetsPath)) {
  console.log('❌ Carpeta assets no existe');
  process.exit(1);
}

const assets = fs.readdirSync(assetsPath);
console.log('📁 Assets generados:');
assets.forEach(asset => console.log(`   - ${asset}`));

// 4. Copiar index como 404
console.log('\n4️⃣ Configurando 404.html...');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('✅ 404.html configurado');
} else {
  console.log('❌ index.html no encontrado');
  process.exit(1);
}

// 5. Verificar contenido del HTML
console.log('\n5️⃣ Verificando HTML generado...');
const htmlContent = fs.readFileSync(indexPath, 'utf8');
const scriptMatches = htmlContent.match(/src="\/Prunaverso_Web\/assets\/(.*?)"/g);
const cssMatches = htmlContent.match(/href="\/Prunaverso_Web\/assets\/(.*?)"/g);

console.log('📄 Scripts referenciados en HTML:');
if (scriptMatches) {
  scriptMatches.forEach(match => console.log(`   ${match}`));
} else {
  console.log('   ⚠️ No se encontraron scripts');
}

console.log('🎨 CSS referenciados en HTML:');
if (cssMatches) {
  cssMatches.forEach(match => console.log(`   ${match}`));
} else {
  console.log('   ⚠️ No se encontraron CSS');
}

// 6. Git add y commit
console.log('\n6️⃣ Commiteando cambios...');
try {
  execSync('git add .', { encoding: 'utf8' });
  const timestamp = new Date().toISOString();
  execSync(`git commit -m "EMERGENCY SYNC ${timestamp} - Force rebuild all assets"`, { encoding: 'utf8' });
  console.log('✅ Cambios commiteados');
} catch (e) {
  console.log('⚠️ Error en commit (posible no changes):', e.message);
}

// 7. Force push
console.log('\n7️⃣ Force pushing a GitHub...');
try {
  const pushOutput = execSync('git push origin main --force', { encoding: 'utf8' });
  console.log('✅ Push exitoso');
  console.log(pushOutput);
} catch (e) {
  console.log('❌ Push falló:', e.message);
  process.exit(1);
}

console.log('\n🎯 PROCESO COMPLETADO');
console.log('⏰ Espera 2-3 minutos para que GitHub Pages procese');
console.log('🔗 Luego prueba: https://prunagit.github.io/Prunaverso_Web/#/portal');
console.log('\n📊 Para verificar, ejecuta: node scripts/deployment-diagnosis.cjs');