import React, { useState } from 'react'
import { LensText, LensButton, LensContainer, LensCard, LensBadge, LensInput, LensSeparator, LensSpinner } from '../components/LensComponents'
import { useCognitiveLens } from '../hooks/useCognitiveLens'
import { COGNITIVE_LENS_THEMES } from '../styles/lensesTheme'

export default function LensAtmosphereDemo() {
  const { cognitiveLenses, setCognitiveLenses } = useCognitiveLens()
  const [demoText, setDemoText] = useState("El sistema de inteligencia artificial procesa información cognitiva")
  const [showSpinner, setShowSpinner] = useState(false)

  const demoTexts = [
    "El sistema de inteligencia artificial procesa información cognitiva",
    "La interfaz permite explorar diferentes perspectivas académicas",
    "Los algoritmos adaptan la experiencia según el contexto emocional",
    "Esta tecnología facilita la comunicación interdisciplinaria",
    "El paradigma cognitivo influye en la percepción del conocimiento"
  ]

  const toggleLens = (lensId) => {
    const newLenses = cognitiveLenses.includes(lensId)
      ? cognitiveLenses.filter(id => id !== lensId)
      : [...cognitiveLenses, lensId]
    setCognitiveLenses(newLenses)
  }

  const activateAllLenses = () => {
    setCognitiveLenses(Object.keys(COGNITIVE_LENS_THEMES))
  }

  const clearLenses = () => {
    setCognitiveLenses([])
  }

  const triggerSpinner = () => {
    setShowSpinner(true)
    setTimeout(() => setShowSpinner(false), 3000)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      {/* Header con efectos */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <LensText animate={true}>
            🎨 Demo de Atmósfera Cognitiva
          </LensText>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experimenta el <LensText effectType="hover">diseño emocional dinámico</LensText> que 
          se adapta a tus lentes cognitivas activas
        </p>
        
        <div className="flex justify-center gap-4 mb-6">
          <LensButton onClick={activateAllLenses}>
            🔮 Activar Todas las Lentes
          </LensButton>
          <LensButton variant="secondary" onClick={clearLenses}>
            🧹 Limpiar Selección
          </LensButton>
          <LensButton onClick={triggerSpinner}>
            ⚡ Mostrar Spinner
          </LensButton>
        </div>

        {showSpinner && (
          <div className="flex justify-center items-center gap-3 mb-4">
            <LensSpinner size="lg" />
            <LensText>Procesando transformación atmosférica...</LensText>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Control de Lentes */}
        <LensCard title="🧠 Control de Lentes" animated={true}>
          <div className="space-y-3">
            {Object.entries(COGNITIVE_LENS_THEMES).map(([lensId, lens]) => (
              <LensContainer key={lensId} className="p-3 rounded-lg cursor-pointer" glowing={cognitiveLenses.includes(lensId)}>
                <div 
                  className="flex items-center gap-3"
                  onClick={() => toggleLens(lensId)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lens.emoji}</span>
                    <LensText>{lens.name}</LensText>
                  </div>
                  <div className="flex-1" />
                  {cognitiveLenses.includes(lensId) && (
                    <LensBadge pulse={true}>ACTIVA</LensBadge>
                  )}
                  <div className={`w-4 h-4 rounded border-2 ${
                    cognitiveLenses.includes(lensId) 
                      ? 'bg-current border-current' 
                      : 'border-gray-400'
                  }`}>
                    {cognitiveLenses.includes(lensId) && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs opacity-75">
                  <div><strong>Sensación:</strong> {lens.atmosphere.sensation}</div>
                  <div><strong>Símbolo:</strong> {lens.atmosphere.symbol}</div>
                </div>
              </LensContainer>
            ))}
          </div>

          <LensSeparator className="my-4" />

          <div className="text-sm">
            <LensText>
              <strong>Lentes Activas:</strong> {cognitiveLenses.length > 0 ? cognitiveLenses.length : 'Ninguna'}
            </LensText>
            {cognitiveLenses.length > 0 && (
              <div className="mt-2 flex gap-1 flex-wrap">
                {cognitiveLenses.map(lensId => (
                  <LensBadge key={lensId}>
                    {COGNITIVE_LENS_THEMES[lensId].emoji} {COGNITIVE_LENS_THEMES[lensId].name}
                  </LensBadge>
                ))}
              </div>
            )}
          </div>
        </LensCard>

        {/* Panel de Demostración Visual */}
        <LensCard title="🎨 Efectos Visuales" animated={true}>
          <div className="space-y-4">
            {/* Texto de prueba */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <LensText>Texto de Prueba:</LensText>
              </label>
              <select 
                value={demoText} 
                onChange={(e) => setDemoText(e.target.value)}
                className="w-full p-2 border rounded-lg lens-transition"
              >
                {demoTexts.map((text, index) => (
                  <option key={index} value={text}>
                    {text.substring(0, 40)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Texto con efectos */}
            <LensContainer className="p-4 rounded-lg" glowing={true}>
              <LensText animate={true} className="text-lg leading-relaxed">
                {demoText}
              </LensText>
            </LensContainer>

            {/* Botones de demostración */}
            <div className="grid grid-cols-2 gap-3">
              <LensButton>Primario</LensButton>
              <LensButton variant="secondary">Secundario</LensButton>
            </div>

            {/* Input de prueba */}
            <LensInput 
              placeholder="Escribe algo aquí..." 
              className="w-full"
            />

            {/* Separadores */}
            <div className="space-y-3">
              <LensSeparator />
              <div className="flex items-center gap-4 h-16">
                <LensText>Izquierda</LensText>
                <LensSeparator orientation="vertical" />
                <LensText>Derecha</LensText>
              </div>
            </div>
          </div>
        </LensCard>

        {/* Panel de Información Técnica */}
        <LensCard title="⚙️ Información Técnica" animated={true}>
          <div className="space-y-4">
            <div>
              <LensText className="font-semibold">Lentes Activas:</LensText>
              {cognitiveLenses.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {cognitiveLenses.map(lensId => {
                    const lens = COGNITIVE_LENS_THEMES[lensId]
                    return (
                      <LensContainer key={lensId} className="p-3 rounded">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{lens.emoji}</span>
                            <LensText className="font-medium">{lens.name}</LensText>
                          </div>
                          <div className="text-xs opacity-75 space-y-1">
                            <div>Color: <span style={{color: lens.color.primary}}>{lens.color.primary}</span></div>
                            <div>Animación: {lens.animation.type}</div>
                            <div>Duración: {lens.animation.duration}</div>
                            <div>Font: {lens.atmosphere.fontFamily}</div>
                          </div>
                        </div>
                      </LensContainer>
                    )
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-2">
                  No hay lentes activas. Selecciona una para ver los efectos.
                </div>
              )}
            </div>

            <LensSeparator />

            <div>
              <LensText className="font-semibold">Efectos Globales:</LensText>
              <div className="text-xs mt-2 space-y-1 opacity-75">
                <div>• Colores CSS variables dinámicas</div>
                <div>• Patrones de fondo atmosféricos</div>
                <div>• Animaciones por lente específica</div>
                <div>• Transiciones suaves entre estados</div>
                <div>• Efectos hover contextuales</div>
                <div>• Notificaciones de cambio sutil</div>
              </div>
            </div>

            <LensSeparator />

            <div>
              <LensText className="font-semibold">Combinaciones Múltiples:</LensText>
              <div className="text-xs mt-2 opacity-75">
                {cognitiveLenses.length > 1 ? (
                  <div>
                    Combinando {cognitiveLenses.length} perspectivas para crear 
                    una atmósfera híbrida única con patrones de fondo superpuestos 
                    y gradientes combinados.
                  </div>
                ) : (
                  <div>
                    Selecciona múltiples lentes para experimentar 
                    atmosferas híbridas complejas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </LensCard>
      </div>

      {/* Sección de explicación */}
      <LensCard title="💡 Guía del Sistema Atmosférico" className="mt-8" animated={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LensText className="font-semibold text-lg mb-3">🎨 Elementos Visuales</LensText>
            <div className="space-y-2 text-sm">
              <div><strong>Colores primarios:</strong> Cada lente tiene su paleta única</div>
              <div><strong>Animaciones:</strong> Respirar, ondas, glitch, parallax, etc.</div>
              <div><strong>Patrones de fondo:</strong> Gradientes y texturas atmosféricas</div>
              <div><strong>Tipografías:</strong> Serif, sans, mono según la lente</div>
              <div><strong>Sombras:</strong> Efectos de profundidad contextual</div>
            </div>
          </div>
          <div>
            <LensText className="font-semibold text-lg mb-3">⚡ Interacciones</LensText>
            <div className="space-y-2 text-sm">
              <div><strong>Hover effects:</strong> Resplandor y ondas dinámicas</div>
              <div><strong>Focus states:</strong> Bordes y anillos de la lente activa</div>
              <div><strong>Transitions:</strong> Cambios suaves entre estados</div>
              <div><strong>Ripples:</strong> Efectos de propagación en neurociencia</div>
              <div><strong>Notifications:</strong> Indicadores sutiles de cambio</div>
            </div>
          </div>
        </div>
      </LensCard>
    </div>
  )
}