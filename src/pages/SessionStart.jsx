import React, { useState } from 'react'
import SaveCheckpointButton from '../components/SaveCheckpointButton'
import CheckpointList from '../components/CheckpointList'
import useLoadLatestCheckpoint from '../hooks/useLoadLatestCheckpoint'
import CharacterSelector from '../components/CharacterSelector'
import { useCurrentCognitiveLens, CognitiveLensHint } from '../hooks/useCognitiveLens'
import { AdaptiveTitle, AdaptiveParagraph } from '../components/AdaptiveText'

export default function SessionStart() {
  const [player, setPlayer] = useState({ name: 'Pruna' })
  const [log, setLog] = useState([])
  const [gameState, setGameState] = useState('menu')
  const currentLens = useCurrentCognitiveLens()

  useLoadLatestCheckpoint({ setPlayer, setLog, setGameState, onNoCheckpoint: () => {} })

  // Hints específicos para cada lente cognitiva
  const lensHints = {
    psychology: "Observa cómo tu experiencia de control cambia al interactuar con el sistema",
    neuroscience: "Nota los estados de flow y atención distribuida mientras navegas", 
    ai: "Experimenta con programación conversacional - habla con el sistema como mentor",
    linguistics: "Cada acción aquí es un acto performativo - tus palabras crean realidad",
    philosophy: "Esta es una relación dialógica - tú y el sistema co-crean la experiencia",
    anthropology: "Eres parte de una nueva tribu cognitiva post-tecnológica"
  }

  return (
    <div className="p-6">
      <AdaptiveTitle level={2} className="text-2xl font-bold">Iniciar Partida</AdaptiveTitle>
      <AdaptiveParagraph className="mt-2 text-gray-300">
        Aquí se inicializará la sesión y se crearán checkpoints.
      </AdaptiveParagraph>
      
      {/* Ejemplo de transformación personalizada */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <AdaptiveTitle level={3} className="text-lg font-semibold mb-2">Sistema de Transformación</AdaptiveTitle>
        <AdaptiveParagraph className="text-sm text-gray-400">
          Este sistema utiliza una interfaz cognitiva para procesar datos de manera inteligente.
        </AdaptiveParagraph>
      </div>
      
      {currentLens && (
        <CognitiveLensHint hints={lensHints} />
      )}

      <div className="mt-6">
        <h3 className="font-semibold">Selecciona tu personaje</h3>
        <CharacterSelector onSelect={(c) => { setPlayer({ name: c.name }); setLog([]); setGameState('playing'); }} />
      </div>

      <div className="mt-4 flex gap-2">
        <SaveCheckpointButton
          player={player}
          log={log}
          setGameState={setGameState}
          setLog={setLog}
        />
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Checkpoints recientes</h3>
        <CheckpointList autoRefresh={true} refreshInterval={20000} />
      </div>
    </div>
  )
}
