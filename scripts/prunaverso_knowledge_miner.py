#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧠 PRUNAVERSO KNOWLEDGE MINER
============================

Sistema avanzado de minería de conocimiento que extrae:
- Información de personajes y sus relaciones
- Metadatos del universo Prunaversal 
- Orígenes y evolución del sistema
- Conexiones semánticas entre elementos
- Context embeddings para búsquedas inteligentes

Fuente: C:\\Users\\pruna\\Documents\\GITHUB\\Prunaverso (repositorio completo)
Destino: Sistema web con búsquedas contextuales en tiempo real
"""

import os
import json
import re
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import fnmatch

class PrunaversoKnowledgeMiner:
    def __init__(self, source_repo_path: str, web_repo_path: str):
        self.source_path = Path(source_repo_path)
        self.web_path = Path(web_repo_path)
        self.knowledge_base = {
            'characters': {},
            'stories': {},
            'concepts': {},
            'relationships': {},
            'timeline': [],
            'meta_info': {},
            'origins': {},
            'evolution': {},
            'context_map': {},
            'semantic_links': {}
        }
        self.file_patterns = {
            'characters': ['**/personajes/**/*.txt', '**/personajes/**/*.md', '**/personajes/**/*.json'],
            'stories': ['**/saved_chats/**/*.txt', '**/saved_chats/**/*.md'],
            'docs': ['**/*.md', '**/README*', '**/ESTADO*.md'],
            'manifests': ['**/manifiesto*', '**/MANIFIESTO*'],
            'profiles': ['**/profile*', '**/perfil*'],
            'analysis': ['**/analisis*', '**/reflexion*']
        }
        
    def mine_complete_knowledge(self) -> Dict[str, Any]:
        """Minería completa del conocimiento Prunaversal"""
        print("🌌 Iniciando minería completa del Prunaverso...")
        
        # 1. Scan del repositorio completo
        all_files = self._scan_repository()
        print(f"📁 Archivos encontrados: {len(all_files)}")
        
        # 2. Minería por categorías
        self._mine_characters(all_files)
        self._mine_stories_and_chats(all_files)
        self._mine_concepts_and_meta(all_files)
        self._mine_relationships(all_files)
        self._mine_timeline_events(all_files)
        self._mine_origins_and_evolution(all_files)
        
        # 3. Construcción de mapa semántico
        self._build_semantic_map()
        
        # 4. Generar contexto embeddings
        self._generate_context_embeddings()
        
        # 5. Exportar bases de conocimiento
        self._export_knowledge_bases()
        
        return self.knowledge_base
    
    def _scan_repository(self) -> List[Path]:
        """Escaneo recursivo del repositorio"""
        all_files = []
        for root, dirs, files in os.walk(self.source_path):
            # Filtrar directorios innecesarios
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__']]
            
            for file in files:
                file_path = Path(root) / file
                if self._is_relevant_file(file_path):
                    all_files.append(file_path)
        
        return all_files
    
    def _is_relevant_file(self, file_path: Path) -> bool:
        """Determina si un archivo es relevante para la minería"""
        irrelevant_extensions = {'.pyc', '.exe', '.dll', '.so', '.o', '.class'}
        if file_path.suffix.lower() in irrelevant_extensions:
            return False
            
        irrelevant_patterns = ['*.log', '*.cache', '*.tmp', '*.temp']
        for pattern in irrelevant_patterns:
            if fnmatch.fnmatch(file_path.name, pattern):
                return False
                
        return True
    
    def _mine_characters(self, all_files: List[Path]):
        """Minería de información de personajes"""
        print("👥 Minando personajes...")
        
        character_files = []
        for pattern_list in self.file_patterns['characters']:
            for file_path in all_files:
                if any(fnmatch.fnmatch(str(file_path), pattern) for pattern in [pattern_list]):
                    character_files.append(file_path)
        
        for file_path in character_files:
            try:
                content = self._read_file_safely(file_path)
                if content:
                    character_info = self._extract_character_info(content, file_path)
                    if character_info:
                        char_id = self._generate_character_id(file_path)
                        self.knowledge_base['characters'][char_id] = character_info
                        print(f"  ✅ {char_id}: {character_info.get('name', 'Unknown')}")
            except Exception as e:
                print(f"  ❌ Error procesando {file_path}: {e}")
    
    def _extract_character_info(self, content: str, file_path: Path) -> Optional[Dict[str, Any]]:
        """Extrae información estructurada de un personaje"""
        # Detectar tipo de archivo y aplicar parser apropiado
        if file_path.suffix == '.json':
            try:
                data = json.loads(content)
                return self._normalize_character_json(data, file_path)
            except:
                return None
        else:
            return self._parse_character_text(content, file_path)
    
    def _normalize_character_json(self, data: Dict, file_path: Path) -> Dict[str, Any]:
        """Normaliza datos JSON de personaje"""
        return {
            'name': data.get('name', data.get('nombre', self._infer_name_from_path(file_path))),
            'type': 'character',
            'source_file': str(file_path),
            'raw_data': data,
            'relationships': data.get('relationships', data.get('relaciones', [])),
            'traits': data.get('traits', data.get('caracteristicas', [])),
            'description': data.get('description', data.get('descripcion', '')),
            'category': self._categorize_character(file_path),
            'last_updated': datetime.now().isoformat(),
            'hash': hashlib.md5(json.dumps(data, sort_keys=True).encode()).hexdigest()
        }
    
    def _parse_character_text(self, content: str, file_path: Path) -> Dict[str, Any]:
        """Parse de archivos de texto de personajes"""
        # Extraer nombre
        name = self._extract_name_from_text(content) or self._infer_name_from_path(file_path)
        
        # Extraer características principales
        traits = self._extract_traits_from_text(content)
        relationships = self._extract_relationships_from_text(content)
        description = self._extract_description_from_text(content)
        
        return {
            'name': name,
            'type': 'character',
            'source_file': str(file_path),
            'traits': traits,
            'relationships': relationships,
            'description': description,
            'category': self._categorize_character(file_path),
            'content_preview': content[:500] + '...' if len(content) > 500 else content,
            'last_updated': datetime.now().isoformat(),
            'hash': hashlib.md5(content.encode()).hexdigest()
        }
    
    def _mine_stories_and_chats(self, all_files: List[Path]):
        """Minería de historias y conversaciones"""
        print("💬 Minando historias y chats...")
        
        story_files = []
        for pattern_list in self.file_patterns['stories']:
            for file_path in all_files:
                if fnmatch.fnmatch(str(file_path), pattern_list):
                    story_files.append(file_path)
        
        for file_path in story_files:
            try:
                content = self._read_file_safely(file_path)
                if content:
                    story_info = self._extract_story_info(content, file_path)
                    story_id = self._generate_story_id(file_path)
                    self.knowledge_base['stories'][story_id] = story_info
                    print(f"  ✅ {story_id}")
            except Exception as e:
                print(f"  ❌ Error procesando historia {file_path}: {e}")
    
    def _mine_concepts_and_meta(self, all_files: List[Path]):
        """Minería de conceptos y metainformación"""
        print("🧠 Minando conceptos y meta-info...")
        
        # Buscar archivos de documentación y manifiestos
        doc_files = []
        for pattern_list in self.file_patterns['docs'] + self.file_patterns['manifests']:
            for file_path in all_files:
                if fnmatch.fnmatch(str(file_path), pattern_list):
                    doc_files.append(file_path)
        
        for file_path in doc_files:
            try:
                content = self._read_file_safely(file_path)
                if content:
                    concepts = self._extract_concepts_from_text(content)
                    for concept_id, concept_info in concepts.items():
                        self.knowledge_base['concepts'][concept_id] = concept_info
                        
                    # Extraer meta-información
                    meta_info = self._extract_meta_info(content, file_path)
                    if meta_info:
                        meta_id = file_path.stem
                        self.knowledge_base['meta_info'][meta_id] = meta_info
                        
            except Exception as e:
                print(f"  ❌ Error procesando doc {file_path}: {e}")
    
    def _extract_concepts_from_text(self, content: str) -> Dict[str, Any]:
        """Extrae conceptos del Prunaverso de texto"""
        concepts = {}
        
        # Patrones para detectar conceptos
        concept_patterns = [
            r'(?:concepto|idea|principio)[:]\s*([^\n]+)',
            r'(?:definición|definicion)[:]\s*([^\n]+)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[:]\s*([^\n]+)',
            r'(?:## |### )([^\n]+)'  # Headers de markdown
        ]
        
        for pattern in concept_patterns:
            matches = re.finditer(pattern, content, re.MULTILINE | re.IGNORECASE)
            for match in matches:
                if len(match.groups()) == 2:
                    concept_name = match.group(1).strip()
                    concept_desc = match.group(2).strip()
                else:
                    concept_name = match.group(1).strip()
                    concept_desc = "Concepto identificado en el texto"
                
                concept_id = self._normalize_id(concept_name)
                concepts[concept_id] = {
                    'name': concept_name,
                    'description': concept_desc,
                    'type': 'concept',
                    'context': match.group(0),
                    'extracted_from': 'text_mining'
                }
        
        return concepts
    
    def _mine_relationships(self, all_files: List[Path]):
        """Minería de relaciones entre elementos"""
        print("🔗 Minando relaciones...")
        
        # Analizar relaciones entre personajes
        characters = self.knowledge_base['characters']
        for char_id, char_info in characters.items():
            relationships = char_info.get('relationships', [])
            for rel in relationships:
                if isinstance(rel, dict):
                    target = rel.get('target', rel.get('with'))
                    rel_type = rel.get('type', rel.get('relation', 'unknown'))
                else:
                    target = str(rel)
                    rel_type = 'mentioned'
                
                if target:
                    rel_id = f"{char_id}_{self._normalize_id(target)}_{rel_type}"
                    self.knowledge_base['relationships'][rel_id] = {
                        'from': char_id,
                        'to': self._normalize_id(target),
                        'type': rel_type,
                        'source': char_info['source_file'],
                        'confidence': 0.8
                    }
    
    def _build_semantic_map(self):
        """Construye mapa semántico de conexiones"""
        print("🗺️ Construyendo mapa semántico...")
        
        # Crear conexiones semánticas basadas en co-ocurrencia
        all_entities = {
            **{k: v['name'] for k, v in self.knowledge_base['characters'].items()},
            **{k: v['name'] for k, v in self.knowledge_base['concepts'].items()}
        }
        
        # Analizar co-ocurrencia en textos
        for story_id, story_info in self.knowledge_base['stories'].items():
            content = story_info.get('content', '')
            entities_in_text = []
            
            for entity_id, entity_name in all_entities.items():
                if entity_name.lower() in content.lower():
                    entities_in_text.append(entity_id)
            
            # Crear enlaces semánticos
            for i, entity1 in enumerate(entities_in_text):
                for entity2 in entities_in_text[i+1:]:
                    link_id = f"{entity1}_semantic_{entity2}"
                    if link_id not in self.knowledge_base['semantic_links']:
                        self.knowledge_base['semantic_links'][link_id] = {
                            'entity1': entity1,
                            'entity2': entity2,
                            'strength': 1,
                            'contexts': [story_id]
                        }
                    else:
                        self.knowledge_base['semantic_links'][link_id]['strength'] += 1
                        self.knowledge_base['semantic_links'][link_id]['contexts'].append(story_id)
    
    def _export_knowledge_bases(self):
        """Exporta las bases de conocimiento al sistema web"""
        print("📤 Exportando bases de conocimiento...")
        
        output_dir = self.web_path / 'public' / 'data' / 'knowledge'
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Exportar cada categoría
        for category, data in self.knowledge_base.items():
            if data:  # Solo exportar si hay datos
                output_file = output_dir / f'{category}.json'
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"  ✅ {category}: {len(data)} elementos → {output_file}")
        
        # Exportar índice unificado
        unified_index = {
            'generated_at': datetime.now().isoformat(),
            'source_repository': str(self.source_path),
            'total_characters': len(self.knowledge_base['characters']),
            'total_stories': len(self.knowledge_base['stories']),
            'total_concepts': len(self.knowledge_base['concepts']),
            'total_relationships': len(self.knowledge_base['relationships']),
            'total_semantic_links': len(self.knowledge_base['semantic_links']),
            'categories': list(self.knowledge_base.keys())
        }
        
        index_file = output_dir / 'knowledge_index.json'
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(unified_index, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Índice unificado exportado: {index_file}")
    
    # Helper methods
    def _read_file_safely(self, file_path: Path) -> Optional[str]:
        """Lee archivo de forma segura con múltiples encodings"""
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
            except Exception:
                return None
        return None
    
    def _generate_character_id(self, file_path: Path) -> str:
        """Genera ID único para personaje"""
        # Usar path relativo y nombre de archivo
        relative_path = file_path.relative_to(self.source_path)
        path_parts = list(relative_path.parts)
        
        # Extraer nombre del personaje del path
        for part in reversed(path_parts):
            if 'personaje' not in part.lower() and part != file_path.name:
                return self._normalize_id(part)
        
        return self._normalize_id(file_path.stem)
    
    def _normalize_id(self, text: str) -> str:
        """Normaliza texto a ID válido"""
        # Remover caracteres especiales y espacios
        normalized = re.sub(r'[^a-zA-Z0-9_]', '_', text.lower())
        # Remover underscores múltiples
        normalized = re.sub(r'_+', '_', normalized)
        # Remover underscores al inicio/final
        return normalized.strip('_')
    
    def _categorize_character(self, file_path: Path) -> str:
        """Categoriza personaje basado en su ubicación"""
        path_str = str(file_path).lower()
        if 'nucleo_central' in path_str:
            return 'nucleo_central'
        elif 'nucleo_cercano' in path_str:
            return 'nucleo_cercano'
        elif 'externos' in path_str:
            return 'externos'
        elif 'old_friends' in path_str:
            return 'old_friends'
        elif 'exparejas' in path_str:
            return 'exparejas'
        else:
            return 'general'
    
    def _infer_name_from_path(self, file_path: Path) -> str:
        """Infiere nombre de personaje del path"""
        path_parts = file_path.parts
        for part in reversed(path_parts):
            if not part.endswith(('.txt', '.md', '.json')) and 'profile' not in part.lower():
                return part.replace('_', ' ').title()
        return file_path.stem.replace('_', ' ').title()
    
    def _extract_name_from_text(self, content: str) -> Optional[str]:
        """Extrae nombre de personaje del contenido"""
        patterns = [
            r'nombre[:]\s*([^\n]+)',
            r'name[:]\s*([^\n]+)',
            r'# ([^\n]+)',
            r'## ([^\n]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None
    
    def _extract_traits_from_text(self, content: str) -> List[str]:
        """Extrae características del texto"""
        traits = []
        patterns = [
            r'(?:trait|característica|personalidad)[:]\s*([^\n]+)',
            r'(?:es|tiene|muestra)\s+([a-z]+(?:\s+[a-z]+)*)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                trait = match.group(1).strip()
                if len(trait) > 3 and trait not in traits:
                    traits.append(trait)
        
        return traits[:10]  # Limitar a 10 traits principales
    
    def _extract_relationships_from_text(self, content: str) -> List[Dict[str, str]]:
        """Extrae relaciones del texto"""
        relationships = []
        patterns = [
            r'(?:relación|relation)\s+con\s+([^:\n]+)[:]\s*([^\n]+)',
            r'(?:conoce|amigo|pareja|hermano|padre|madre)\s+(?:de\s+)?([^\n.,]+)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                if len(match.groups()) >= 2:
                    relationships.append({
                        'target': match.group(1).strip(),
                        'type': match.group(2).strip()
                    })
                else:
                    relationships.append({
                        'target': match.group(1).strip(),
                        'type': 'mentioned'
                    })
        
        return relationships
    
    def _extract_description_from_text(self, content: str) -> str:
        """Extrae descripción principal del texto"""
        # Tomar los primeros párrafos como descripción
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        description_parts = []
        
        for paragraph in paragraphs[:3]:  # Primeros 3 párrafos
            if len(paragraph) > 50:  # Solo párrafos sustanciales
                description_parts.append(paragraph)
        
        return ' '.join(description_parts)[:1000]  # Limitar a 1000 chars
    
    def _generate_story_id(self, file_path: Path) -> str:
        """Genera ID para historia"""
        return self._normalize_id(file_path.stem)
    
    def _extract_story_info(self, content: str, file_path: Path) -> Dict[str, Any]:
        """Extrae información de historia"""
        return {
            'title': self._extract_title_from_content(content) or file_path.stem,
            'content': content,
            'source_file': str(file_path),
            'type': 'story',
            'characters_mentioned': self._find_characters_in_text(content),
            'concepts_mentioned': self._find_concepts_in_text(content),
            'length': len(content),
            'last_updated': datetime.now().isoformat(),
            'hash': hashlib.md5(content.encode()).hexdigest()
        }
    
    def _extract_title_from_content(self, content: str) -> Optional[str]:
        """Extrae título del contenido"""
        lines = content.split('\n')
        for line in lines[:5]:  # Primeras 5 líneas
            line = line.strip()
            if line and not line.startswith(('>', 'User:', 'Assistant:')):
                return line[:100]  # Primeros 100 chars
        return None
    
    def _find_characters_in_text(self, content: str) -> List[str]:
        """Encuentra menciones de personajes en el texto"""
        # Esto se ejecutará después de haber procesado los personajes
        mentioned = []
        for char_id, char_info in self.knowledge_base['characters'].items():
            char_name = char_info.get('name', '')
            if char_name and char_name.lower() in content.lower():
                mentioned.append(char_id)
        return mentioned
    
    def _find_concepts_in_text(self, content: str) -> List[str]:
        """Encuentra menciones de conceptos en el texto"""
        mentioned = []
        # Lista de conceptos clave del Prunaverso
        key_concepts = [
            'prunaverso', 'portal', 'personaje', 'consciencia', 'narrativa',
            'cognitivo', 'identidad', 'sintonización', 'orbital', 'fractal'
        ]
        
        for concept in key_concepts:
            if concept.lower() in content.lower():
                mentioned.append(self._normalize_id(concept))
        
        return mentioned
    
    def _extract_meta_info(self, content: str, file_path: Path) -> Dict[str, Any]:
        """Extrae metainformación de documentos"""
        return {
            'title': file_path.stem,
            'type': 'documentation',
            'content_preview': content[:500],
            'file_path': str(file_path),
            'concepts_defined': len(self._extract_concepts_from_text(content)),
            'last_updated': datetime.now().isoformat()
        }
    
    def _mine_timeline_events(self, all_files: List[Path]):
        """Mina eventos de timeline"""
        # Placeholder para futura implementación
        pass
    
    def _mine_origins_and_evolution(self, all_files: List[Path]):
        """Mina información sobre orígenes y evolución"""
        # Placeholder para futura implementación
        pass
    
    def _generate_context_embeddings(self):
        """Genera embeddings para búsqueda contextual"""
        # Placeholder para futura implementación con AI
        pass

def main():
    """Función principal"""
    source_repo = r"C:\Users\pruna\Documents\GITHUB\Prunaverso"
    web_repo = r"C:\Users\pruna\Documents\GITHUB\Prunaverso_Web"
    
    if not os.path.exists(source_repo):
        print(f"❌ Repositorio fuente no encontrado: {source_repo}")
        return
    
    if not os.path.exists(web_repo):
        print(f"❌ Repositorio web no encontrado: {web_repo}")
        return
    
    print("🌌 PRUNAVERSO KNOWLEDGE MINER v2.0")
    print("=" * 50)
    
    miner = PrunaversoKnowledgeMiner(source_repo, web_repo)
    knowledge_base = miner.mine_complete_knowledge()
    
    print("\n" + "=" * 50)
    print("✅ Minería completada exitosamente!")
    print(f"📊 Personajes extraídos: {len(knowledge_base['characters'])}")
    print(f"📚 Historias procesadas: {len(knowledge_base['stories'])}")
    print(f"🧠 Conceptos identificados: {len(knowledge_base['concepts'])}")
    print(f"🔗 Relaciones mapeadas: {len(knowledge_base['relationships'])}")
    print(f"🗺️ Enlaces semánticos: {len(knowledge_base['semantic_links'])}")

if __name__ == "__main__":
    main()