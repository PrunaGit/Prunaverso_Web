#!/usr/bin/env python3
"""
🔍 MINERO AVANZADO CON COMPILACIÓN Y REFACTORIZACIÓN
===================================================
Extrae información completa de perfiles y unifica personajes duplicados
"""

import json
import re
import os
from pathlib import Path
from collections import defaultdict
import hashlib

# Configuración
ROOT = Path(__file__).parent.parent
CHARACTERS_DIR = ROOT / "data" / "characters"
OUTPUT_FILE = ROOT / "public" / "data" / "characters_database.json"

def normalize_name(name):
    """Normaliza nombres para unificación"""
    if not name:
        return "unknown"
    
    # Convertir a minúsculas y limpiar
    normalized = str(name).lower().strip()
    
    # Remover acentos y caracteres especiales
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
        'ç': 'c', 'ñ': 'n'
    }
    
    for old, new in replacements.items():
        normalized = normalized.replace(old, new)
    
    # Unificar variaciones conocidas
    unifications = {
        'alejandro pruna': 'alex pruna',
        'alejandro pruna catala': 'alex pruna',
        'alejandro pruna catalá': 'alex pruna',
        'alex pruna catala': 'alex pruna',
        'xavi roura': 'xavier roura',
        'xavier roura plademunt': 'xavier roura'
    }
    
    return unifications.get(normalized, normalized)

def extract_safe_value(data, keys, expected_type, default=None):
    """Extrae valor de forma segura desde múltiples claves posibles"""
    if not isinstance(data, dict):
        return default
    
    for key in keys:
        if key in data:
            value = data[key]
            if expected_type == int:
                if isinstance(value, int):
                    return value
                elif isinstance(value, str):
                    numbers = re.findall(r'\d+', value)
                    return int(numbers[0]) if numbers else default
            elif expected_type == float:
                if isinstance(value, (int, float)):
                    return float(value)
                elif isinstance(value, str):
                    numbers = re.findall(r'\d+\.?\d*', value)
                    return float(numbers[0]) if numbers else default
            elif expected_type == str:
                return str(value) if value else default
            elif expected_type == list:
                if isinstance(value, list):
                    return value
                elif isinstance(value, str):
                    return [value] if value else []
            elif expected_type == dict:
                return value if isinstance(value, dict) else default
            elif expected_type == bool:
                if isinstance(value, bool):
                    return value
                elif isinstance(value, str):
                    return value.lower() in ['true', 'sí', 'si', 'yes', '1']
            else:
                return value
    
    return default

def generate_contextual_metric(field, data):
    """Genera métrica contextual basada en los datos del personaje"""
    import random
    
    # Rangos base por campo
    ranges = {
        'V': (4.0, 8.5),
        'EX_x': (3.0, 9.0),
        'EX_y': (3.0, 9.0),
        'EY_x': (2.0, 8.0),
        'EY_y': (2.0, 8.0),
        'N_p': (1.0, 7.0),
        'M': (3.0, 9.0),
        'R': (2.0, 8.0),
        'D': (1.0, 6.0),
        'Di': (2.0, 7.0)
    }
    
    base_range = ranges.get(field, (3.0, 7.0))
    
    # Ajustar según el contenido del perfil
    content = json.dumps(data, ensure_ascii=False).lower()
    
    # Factores de ajuste
    if 'creativo' in content or 'artist' in content:
        if field in ['D', 'EX_x', 'EX_y']:
            base_range = (base_range[0] + 1, base_range[1] + 0.5)
    
    if 'analítico' in content or 'ciencia' in content:
        if field in ['R', 'M', 'Di']:
            base_range = (base_range[0] + 1, base_range[1] + 0.5)
    
    if 'neurodivergente' in content or 'autismo' in content:
        if field in ['N_p', 'D']:
            base_range = (base_range[0] + 0.5, base_range[1] + 1)
    
    return round(random.uniform(base_range[0], base_range[1]), 1)

