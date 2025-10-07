import { useEffect, useState } from "react";

export default function PrunaversoPanel() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    fetch("/data/alex_pruna_profile.v4.json")
      .then((res) => res.json())
      .then((data) => setPerfil(data))
      .catch((err) => console.error("Error cargando perfil:", err));
  }, []);

  if (!perfil)
    return (
      <div className="flex h-screen items-center justify-center bg-[#111] text-gray-300 text-lg">
        Cargando datos del Prunaverso...
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0d0d0f] via-[#121225] to-[#0d0d0f] text-gray-200 font-mono text-center px-4">
      <h1 className="text-5xl font-extrabold mb-2 text-[#77eaff]">
        🌌 Prunaverso Visual v0.1
      </h1>
      <h2 className="text-2xl mb-6 opacity-80">
        {perfil.nombre || "Sin nombre registrado"}
      </h2>

      <div className="bg-[#1c1f26] p-8 rounded-2xl shadow-xl border border-[#333] max-w-lg w-11/12 text-center space-y-3">
        <p>
          <b>Rol:</b> {perfil.rol || "—"}
        </p>
        <p>
          <b>Versión:</b> {perfil.version || "v0.06"}
        </p>
        <p>
          <b>Estado:</b> {perfil.estado_actual || "Activo"}
        </p>
        <p>
          <b>Propósito:</b> {perfil.proposito || "Expansión cognitiva"}
        </p>
      </div>

      <footer className="mt-10 text-xs opacity-60">
        Sistema operativo Prunaversal © 2025
      </footer>
    </div>
  );
}
