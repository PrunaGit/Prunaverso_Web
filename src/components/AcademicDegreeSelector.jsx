import React, { useState } from 'react'
import { useCognitiveLens } from '../hooks/useCognitiveLens'
import { ACADEMIC_DEGREES } from '../utils/textTransformer'

export function AcademicDegreeSelector() {
  const { academicDegree, setAcademicDegree } = useCognitiveLens()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
        {/* Degree Indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
        >
          <span className="text-xs">🎓</span>
          <span>{ACADEMIC_DEGREES[academicDegree]?.name || 'Intermedio'}</span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▲</span>
        </button>

        {/* Degree Selection Panel */}
        {isExpanded && (
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border p-3 min-w-48">
            <div className="text-xs font-semibold text-gray-600 mb-2">Nivel Académico</div>
            <div className="space-y-1">
              {Object.entries(ACADEMIC_DEGREES).map(([key, degree]) => (
                <button
                  key={key}
                  onClick={() => {
                    setAcademicDegree(key)
                    setIsExpanded(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    academicDegree === key
                      ? 'bg-purple-100 text-purple-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{degree.name}</span>
                    <div className="flex">
                      {Array.from({length: degree.complexity}, (_, i) => (
                        <span key={i} className="text-xs text-purple-500">●</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
              El grado académico adapta la complejidad del lenguaje
            </div>
          </div>
        )}
      </div>
    </div>
  )
}