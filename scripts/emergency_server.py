import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Cambiar al directorio del proyecto
project_dir = Path(__file__).parent.parent
os.chdir(project_dir)

# Crear servidor HTTP simple
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

print(f"🌟 Iniciando servidor de emergencia en puerto {PORT}")
print(f"📁 Sirviendo desde: {project_dir}")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Servidor activo en: http://localhost:{PORT}")
        print(f"🎯 Accede a: http://localhost:{PORT}/public/test.html")
        
        # Abrir navegador automáticamente
        webbrowser.open(f"http://localhost:{PORT}/public/test.html")
        
        print("🔥 Presiona Ctrl+C para detener")
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\n🛑 Servidor detenido")
except Exception as e:
    print(f"❌ Error: {e}")
    print("💡 Prueba manualmente: python -m http.server 8080")