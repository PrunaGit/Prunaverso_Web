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

def extract_detailed_characters():
    """Extrae personajes con información detallada completa"""
    print("🔍 EXTRACCIÓN DETALLADA DE PERSONAJES")
    print("=" * 60)
    
    characters = {}  # Usar dict para facilitar unificación
    
    # 1. Procesar perfiles individuales JSON con información completa
    print("\n📄 Procesando perfiles individuales...")
    profile_files = list(CHARACTERS_DIR.glob("**/*profile*.json"))
    
    for profile_file in profile_files:
        print(f"   � {profile_file.name}")
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

def extract_json_objects_from_text(text):
    """Extrae objetos JSON válidos de un texto con múltiples objetos"""
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
                potential_json = text[start_pos:i+1]
                # Validar que parece JSON válido
                if '"' in potential_json and ':' in potential_json:
                    objects.append(potential_json)
                start_pos = None
    
    return objects

def is_character_data(data):
    """Determina si un objeto JSON representa datos de personaje"""
    if not isinstance(data, dict):
        return False
    
    # Buscar campos que indican que es un personaje
    character_indicators = [
        'nombre', 'name', 'alias', 'perfil_cognitivo', 
        'atributos', 'edad', 'ideologia', 'rol', 'personalidad'
    ]
    
    return any(indicator in data for indicator in character_indicators)

def extract_character_info(char_data, source):
    """Extrae información cognitiva de un personaje"""
    # Generar ID único
    name = char_data.get('nombre', char_data.get('name', 'Unknown'))
    char_id = hashlib.md5(f"{name}_{source}".encode()).hexdigest()[:8]
    
    # Extraer atributos cognitivos
    atributos = char_data.get('atributos', {})
    if isinstance(atributos, list) and atributos:
        atributos = atributos[0] if atributos else {}
    
    # Extraer perfil cognitivo
    perfil_cognitivo = char_data.get('perfil_cognitivo', {})
    
    # Determinar lentes cognitivas dominantes
    lentes = determine_cognitive_lenses(char_data)
    
    # Generar métricas cognitivas
    cognitive_metrics = normalize_attributes(atributos)
    if not cognitive_metrics:
        cognitive_metrics = generate_default_metrics()
    
    character = {
        "id": char_id,
        "nombre": name,
        "edad": char_data.get('edad', None),
        "idioma": char_data.get('idioma', 'español'),
        "fuente": source,
        
        # Métricas cognitivas (sistema V, EX, EY, etc.)
        "cognitive_metrics": cognitive_metrics,
        
        # Perfil psicológico
        "perfil_cognitivo": {
            "neurodivergencia": perfil_cognitivo.get('neurodivergencia', 'no especificada'),
            "caracteristicas": perfil_cognitivo.get('caracteristicas', []),
            "lentes_dominantes": lentes
        },
        
        # Contexto adicional
        "contexto": {
            "rol": char_data.get('rol', ''),
            "ideologia": char_data.get('ideologia', ''),
            "descripcion": char_data.get('descripcion', char_data.get('personalidad', ''))
        },
        
        "avatar": generate_avatar(name),
        "procesado": "2025-01-07"
    }
    
    return character

def determine_cognitive_lenses(char_data):
    """Determina lentes cognitivas dominantes basándose en el perfil"""
    lentes = []
    
    # Análisis del contenido del personaje
    text_content = str(char_data).lower()
    
    # Mapeo de patrones a lentes
    lens_patterns = {
        'ai': ['ia', 'artificial', 'tecnolog', 'algoritm', 'neural', 'machine'],
        'philosophy': ['filosof', 'existencial', 'ontolog', 'epistemolog', 'etic'],
        'linguistics': ['lenguaj', 'linguistic', 'semantica', 'pragmatic', 'discurs'],
        'biology': ['biolog', 'evolutiv', 'genetic', 'organismo', 'vida'],
        'psychology': ['psicolog', 'cognitiv', 'mental', 'emocional', 'comportamiento'],
        'art': ['arte', 'creativ', 'estetica', 'artistic', 'expresion'],
        'science': ['ciencia', 'scientific', 'investigacion', 'empiric', 'experiment'],
        'social': ['social', 'sociolog', 'comunidad', 'grupo', 'interact']
    }
    
    # Detectar lentes basándose en el contenido
    for lens, patterns in lens_patterns.items():
        if any(pattern in text_content for pattern in patterns):
            lentes.append(lens)
    
    # Si no se detectaron lentes, asignar por defecto según el nombre
    if not lentes:
        name = char_data.get('nombre', '').lower()
        if 'alex' in name or 'pruna' in name:
            lentes = ['ai', 'philosophy', 'linguistics']
        elif 'xavier' in name or 'roura' in name:
            lentes = ['science', 'art']
        else:
            lentes = ['psychology']
    
    return lentes[:3]  # Máximo 3 lentes