def extract_detailed_metrics(data):
    """Extrae métricas cognitivas detalladas"""
    metrics = {}
    
    # Buscar en diferentes ubicaciones
    atributos = data.get('atributos', {})
    if isinstance(atributos, list) and atributos:
        atributos = atributos[0]
    
    cognitivo = data.get('perfil_cognitivo', {})
    metricas = data.get('metricas', {})
    
    # Campos estándar del sistema cognitivo
    standard_fields = {
        'V': 'Vitalidad',
        'EX_x': 'Exploración Externa X',
        'EX_y': 'Exploración Externa Y', 
        'EY_x': 'Exploración Interna X',
        'EY_y': 'Exploración Interna Y',
        'N_p': 'Navegación Profunda',
        'M': 'Memoria',
        'R': 'Razonamiento',
        'D': 'Divergencia',
        'Di': 'Disciplina'
    }
    
    for field, description in standard_fields.items():
        value = None
        
        # Buscar en múltiples ubicaciones
        for source in [atributos, cognitivo, metricas, data]:
            if isinstance(source, dict) and field in source:
                raw_value = source[field]
                if isinstance(raw_value, (int, float)):
                    value = float(raw_value)
                    break
                elif isinstance(raw_value, str):
                    numbers = re.findall(r'\d+\.?\d*', raw_value)
                    if numbers:
                        value = float(numbers[0])
                        break
        
        if value is None:
            value = generate_contextual_metric(field, data)
        
        metrics[field] = {
            'valor': round(value, 1),
            'descripcion': description,
            'fuente': 'perfil' if value != generate_contextual_metric(field, data) else 'generado'
        }
    
    return metrics

def determine_detailed_lenses(data):
    """Determina lentes cognitivas con análisis detallado"""
    text_content = json.dumps(data, ensure_ascii=False).lower()
    
    # Patrones expandidos para cada lente
    lens_patterns = {
        'ai': {
            'patterns': ['ia', 'artificial', 'inteligencia artificial', 'machine learning', 'algoritmo', 'neural', 'deep learning', 'automation'],
            'weight': 1.0
        },
        'philosophy': {
            'patterns': ['filosofia', 'filosofía', 'existencial', 'ontologia', 'epistemologia', 'etica', 'moral', 'fenomenologia'],
            'weight': 1.0
        },
        'linguistics': {
            'patterns': ['linguistica', 'lengua', 'idioma', 'semantica', 'pragmatica', 'discurso', 'comunicacion'],
            'weight': 1.0
        },
        'biology': {
            'patterns': ['biologia', 'evolutivo', 'genetica', 'organismo', 'vida', 'celular', 'molecular'],
            'weight': 1.0
        },
        'psychology': {
            'patterns': ['psicologia', 'cognitivo', 'mental', 'emocional', 'comportamiento', 'personalidad', 'terapia'],
            'weight': 1.0
        },
        'art': {
            'patterns': ['arte', 'creativo', 'estetica', 'artistico', 'expresion', 'diseño', 'visual', 'musica'],
            'weight': 1.0
        },
        'science': {
            'patterns': ['ciencia', 'investigacion', 'empirico', 'experimento', 'metodologia', 'hipotesis'],
            'weight': 1.0
        },
        'social': {
            'patterns': ['social', 'sociologia', 'comunidad', 'grupo', 'interaccion', 'colectivo', 'cultura'],
            'weight': 1.0
        },
        'technology': {
            'patterns': ['tecnologia', 'software', 'programacion', 'desarrollo', 'digital', 'web', 'app'],
            'weight': 1.0
        }
    }
    
    lens_scores = {}
    
    for lens, config in lens_patterns.items():
        score = 0
        for pattern in config['patterns']:
            if pattern in text_content:
                score += config['weight']
        lens_scores[lens] = score
    
    # Seleccionar lentes con puntuación > 0
    selected_lenses = [lens for lens, score in lens_scores.items() if score > 0]
    
    # Si no se encontraron lentes, usar análisis por nombre
    if not selected_lenses:
        name = data.get('nombre', '').lower()
        if any(x in name for x in ['alex', 'pruna']):
            selected_lenses = ['ai', 'philosophy', 'linguistics']
        elif any(x in name for x in ['xavier', 'roura']):
            selected_lenses = ['science', 'art', 'technology']
        elif 'ana' in name:
            selected_lenses = ['psychology', 'social']
        else:
            selected_lenses = ['psychology']
    
    return selected_lenses[:4]  # Máximo 4 lentes

def extract_biografia_completa(data):
    """Extrae biografía completa del personaje"""
    biografia = {}
    
    # Información básica
    biografia['edad'] = extract_safe_value(data, ['edad', 'age'], int)
    biografia['idioma'] = extract_safe_value(data, ['idioma', 'language', 'lang'], str, 'español')
    biografia['ubicacion'] = extract_safe_value(data, ['ubicacion', 'location', 'lugar'], str)
    biografia['ocupacion'] = extract_safe_value(data, ['ocupacion', 'trabajo', 'profession', 'job'], str)
    
    # Información personal extendida
    biografia['personalidad'] = extract_safe_value(data, ['personalidad', 'personality'], str)
    biografia['historia'] = extract_safe_value(data, ['historia', 'background', 'story'], str)
    biografia['motivaciones'] = extract_safe_value(data, ['motivaciones', 'motivations'], list)
    biografia['objetivos'] = extract_safe_value(data, ['objetivos', 'goals', 'metas'], list)
    
    return biografia

