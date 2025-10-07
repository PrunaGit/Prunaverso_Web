import os

# ───────────────────────────────
# CONFIGURACIÓN TAILWIND (PYTHON)
# ───────────────────────────────

def setup_tailwind():
    root = os.getcwd()

    # 1️⃣ Verifica si existe package.json
    if not os.path.exists(os.path.join(root, "package.json")):
        print("❌ No se encontró package.json. Ejecuta este script en la raíz del proyecto.")
        return

    # 2️⃣ Crea tailwind.config.js
    tailwind_config = """export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
"""
    with open("tailwind.config.js", "w", encoding="utf-8") as f:
        f.write(tailwind_config)
    print("✅ tailwind.config.js creado o actualizado.")

    # 3️⃣ Crea postcss.config.js
    postcss_config = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"""
    with open("postcss.config.js", "w", encoding="utf-8") as f:
        f.write(postcss_config)
    print("✅ postcss.config.js creado o actualizado.")

    # 4️⃣ Asegura que el CSS principal tenga las directivas
    css_paths = [os.path.join("src", "index.css"), os.path.join("src", "main.css")]
    tailwind_imports = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"

    for css_path in css_paths:
        if os.path.exists(css_path):
            with open(css_path, "r+", encoding="utf-8") as f:
                content = f.read()
                if "@tailwind base" not in content:
                    f.seek(0, 0)
                    f.write(tailwind_imports + "\n" + content)
                    print(f"✨ Añadidas directivas Tailwind a {css_path}")
                else:
                    print(f"✅ {css_path} ya contiene las directivas Tailwind.")
            break
    else:
        print("⚠️ No se encontró ningún archivo CSS en src/. Crea uno con las directivas base de Tailwind.")

    print("\n🌈 Configuración Tailwind finalizada correctamente.")
    print("➡️ Ahora puedes ejecutar: npm run dev\n")


if __name__ == "__main__":
    setup_tailwind()