def normalize_attributes(attrs):
    """Normaliza los atributos cognitivos al formato estándar"""
    if not attrs:
        return generate_default_metrics()
    
    normalized = {}
    
    # Mapeo de campos conocidos
    field_mapping = {
        'V': 'V',
        'EX_x': 'EX_x', 'EX_y': 'EX_y',
        'EY_x': 'EY_x', 'EY_y': 'EY_y',
        'N_p': 'N_p', 'M': 'M', 'R': 'R', 'D': 'D', 'Di': 'Di'
    }
    
    for original_key, standard_key in field_mapping.items():
        if original_key in attrs:
            value = attrs[original_key]
            if isinstance(value, str):
                # Extraer número del string
                import re
                numbers = re.findall(r'\d+\.?\d*', value)
                if numbers:
                    normalized[standard_key] = float(numbers[0])
                else:
                    normalized[standard_key] = 5.0  # Valor por defecto
            elif isinstance(value, (int, float)):
                normalized[standard_key] = float(value)
    
    # Completar métricas faltantes
    default_metrics = generate_default_metrics()
    for key, default_value in default_metrics.items():
        if key not in normalized:
            normalized[key] = default_value
    
    return normalized

def generate_default_metrics():
    """Genera métricas cognitivas por defecto"""
    import random
    
    return {
        "V": round(random.uniform(4.0, 8.0), 1),
        "EX_x": round(random.uniform(3.0, 9.0), 1),
        "EX_y": round(random.uniform(3.0, 9.0), 1),
        "EY_x": round(random.uniform(2.0, 8.0), 1),
        "EY_y": round(random.uniform(2.0, 8.0), 1),
        "N_p": round(random.uniform(1.0, 7.0), 1),
        "M": round(random.uniform(3.0, 9.0), 1),
        "R": round(random.uniform(2.0, 8.0), 1),
        "D": round(random.uniform(1.0, 6.0), 1),
        "Di": round(random.uniform(2.0, 7.0), 1)
    }

def generate_avatar(name):
    """Genera avatar basándose en el nombre"""
    name_lower = name.lower()
    
    if 'alex' in name_lower or 'pruna' in name_lower:
        return '🧬'
    elif 'xavier' in name_lower or 'roura' in name_lower:
        return '🔧'
    elif 'ana' in name_lower:
        return '🌟'
    elif 'joaquim' in name_lower:
        return '📚'
    elif 'cristobal' in name_lower or 'cristóbal' in name_lower:
        return '🎨'
    elif 'dani' in name_lower or 'daniel' in name_lower:
        return '⚡'
    elif 'david' in name_lower:
        return '🚀'
    elif 'sergi' in name_lower:
        return '🔍'
    else:
        return '👤'