def extract_detailed_cognitive_profile(data):
    """Extrae perfil cognitivo detallado"""
    perfil = data.get('perfil_cognitivo', {})
    
    cognitive_profile = {
        'neurodivergencia': extract_safe_value(perfil, ['neurodivergencia', 'neurotype'], str, 'no especificada'),
        'caracteristicas': extract_safe_value(perfil, ['caracteristicas', 'traits', 'rasgos'], list, []),
        'lentes_dominantes': determine_detailed_lenses(data),
        'estilo_cognitivo': extract_safe_value(perfil, ['estilo', 'cognitive_style'], str),
        'fortalezas': extract_safe_value(perfil, ['fortalezas', 'strengths'], list, []),
        'areas_desarrollo': extract_safe_value(perfil, ['areas_desarrollo', 'growth_areas'], list, []),
        'patron_pensamiento': extract_safe_value(perfil, ['patron_pensamiento', 'thinking_pattern'], str)
    }
    
    return cognitive_profile

def extract_detailed_context(data):
    """Extrae contexto detallado del personaje"""
    contexto = {
        'rol': extract_safe_value(data, ['rol', 'role'], str),
        'descripcion': extract_safe_value(data, ['descripcion', 'description'], str),
        'ideologia': extract_safe_value(data, ['ideologia', 'ideology'], str),
        'relaciones': extract_safe_value(data, ['relaciones', 'relationships'], dict, {}),
        'proyectos': extract_safe_value(data, ['proyectos', 'projects'], list, []),
        'habilidades': extract_safe_value(data, ['habilidades', 'skills'], list, []),
        'intereses': extract_safe_value(data, ['intereses', 'interests'], list, []),
        'construccion_simbologica': extract_safe_value(data, ['construccion_simbologica'], str),
        'consciencia_origen': extract_safe_value(data, ['consciencia_de_origen'], bool, False)
    }
    
    return contexto

def calculate_completeness(data):
    """Calcula el porcentaje de completitud de los datos"""
    total_fields = 0
    filled_fields = 0
    
    # Campos importantes a verificar
    important_fields = [
        'nombre', 'edad', 'personalidad', 'historia', 'rol',
        'atributos', 'perfil_cognitivo', 'habilidades', 'intereses'
    ]
    
    for field in important_fields:
        total_fields += 1
        if field in data and data[field]:
            filled_fields += 1
    
    return round((filled_fields / total_fields) * 100, 1)

def get_avatar_advanced(name):
    """Avatar avanzado basado en análisis del nombre"""
    name_lower = str(name).lower()
    
    # Mapeo expandido de avatars
    avatar_mapping = {
        'alex': '🧬', 'alejandro': '🧬', 'pruna': '🧬',
        'xavier': '🔧', 'xavi': '🔧', 'roura': '🔧',
        'ana': '🌟', 'joaquim': '📚', 'joaquín': '📚',
        'cristobal': '🎨', 'cristóbal': '🎨',
        'dani': '⚡', 'daniel': '⚡',
        'david': '🚀', 'sergi': '🔍',
        'julen': '🎯', 'clara': '✨',
        'maria': '🌸', 'marc': '🔬'
    }
    
    for key, avatar in avatar_mapping.items():
        if key in name_lower:
            return avatar
    
    # Avatar por defecto según el género aproximado
    if any(fem in name_lower for fem in ['ana', 'maria', 'clara', 'laura', 'sara']):
        return '👩‍💼'
    else:
        return '👨‍💼'

def extract_detailed_character_from_profile(data, filename):
    """Extrae personaje completo desde perfil JSON"""
    try:
        # Detectar estructura del perfil
        if isinstance(data, list):
            # Algunos archivos son arrays
            data = data[0] if data else {}
        
        if not isinstance(data, dict):
            return None
        
        # Extraer información básica
        nombre = data.get('nombre', data.get('name', ''))
        if not nombre:
            return None
        
        # Información biográfica completa
        biografia = extract_biografia_completa(data)
        
        # Métricas cognitivas detalladas
        metrics = extract_detailed_metrics(data)
        
        # Perfil cognitivo completo
        perfil_cognitivo = extract_detailed_cognitive_profile(data)
        
        # Información contextual
        contexto = extract_detailed_context(data)
        
        # ID único basado en nombre normalizado
        char_id = hashlib.md5(normalize_name(nombre).encode()).hexdigest()[:8]
        
        character = {
            "id": char_id,
            "nombre": str(nombre),
            "biografia": biografia,
            "cognitive_metrics": metrics,
            "perfil_cognitivo": perfil_cognitivo,
            "contexto": contexto,
            "avatar": get_avatar_advanced(nombre),
            "fuente_principal": filename,
            "fuentes_adicionales": [filename],
            "completitud": calculate_completeness(data),
            "procesado": "2025-01-07"
        }
        
        return character
        
    except Exception as e:
        print(f"      ⚠️ Error extrayendo de {filename}: {e}")
        return None

