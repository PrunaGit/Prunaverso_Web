# protocol_sync_v1 — Protocolo de Ejecución en Espejo (borrador)

## Resumen
Este documento describe el ciclo operativo por el cual una representación simbólica (producida por una IA o agente simbólico) se traduce en acciones técnicas dentro del entorno local (edición/creación de archivos, ejecución de scripts, etc.) bajo políticas de control y trazabilidad.

## Objetivos
- Definir pasos mínimos para transformar enunciados simbólicos en artefactos técnicos.
- Establecer controles de seguridad y permisos antes de ejecutar acciones con efectos secundarios.
- Garantizar trazabilidad y reversibilidad de cambios.

## Ciclo operativo
1. Captura: el agente recibe la intención simbólica (handshake JSON).
2. Validación previa: verificar firma, permisos y formato (JSON-Schema).
3. Planificación: descomponer la intención en acciones atómicas (crear archivo, editar, ejecutar script).
4. Simulación: generar un diff o vista previa (no destructiva) y presentarla para aprobación automática según políticas.
5. Ejecución controlada: aplicar cambios en el repositorio local y registrar resultados en `data/logs/`.
6. Verificación post-ejecución: checks automáticos (lint, tests básicos si aplica).
7. Registro y notificación: crear un log con metadata y diffs; opcionalmente notificar a un endpoint.

## Controles de seguridad mínimos
- Lista blanca de rutas permitidas (`data/`, `docs/`, `src/` opcionalmente).
- Limitación de comandos ejecutables (no permitir ejecución arbitraria sin aprobación humana).
- Política de firmas: cada handshake debe incluir `metadata.author` y una `signature` (futura).
- Reversión automática en caso de fallo crítico (restore desde git HEAD o backup temporal).

## Formato de handshake (mínimo)
- `actor`, `intent`, `methodology`, `agreement`, `next_action`, `schema_version`, `metadata`.

## Ejemplo de flujo de aprobación
- `auto-approve` si `actor` en lista blanca y `next_action` es `write_file` en rutas permitidas.
- `manual-approve` si `next_action` consiste en `execute_command` o modificación de archivos de configuración críticos.

## Registro
- Ubicación: `data/logs/`.
- Contenido: `timestamp`, `actor`, `intent`, `actions`, `diffs`, `status`, `metadata`.

## Extensiones futuras
- Integración con sistema de firmas/verificación criptográfica.
- Endpoint remoto para centralizar registros de sincronía.
- UI de revisión y aprobación en la interfaz del panel.

---

Este borrador se puede transformar en un formato más riguroso (RFC interno) y acompañarse de `JSON-Schema` y scripts de validación. Si quieres, genero esos archivos ahora (`data/sync/schema/handshake.schema.json` y `scripts/validate_handshake.js`).
