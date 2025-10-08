#!/usr/bin/env node

/**
 * 🌀 GENERADOR DE ÍNDICE FRACTAL DEL PRUNAVERSO
 * 
 * Este script escanea toda la estructura modular y genera un mapa
 * completo del sistema cognitivo, incluyendo metadatos, conexiones
 * y documentación de cada módulo.
 */

const fs = require('fs');
const path = require('path');

class PrunaversoIndexer {
    constructor() {
        this.basePath = path.resolve(__dirname, '..');
        this.index = {
            metadata: {
                generated_at: new Date().toISOString(),
                version: "1.0.0",
                total_modules: 0,
                cognitive_depth: 0
            },
            modules: {},
            connections: {},
            evolution_map: {}
        };
    }

    // Escanea un módulo y extrae su información
    scanModule(modulePath, moduleType) {
        const module = {
            type: moduleType,
            path: modulePath,
            files: {},
            cognitive_properties: {},
            connections: []
        };

        // Buscar archivos estándar
        const standardFiles = ['index.jsx', 'index.js', 'README.md', 'config.json', 'meta.json', 'schema.json', 'flow.json'];
        
        standardFiles.forEach(fileName => {
            const filePath = path.join(modulePath, fileName);
            if (fs.existsSync(filePath)) {
                module.files[fileName] = {
                    exists: true,
                    size: fs.statSync(filePath).size,
                    modified: fs.statSync(filePath).mtime
                };

                // Extraer metadatos según tipo de archivo
                if (fileName.endsWith('.json')) {
                    try {
                        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        module.files[fileName].metadata = content.metadata || {};
                        if (content.cognitive_properties) {
                            module.cognitive_properties = content.cognitive_properties;
                        }
                    } catch (e) {
                        console.warn(`⚠️  Error parsing ${fileName} in ${modulePath}`);
                    }
                }

                // Extraer información del README
                if (fileName === 'README.md') {
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        module.files[fileName].first_line = content.split('\n')[0];
                        
                        // Buscar sección de conexiones modulares
                        const connectionsMatch = content.match(/## 🧩 \*\*Conexiones Modulares\*\*(.*?)##/s);
                        if (connectionsMatch) {
                            const connectionsText = connectionsMatch[1];
                            const consumeMatch = connectionsText.match(/Consume.*?:(.*?)$/m);
                            const exportMatch = connectionsText.match(/Exporta.*?:(.*?)$/m);
                            
                            if (consumeMatch) module.connections.push({ type: 'consume', targets: consumeMatch[1].trim() });
                            if (exportMatch) module.connections.push({ type: 'export', targets: exportMatch[1].trim() });
                        }
                    } catch (e) {
                        console.warn(`⚠️  Error reading README in ${modulePath}`);
                    }
                }
            }
        });

        return module;
    }

    // Escanea todos los módulos en una carpeta
    scanModuleType(folderName, moduleType) {
        const modulesPath = path.join(this.basePath, 'src', folderName);
        
        if (!fs.existsSync(modulesPath)) {
            console.warn(`⚠️  Folder ${folderName} not found`);
            return;
        }

        console.log(`🔍 Scanning ${moduleType} modules...`);
        
        const items = fs.readdirSync(modulesPath, { withFileTypes: true });
        
        items.forEach(item => {
            if (item.isDirectory()) {
                const modulePath = path.join(modulesPath, item.name);
                const module = this.scanModule(modulePath, moduleType);
                
                const moduleKey = `${moduleType}.${item.name}`;
                this.index.modules[moduleKey] = module;
                this.index.metadata.total_modules++;
                
                console.log(`  ✅ ${moduleKey}`);
            }
        });
    }

    // Escanea el módulo de datos
    scanDataModule() {
        const dataPath = path.join(this.basePath, 'src', 'data');
        console.log(`🔍 Scanning data module...`);
        
        const module = {
            type: 'data',
            path: dataPath,
            files: {},
            total_size: 0
        };

        if (fs.existsSync(dataPath)) {
            const files = fs.readdirSync(dataPath);
            files.forEach(fileName => {
                const filePath = path.join(dataPath, fileName);
                const stats = fs.statSync(filePath);
                
                module.files[fileName] = {
                    exists: true,
                    size: stats.size,
                    modified: stats.mtime
                };
                module.total_size += stats.size;

                // Para archivos JSON, extraer metadata
                if (fileName.endsWith('.json')) {
                    try {
                        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        if (content.metadata) {
                            module.files[fileName].metadata = content.metadata;
                        }
                        if (content.terms) {
                            module.files[fileName].term_count = Object.keys(content.terms).length;
                        }
                    } catch (e) {
                        console.warn(`⚠️  Error parsing ${fileName}`);
                    }
                }
            });

            console.log(`  ✅ data module (${files.length} files)`);
        }
    }

