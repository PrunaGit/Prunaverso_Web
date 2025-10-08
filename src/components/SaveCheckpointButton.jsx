import React from "react";

export default function SaveCheckpointButton({ player, log, setGameState, setLog }) {
  async function saveCheckpoint() {
    const payload = { player, log, ts: new Date().toISOString() };
    const json = JSON.stringify(payload);

    try {
      const res = await fetch("/api/save-checkpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      if (res.ok) return { ok: true };
    } catch (_) {}

    // fallback → descarga directa
    try {
      const name = `checkpoint-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return { ok: false, fallback: "download" };
    } catch (e) {
      return { ok: false, error: e?.message || String(e) };
    }
  }

  async function handleExit() {
    const result = await saveCheckpoint();
    setGameState?.("menu");
    setLog?.((l) => [...(l || []), `Sesión guardada (${result.ok ? "OK" : "fallback"})`]);
  }

  return (
    <button
      onClick={handleExit}
      className="px-4 py-2 bg-red-600 text-white rounded"
      title="Finalizar sesión y guardar checkpoint"
    >
      Finalizar sesión
    </button>
  );
}
