import React, { useEffect, useState } from 'react';
import CharacterDetails from './CharacterDetails';

export default function CharacterSelector({ onSelect }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/characters');
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Error al cargar personajes');
        setCharacters(data.characters || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/character/' + encodeURIComponent(selectedFile));
        const data = await res.json();
        if (mounted && data.ok) setDetails(data.data);
      } catch (e) {
        console.error('Failed to load details', e);
      }
    })();
    return () => { mounted = false };
  }, [selectedFile]);

  if (loading) return <div>Cargando personajes...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!characters.length) return <div>No hay personajes disponibles.</div>;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((c) => (
          <div
            key={c.file}
            className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
            onClick={() => setSelectedFile(c.file)}
          >
            {c.avatar ? (
              <img src={c.avatar} alt={c.name} className="w-full h-32 object-cover rounded-lg mb-2" />
            ) : (
              <div className="w-full h-32 bg-gray-700 flex items-center justify-center rounded-lg text-gray-400">
                sin avatar
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{c.name}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-3">{c.description}</p>
          </div>
        ))}
      </div>

      <CharacterDetails
        file={selectedFile}
        details={details}
        onClose={() => { setSelectedFile(null); setDetails(null); }}
        onUse={(d) => { onSelect?.(d); setSelectedFile(null); setDetails(null); }}
      />
    </>
  );
}
