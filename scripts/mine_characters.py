# scripts/mine_characters.py
# Extrae y procesa todos los personajes cognitivos del Prunaverso
# Crea una base de datos unificada para el selector de réplicas

import json
import re
from pathlib import Path
from collections import defaultdict
import hashlib

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
PUBLIC_DATA = ROOT / "public" / "data"
CHARACTERS_DIR = DATA_DIR / "characters"

OUTPUT_FILE = PUBLIC_DATA / "characters_database.json"

def extract_character_data():
    """Extrae datos de personajes de todos los archivos JSON"""
    characters = []
    
    # 1. Buscar en data/characters/personajes/
    personajes_dir = CHARACTERS_DIR / "personajes"
    if personajes_dir.exists():
        for json_file in personajes_dir.glob("*.json"):
            print(f"📖 Procesando: {json_file.name}")
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Limpiar comentarios // para que sea JSON válido
                    content = re.sub(r'^\s*//.*$', '', content, flags=re.MULTILINE)
                    data = json.loads(content)
                    characters.extend(parse_personajes_file(data, json_file.name))
            except Exception as e:
                print(f"⚠️ Error procesando {json_file}: {e}")
    
    # 2. Buscar Alex Pruna profiles
    alex_files = list(PUBLIC_DATA.glob("alex_pruna*.json"))
    for alex_file in alex_files:
        print(f"📖 Procesando Alex: {alex_file.name}")
        try:
            with open(alex_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                characters.append(parse_alex_profile(data, alex_file.name))
        except Exception as e:
            print(f"⚠️ Error procesando {alex_file}: {e}")
    
    # 3. Buscar otros perfiles en src/data/
    src_data = ROOT / "src" / "data"
    if src_data.exists():
        for json_file in src_data.glob("*.json"):
            print(f"📖 Procesando src: {json_file.name}")
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if 'nombre' in data or 'name' in data:
                        characters.append(parse_generic_profile(data, json_file.name))
            except Exception as e:
                print(f"⚠️ Error procesando {json_file}: {e}")
    
    return characters

def parse_personajes_file(data, filename):
    """Parsea el archivo personajes_unif_v1.json complejo"""
    characters = []
    
    # Si es un archivo de personajes_unif, usar parser avanzado
    if 'personajes_unif' in filename:
        return parse_complex_personajes_file(filename)
    
    # Buscar estructuras de personajes
    if isinstance(data, dict):
        # Caso 1: Personaje individual
        if 'nombre' in data:
            characters.append(extract_character_info(data, filename))
        
        # Caso 2: Múltiples personajes en el archivo
        for key, value in data.items():
            if isinstance(value, dict) and 'nombre' in value:
                characters.append(extract_character_info(value, f"{filename}:{key}"))
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict) and 'nombre' in item:
                        characters.append(extract_character_info(item, filename))
    
    elif isinstance(data, list):
        # Lista de personajes
        for item in data:
            if isinstance(item, dict) and 'nombre' in item:
                characters.append(extract_character_info(item, filename))
    
    return characters

def parse_complex_personajes_file(filename):
    """Parser especializado para archivos complejos con múltiples JSONs"""
    from pathlib import Path
    import re
    
    file_path = Path(__file__).parent.parent / "data" / "characters" / "personajes" / filename
    
    if not file_path.exists():
        print(f"⚠️ Archivo no encontrado: {file_path}")
        return []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dividir por comentarios que indican nuevos archivos o secciones
    sections = re.split(r'// Archivo: .+?\.json|// -+', content)
    
    characters = []
    
    for section in sections:
        if not section.strip():
            continue
            
        # Limpiar comentarios de línea
        cleaned = re.sub(r'^\s*//.*$', '', section, flags=re.MULTILINE)
        
        # Buscar objetos JSON válidos
        json_objects = extract_json_objects_advanced(cleaned)
        
        for json_obj in json_objects:
            try:
                data = json.loads(json_obj)
                if is_character_data(data):
                    characters.append(extract_character_info(data, filename))
            except json.JSONDecodeError as e:
                continue
    
    print(f"📖 Extraídos {len(characters)} personajes de {filename}")
    return characters

