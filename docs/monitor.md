# Monitor simbólico — documentación

Este módulo genera reportes periódicos sobre la salud semántica y operativa del Prunaverso.

Ubicaciones relevantes
- Logs de validación: `data/logs/validation/`
- Reportes generados: `data/logs/monitor-reports/`
- Alertas: `data/logs/alerts/`

Qué hace
1. Lee los archivos JSON en `data/logs/validation/`.
2. Resume métricas: número de logs, validaciones totales, validadas e inválidas.
3. Analiza handshakes en `data/sync/` para calcular actividad por `actor` y listar `trace_id` recientes.
4. Genera un reporte JSON y un resumen en Markdown.
5. Si detecta invalidaciones, crea una alerta en `data/logs/alerts/`.

Cómo usar
- Ejecuta manualmente:

```powershell
node scripts/monitor_symbolic.cjs
```

- Para monitor continuo, añade una tarea cron o un servicio que ejecute el script periódicamente.

Extensiones propuestas
- Añadir métricas de latencia (tiempo entre creación y validación).
- Integrar alertas con email o webhook.
- Analizar tendencias y anomalías semánticas con ML.
