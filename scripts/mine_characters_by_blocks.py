#!/usr/bin/env python3
"""
🔍 MINERO DE PERSONAJES POR BLOQUES DEL PRUNAVERSO
=================================================
Extrae personajes organizadamente por subcarpetas y bloques temáticos.
Procesa por grupos para mejor organización y debugging.
"""

import json
import re
import os
import glob
from pathlib import Path
from collections import defaultdict
import hashlib

# Configuración de rutas
ROOT = Path(__file__).parent.parent
CHARACTERS_DIR = ROOT / "data" / "characters"
OUTPUT_DIR = ROOT / "public" / "data"
OUTPUT_FILE = OUTPUT_DIR / "characters_database.json"

def scan_character_sources():
    """Escanea y organiza las fuentes de personajes por bloques"""
    blocks = {
        "personajes_principales": {
            "description": "Personajes principales del archivo unificado",
            "files": ["personajes/personajes_unif_v1.json"],
            "priority": 1
        },
        "perfiles_individuales": {
            "description": "Archivos JSON individuales de personajes",
            "files": [],
            "priority": 2
        },
        "documentos_texto": {
            "description": "Referencias en archivos TXT y MD",
            "files": [],
            "priority": 3
        },
        "saved_chats": {
            "description": "Personajes mencionados en chats guardados",
            "files": [],
            "priority": 4
        }
    }
    
    print("🔍 Escaneando fuentes de personajes...")
    
    # Buscar archivos JSON individuales
    json_files = list(CHARACTERS_DIR.glob("**/*.json"))
    for json_file in json_files:
        if "personajes_unif" not in json_file.name:
            relative_path = json_file.relative_to(CHARACTERS_DIR)
            blocks["perfiles_individuales"]["files"].append(str(relative_path))
    
    # Buscar archivos de texto
    text_files = list(CHARACTERS_DIR.glob("**/*.txt")) + list(CHARACTERS_DIR.glob("**/*.md"))
    for text_file in text_files:
        relative_path = text_file.relative_to(CHARACTERS_DIR)
        blocks["documentos_texto"]["files"].append(str(relative_path))
    
    # Buscar en saved_chats
    saved_chats_dir = ROOT / "a_stabledversions" / "saved_chats"
    if saved_chats_dir.exists():
        chat_files = list(saved_chats_dir.glob("**/*.json"))
        for chat_file in chat_files:
            relative_path = chat_file.relative_to(ROOT)
            blocks["saved_chats"]["files"].append(str(relative_path))
    
    return blocks

def process_block_personajes_principales():
    """Procesa el bloque principal de personajes_unif_v1.json"""
    print("\n🎯 BLOQUE 1: Personajes Principales")
    print("-" * 50)
    
    file_path = CHARACTERS_DIR / "personajes" / "personajes_unif_v1.json"
    
    if not file_path.exists():
        print(f"⚠️ Archivo principal no encontrado: {file_path}")
        return []
    
    characters = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dividir en secciones lógicas
    sections = split_complex_file_into_sections(content)
    
    for i, section in enumerate(sections):
        print(f"   📖 Procesando sección {i+1}/{len(sections)}...")
        
        # Extraer personajes de esta sección
        section_chars = extract_characters_from_section(section, f"principales:section_{i+1}")
        characters.extend(section_chars)
        
        for char in section_chars:
            print(f"      ✅ {char['nombre']}")
    
    print(f"   🎉 Total extraídos del bloque principal: {len(characters)}")
    return characters

def split_complex_file_into_sections(content):
    """Divide el archivo complejo en secciones manejables"""
    # Dividir por comentarios de archivo
    sections = re.split(r'// Archivo: .+?\.json', content)
    
    # Si no hay divisiones claras, dividir por objetos JSON grandes
    if len(sections) <= 1:
        sections = []
        brace_count = 0
        current_section = ""
        
        for char in content:
            current_section += char
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0 and len(current_section) > 100:
                    sections.append(current_section)
                    current_section = ""
    
    # Filtrar secciones vacías
    return [s.strip() for s in sections if s.strip()]

def extract_characters_from_section(section, source_id):
    """Extrae personajes de una sección específica"""
    characters = []
    
    # Limpiar comentarios de línea
    cleaned = re.sub(r'^\s*//.*$', '', section, flags=re.MULTILINE)
    
    # Buscar objetos JSON válidos
    json_objects = extract_json_objects_from_text(cleaned)
    
    for j, json_obj in enumerate(json_objects):
        try:
            data = json.loads(json_obj)
            if is_character_data(data):
                char = create_character_profile(data, f"{source_id}:obj_{j+1}")
                characters.append(char)
        except json.JSONDecodeError:
            continue
    
    return characters