    // Analiza conexiones entre módulos
    analyzeConnections() {
        console.log(`🔗 Analyzing module connections...`);
        
        Object.keys(this.index.modules).forEach(moduleKey => {
            const module = this.index.modules[moduleKey];
            if (module.connections) {
                module.connections.forEach(connection => {
                    if (!this.index.connections[moduleKey]) {
                        this.index.connections[moduleKey] = [];
                    }
                    this.index.connections[moduleKey].push(connection);
                });
            }
        });
    }

    // Genera el mapa de evolución
    generateEvolutionMap() {
        console.log(`📈 Generating evolution map...`);
        
        // Analizar niveles cognitivos
        const cognitiveModules = Object.keys(this.index.modules)
            .filter(key => this.index.modules[key].cognitive_properties)
            .map(key => ({
                key,
                level: this.index.modules[key].cognitive_properties.consciousness_level || 0
            }));

        this.index.evolution_map = {
            cognitive_levels: cognitiveModules,
            max_level: Math.max(...cognitiveModules.map(m => m.level)),
            expansion_vectors: this.extractExpansionVectors()
        };

        this.index.metadata.cognitive_depth = this.index.evolution_map.max_level;
    }

    // Extrae vectores de expansión de los metadatos
    extractExpansionVectors() {
        const vectors = {};
        
        Object.keys(this.index.modules).forEach(moduleKey => {
            const module = this.index.modules[moduleKey];
            Object.keys(module.files).forEach(fileName => {
                if (fileName.endsWith('.json') && module.files[fileName].metadata) {
                    try {
                        const filePath = path.join(module.path, fileName);
                        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        if (content.expansion_vectors) {
                            vectors[moduleKey] = content.expansion_vectors;
                        }
                    } catch (e) {
                        // Silently ignore parsing errors
                    }
                }
            });
        });

        return vectors;
    }

    // Genera el índice completo
    generate() {
        console.log(`🌀 INICIANDO GENERACIÓN DE ÍNDICE FRACTAL DEL PRUNAVERSO`);
        console.log(`===========================================================`);

        // Escanear todos los tipos de módulos
        this.scanModuleType('components', 'component');
        this.scanModuleType('hooks', 'hook');
        this.scanModuleType('pages', 'page');
        this.scanDataModule();

        // Análisis avanzado
        this.analyzeConnections();
        this.generateEvolutionMap();

        // Generar estadísticas finales
        this.index.metadata.components_count = Object.keys(this.index.modules).filter(k => k.startsWith('component')).length;
        this.index.metadata.hooks_count = Object.keys(this.index.modules).filter(k => k.startsWith('hook')).length;
        this.index.metadata.pages_count = Object.keys(this.index.modules).filter(k => k.startsWith('page')).length;

        console.log(`\n📊 ESTADÍSTICAS FINALES:`);
        console.log(`   Total módulos: ${this.index.metadata.total_modules}`);
        console.log(`   Componentes: ${this.index.metadata.components_count}`);
        console.log(`   Hooks: ${this.index.metadata.hooks_count}`);
        console.log(`   Páginas: ${this.index.metadata.pages_count}`);
        console.log(`   Profundidad cognitiva: ${this.index.metadata.cognitive_depth}`);

        return this.index;
    }

    // Guarda el índice
    save() {
        const outputPath = path.join(this.basePath, 'fractal_index.json');
        fs.writeFileSync(outputPath, JSON.stringify(this.index, null, 2));
        
        console.log(`\n✅ Índice fractal guardado en: fractal_index.json`);
        console.log(`🌌 El Prunaverso está completamente mapeado y listo para evolucionar`);
        
        return outputPath;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const indexer = new PrunaversoIndexer();
    const index = indexer.generate();
    indexer.save();
}

module.exports = PrunaversoIndexer;