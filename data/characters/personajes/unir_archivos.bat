@echo off
cd /d "C:\Users\pruna\Documents\GITHUB\Prunaverso\docs\recatoring\MAMA_GPT"
if not exist "unido" mkdir "unido"
type *.txt > "unido\archivo_unido.txt"
echo Archivo unido creado correctamente en la carpeta 'unido'.   