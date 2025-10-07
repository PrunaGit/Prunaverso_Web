# protocol_integrity_v1 — Protocolo de Integridad Operativa

## Objetivo
Establecer reglas, controles y formatos para garantizar que cualquier artefacto simbólico (handshake) que entre en el repositorio cumple con criterios de validez, trazabilidad y firma.

## Alcance
Aplica a archivos en `data/sync/` y a los procesos que generan handshakes (agentes, scripts, interfaces).

## Hooks y validaciones
- `.husky/pre-commit` / `.husky/pre-commit.ps1`
  - Ejecutan: `scripts/precommit_validate.cjs`.
  - Validan: conformidad con `data/sync/schema/handshake.schema.json`.
  - Resultado: impiden commit si existe alguna instancia inválida.

## Campos de trazabilidad requeridos
- `transform_version` (semver): versión de la transformación o template aplicada.
- `trace_id` (UUID): identificador único de la sincronización.
- `agent_signature` (string): firma simbólica del agente (puede evolucionar a HMAC/PKI).

## Firma y verificación
- Recomendación inicial: `agent_signature` contiene una cadena referencial (e.g., `AgentName:SIG:base64`).
- Futuro: definir clave pública/privada o HMAC compartido para verificación automática.

## Logs
- Ubicación: `data/logs/validation/`.
- Contenido: JSON con `timestamp`, `summary`, `results` (errores por archivo).
- Política: logs no se bloquean en commit; son referencia obligatoria para auditoría.

## Procedimiento de emergencia
- Si un commit inválido llega al main (por fallo en hook), ejecutar:
  1. Revertir commit: `git revert` o restaurar desde copia de seguridad.
  2. Ejecutar `node scripts/precommit_validate.cjs` para diagnosticar.
  3. Notificar a responsables.

## Extensiones propuestas
- Validación de `agent_signature` con claves locales.
- Inclusión automática de `trace_id` si falta (con política de consentimiento).
- Integración con CI para validar en cada PR.

---

Este documento es la base para el control de integridad operativa; se puede ampliar con detalles de claves, procesos de emisión de firmas y políticas de retención de logs.

### Firma simbólica
- Algoritmo: HMAC-SHA256  
- Clave simbólica: `Prunaversal_Core_Key`  
- Propósito: validar integridad de agentes internos  