def extract_json_objects_advanced(text):
    """Extrae objetos JSON válidos de un texto"""
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
        'atributos', 'edad', 'ideologia', 'rol'
    ]
    
    return any(indicator in data for indicator in character_indicators)

def extract_character_info(char_data, source):
    """Extrae información cognitiva de un personaje"""
    # Generar ID único
    name = char_data.get('nombre', 'Unknown')
    char_id = hashlib.md5(f"{name}_{source}".encode()).hexdigest()[:8]
    
    # Extraer atributos cognitivos
    atributos = char_data.get('atributos', {})
    if isinstance(atributos, list) and atributos:
        # Tomar el primer conjunto de atributos como base
        atributos = atributos[0] if atributos else {}
    
    # Extraer perfil cognitivo
    perfil_cognitivo = char_data.get('perfil_cognitivo', {})
    
    # Determinar lentes cognitivas dominantes basándose en el perfil
    lentes = determine_cognitive_lenses(char_data)
    
    character = {
        "id": char_id,
        "nombre": name,
        "edad": char_data.get('edad', None),
        "idioma": char_data.get('idioma', 'español'),
        "fuente": source,
        
        # Métricas cognitivas (sistema V, EX, EY, etc.)
        "metricas_cognitivas": normalize_attributes(atributos),
        
        # Perfil psicológico
        "perfil_cognitivo": {
            "neurodivergencia": perfil_cognitivo.get('neurodivergencia', 'no especificada'),
            "caracteristicas": perfil_cognitivo.get('caracteristicas', []),
            "lentes_dominantes": lentes
        },
        
        # Contexto y relaciones
        "contexto": {
            "rol": char_data.get('rol', ''),
            "ideologia": char_data.get('ideologia', ''),
            "descripcion": char_data.get('descripcion', char_data.get('construccion_simbologica', ''))
        },
        
        # Uso de IA/LLM
        "uso_llm": char_data.get('uso_de_chatgpt', char_data.get('uso_llm', {})),
        
        # Estado actual
        "estado": char_data.get('estado_actual', {}),
        
        # Avatar/representación
        "avatar": char_data.get('avatar', generate_avatar_emoji(char_data)),
        
        # Timestamp
        "procesado": "2025-10-07"
    }
    
    return character

def parse_alex_profile(data, filename):
    """Parsea perfiles específicos de Alex Pruna"""
    return {
        "id": "alex_pruna",
        "nombre": data.get('nombre', 'Alejandro Pruna'),
        "edad": data.get('edad', 28),
        "idioma": "español/catalán",
        "fuente": filename,
        "tipo": "perfil_base",
        
        "metricas_cognitivas": normalize_attributes(data.get('atributos', {})),
        
        "perfil_cognitivo": {
            "neurodivergencia": "autismo nivel 1 + TDAH",
            "caracteristicas": [
                "pensamiento fractal",
                "creatividad divergente overpower", 
                "navegación entre capas N0-N2",
                "worldbuilding simbólico"
            ],
            "lentes_dominantes": ["ai", "philosophy", "linguistics"]
        },
        
        "contexto": {
            "rol": "creador del Prunaverso",
            "descripcion": data.get('construccion_simbologica', ''),
            "consciencia_origen": data.get('consciencia_de_origen', True)
        },
        
        "avatar": "🧬",
        "procesado": "2025-10-07"
    }

def parse_generic_profile(data, filename):
    """Parsea perfiles genéricos"""
    name = data.get('nombre', data.get('name', 'Unknown'))
    char_id = hashlib.md5(f"{name}_{filename}".encode()).hexdigest()[:8]
    
    return {
        "id": char_id,
        "nombre": name,
        "fuente": filename,
        "contexto": {"descripcion": str(data)[:200] + "..."},
        "avatar": "👤",
        "procesado": "2025-10-07"
    }

