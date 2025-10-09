#!/usr/bin/env node
// Diagnóstico completo del deployment y todas las rutas

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://prunagit.github.io/Prunaverso_Web';

// Lista de todas las rutas a probar
const ROUTES_TO_TEST = [
  // Rutas principales
  { path: '/', name: 'Página Principal' },
  { path: '/#/', name: 'Hash Principal' },
  { path: '/#/portal', name: 'Portal Hash' },
  { path: '/#/player-evolution', name: 'Player Evolution Hash' },
  { path: '/#/gdd', name: 'GDD Hash' },
  { path: '/#/awakening', name: 'Awakening Hash' },
  { path: '/#/dev', name: 'Dev Portal Hash' },
  
  // Rutas sin hash (para comparar)
  { path: '/portal', name: 'Portal Sin Hash' },
  { path: '/player-evolution', name: 'Player Evolution Sin Hash' },
  { path: '/gdd', name: 'GDD Sin Hash' },
];

// Colores para terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function makeRequest(url) {
  return new Promise((resolve) => {
    const options = {
      timeout: 5000,
      headers: {
        'User-Agent': 'Prunaverso-Debug-Bot/1.0'
      }
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data,
          headers: res.headers,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 'ERROR',
        error: error.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        error: 'Timeout after 5s',
        success: false
      });
    });
  });
}

async function testRoute(route) {
  const url = BASE_URL + route.path;
  console.log(`${colors.blue}Testing:${colors.reset} ${route.name} (${route.path})`);
  
  const result = await makeRequest(url);
  
  const status = result.success ? 
    `${colors.green}✓ ${result.status}${colors.reset}` : 
    `${colors.red}✗ ${result.status || result.error}${colors.reset}`;
  
  let details = '';
  if (result.success && result.data) {
    // Verificar si contiene React/Vite
    const hasReact = result.data.includes('react') || result.data.includes('React');
    const hasVite = result.data.includes('vite') || result.data.includes('Vite');
    const hasTitle = result.data.match(/<title>(.*?)<\/title>/);
    const hasApp = result.data.includes('id="root"') || result.data.includes('class="app"');
    
    details = ` | React: ${hasReact ? '✓' : '✗'} | Vite: ${hasVite ? '✓' : '✗'} | App: ${hasApp ? '✓' : '✗'}`;
    if (hasTitle) details += ` | Title: "${hasTitle[1]}"`;
  }
  
  console.log(`  ${status}${details}`);
  return { route, result, details };
}

async function checkAssets() {
  console.log(`\n${colors.bold}=== CHECKING ASSETS ===${colors.reset}`);
  
  // Verificar assets críticos
  const assets = [
    '/assets/index-bIPWn2m2.js',
    '/assets/index-DIqgYvT_.css',
    '/assets/react-core-_g6xLlVr.js',
    '/assets/react-router-BTgER9_u.js'
  ];
  
  for (const asset of assets) {
    const result = await makeRequest(BASE_URL + asset);
    const status = result.success ? 
      `${colors.green}✓${colors.reset}` : 
      `${colors.red}✗ ${result.status}${colors.reset}`;
    console.log(`  ${status} ${asset}`);
  }
}

async function fullDiagnosis() {
  console.log(`${colors.bold}${colors.blue}
╔══════════════════════════════════════╗
║     PRUNAVERSO DEPLOYMENT DEBUG      ║
║            Diagnóstico v2.0          ║
╚══════════════════════════════════════╝${colors.reset}
`);

  console.log(`${colors.bold}=== TESTING ALL ROUTES ===${colors.reset}`);
  
  const results = [];
  for (const route of ROUTES_TO_TEST) {
    const result = await testRoute(route);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }
  
  await checkAssets();
  
  console.log(`\n${colors.bold}=== SUMMARY ===${colors.reset}`);
  
  const working = results.filter(r => r.result.success);
  const broken = results.filter(r => !r.result.success);
  
  console.log(`${colors.green}Working routes: ${working.length}${colors.reset}`);
  working.forEach(r => console.log(`  ✓ ${r.route.name}`));
  
  console.log(`${colors.red}Broken routes: ${broken.length}${colors.reset}`);
  broken.forEach(r => console.log(`  ✗ ${r.route.name} (${r.result.status || r.result.error})`));
  
  // Generar recomendaciones
  console.log(`\n${colors.bold}=== RECOMMENDATIONS ===${colors.reset}`);
  
  if (broken.length > working.length) {
    console.log(`${colors.red}⚠️ Mayoría de rutas rotas - problema fundamental de deployment${colors.reset}`);
  }
  
  const hashWorking = working.some(r => r.route.path.includes('#'));
  const noHashWorking = working.some(r => !r.route.path.includes('#') && r.route.path !== '/');
  
  if (hashWorking && !noHashWorking) {
    console.log(`${colors.yellow}💡 Solo rutas hash funcionan - continuar con HashRouter${colors.reset}`);
  } else if (!hashWorking && noHashWorking) {
    console.log(`${colors.yellow}💡 Solo rutas sin hash funcionan - cambiar a BrowserRouter${colors.reset}`);
  } else if (!hashWorking && !noHashWorking) {
    console.log(`${colors.red}🚨 Ninguna ruta funciona - problema de build/deployment${colors.reset}`);
  }
  
  // Guardar log
  const logData = {
    timestamp: new Date().toISOString(),
    results: results.map(r => ({
      route: r.route,
      success: r.result.success,
      status: r.result.status,
      error: r.result.error
    }))
  };
  
  fs.writeFileSync('deployment-diagnosis.json', JSON.stringify(logData, null, 2));
  console.log(`\n${colors.blue}📄 Log guardado en: deployment-diagnosis.json${colors.reset}`);
}

// Ejecutar diagnóstico
fullDiagnosis().catch(console.error);