def extract_additional_sources():
    """Extrae personajes de fuentes adicionales"""
    characters = []
    
    # Buscar en archivos TXT
    txt_files = list(CHARACTERS_DIR.rglob("*.txt"))
    for txt_file in txt_files:
        print(f"📄 Procesando TXT: {txt_file.name}")
        try:
            with open(txt_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Buscar nombres mencionados
            names = extract_names_from_text(content)
            for name in names:
                characters.append({
                    "id": hashlib.md5(f"{name}_{txt_file.name}".encode()).hexdigest()[:8],
                    "nombre": name,
                    "fuente": txt_file.name,
                    "cognitive_metrics": generate_default_metrics(),
                    "perfil_cognitivo": {
                        "neurodivergencia": "no especificada",
                        "caracteristicas": [],
                        "lentes_dominantes": ["psychology"]
                    },
                    "contexto": {"descripcion": f"Mencionado en {txt_file.name}"},
                    "avatar": generate_avatar(name),
                    "procesado": "2025-01-07"
                })
                print(f"   ✅ Extraído de TXT: {name}")
        except Exception as e:
            print(f"   ❌ Error procesando {txt_file}: {e}")
    
    return characters

def extract_names_from_text(text):
    """Extrae nombres de personas de un texto"""
    import re
    
    # Patrones para encontrar nombres
    patterns = [
        r'\b([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b',  # Nombres propios
        r'nombre[:\s]+([^\n\r\.,;]+)',
        r'alias[:\s]+([^\n\r\.,;]+)'
    ]
    
    names = set()
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            name = match.strip()
            if len(name) > 4 and len(name) < 50:  # Filtrar nombres válidos
                names.add(name)
    
    return list(names)

def save_characters_database(characters):
    """Guarda la base de datos completa de personajes"""
    # Eliminar duplicados por nombre
    unique_characters = {}
    for char in characters:
        name = char["nombre"].lower()
        if name not in unique_characters:
            unique_characters[name] = char
        else:
            # Mantener el más completo
            if len(str(char)) > len(str(unique_characters[name])):
                unique_characters[name] = char
    
    final_characters = list(unique_characters.values())
    
    # Crear estructura final
    database = {
        "version": "1.2",
        "generado": "2025-01-07",
        "total_personajes": len(final_characters),
        "fuentes_procesadas": list(set([char["fuente"] for char in final_characters])),
        "personajes": final_characters,
        
        # Estadísticas
        "estadisticas": {
            "lentes_mas_comunes": get_most_common_lenses(final_characters),
            "neurodivergencias": get_neurodivergence_stats(final_characters),
            "idiomas": get_language_stats(final_characters)
        }
    }
    
    # Crear directorio si no existe
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Guardar archivo
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Base de datos guardada: {OUTPUT_FILE}")
    print(f"📊 Total de personajes únicos: {len(final_characters)}")
    
    return database

def get_most_common_lenses(characters):
    """Estadísticas de lentes cognitivas"""
    lens_count = defaultdict(int)
    for char in characters:
        for lens in char.get("perfil_cognitivo", {}).get("lentes_dominantes", []):
            lens_count[lens] += 1
    return dict(sorted(lens_count.items(), key=lambda x: x[1], reverse=True))

def get_neurodivergence_stats(characters):
    """Estadísticas de neurodivergencias"""
    neuro_count = defaultdict(int)
    for char in characters:
        neuro = char.get("perfil_cognitivo", {}).get("neurodivergencia", "no especificada")
        neuro_count[neuro] += 1
    return dict(neuro_count)

def get_language_stats(characters):
    """Estadísticas de idiomas"""
    lang_count = defaultdict(int)
    for char in characters:
        lang = char.get("idioma", "no especificado")
        lang_count[lang] += 1
    return dict(lang_count)

def main():
    print("🔍 INICIANDO MINADO COMPLETO DE PERSONAJES DEL PRUNAVERSO")
    print("=" * 60)
    
    all_characters = []
    
    # 1. Extraer del archivo complejo principal
    print("\n🎯 Fase 1: Extrayendo del archivo personajes_unif_v1.json...")
    complex_chars = parse_complex_personajes_file()
    all_characters.extend(complex_chars)
    print(f"   ✅ {len(complex_chars)} personajes extraídos del archivo complejo")
    
    # 2. Extraer de fuentes adicionales
    print("\n🎯 Fase 2: Extrayendo de fuentes adicionales...")
    additional_chars = extract_additional_sources()
    all_characters.extend(additional_chars)
    print(f"   ✅ {len(additional_chars)} personajes extraídos de fuentes adicionales")
    
    if not all_characters:
        print("⚠️ No se encontraron personajes para procesar")
        return
    
    # 3. Guardar base de datos
    print("\n🎯 Fase 3: Generando base de datos final...")
    database = save_characters_database(all_characters)
    
    # 4. Mostrar estadísticas
    print("\n📈 ESTADÍSTICAS FINALES:")
    print(f"   📊 Total de personajes: {database['total_personajes']}")
    print(f"   📁 Fuentes procesadas: {len(database['fuentes_procesadas'])}")
    print(f"   🔍 Lentes más comunes: {database['estadisticas']['lentes_mas_comunes']}")
    print(f"   🧠 Neurodivergencias: {database['estadisticas']['neurodivergencias']}")
    print(f"   🌍 Idiomas: {database['estadisticas']['idiomas']}")
    
    print(f"\n🎉 ¡MINADO COMPLETADO! Base de datos disponible en:")
    print(f"    {OUTPUT_FILE.relative_to(ROOT)}")
    print("\n🚀 Ahora puedes usar el selector de personajes en la interfaz web!")

if __name__ == "__main__":
    main()