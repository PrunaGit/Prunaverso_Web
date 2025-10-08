# 📱 MENSAJE LISTO PARA WHATSAPP - PRUNAVERSO WEB

## 🎯 Para dispositivos en la MISMA Wi-Fi:

```
🌟 ¡Prueba mi PRUNAVERSO WEB! 🧠✨

🎮 Portal mental inmersivo con arquetipos RPG
🎵 Experiencia atmosférica con audio envolvente  
🧬 Clasificación cognitiva basada en ecuación primaria

📱 Abre en tu navegador:
http://192.168.1.38:5180/

🔧 Si no carga:
• Asegúrate de estar en la misma Wi-Fi
• Copia y pega la URL completa
• Prueba también: http://192.168.1.37:5180/

💫 ¡Descubre tu arquetipo mental!
```

## 🌐 Para crear LINK PÚBLICO (cualquier persona):

**Ejecuta este comando en PowerShell:**
```powershell
npx localtunnel --port 5180 --subdomain prunaverso-demo
```

**Luego usa este mensaje:**
```
🌟 ¡Prueba mi PRUNAVERSO WEB! 🧠✨

🎮 Portal mental inmersivo con arquetipos RPG
🎵 Experiencia atmosférica con audio envolvente  
🧬 Clasificación cognitiva basada en ecuación primaria

🌐 Link público (funciona desde cualquier lugar):
https://prunaverso-demo.loca.lt

💫 ¡Descubre tu arquetipo mental!

⚡ Demo temporal - si no carga, avísame
```

## 🎯 URLS DIRECTAS PARA COMPARTIR:

### Wi-Fi Local:
- **Principal**: http://192.168.1.38:5180/
- **Alternativa**: http://192.168.1.37:5180/

### Para móvil (copia y pega):
```
http://192.168.1.38:5180/
```

## 🔥 COMANDOS DE MANTENIMIENTO:

**Reiniciar servidores:**
```powershell
taskkill /F /IM node.exe /T; npm run dev-unsafe -- --host 0.0.0.0 --port 5180
```

**Crear túnel público:**
```powershell
npx localtunnel --port 5180 --subdomain prunaverso-[tu-nombre]
```

**Verificar que funciona:**
```powershell
Invoke-WebRequest -Uri "http://192.168.1.38:5180" -Method GET
```