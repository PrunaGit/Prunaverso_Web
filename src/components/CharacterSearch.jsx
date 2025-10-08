import React, { useEffect, useMemo, useState } from 'react'
import CharacterDetails from './CharacterDetails'

export default function CharacterSearch() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/characters_index.json')
        const data = await res.json()
        if (data && data.characters) setItems(data.characters)
      } catch (e) {
        console.error('Failed to load index', e)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return items
    return items.filter(it => (it.name || '').toLowerCase().includes(qq) || (it.description||'').toLowerCase().includes(qq))
  }, [items, q])

  if (loading) return <div>Cargando personajes…</div>

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o descripción..." className="flex-1 px-3 py-2 rounded bg-gray-800 text-white" />
        <button onClick={() => setQ('')} className="px-3 py-2 bg-gray-700 rounded">Limpiar</button>
      </div>

      {filtered.length === 0 ? <div>No hay resultados.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(it => (
            <div key={it.file} className="bg-gray-800 rounded p-3 cursor-pointer" onClick={() => setSelected(it)}>
              <div className="h-28 bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-400">
                {it.avatar ? <img src={it.avatar} alt={it.name} className="h-full object-cover rounded" /> : 'sin avatar'}
              </div>
              <div className="font-semibold text-white">{it.name}</div>
              <div className="text-sm text-gray-400 truncate">{it.description}</div>
            </div>
          ))}
        </div>
      )}

      <CharacterDetails file={selected?.file} details={selected} onClose={() => setSelected(null)} onUse={(d) => { alert('Usar: '+(d?.name||d?.file)); setSelected(null); }} />
    </div>
  )
}