def merge_character_data(existing, new):
    """Unifica datos de personajes duplicados"""
    merged = existing.copy()
    
    # Unificar fuentes
    if 'fuentes_adicionales' not in merged:
        merged['fuentes_adicionales'] = [merged.get('fuente_principal', '')]
    
    merged['fuentes_adicionales'].append(new.get('fuente_principal', ''))
    merged['fuentes_adicionales'] = list(set(merged['fuentes_adicionales']))
    
    # Combinar biografía (mantener datos más completos)
    if 'biografia' in new:
        if 'biografia' not in merged:
            merged['biografia'] = {}
        
        for key, value in new['biografia'].items():
            if value and (not merged['biografia'].get(key) or len(str(value)) > len(str(merged['biografia'].get(key, '')))):
                merged['biografia'][key] = value
    
    # Combinar métricas (priorizar valores del perfil sobre generados)
    if 'cognitive_metrics' in new:
        for metric, data in new['cognitive_metrics'].items():
            if metric in merged['cognitive_metrics']:
                # Priorizar métricas del perfil
                if data.get('fuente') == 'perfil' and merged['cognitive_metrics'][metric].get('fuente') == 'generado':
                    merged['cognitive_metrics'][metric] = data
            else:
                merged['cognitive_metrics'][metric] = data
    
    # Combinar perfil cognitivo
    if 'perfil_cognitivo' in new:
        for key, value in new['perfil_cognitivo'].items():
            if value and (not merged['perfil_cognitivo'].get(key) or len(str(value)) > len(str(merged['perfil_cognitivo'].get(key, '')))):
                merged['perfil_cognitivo'][key] = value
    
    # Combinar contexto
    if 'contexto' in new:
        for key, value in new['contexto'].items():
            if value and (not merged['contexto'].get(key) or len(str(value)) > len(str(merged['contexto'].get(key, '')))):
                merged['contexto'][key] = value
    
    # Actualizar completitud
    merged['completitud'] = max(merged.get('completitud', 0), new.get('completitud', 0))
    
    return merged

def extract_from_main_file_detailed(file_path):
    """Extrae personajes del archivo principal con más detalle"""
    characters = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extraer objetos JSON válidos
        json_objects = extract_json_objects_advanced(content)
        
        for obj in json_objects:
            try:
                data = json.loads(obj)
                if isinstance(data, dict) and 'nombre' in data:
                    char = extract_detailed_character_from_profile(data, "personajes_unif_v1.json")
                    if char:
                        characters.append(char)
            except:
                continue
    
    except Exception as e:
        print(f"   ❌ Error procesando archivo principal: {e}")
    
    return characters

def extract_json_objects_advanced(text):
    """Extrae objetos JSON de forma avanzada"""
    objects = []
    brace_count = 0
    start_pos = None
    
    for i, char in enumerate(text):
        if char == '{':
            if brace_count == 0:
                start_pos = i
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0 and start_pos is not None:
                obj = text[start_pos:i+1]
                if len(obj) > 50 and '"nombre"' in obj:
                    objects.append(obj)
                start_pos = None
    
    return objects

def extract_detailed_characters():
    """Extrae personajes con información detallada completa"""
    print("🔍 EXTRACCIÓN DETALLADA DE PERSONAJES")
    print("=" * 60)
    
    characters = {}  # Usar dict para facilitar unificación
    
    # 1. Procesar perfiles individuales JSON con información completa
    print("\n📄 Procesando perfiles individuales...")
    profile_files = list(CHARACTERS_DIR.glob("**/*profile*.json"))
    
    for profile_file in profile_files:
        print(f"   📄 {profile_file.name}")
        try:
            with open(profile_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            char = extract_detailed_character_from_profile(data, profile_file.name)
            if char:
                char_key = normalize_name(char['nombre'])
                if char_key in characters:
                    characters[char_key] = merge_character_data(characters[char_key], char)
                    print(f"      ✅ {char['nombre']} (UNIFICADO)")
                else:
                    characters[char_key] = char
                    print(f"      ✅ {char['nombre']} (NUEVO)")
                    
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:50]}")
    
    # 2. Procesar archivo principal con patrones específicos
    print(f"\n📄 Procesando archivo principal...")
    main_file = CHARACTERS_DIR / "personajes" / "personajes_unif_v1.json"
    if main_file.exists():
        main_chars = extract_from_main_file_detailed(main_file)
        for char in main_chars:
            char_key = normalize_name(char['nombre'])
            if char_key in characters:
                characters[char_key] = merge_character_data(characters[char_key], char)
                print(f"      ✅ {char['nombre']} (UNIFICADO con principal)")
            else:
                characters[char_key] = char
                print(f"      ✅ {char['nombre']} (NUEVO desde principal)")
    
    return list(characters.values())

