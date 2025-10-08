#!/usr/bin/env node

/**
 * 🌍 Script de Deployment Híbrido - Prunaverso Web
 * 
 * Sincroniza el laboratorio local con el cosmos público
 * Mantiene ambos entornos actualizados y coherentes
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const execAsync = promisify(exec);

console.log('🌍 DEPLOYMENT HÍBRIDO DEL PRUNAVERSO WEB');
console.log('='.repeat(50));

async function runCommand(command, description, continueOnError = false) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr && !continueOnError) console.log('⚠️  Warnings:', stderr);
    console.log(`✅ ${description} completado`);
    return { success: true, stdout, stderr };
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    if (!continueOnError) throw error;
    return { success: false, error: error.message };
  }
}

async function deployHybrid() {
  try {
    console.log('\n🧠 ANÁLISIS DEL ENTORNO ACTUAL');
    console.log('='.repeat(30));
    
    // 1. Verificar estado del repositorio
    const gitStatus = await runCommand('git status --porcelain', 'Verificando cambios pendientes', true);
    if (gitStatus.stdout && gitStatus.stdout.trim()) {
      console.log(`📝 Cambios detectados: ${gitStatus.stdout.split('\n').length} archivos`);
    } else {
      console.log('✅ No hay cambios pendientes');
    }

    // 2. Health check del sistema local
    await runCommand('npm run health-check', 'Health Check del Sistema Local', true);

    // 3. Generar índice fractal actualizado
    await runCommand('node scripts/generate_fractal_index.cjs', 'Actualizando Índice Fractal', true);

    // 4. Build de producción
    console.log('\n🏗️  CONSTRUCCIÓN DEL PORTAL DUAL');
    console.log('='.repeat(35));
    await runCommand('npm run build', 'Build de Producción');

    // 5. Verificar integridad del build
    if (!fs.existsSync('dist')) {
      throw new Error('❌ La carpeta dist no se generó correctamente.');
    }

    const distStats = fs.readdirSync('dist');
    console.log(`📊 Build completado: ${distStats.length} archivos generados`);

    // 6. Análisis de assets
    console.log('\n📊 ANÁLISIS DE ASSETS');
    console.log('='.repeat(25));
    try {
      const assetsDir = 'dist/assets';
      if (fs.existsSync(assetsDir)) {
        const assets = fs.readdirSync(assetsDir);
        console.log(`📁 Assets generados: ${assets.length}`);
        
        // Mostrar tamaños de archivos principales
        assets.forEach(file => {
          if (file.endsWith('.js') || file.endsWith('.css')) {
            const stats = fs.statSync(`${assetsDir}/${file}`);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`  📄 ${file}: ${sizeKB} KB`);
          }
        });
      }
    } catch (e) {
      console.log('⚠️  No se pudo analizar assets:', e.message);
    }

    // 7. Commit y push (si hay cambios)
    if (gitStatus.stdout && gitStatus.stdout.trim()) {
      console.log('\n🚀 SINCRONIZACIÓN CON EL COSMOS');
      console.log('='.repeat(35));
      
      const commitMessage = `🌍 Auto-deploy: Portal Dual actualizado (${new Date().toISOString().split('T')[0]})`;
      
      await runCommand('git add .', 'Agregando cambios al staging');
      await runCommand(`git commit -m "${commitMessage}"`, 'Creando commit');
      await runCommand('git push origin main', 'Pushing al repositorio remoto');
      
      console.log('\n🎉 ¡DEPLOYMENT AUTOMÁTICO ACTIVADO!');
      console.log('GitHub Actions se encargará del resto...');
    } else {
      console.log('\n📄 Sin cambios para commitear. Deploying build actual...');
      await runCommand('npm run deploy', 'Deployment directo con gh-pages');
    }

    console.log('\n🌟 DEPLOYMENT HÍBRIDO COMPLETADO');
    console.log('='.repeat(40));
    console.log('🔗 URLs de tu Prunaverso:');
    console.log('  🧪 Local (Laboratorio): http://localhost:5179');
    console.log('  🌍 GitHub Pages (Cosmos): https://TU_USUARIO.github.io/Prunaverso_Web/');
    console.log('');
    console.log('⚡ Características activas:');
    console.log('  - Portal Dev (modo arquitecto)');
    console.log('  - Portal Público (modo narrativo)');
    console.log('  - Sistema SISC cognitivo');
    console.log('  - Gaming Controls');
    console.log('  - InfoOrbitales contextuales');
    console.log('');
    console.log('🔄 Para siguiente actualización: npm run deploy-hybrid');

  } catch (error) {
    console.error('\n💥 ERROR EN DEPLOYMENT HÍBRIDO:', error.message);
    console.log('\n🔧 Comandos de recovery:');
    console.log('  npm run health-check');
    console.log('  npm run build');
    console.log('  git status');
    process.exit(1);
  }
}

// Ejecutar deployment híbrido
deployHybrid();