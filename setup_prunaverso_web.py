import os
import shutil
import subprocess

# Rutas base
BASE = r"C:\Users\pruna\Documents\GITHUB\Prunaverso_Web"
SRC_DATA = os.path.join(BASE, "public", "data")
PROFILE_SOURCE = r"C:\Users\pruna\Documents\GITHUB\Prunaverso\data\alex_pruna_profile.v4.json"

def ensure_dirs():
    """Crea las carpetas necesarias."""
    os.makedirs(SRC_DATA, exist_ok=True)
    print(f"🗂️  Carpeta creada/verificada: {SRC_DATA}")

def copy_profile():
    """Copia el perfil JSON real a public/data."""
    if os.path.exists(PROFILE_SOURCE):
        dest = os.path.join(SRC_DATA, "alex_pruna_profile.v4.json")
        shutil.copy2(PROFILE_SOURCE, dest)
        print(f"✅ Perfil copiado a: {dest}")
    else:
        print("⚠️ No se encontró el archivo de perfil en la ruta origen.")

def run_vite_dev():
    """Ejecuta npm run dev si está disponible."""
    try:
        print("🚀 Iniciando servidor local de Vite...")
        subprocess.run(["npm", "run", "dev"], cwd=BASE, check=True)
    except Exception as e:
        print("❌ Error al iniciar Vite:", e)

def main():
    print("🌌 Configurador automático del Prunaverso Visual")
    ensure_dirs()
    copy_profile()
    print("\nListo. Ahora puedes ejecutar manualmente o dejar que arranque el servidor.")
    run_vite_dev()

if __name__ == "__main__":
    main()