def process_block_perfiles_individuales():
    """Procesa archivos JSON individuales de personajes"""
    print("\n🎯 BLOQUE 2: Perfiles Individuales")
    print("-" * 50)
    
    characters = []
    json_files = list(CHARACTERS_DIR.glob("**/*.json"))
    
    for json_file in json_files:
        if "personajes_unif" in json_file.name:
            continue  # Ya procesado en bloque 1
            
        print(f"   📄 Procesando: {json_file.name}")
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            file_chars = extract_characters_from_json(data, json_file.name)
            characters.extend(file_chars)
            
            for char in file_chars:
                print(f"      ✅ {char['nombre']}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    print(f"   🎉 Total extraídos de perfiles individuales: {len(characters)}")
    return characters

def process_block_documentos_texto():
    """Procesa referencias en documentos de texto"""
    print("\n🎯 BLOQUE 3: Documentos de Texto")
    print("-" * 50)
    
    characters = []
    text_files = list(CHARACTERS_DIR.glob("**/*.txt")) + list(CHARACTERS_DIR.glob("**/*.md"))
    
    for text_file in text_files:
        print(f"   📄 Procesando: {text_file.name}")
        
        try:
            with open(text_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            names = extract_names_from_text(content)
            for name in names:
                char = create_character_from_name(name, text_file.name, content)
                characters.append(char)
                print(f"      ✅ {name}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    print(f"   🎉 Total extraídos de documentos: {len(characters)}")
    return characters

def process_block_saved_chats():
    """Procesa personajes mencionados en chats guardados"""
    print("\n🎯 BLOQUE 4: Saved Chats")
    print("-" * 50)
    
    characters = []
    saved_chats_dir = ROOT / "a_stabledversions" / "saved_chats"
    
    if not saved_chats_dir.exists():
        print("   ⚠️ Directorio de saved_chats no encontrado")
        return characters
    
    chat_files = list(saved_chats_dir.glob("**/*.json"))
    
    for chat_file in chat_files[:5]:  # Limitar a 5 archivos para no sobrecargar
        print(f"   💬 Procesando chat: {chat_file.name}")
        
        try:
            with open(chat_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            chat_chars = extract_characters_from_chat(data, chat_file.name)
            characters.extend(chat_chars)
            
            for char in chat_chars:
                print(f"      ✅ {char['nombre']}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    print(f"   🎉 Total extraídos de chats: {len(characters)}")
    return characters

def extract_json_objects_from_text(text):
    """Extrae objetos JSON válidos de texto"""
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
                if '"' in potential_json and ':' in potential_json:
                    objects.append(potential_json)
                start_pos = None
    
    return objects

def is_character_data(data):
    """Determina si un objeto representa datos de personaje"""
    if not isinstance(data, dict):
        return False
    
    character_indicators = [
        'nombre', 'name', 'alias', 'perfil_cognitivo', 
        'atributos', 'edad', 'ideologia', 'rol', 'personalidad'
    ]
    
    return any(indicator in data for indicator in character_indicators)

def extract_characters_from_json(data, filename):
    """Extrae personajes de datos JSON"""
    characters = []
    
    if isinstance(data, dict):
        if is_character_data(data):
            characters.append(create_character_profile(data, filename))
        else:
            # Buscar en valores anidados
            for key, value in data.items():
                if isinstance(value, dict) and is_character_data(value):
                    characters.append(create_character_profile(value, f"{filename}:{key}"))
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, dict) and is_character_data(item):
                            characters.append(create_character_profile(item, filename))
    
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and is_character_data(item):
                characters.append(create_character_profile(item, filename))
    
    return characters

def extract_characters_from_chat(data, filename):
    """Extrae personajes mencionados en chats"""
    characters = []
    
    # Buscar en el contenido del chat
    chat_content = str(data)
    names = extract_names_from_text(chat_content)
    
    for name in names[:3]:  # Limitar a 3 por chat
        char = create_character_from_name(name, f"chat:{filename}", chat_content)
        characters.append(char)
    
    return characters

def extract_names_from_text(text):
    """Extrae nombres de personas de un texto"""
    import re
    
    patterns = [
        r'\b([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b',
        r'nombre[:\s]+([^\n\r\.,;]+)',
        r'alias[:\s]+([^\n\r\.,;]+)'
    ]
    
    names = set()
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            name = match.strip()
            if 4 < len(name) < 50 and not any(exclude in name.lower() for exclude in ['json', 'file', 'error', 'data']):
                names.add(name)
    
    return list(names)[:10]  # Limitar a 10 nombres por archivo

def create_character_profile(char_data, source):
    """Crea un perfil completo de personaje"""
    name = char_data.get('nombre', char_data.get('name', 'Unknown'))
    char_id = hashlib.md5(f"{name}_{source}".encode()).hexdigest()[:8]
    
    # Extraer atributos cognitivos
    atributos = char_data.get('atributos', {})
    if isinstance(atributos, list) and atributos:
        atributos = atributos[0]
    
    return {
        "id": char_id,
        "nombre": name,
        "edad": char_data.get('edad', None),
        "idioma": char_data.get('idioma', 'español'),
        "fuente": source,
        "cognitive_metrics": normalize_attributes(atributos),
        "perfil_cognitivo": {
            "neurodivergencia": char_data.get('perfil_cognitivo', {}).get('neurodivergencia', 'no especificada'),
            "caracteristicas": char_data.get('perfil_cognitivo', {}).get('caracteristicas', []),
            "lentes_dominantes": determine_cognitive_lenses(char_data)
        },
        "contexto": {
            "rol": char_data.get('rol', ''),
            "ideologia": char_data.get('ideologia', ''),
            "descripcion": char_data.get('descripcion', char_data.get('personalidad', ''))
        },
        "avatar": generate_avatar(name),
        "procesado": "2025-01-07"
    }

def create_character_from_name(name, source, context):
    """Crea un personaje básico solo con el nombre"""
    char_id = hashlib.md5(f"{name}_{source}".encode()).hexdigest()[:8]
    
    return {
        "id": char_id,
        "nombre": name,
        "fuente": source,
        "cognitive_metrics": generate_default_metrics(),
        "perfil_cognitivo": {
            "neurodivergencia": "no especificada",
            "caracteristicas": [],
            "lentes_dominantes": determine_cognitive_lenses_from_name(name)
        },
        "contexto": {"descripcion": f"Mencionado en {source}"},
        "avatar": generate_avatar(name),
        "procesado": "2025-01-07"
    }

def determine_cognitive_lenses(char_data):
    """Determina lentes cognitivas basándose en el perfil"""
    try:
        text_content = str(char_data).lower()
        
        lens_patterns = {
            'ai': ['ia', 'artificial', 'tecnolog', 'algoritm'],
            'philosophy': ['filosof', 'existencial', 'ontolog'],
            'linguistics': ['lenguaj', 'linguistic', 'semantica'],
            'biology': ['biolog', 'evolutiv', 'genetic'],
            'psychology': ['psicolog', 'cognitiv', 'mental'],
            'art': ['arte', 'creativ', 'estetica'],
            'science': ['ciencia', 'scientific', 'investigacion'],
            'social': ['social', 'sociolog', 'comunidad']
        }
        
        lentes = []
        for lens, patterns in lens_patterns.items():
            if any(pattern in text_content for pattern in patterns):
                lentes.append(lens)
        
        if not lentes:
            name = char_data.get('nombre', '') if isinstance(char_data, dict) else str(char_data)
            lentes = determine_cognitive_lenses_from_name(name)
        
        return lentes[:3]
    except Exception:
        return ['psychology']

def determine_cognitive_lenses_from_name(name):
    """Determina lentes basándose en el nombre"""
    name_lower = name.lower()
    
    if 'alex' in name_lower or 'pruna' in name_lower:
        return ['ai', 'philosophy', 'linguistics']
    elif 'xavier' in name_lower or 'roura' in name_lower:
        return ['science', 'art']
    elif 'ana' in name_lower:
        return ['psychology', 'social']
    else:
        return ['psychology']

def normalize_attributes(attrs):
    """Normaliza atributos cognitivos"""
    try:
        if not attrs or not isinstance(attrs, dict):
            return generate_default_metrics()
        
        normalized = {}
        standard_fields = ['V', 'EX_x', 'EX_y', 'EY_x', 'EY_y', 'N_p', 'M', 'R', 'D', 'Di']
        
        for field in standard_fields:
            if field in attrs:
                value = attrs[field]
                if isinstance(value, str):
                    import re
                    numbers = re.findall(r'\d+\.?\d*', value)
                    normalized[field] = float(numbers[0]) if numbers else 5.0
                elif isinstance(value, (int, float)):
                    normalized[field] = float(value)
                else:
                    normalized[field] = 5.0
            else:
                normalized[field] = 5.0
        
        return normalized
    except Exception:
        return generate_default_metrics()

def generate_default_metrics():
    """Genera métricas por defecto"""
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
    
    avatars = {
        'alex': '🧬', 'pruna': '🧬',
        'xavier': '🔧', 'roura': '🔧',
        'ana': '🌟', 'joaquim': '📚',
        'cristobal': '🎨', 'cristóbal': '🎨',
        'dani': '⚡', 'daniel': '⚡',
        'david': '🚀', 'sergi': '🔍'
    }
    
    for key, avatar in avatars.items():
        if key in name_lower:
            return avatar
    
    return '👤'

def save_block_database(all_characters):
    """Guarda la base de datos final de todos los bloques"""
    # Eliminar duplicados por nombre
    unique_characters = {}
    for char in all_characters:
        name_key = char["nombre"].lower().strip()
        if name_key not in unique_characters:
            unique_characters[name_key] = char
        else:
            # Mantener el más completo (con más información)
            if len(str(char)) > len(str(unique_characters[name_key])):
                unique_characters[name_key] = char
    
    final_characters = list(unique_characters.values())
    
    # Estadísticas
    stats = {
        "lentes_mas_comunes": get_lens_stats(final_characters),
        "neurodivergencias": get_neuro_stats(final_characters),
        "fuentes": get_source_stats(final_characters)
    }
    
    database = {
        "version": "1.3",
        "generado": "2025-01-07",
        "total_personajes": len(final_characters),
        "personajes": final_characters,
        "estadisticas": stats
    }
    
    # Crear directorio y guardar
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    return database

def get_lens_stats(characters):
    """Estadísticas de lentes"""
    lens_count = defaultdict(int)
    for char in characters:
        for lens in char.get("perfil_cognitivo", {}).get("lentes_dominantes", []):
            lens_count[lens] += 1
    return dict(sorted(lens_count.items(), key=lambda x: x[1], reverse=True))

def get_neuro_stats(characters):
    """Estadísticas de neurodivergencias"""
    neuro_count = defaultdict(int)
    for char in characters:
        neuro = char.get("perfil_cognitivo", {}).get("neurodivergencia", "no especificada")
        neuro_count[neuro] += 1
    return dict(neuro_count)

def get_source_stats(characters):
    """Estadísticas de fuentes"""
    source_count = defaultdict(int)
    for char in characters:
        source = char.get("fuente", "desconocida")
        source_count[source] += 1
    return dict(source_count)

def main():
    print("🔍 MINERO DE PERSONAJES POR BLOQUES - PRUNAVERSO")
    print("=" * 60)
    
    # Escanear fuentes disponibles
    blocks = scan_character_sources()
    
    print(f"\n📊 Fuentes encontradas:")
    for block_name, block_info in blocks.items():
        print(f"   {block_name}: {len(block_info['files'])} archivos")
    
    all_characters = []
    
    # Procesar cada bloque
    try:
        # Bloque 1: Personajes principales
        chars_1 = process_block_personajes_principales()
        all_characters.extend(chars_1)
        
        # Bloque 2: Perfiles individuales
        chars_2 = process_block_perfiles_individuales()
        all_characters.extend(chars_2)
        
        # Bloque 3: Documentos de texto
        chars_3 = process_block_documentos_texto()
        all_characters.extend(chars_3)
        
        # Bloque 4: Saved chats (opcional)
        chars_4 = process_block_saved_chats()
        all_characters.extend(chars_4)
        
    except Exception as e:
        print(f"\n⚠️ Error en procesamiento: {e}")
        print("Continuando con los personajes ya extraídos...")
    
    if not all_characters:
        print("\n❌ No se encontraron personajes para procesar")
        return
    
    # Guardar base de datos final
    print(f"\n🎯 Generando base de datos final...")
    database = save_block_database(all_characters)
    
    # Mostrar resumen final
    print(f"\n🎉 MINADO COMPLETADO POR BLOQUES!")
    print(f"   📊 Total de personajes únicos: {database['total_personajes']}")
    print(f"   📁 Archivo generado: {OUTPUT_FILE.relative_to(ROOT)}")
    print(f"   🔍 Lentes más comunes: {list(database['estadisticas']['lentes_mas_comunes'].keys())[:5]}")
    print(f"\n🚀 Base de datos lista para el selector de personajes!")

if __name__ == "__main__":
    main()