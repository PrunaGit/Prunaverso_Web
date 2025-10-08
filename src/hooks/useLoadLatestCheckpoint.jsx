import { useEffect } from 'react';

export default function useLoadLatestCheckpoint({ setPlayer, setLog, setGameState, onNoCheckpoint }) {
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/load-latest-checkpoint');
        if (!res.ok) {
          if (mounted && onNoCheckpoint) onNoCheckpoint();
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        if (data && data.ok && data.checkpoint) {
          const cp = data.checkpoint;
          if (cp.player && typeof setPlayer === 'function') setPlayer(cp.player);
          if (Array.isArray(cp.log) && typeof setLog === 'function') setLog(cp.log);
          if (typeof setGameState === 'function') setGameState('playing');
          if (data.sigValid === false) console.warn('Checkpoint signature INVALID');
          else if (data.sigValid === 'no-key') console.warn('Checkpoint has signature but server has no key to verify');
        } else {
          if (mounted && onNoCheckpoint) onNoCheckpoint();
        }
      } catch (e) {
        if (mounted && onNoCheckpoint) onNoCheckpoint();
        console.error('Failed to load checkpoint:', e);
      }
    }
    load();
    return () => { mounted = false; };
  }, [setPlayer, setLog, setGameState, onNoCheckpoint]);
}