def normalize_attributes(attrs):
    """Normaliza los atributos cognitivos al formato estándar"""
    if not attrs:
        return {}
    
    # Convertir strings con descripciones a números donde sea posible
    normalized = {}
    for key, value in attrs.items():
        if isinstance(value, str):
            # Extraer número del string (ej: "6.5-7" -> 6.75)
            numbers = re.findall(r'\d+\.?\d*', value)
            if numbers:
                try:
                    normalized[key] = float(numbers[0])
                except:
                    normalized[key] = value
            else:
                normalized[key] = value
        else:
            normalized[key] = value
    
    return normalized

def determine_cognitive_lenses(char_data):
    """Determina lentes cognitivas basándose en características del personaje"""
    lenses = []
    
    # Análisis basado en características
    caracteristicas = str(char_data).lower()
    
    if any(word in caracteristicas for word in ['ia', 'tecnologia', 'scripting', 'logica']):
        lenses.append('ai')
    if any(word in caracteristicas for word in ['emocional', 'terapia', 'psicologia']):
        lenses.append('psychology')
    if any(word in caracteristicas for word in ['narrativa', 'comunicacion', 'linguistica']):
        lenses.append('linguistics')
    if any(word in caracteristicas for word in ['filosofia', 'etica', 'sentido']):
        lenses.append('philosophy')
    if any(word in caracteristicas for word in ['neuronal', 'cerebro', 'cognitivo']):
        lenses.append('neuroscience')
    if any(word in caracteristicas for word in ['cultural', 'social', 'antropologia']):
        lenses.append('anthropology')
    
    # Default si no se detecta nada específico
    if not lenses:
        lenses = ['ai', 'linguistics']
    
    return lenses[:3]  # Máximo 3 lentes

def generate_avatar_emoji(char_data):
    """Genera emoji de avatar basándose en características"""
    name = char_data.get('nombre', '').lower()
    
    if 'alex' in name or 'alejandro' in name:
        return '🧬'
    elif 'xavi' in name or 'xavier' in name:
        return '⚡'
    elif 'ana' in name:
        return '🌟'
    elif 'roura' in name:
        return '🔧'
    else:
        return '👤'

def save_characters_database(characters):
    """Guarda la base de datos de personajes"""
    # Crear estructura final
    database = {
        "version": "1.0",
        "generado": "2025-10-07",
        "total_personajes": len(characters),
        "fuentes_procesadas": list(set([char["fuente"] for char in characters])),
        "personajes": characters,
        
        # Estadísticas
        "estadisticas": {
            "lentes_mas_comunes": get_most_common_lenses(characters),
            "neurodivergencias": get_neurodivergence_stats(characters),
            "idiomas": get_language_stats(characters)
        }
    }
    
    # Asegurar que el directorio existe
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Guardar
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Base de datos guardada: {OUTPUT_FILE}")
    print(f"📊 {len(characters)} personajes procesados")
    return database

def get_most_common_lenses(characters):
    """Obtiene estadísticas de lentes más comunes"""
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
    print("🔍 Iniciando minado de personajes del Prunaverso...")
    
    characters = extract_character_data()
    
    if not characters:
        print("⚠️ No se encontraron personajes para procesar")
        return
    
    database = save_characters_database(characters)
    
    print("\n📈 Estadísticas:")
    print(f"   Lentes más comunes: {database['estadisticas']['lentes_mas_comunes']}")
    print(f"   Neurodivergencias: {database['estadisticas']['neurodivergencias']}")
    print(f"   Idiomas: {database['estadisticas']['idiomas']}")
    
    print(f"\n🎉 ¡Minado completado! Base de datos en: {OUTPUT_FILE.relative_to(ROOT)}")

if __name__ == "__main__":
    main()