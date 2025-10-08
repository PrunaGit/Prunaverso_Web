import os
import json

def load_jsons(input_dir):
    data = []
    for filename in os.listdir(input_dir):
        if filename.endswith(".json"):
            filepath = os.path.join(input_dir, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data.append(json.load(f))
            except Exception as e:
                print(f"⚠️ Error leyendo {filename}: {e}")
    return data

def consolidate(profiles):
    consolidated = {}
    for profile in profiles:
        for key, value in profile.items():
            if key not in consolidated:
                consolidated[key] = value
            else:
                # Si ya existe, lo convertimos en lista de versiones
                if not isinstance(consolidated[key], list):
                    consolidated[key] = [consolidated[key]]
                consolidated[key].append(value)
    return consolidated

def save_json(data, output_path):
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    # Carpeta donde está el script
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    INPUT_DIR = BASE_DIR
    OUTPUT_DIR = os.path.join(BASE_DIR, "consolidado_v2")

    # Crear carpeta si no existe
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Cargar y consolidar
    profiles = load_jsons(INPUT_DIR)
    consolidated = consolidate(profiles)

    # Guardar consolidado
    output_file = os.path.join(OUTPUT_DIR, "alex_pruna_consolidado_v2.json")
    save_json(consolidated, output_file)

    print(f"✅ Consolidación completada: {output_file}")
