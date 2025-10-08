#!/usr/bin/env node

/**
 * 🔧 Script de Configuración de GitHub para Prunaverso Web
 * 
 * Este script verifica y configura la conexión con GitHub Pages
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const execAsync = promisify(exec);

console.log('🔧 CONFIGURACIÓN DE GITHUB PARA PRUNAVERSO WEB');
console.log('='.repeat(50));

async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    return { error: error.message, stdout: '', stderr: '' };
  }
}

async function setupGitHub() {
  try {
    // 1. Verificar si Git está inicializado
    console.log('\n📋 VERIFICANDO CONFIGURACIÓN ACTUAL');
    
    const gitStatus = await runCommand('git status --porcelain', 'Verificando estado de Git');
    if (gitStatus.error) {
      console.log('❌ Git no está inicializado. Inicializando...');
      await runCommand('git init', 'Inicializando repositorio Git');
      await runCommand('git branch -M main', 'Configurando rama principal');
    } else {
      console.log('✅ Repositorio Git ya está inicializado');
    }

    // 2. Verificar remote
    const remote = await runCommand('git remote -v', 'Verificando configuración de remote');
    
    if (!remote.stdout || remote.stdout.includes('fatal') || !remote.stdout.includes('github.com')) {
      console.log('\n⚠️  Remote de GitHub no encontrado o incorrecto');
      console.log('🔧 CONFIGURACIÓN NECESARIA:');
      console.log('1. Ve a https://github.com y crea un nuevo repositorio llamado "Prunaverso_Web"');
      console.log('2. Ejecuta los siguientes comandos:');
      console.log('   git remote add origin https://github.com/TU_USUARIO/Prunaverso_Web.git');
      console.log('   git branch -M main');
      console.log('3. Luego ejecuta: npm run deploy');
    } else {
      console.log('✅ Remote de GitHub configurado correctamente:');
      console.log(remote.stdout);
    }

    // 3. Verificar ramas
    const branches = await runCommand('git branch -a', 'Verificando ramas');
    console.log('\n📂 Ramas disponibles:');
    console.log(branches.stdout || 'main (rama por defecto)');

    // 4. Verificar archivos sin commit
    const statusFiles = await runCommand('git status --porcelain', 'Verificando archivos sin commit');
    if (statusFiles.stdout) {
      console.log('\n📄 Archivos pendientes de commit:');
      const files = statusFiles.stdout.split('\n').slice(0, 10); // Mostrar solo los primeros 10
      files.forEach(file => console.log(`   ${file}`));
      if (statusFiles.stdout.split('\n').length > 10) {
        console.log(`   ... y ${statusFiles.stdout.split('\n').length - 10} archivos más`);
      }
      
      console.log('\n💡 Para hacer commit de todos los cambios:');
      console.log('   git add .');
      console.log('   git commit -m "🌍 Configuración inicial del Prunaverso Web"');
      console.log('   git push -u origin main');
    }

    // 5. Verificar configuración de GitHub Pages
    console.log('\n🌐 CONFIGURACIÓN DE GITHUB PAGES:');
    console.log('Después de hacer push, ve a tu repositorio en GitHub:');
    console.log('1. Settings → Pages');
    console.log('2. Source: Deploy from a branch');
    console.log('3. Branch: gh-pages');
    console.log('4. Folder: / (root)');
    console.log('5. Save');
    
    console.log('\n🚀 URLs importantes:');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`📦 Proyecto: ${packageJson.name}`);
    console.log('🔗 GitHub Pages: https://TU_USUARIO.github.io/Prunaverso_Web/');
    console.log('📂 Repositorio: https://github.com/TU_USUARIO/Prunaverso_Web');

  } catch (error) {
    console.error('\n💥 Error:', error.message);
  }
}

setupGitHub();