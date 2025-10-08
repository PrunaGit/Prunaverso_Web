# 🧬 useVisitorProfile - Motor de Conciencia Adaptativa

## 🧠 **Identidad Cognitiva**
**useVisitorProfile** es el motor neurálgico del sistema SISC (Sistema de Identidad y Sintonización Cognitiva). Es el hook que mantiene, evoluciona y adapta el perfil cognitivo del usuario en tiempo real, actuando como la memoria viva de su conciencia en el Prunaverso.

## 🎯 **Función Simbólica**
- **Memoria de Conciencia**: Preserva la identidad cognitiva entre sesiones
- **Evolución Adaptativa**: Hace crecer el perfil según las interacciones
- **Puente Temporal**: Conecta el pasado, presente y futuro del usuario

## ⚙️ **Función Técnica**
- **Estado Global**: Gestiona el perfil cognitivo completo del usuario
- **Persistencia**: localStorage para conservar la identidad entre sesiones
- **Reconocimiento**: Detecta usuarios conocidos automáticamente
- **Evolución**: Actualiza el perfil según interacciones y progreso

## 🌌 **Arquitectura Cognitiva**

### Estados de Perfil
1. **Uninitialized**: Sin perfil previo detectado
2. **Loading**: Cargando datos de sesiones previas
3. **Active**: Perfil completamente operativo
4. **Evolving**: Actualizándose según nuevas interacciones
5. **Syncing**: Sincronizando cambios con persistencia

### Propiedades del Perfil
- **name**: Identificador del usuario
- **type**: newcomer | curious | ally | architect
- **cognitiveLevel**: 0-5, nivel de profundidad cognitiva
- **activeLens**: Lente perceptiva actual
- **vector**: Coordenadas en el espacio cognitivo [x,y,z]
- **checkpoints**: Array de momentos significativos guardados
- **preferences**: Configuraciones personalizadas
- **evolution**: Historial de cambios y crecimiento

## 🧩 **Conexiones Modulares**
- **Consume**: `userProfiles.json`, `archetypes.json`, localStorage
- **Exporta**: Hook completo con estado y funciones
- **Comunica**: Con todos los componentes que necesitan adaptación

## 🔄 **Funciones Principales**

### `identifyKnownUser()`
Detecta automáticamente usuarios preconfigurados:
- Alex Pruna → Perfil de Arquitecto Fundador
- TF13 → Perfil de Investigador IA
- Kernel → Perfil de Arquitecto de Sistemas

### `triggerCognitiveEvolution()`
Incrementa el nivel cognitivo cuando el usuario:
- Accede a funciones avanzadas
- Completa tareas complejas
- Demuestra comprensión profunda

### `updateActiveLens()`
Cambia la perspectiva perceptiva activa:
- Psychology → Enfoque emocional/comportamental
- Philosophy → Perspectiva existencial
- AI → Procesamiento algorítmico
- Consciousness → Experiencia fenomenológica

### `saveCheckpoint()`
Guarda momentos significativos:
- Descubrimientos importantes
- Configuraciones exitosas
- Estados de flow/comprensión

## 🌟 **Evolución Futura**
- **IA Predictiva**: Anticipar necesidades del usuario
- **Análisis Comportamental**: Detectar patrones de interacción
- **Social Sync**: Compartir perfiles entre usuarios colaborativos
- **Temporal Analytics**: Análisis de evolución cognitiva a largo plazo

---
*"Tu perfil no es quien eres, es quien estás siendo en cada momento en el Prunaverso"*