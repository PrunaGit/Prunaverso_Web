# data/sync — Sincronizaciones semánticas (handshakes)

Propósito
--------
Este directorio contiene registros de "handshake" semánticos entre módulos y agentes del ecosistema Prunaverso. Cada archivo JSON representa una sincronización inicial con metadatos, intención y la metodología utilizada para alinear capas humana y técnica.

Formato recomendado
------------------
- Ruta: `data/sync/`.
- Nombre: `handshake_<nombre>_v<version>.json`.
- Formato: JSON-LD (recomendado) o JSON-lean.

Campos clave
-----------
- `@context` (opcional pero recomendado): URL o referencia a un JSON-LD context que normalice vocabulario y términos.
- `actor`: identificador del agente que inicia o responde al handshake.
- `intent`: intención principal de la sincronización.
- `methodology`: etiqueta para la metodología/mapping usada.
- `agreement`: objeto que describe el contrato (entrada/salida, modos de fallo, criterios de éxito).
- `next_action`: la acción sugerida a seguir dentro del sistema.
- `schema_version`: versión del esquema de handshake.
- `metadata`: metadatos adicionales (autor, capa, timestamps, `transform_version`, etc.).

Versionado
---------
Use semver para `schema_version` y refleje cambios en el nombre del archivo si el contenido semántico cambia de manera incompatible.

Extensiones futuras
-------------------
- `transform_version`: versión de las reglas o plantillas usadas para convertir representaciones simbólicas en artefactos técnicos.
- `provenance`: URI o referencia a logs externos que prueban la ejecución del `next_action`.
- `permissions`: políticas relacionadas con efectos secundarios o comandos que puedan modificar el sistema.

Ejemplo
------
`handshake_prunaverso_v3.json` (ejemplo inicial en este directorio) muestra una instancia mínima de un handshake aceptado.

Siguiente paso
---------------
- Proponer o generar un `JSON-Schema` mínimo para validar handshakes en `data/sync/schema/handshake.schema.json`.
- Añadir scripts de validación (por ejemplo `scripts/validate_handshake.js`) que permitan validar localmente con `node`.

Contribuir
---------
Si añades un nuevo handshake, incluye un breve `CHANGELOG` o nota en el commit explicando el propósito y los cambios semánticos.
