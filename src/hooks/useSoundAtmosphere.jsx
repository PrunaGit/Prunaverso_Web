import { useEffect, useRef } from "react";

// hue (0–360) → frecuencia 110–880 Hz
const hueToFrequency = (h) => 110 + (h / 360) * 770;

export default function useSoundAtmosphere({ activeHue = 220, enabled = true }) {
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // stop & cleanup si se desactiva
    if (!enabled) {
      cancelAnimationFrame(rafRef.current);
      if (oscRef.current) try { oscRef.current.stop(); } catch {}
      if (audioCtxRef.current) audioCtxRef.current.close().catch(()=>{});
      audioCtxRef.current = null; oscRef.current = null; gainRef.current = null;
      document.body.style.filter = "";
      return;
    }

    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = hueToFrequency(activeHue);
    gain.gain.value = 0.15; // volumen base suave

    osc.connect(gain).connect(ctx.destination);
    osc.start();

    audioCtxRef.current = ctx; oscRef.current = osc; gainRef.current = gain;

    // pedir gesto si está suspendido (autoplay policy)
    if (ctx.state === "suspended") {
      const resume = () => ctx.resume();
      window.addEventListener("pointerdown", resume, { once: true });
    }

    const t0 = ctx.currentTime;
    const animate = () => {
      const t = ctx.currentTime - t0;
      // ciclo respirante ~8s
      const breathing = 0.5 + 0.5 * Math.sin((2 * Math.PI / 8) * t);
      // volumen + brillo/saturación del body
      gain.gain.setTargetAtTime(0.08 + 0.14 * breathing, ctx.currentTime, 0.5);
      document.body.style.filter = `brightness(${0.9 + 0.1 * breathing}) saturate(${1 + 0.1 * breathing})`;
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      try { osc.stop(); } catch {}
      ctx.close().catch(()=>{});
      document.body.style.filter = "";
    };
  }, [activeHue, enabled]);
}