#!/usr/bin/env python3
"""
🔍 MINERO SIMPLIFICADO DE PERSONAJES DEL PRUNAVERSO
===================================================
Extrae personajes de forma segura por bloques
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

def extract_simple_characters():
    """Extrae personajes de forma simple y segura"""
    print("🔍 EXTRACCIÓN SIMPLE DE PERSONAJES")
    print("=" * 50)
    
    characters = []
    
    # 1. Procesar archivo principal
    main_file = CHARACTERS_DIR / "personajes" / "personajes_unif_v1.json"
    if main_file.exists():
        print("📄 Procesando archivo principal...")
        chars = extract_from_main_file(main_file)
        characters.extend(chars)
        print(f"   ✅ {len(chars)} personajes extraídos")
    
    # 2. Procesar otros JSON
    print("\n📄 Procesando archivos JSON adicionales...")
    json_files = list(CHARACTERS_DIR.glob("**/*.json"))
    
    for json_file in json_files[:10]:  # Limitar a 10 archivos
        if "personajes_unif" in json_file.name:
            continue
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            chars = extract_from_json_safe(data, json_file.name)
            characters.extend(chars)
            print(f"   ✅ {json_file.name}: {len(chars)} personajes")
            
        except Exception as e:
            print(f"   ⚠️ {json_file.name}: Error - {str(e)[:50]}")
    
    return characters

def extract_from_main_file(file_path):
    """Extrae personajes del archivo principal de forma segura"""
    characters = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Buscar nombres conocidos con patrones simples
        known_names = [
            "Xavier Roura", "Xavi Roura", "Alex Pruna", "Alejandro Pruna",
            "Ana Valera", "Joaquim Pruna", "Ana Ruiz", "Ana Maria",
            "Cristóbal", "Dani González", "David Moreno", "Sergi Torrent"
        ]
        
        for name in known_names:
            if name in content:
                char = create_simple_character(name, "personajes_unif_v1.json")
                characters.append(char)
                print(f"      ✅ {name}")
        
        # También buscar por patrones de JSON
        json_objects = extract_json_objects_simple(content)
        for obj in json_objects[:10]:  # Limitar
            try:
                data = json.loads(obj)
                if isinstance(data, dict) and 'nombre' in data:
                    name = data['nombre']
                    if isinstance(name, str) and len(name) > 2:
                        char = create_character_from_json(data, "personajes_unif_v1.json")
                        characters.append(char)
                        print(f"      ✅ {name}")
            except:
                continue
    
    except Exception as e:
        print(f"   ❌ Error procesando archivo principal: {e}")
    
    return characters

def extract_json_objects_simple(text):
    """Extrae objetos JSON de forma simple"""
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
                if len(obj) > 20 and '"nombre"' in obj:
                    objects.append(obj)
                start_pos = None
    
    return objects

def extract_from_json_safe(data, filename):
    """Extrae personajes de JSON de forma segura"""
    characters = []
    
    try:
        if isinstance(data, dict):
            # Buscar campo 'nombre' directamente
            if 'nombre' in data:
                char = create_character_from_json(data, filename)
                characters.append(char)
            else:
                # Buscar en valores anidados
                for key, value in data.items():
                    if isinstance(value, dict) and 'nombre' in value:
                        char = create_character_from_json(value, f"{filename}:{key}")
                        characters.append(char)
        
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'nombre' in item:
                    char = create_character_from_json(item, filename)
                    characters.append(char)
    
    except Exception:
        pass
    
    return characters

def create_simple_character(name, source):
    """Crea un personaje con datos mínimos"""
    char_id = hashlib.md5(f"{name}_{source}".encode()).hexdigest()[:8]
    
    return {
        "id": char_id,
        "nombre": name,
        "fuente": source,
        "cognitive_metrics": generate_default_metrics(),
        "perfil_cognitivo": {
            "neurodivergencia": "no especificada",
            "caracteristicas": [],
            "lentes_dominantes": get_default_lenses(name)
        },
        "contexto": {
            "descripcion": f"Personaje del Prunaverso extraído de {source}"
        },
        "avatar": get_avatar(name),
        "procesado": "2025-01-07"
    }

def create_character_from_json(data, source):
    """Crea personaje desde datos JSON"""
    try:
        name = str(data.get('nombre', 'Unknown'))
        char_id = hashlib.md5(f"{name}_{source}".encode()).hexdigest()[:8]
        
        # Extraer edad de forma segura
        edad = data.get('edad', None)
        if isinstance(edad, str):
            edad_nums = re.findall(r'\d+', edad)
            edad = int(edad_nums[0]) if edad_nums else None
        
        return {
            "id": char_id,
            "nombre": name,
            "edad": edad,
            "idioma": str(data.get('idioma', 'español')),
            "fuente": source,
            "cognitive_metrics": extract_metrics_safe(data.get('atributos', {})),
            "perfil_cognitivo": {
                "neurodivergencia": extract_neurodivergence(data),
                "caracteristicas": extract_characteristics_safe(data),
                "lentes_dominantes": get_default_lenses(name)
            },
            "contexto": {
                "rol": str(data.get('rol', '')),
                "descripcion": str(data.get('descripcion', data.get('personalidad', '')))[:200]
            },
            "avatar": get_avatar(name),
            "procesado": "2025-01-07"
        }
    except Exception:
        return create_simple_character(str(data.get('nombre', 'Unknown')), source)

def extract_metrics_safe(atributos):
    """Extrae métricas de forma segura"""
    metrics = generate_default_metrics()
    
    try:
        if isinstance(atributos, dict):
            for key in ['V', 'EX_x', 'EX_y', 'EY_x', 'EY_y', 'N_p', 'M', 'R', 'D', 'Di']:
                if key in atributos:
                    value = atributos[key]
                    if isinstance(value, (int, float)):
                        metrics[key] = float(value)
                    elif isinstance(value, str):
                        nums = re.findall(r'\d+\.?\d*', value)
                        if nums:
                            metrics[key] = float(nums[0])
    except:
        pass
    
    return metrics

def extract_neurodivergence(data):
    """Extrae neurodivergencia de forma segura"""
    try:
        perfil = data.get('perfil_cognitivo', {})
        if isinstance(perfil, dict):
            return str(perfil.get('neurodivergencia', 'no especificada'))
    except:
        pass
    return 'no especificada'

def extract_characteristics_safe(data):
    """Extrae características de forma segura"""
    try:
        perfil = data.get('perfil_cognitivo', {})
        if isinstance(perfil, dict):
            chars = perfil.get('caracteristicas', [])
            if isinstance(chars, list):
                return [str(c) for c in chars if isinstance(c, str)]
    except:
        pass
    return []

def get_default_lenses(name):
    """Lentes por defecto según el nombre"""
    name_lower = str(name).lower()
    
    if any(x in name_lower for x in ['alex', 'pruna']):
        return ['ai', 'philosophy', 'linguistics']
    elif any(x in name_lower for x in ['xavier', 'roura']):
        return ['science', 'art']
    elif 'ana' in name_lower:
        return ['psychology', 'social']
    else:
        return ['psychology']

def get_avatar(name):
    """Avatar según el nombre"""
    name_lower = str(name).lower()
    
    avatars = {
        'alex': '🧬', 'pruna': '🧬',
        'xavier': '🔧', 'roura': '🔧', 
        'ana': '🌟', 'joaquim': '📚',
        'cristobal': '🎨', 'dani': '⚡',
        'david': '🚀', 'sergi': '🔍'
    }
    
    for key, avatar in avatars.items():
        if key in name_lower:
            return avatar
    
    return '👤'

def generate_default_metrics():
    """Métricas por defecto"""
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

def save_database(characters):
    """Guarda la base de datos"""
    # Eliminar duplicados
    unique_chars = {}
    for char in characters:
        name_key = char["nombre"].lower().strip()
        if name_key not in unique_chars:
            unique_chars[name_key] = char
    
    final_chars = list(unique_chars.values())
    
    # Estadísticas simples
    lenses = defaultdict(int)
    neuros = defaultdict(int)
    
    for char in final_chars:
        for lens in char["perfil_cognitivo"]["lentes_dominantes"]:
            lenses[lens] += 1
        neuros[char["perfil_cognitivo"]["neurodivergencia"]] += 1
    
    database = {
        "version": "1.4",
        "generado": "2025-01-07",
        "total_personajes": len(final_chars),
        "personajes": final_chars,
        "estadisticas": {
            "lentes_mas_comunes": dict(lenses),
            "neurodivergencias": dict(neuros)
        }
    }
    
    # Crear directorio y guardar
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    return database

def main():
    print("🔍 MINERO SIMPLIFICADO DE PERSONAJES")
    print("=" * 50)
    
    characters = extract_simple_characters()
    
    if not characters:
        print("\n❌ No se encontraron personajes")
        return
    
    print(f"\n💾 Guardando {len(characters)} personajes...")
    database = save_database(characters)
    
    print(f"\n🎉 COMPLETADO!")
    print(f"   📊 Personajes únicos: {database['total_personajes']}")
    print(f"   📁 Archivo: {OUTPUT_FILE.relative_to(ROOT)}")
    print(f"   🔍 Lentes: {list(database['estadisticas']['lentes_mas_comunes'].keys())}")
    
    # Mostrar personajes extraídos
    print(f"\n👥 PERSONAJES EXTRAÍDOS:")
    for char in database['personajes']:
        print(f"   {char['avatar']} {char['nombre']} ({char['fuente']})")

if __name__ == "__main__":
    main()