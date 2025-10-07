import os
import re

TARGET_FILE = os.path.join("src", "PrunaversoPanel.jsx")

NEW_RETURN_BLOCK = r'''return (
  <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0d0d0f] via-[#121225] to-[#0d0d0f] text-gray-200 font-mono">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold mb-2 text-[#77eaff]">
        🌌 Prunaverso Visual v0.1
      </h1>
      <h2 className="text-2xl mb-6 opacity-80">
        {perfil.nombre || "Sin nombre registrado"}
      </h2>

      <div className="bg-[#1c1f26] p-8 rounded-2xl shadow-xl border border-[#333] max-w-lg w-11/12 text-center space-y-3">
        <p><b>Rol:</b> {perfil.rol || "—"}</p>
        <p><b>Versión:</b> {perfil.version || "v0.06"}</p>
        <p><b>Estado:</b> {perfil.estado_actual || "Activo"}</p>
        <p><b>Propósito:</b> {perfil.proposito || "Expansión cognitiva"}</p>
      </div>

      <footer className="mt-10 text-xs opacity-60">
        Sistema operativo Prunaversal © 2025
      </footer>
    </div>
  </div>
);'''

def fix_center():
    if not os.path.exists(TARGET_FILE):
        print(f"❌ No se encontró {TARGET_FILE}")
        return

    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # reemplaza todo el bloque return (...) ;
    content_new = re.sub(r"return\s*\([^)]*\);\s*$", NEW_RETURN_BLOCK, content, flags=re.S)

    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(content_new)

    print("✅ Centrado corregido en src/PrunaversoPanel.jsx")
    print("➡️ Ejecuta ahora: npm run dev\n")

if __name__ == "__main__":
    fix_center()
