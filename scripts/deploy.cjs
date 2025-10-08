#!/usr/bin/env node

/**
 * 🚀 Script de Deployment Manual para Prunaverso Web
 * 
 * Este script automatiza el proceso de build y deployment a GitHub Pages
 * cuando necesites hacer un deploy manual desde tu máquina local.
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

console.log('🌍 INICIANDO DEPLOYMENT DEL PRUNAVERSO WEB');
console.log('='.repeat(50));

async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log('⚠️  Warnings:', stderr);
    console.log(`✅ ${description} completado`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    throw error;
  }
}

async function deployPrunaverso() {
  try {
    // 1. Verificar que estemos en el directorio correcto
    if (!fs.existsSync('package.json')) {
      throw new Error('❌ No se encuentra package.json. Ejecuta desde la raíz del proyecto.');
    }

    // 2. Health check
    await runCommand('npm run health-check', 'Health Check del Sistema');

    // 3. Generar índice fractal
    await runCommand('node scripts/generate_fractal_index.cjs', 'Generación del Índice Fractal');

    // 4. Build del proyecto
    await runCommand('npm run build', 'Build de Producción');

    // 5. Verificar que se creó la carpeta dist
    if (!fs.existsSync('dist')) {
      throw new Error('❌ La carpeta dist no se generó correctamente.');
    }

    console.log('\n📊 Estadísticas del Build:');
    const distStats = fs.readdirSync('dist');
    console.log(`📁 Archivos generados: ${distStats.length}`);
    
    // 6. Deploy usando gh-pages
    console.log('\n🚀 Iniciando deployment a GitHub Pages...');
    await runCommand('npx gh-pages -d dist', 'Deployment a GitHub Pages');

    console.log('\n🎉 ¡DEPLOYMENT COMPLETADO CON ÉXITO!');
    console.log('🔗 Tu Prunaverso Web estará disponible en:');
    console.log('   https://alexpruna.github.io/Prunaverso_Web/');
    console.log('\n⏰ Nota: Puede tomar unos minutos en estar disponible.');

  } catch (error) {
    console.error('\n💥 ERROR EN EL DEPLOYMENT:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que tienes permisos en el repositorio');
    console.log('2. Asegúrate de que git remote está configurado');
    console.log('3. Ejecuta: git remote -v para verificar la URL');
    process.exit(1);
  }
}

// Ejecutar deployment
deployPrunaverso();