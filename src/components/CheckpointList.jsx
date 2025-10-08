import React, { useEffect, useState } from 'react';

export default function CheckpointList({ autoRefresh = false, refreshInterval = 15000 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/list-checkpoints');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) setItems(data.checkpoints || []);
      else throw new Error('Malformed response');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    if (!autoRefresh) return;
    const id = setInterval(fetchList, refreshInterval);
    return () => clearInterval(id);
  }, [autoRefresh, refreshInterval]);

  if (loading) return <div>Cargando checkpoints…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!items.length) return <div>No hay checkpoints.</div>;

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th>Fecha</th>
            <th>Archivo</th>
            <th>Tamaño</th>
            <th>Firma</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.file} className="border-t">
              <td>{new Date(it.mtime).toLocaleString()}</td>
              <td>{it.file}</td>
              <td>{(it.size / 1024).toFixed(1)} KB</td>
              <td>
                {it.sig ? (
                  it.sigValid === true ? (
                    <span className="text-green-400">OK</span>
                  ) : it.sigValid === false ? (
                    <span className="text-red-400">INVALID</span>
                  ) : (
                    <span className="text-yellow-300">{String(it.sigValid)}</span>
                  )
                ) : (
                  <span className="text-gray-400">no sig</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
