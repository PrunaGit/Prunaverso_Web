import React, { useMemo, useState } from "react";
import { useCognitiveLens } from "../hooks/useCognitiveLens";

/**
 * Mapa interactivo de arquitectura (sin dependencias extra).
 * * Cambia descripciones según la lente cognitiva activa.
 * * Nodos clicables con tooltip.
 * * Estilos Tailwind.
 */
export default function Architecture() {
  return (
    <div className="p-8 bg-blue-100 text-blue-800">
      <h1 className="text-2xl font-bold">🧩 Arquitectura (Modo Simple)</h1>
      <p>Página temporal para diagnosticar errores.</p>
    </div>
  )
}
