# scripts/advanced_character_parser.py
# Parser avanzado para archivos JSON complejos con múltiples personajes

import json
import re
from pathlib import Path

def parse_complex_json_file(file_path):
    """Parsea archivos JSON complejos con múltiples objetos y comentarios"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dividir por comentarios que indican nuevos archivos
    sections = re.split(r'// Archivo: .+?\.json', content)
    
    characters = []
    
    for section in sections:
        if not section.strip():
            continue
            
        # Limpiar comentarios de línea
        cleaned = re.sub(r'^\s*//.*$', '', section, flags=re.MULTILINE)
        
        # Buscar objetos JSON válidos
        json_objects = extract_json_objects(cleaned)
        
        for json_obj in json_objects:
            try:
                data = json.loads(json_obj)
                if is_character_data(data):
                    characters.append(data)
            except json.JSONDecodeError as e:
                print(f"Error parseando JSON: {e}")
                continue
    
    return characters

def extract_json_objects(text):
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

# Ejecutar el parser avanzado
if __name__ == "__main__":
    file_path = Path("../data/characters/personajes/personajes_unif_v1.json")
    characters = parse_complex_json_file(file_path)
    
    print(f"🔍 Encontrados {len(characters)} personajes:")
    for i, char in enumerate(characters):
        nombre = char.get('nombre', char.get('name', f'Personaje {i+1}'))
        print(f"   {i+1}. {nombre}")