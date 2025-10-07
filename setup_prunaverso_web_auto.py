import os
import shutil
import subprocess

# === CONFIGURACIÓN BASE ===
REPO_PRUNAVERSO = r"C:\Users\pruna\Documents\GITHUB\Prunaverso"
WEB_ROOT = r"C:\Users\pruna\Documents\GITHUB\Prunaverso_Web"
DEST_DIR = os.path.join(WEB_ROOT, "public", "data")

# Nombre base del perfil que quieres cargar
PERSONAJE = "alex_pruna"

def buscar_perfil(nombre):
    """Busca el JSON más reciente de un personaje dentro del repositorio del Prunaverso."""
    encontrados = []
    for root, _, files in os.walk(REPO_PRUNAVERSO):
        for f in files:
            if f.lower().startswith(nombre) and f.lower().endswith(".json"):
                encontrados.append(os.path.join(root, f))
    if not encontrados:
        return None
    # Ordena por versión numérica si la hay
    encontrados.sort(reverse=True)
    return encontrados[0]

def preparar_carpeta():
    """Crea carpeta destino si no existe."""
    os.makedirs(DEST_DIR, exist_ok=True)
    print(f"🗂️  Carpeta destino lista: {DEST_DIR}")

def copiar_perfil(origen):
    """Copia el perfil al proyecto web."""
    if not origen:
        print("⚠️ No se encontró ningún perfil que copiar.")
        return
    nombre = os.path.basename(origen)
    destino = os.path.join(DEST_DIR, nombre)
    shutil.copy2(origen, destino)
    print(f"✅ Copiado: {nombre}\n   → {destino}")

def ejecutar_vite():
    """Inicia el servidor de desarrollo de Vite."""
    print("🚀 Iniciando servidor de desarrollo...\n")
    try:
        subprocess.run(["npm", "run", "dev"], cwd=WEB_ROOT, check=True)
    except FileNotFoundError:
        print("❌ Error: no se encontró el comando 'npm'.")
    except Exception as e:
        print("❌ Error al ejecutar Vite:", e)

def main():
    print("🌌 Configurador automático del Prunaverso Visual\n")
    preparar_carpeta()
    perfil = buscar_perfil(PERSONAJE)
    if perfil:
        print(f"🔎 Perfil detectado: {perfil}")
    else:
        print("⚠️ No se detectó ningún perfil JSON de ese personaje.")
    copiar_perfil(perfil)
    ejecutar_vite()

if __name__ == "__main__":
    main()
