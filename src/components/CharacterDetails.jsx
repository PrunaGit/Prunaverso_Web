import React from 'react';

export default function CharacterDetails({ file, details, onClose, onUse }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-lg p-6 w-11/12 max-w-3xl shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{details?.name || file}</h2>
          <div className="space-x-2">
            <button onClick={onClose} className="px-3 py-1 bg-gray-700 rounded">Cerrar</button>
            <button onClick={() => onUse?.(details)} className="px-3 py-1 bg-purple-600 rounded text-white">Usar personaje</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            {details?.avatar ? (
              <img src={details.avatar} alt={details.name} className="w-full rounded-lg" />
            ) : (
              <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">No avatar</div>
            )}
          </div>
          <div className="col-span-2 text-sm text-gray-300">
            <p className="mb-3">{details?.description}</p>
            <h4 className="font-semibold">Stats</h4>
            <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">{JSON.stringify(details?.stats || {}, null, 2)}</pre>
            {details?.abilities && (
              <>
                <h4 className="font-semibold mt-3">Abilities</h4>
                <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">{JSON.stringify(details.abilities, null, 2)}</pre>
              </>
            )}
            {details?.backstory && (
              <>
                <h4 className="font-semibold mt-3">Historia</h4>
                <p className="bg-gray-800 p-2 rounded text-sm">{details.backstory}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
