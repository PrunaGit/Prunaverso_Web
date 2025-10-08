import h5py
import json

# Rutas de tus archivos
profile_path = "alex_pruna_profile_v1.json"
output_h5 = "prunaverso_v1.h5"

# Cargar tu perfil JSON
with open(profile_path, "r", encoding="utf-8") as f:
    profile_data = json.load(f)

# Crear un archivo .h5 y guardar los datos principales
with h5py.File(output_h5, "w") as h5:
    # Guardamos el nombre y alias como datasets
    h5.create_dataset("nombre_completo", data=profile_data["nombre_completo"])
    h5.create_dataset("alias", data=json.dumps(profile_data["alias"]))
    
    # Guardamos procesos cognitivos como grupo
    procesos = h5.create_group("procesos_cognitivos")
    for key, value in profile_data["procesos_cognitivos"].items():
        procesos.create_dataset(key, data=value)

print(f"✅ Archivo {output_h5} creado con éxito")
