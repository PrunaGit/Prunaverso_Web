#!/usr/bin/env node

/**
 * 🔍 Verificador de Sincronización - Prunaverso Web
 * 
 * Compara el estado entre laboratorio local y cosmos público
 * Detecta diferencias y sugiere acciones de sincronización
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const https = require('https');

const execAsync = promisify(exec);

console.log('🔍 VERIFICADOR DE SINCRONIZACIÓN PRUNAVERSO');
console.log('='.repeat(50));

async function runCommand(command, continueOnError = true) {
  try {
    const { stdout, stderr } = await execAsync(command);
    return { success: true, stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    if (!continueOnError) throw error;
    return { success: false, error: error.message };
  }
}

async function checkGitHubPages(username, repo) {
  return new Promise((resolve) => {
    const url = `https://${username}.github.io/${repo}/`;
    https.get(url, (res) => {
      resolve({
        accessible: res.statusCode === 200,
        statusCode: res.statusCode,
        url: url
      });
    }).on('error', () => {
      resolve({ accessible: false, statusCode: null, url: url });
    });
  });
}

async function verifySyncStatus() {
  try {
    console.log('\n🧠 ANÁLISIS DEL LABORATORIO LOCAL');
    console.log('='.repeat(35));
    
    // 1. Estado del repositorio local
    const gitStatus = await runCommand('git status --porcelain');
    const hasChanges = gitStatus.stdout && gitStatus.stdout.trim();
    
    console.log(`📁 Cambios locales: ${hasChanges ? '⚠️  Hay cambios sin commitear' : '✅ Todo sincronizado'}`);
    
    if (hasChanges) {
      const changeCount = gitStatus.stdout.split('\n').length;
      console.log(`   📝 ${changeCount} archivos modificados`);
    }

    // 2. Estado del build local
    const buildExists = fs.existsSync('dist');
    console.log(`🏗️  Build local: ${buildExists ? '✅ Existe' : '❌ No encontrado'}`);
    
    if (buildExists) {
      const distFiles = fs.readdirSync('dist');
      console.log(`   📦 ${distFiles.length} archivos en dist/`);
    }

    // 3. Último commit
    const lastCommit = await runCommand('git log -1 --pretty=format:"%h - %s (%cr)"');
    if (lastCommit.success) {
      console.log(`📝 Último commit: ${lastCommit.stdout}`);
    }

    // 4. Rama actual
    const currentBranch = await runCommand('git branch --show-current');
    if (currentBranch.success) {
      console.log(`🌿 Rama actual: ${currentBranch.stdout}`);
    }

    console.log('\n🌍 ANÁLISIS DEL COSMOS PÚBLICO');
    console.log('='.repeat(35));

    // 5. Verificar remote
    const remote = await runCommand('git remote -v');
    if (remote.success && remote.stdout) {
      console.log('✅ Remote configurado:');
      remote.stdout.split('\n').forEach(line => {
        if (line.includes('github.com')) {
          console.log(`   🔗 ${line}`);
        }
      });

      // Extraer username/repo del remote
      const match = remote.stdout.match(/github\.com[:/]([^/]+)\/([^.\s]+)/);
      if (match) {
        const [, username, repoName] = match;
        console.log(`\n🌐 GitHub Pages: ${username}/${repoName}`);
        
        // Verificar si GitHub Pages está accesible
        const pagesStatus = await checkGitHubPages(username, repoName);
        console.log(`   🔗 URL: ${pagesStatus.url}`);
        console.log(`   📡 Estado: ${pagesStatus.accessible ? '✅ Accesible' : '❌ No accesible'}`);
        
        if (pagesStatus.statusCode) {
          console.log(`   📊 Status Code: ${pagesStatus.statusCode}`);
        }
      }
    } else {
      console.log('❌ No hay remote configurado');
    }

    // 6. Estado de GitHub Actions (si hay remote)
    if (remote.success && remote.stdout.includes('github.com')) {
      console.log('\n⚙️  GitHub Actions:');
      console.log('   📁 Workflow: .github/workflows/deploy.yml');
      console.log(`   🔄 Estado: ${fs.existsSync('.github/workflows/deploy.yml') ? '✅ Configurado' : '❌ No encontrado'}`);
    }

    console.log('\n📊 RESUMEN DE SINCRONIZACIÓN');
    console.log('='.repeat(35));

    // Recomendaciones basadas en el estado
    if (hasChanges) {
      console.log('🔄 ACCIÓN RECOMENDADA: Sincronización necesaria');
      console.log('   💻 Comando: npm run deploy-hybrid');
      console.log('   📝 Descripción: Commitea cambios y despliega automáticamente');
    } else if (!buildExists) {
      console.log('🏗️  ACCIÓN RECOMENDADA: Build necesario');
      console.log('   💻 Comando: npm run build');
      console.log('   📝 Descripción: Genera build de producción');
    } else {
      console.log('✅ ESTADO: Sincronizado y listo');
      console.log('   🚀 Tu Prunaverso está actualizado en ambas dimensiones');
    }

    console.log('\n🎯 COMANDOS ÚTILES:');
    console.log('   🔍 Verificar de nuevo: npm run sync-check');
    console.log('   🔄 Sincronizar todo: npm run deploy-hybrid');
    console.log('   🧪 Solo local: npm run dev');
    console.log('   🌍 Solo deploy: npm run deploy');

  } catch (error) {
    console.error('\n💥 Error en verificación:', error.message);
    console.log('\n🔧 Comandos de recovery:');
    console.log('   npm run health-check');
    console.log('   git status');
    console.log('   npm run setup-github');
  }
}

// Ejecutar verificación
verifySyncStatus();