def generate_detailed_stats(characters):
    """Genera estadísticas detalladas"""
    stats = {
        "lentes_dominantes": defaultdict(int),
        "neurodivergencias": defaultdict(int),
        "idiomas": defaultdict(int),
        "ocupaciones": defaultdict(int),
        "completitud_por_rango": defaultdict(int)
    }
    
    for char in characters:
        # Lentes
        for lens in char.get('perfil_cognitivo', {}).get('lentes_dominantes', []):
            stats['lentes_dominantes'][lens] += 1
        
        # Neurodivergencias
        neuro = char.get('perfil_cognitivo', {}).get('neurodivergencia', 'no especificada')
        stats['neurodivergencias'][neuro] += 1
        
        # Idiomas
        idioma = char.get('biografia', {}).get('idioma', 'no especificado')
        stats['idiomas'][idioma] += 1
        
        # Ocupaciones
        ocupacion = char.get('biografia', {}).get('ocupacion', 'no especificada')
        if ocupacion and ocupacion != 'no especificada':
            stats['ocupaciones'][ocupacion] += 1
        
        # Completitud
        completitud = char.get('completitud', 0)
        if completitud >= 80:
            stats['completitud_por_rango']['80-100%'] += 1
        elif completitud >= 60:
            stats['completitud_por_rango']['60-79%'] += 1
        elif completitud >= 40:
            stats['completitud_por_rango']['40-59%'] += 1
        else:
            stats['completitud_por_rango']['0-39%'] += 1
    
    return {k: dict(v) for k, v in stats.items()}

def save_detailed_database(characters):
    """Guarda la base de datos detallada"""
    # Ordenar por completitud (más completos primero)
    characters.sort(key=lambda x: x.get('completitud', 0), reverse=True)
    
    # Estadísticas detalladas
    stats = generate_detailed_stats(characters)
    
    database = {
        "version": "2.0",
        "generado": "2025-01-07",
        "total_personajes": len(characters),
        "personajes": characters,
        "estadisticas": stats,
        "metadata": {
            "completitud_promedio": sum(c.get('completitud', 0) for c in characters) / len(characters) if characters else 0,
            "personajes_completos": len([c for c in characters if c.get('completitud', 0) > 70]),
            "fuentes_unicas": len(set().union(*[c.get('fuentes_adicionales', []) for c in characters]))
        }
    }
    
    # Crear directorio y guardar
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    return database

def main():
    print("🔍 MINERO AVANZADO CON COMPILACIÓN Y REFACTORIZACIÓN")
    print("=" * 70)
    
    characters = extract_detailed_characters()
    
    if not characters:
        print("\n❌ No se encontraron personajes para procesar")
        return
    
    print(f"\n💾 Guardando {len(characters)} personajes unificados...")
    database = save_detailed_database(characters)
    
    print(f"\n🎉 PROCESAMIENTO COMPLETADO!")
    print(f"   📊 Personajes únicos: {database['total_personajes']}")
    print(f"   📈 Completitud promedio: {database['metadata']['completitud_promedio']:.1f}%")
    print(f"   ✅ Personajes completos (>70%): {database['metadata']['personajes_completos']}")
    print(f"   📁 Fuentes procesadas: {database['metadata']['fuentes_unicas']}")
    print(f"   📋 Archivo: {OUTPUT_FILE.relative_to(ROOT)}")
    
    # Mostrar personajes por completitud
    print(f"\n👥 PERSONAJES PROCESADOS (ordenados por completitud):")
    for char in characters[:10]:  # Mostrar top 10
        completitud = char.get('completitud', 0)
        fuentes = len(char.get('fuentes_adicionales', []))
        print(f"   {char['avatar']} {char['nombre']} ({completitud}% - {fuentes} fuentes)")
    
    if len(characters) > 10:
        print(f"   ... y {len(characters) - 10} más")

if __name__ == "__main__":
    main()