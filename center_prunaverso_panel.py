import os
import re

# ────────────────────────────────
# PRUNAVERSO PANEL — CENTER FIXER
# ────────────────────────────────

TARGET_FILE = os.path.join("src", "PrunaversoPanel.jsx")

CENTERED_DIV = (
    '<div className="min-h-screen w-full flex flex-col items-center justify-center '
    'bg-gradient-to-br from-[#0d0d0f] via-[#121225] to-[#0d0d0f] '
    'text-gray-200 font-mono text-center px-4">'
)

def center_prunaverso_panel():
    if not os.path.exists(TARGET_FILE):
        print(f"❌ No se encontró {TARGET_FILE}")
        return

    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Reemplazar el div principal (centrado completo)
    content_new = re.sub(
        r'<div className="min-h-screen[^"]*">',
        CENTERED_DIV,
        content
    )

    # Reemplazar text-left → text-center dentro de la tarjeta
    content_new = content_new.replace("text-left", "text-center")

    # Escribir cambios
    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(content_new)

    print("✅ Corrección aplicada con éxito.")
    print(f"🔄 Archivo modificado: {TARGET_FILE}")
    print("🪶 El panel ahora está centrado y alineado correctamente.\n")
    print("➡️ Ejecuta ahora: npm run dev\n")


if __name__ == "__main__":
    center_prunaverso_panel()
