import { useCognitiveLens } from "../hooks/useCognitiveLens";
import { useSoundAtmosphere } from "../hooks/useSoundAtmosphere";

export default function LensAtmosphereManager() {
  const { cognitiveLenses, breathingMode } = useCognitiveLens();
  
  // Obtener el hue de la primera lente activa
  const lensToHue = {
    'psychology': 220,
    'neuroscience': 280,
    'ai': 120,
    'linguistics': 60,
    'philosophy': 240,
    'anthropology': 40
  };
  
  const activeLens = cognitiveLenses[0] || 'psychology';
  const hue = lensToHue[activeLens] ?? 220;

  useSoundAtmosphere({ activeHue: hue, enabled: breathingMode });

  // (visual tweaks globales ya los aplica el hook al <body>)
  return null;
}