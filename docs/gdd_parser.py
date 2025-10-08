#!/usr/bin/env python3
"""
PRUNAVERSO GDD PARSER
====================

Script para consultar y extraer información del Game Design Document del Prunaverso Web.
Permite acceso programático a toda la documentación técnica y de diseño.

Autor: Alex Pruna + LLM-Dev
Fecha: 08/10/2025
Versión: 1.0.0 "Genesis Build"
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional

class PrunaversoGDDParser:
    """Parser principal para el Game Design Document del Prunaverso Web."""
    
    def __init__(self, gdd_path: str = None):
        """
        Inicializa el parser con la ruta al archivo GDD JSON.
        
        Args:
            gdd_path: Ruta al archivo prunaverso_gdd.json
        """
        if gdd_path is None:
            # Buscar el archivo en ubicaciones estándar
            current_dir = Path(__file__).parent
            possible_paths = [
                current_dir / "prunaverso_gdd.json",
                current_dir.parent / "docs" / "prunaverso_gdd.json",
                current_dir.parent / "prunaverso_gdd.json"
            ]
            
            for path in possible_paths:
                if path.exists():
                    gdd_path = str(path)
                    break
            else:
                raise FileNotFoundError("No se encontró prunaverso_gdd.json")
        
        self.gdd_path = Path(gdd_path)
        self.data = self._load_gdd()
    
    def _load_gdd(self) -> Dict[str, Any]:
        """Carga el archivo JSON del GDD."""
        try:
            with open(self.gdd_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            raise Exception(f"Error cargando GDD: {e}")
    
    def get_metadata(self) -> Dict[str, Any]:
        """Obtiene los metadatos del proyecto."""
        return self.data.get('gameDesignDocument', {}).get('metadata', {})
    
    def get_concept(self) -> Dict[str, Any]:
        """Obtiene el concepto central del juego."""
        return self.data.get('gameDesignDocument', {}).get('concept', {})
    
    def get_features(self) -> Dict[str, Any]:
        """Obtiene las características principales."""
        return self.data.get('gameDesignDocument', {}).get('features', {})
    
    def get_experience_flow(self) -> Dict[str, Any]:
        """Obtiene el flujo de experiencia por fases."""
        return self.data.get('gameDesignDocument', {}).get('experienceFlow', {})
    
    def get_phase_info(self, phase: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene información de una fase específica.
        
        Args:
            phase: Nombre de la fase (phase0, phase1, etc.)
        """
        flow = self.get_experience_flow()
        return flow.get(phase)
    
    def get_mechanics(self) -> Dict[str, Any]:
        """Obtiene las mecánicas de juego."""
        return self.data.get('gameDesignDocument', {}).get('mechanics', {})
    
    def get_progression_levels(self) -> List[Dict[str, Any]]:
        """Obtiene la lista de niveles de progresión."""
        progression = self.data.get('gameDesignDocument', {}).get('progression', {})
        return progression.get('levels', [])
    
    def get_level_info(self, level: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene información de un nivel específico.
        
        Args:
            level: Número del nivel (0-11)
        """
        levels = self.get_progression_levels()
        for level_data in levels:
            if level_data.get('level') == level:
                return level_data
        return None
    
    def get_achievements(self) -> Dict[str, Any]:
        """Obtiene el sistema de logros."""
        return self.data.get('gameDesignDocument', {}).get('achievements', {})
    
    def get_technology_stack(self) -> Dict[str, Any]:
        """Obtiene información del stack tecnológico."""
        tech = self.data.get('gameDesignDocument', {}).get('technology', {})
        return tech.get('stack', {})
    
    def get_architecture(self) -> Dict[str, Any]:
        """Obtiene la arquitectura del sistema."""
        return self.data.get('gameDesignDocument', {}).get('architecture', {})
    
    def get_routes(self) -> Dict[str, str]:
        """Obtiene el mapping de rutas del sistema."""
        return self.data.get('gameDesignDocument', {}).get('routes', {})
    
    def get_development_phases(self) -> List[Dict[str, Any]]:
        """Obtiene las fases de desarrollo."""
        dev = self.data.get('gameDesignDocument', {}).get('development', {})
        return dev.get('phases', [])
    
    def get_current_phase(self) -> Optional[Dict[str, Any]]:
        """Obtiene la fase de desarrollo actual."""
        phases = self.get_development_phases()
        for phase in phases:
            if phase.get('status') == 'in_progress':
                return phase
        return None
    
    def get_metrics(self) -> Dict[str, Any]:
        """Obtiene las métricas de éxito."""
        return self.data.get('gameDesignDocument', {}).get('metrics', {})
    
    def search_feature(self, feature_name: str) -> Optional[Dict[str, Any]]:
        """
        Busca una característica específica por nombre.
        
        Args:
            feature_name: Nombre de la característica a buscar
        """
        features = self.get_features()
        return features.get(feature_name)
    
    def search_implementation(self, component_name: str) -> List[str]:
        """
        Busca rutas de implementación que contengan el nombre del componente.
        
        Args:
            component_name: Nombre del componente a buscar
        """
        results = []
        
        # Buscar en features
        features = self.get_features()
        for feature_key, feature_data in features.items():
            if isinstance(feature_data, dict) and 'implementation' in feature_data:
                impl = feature_data['implementation']
                if component_name.lower() in impl.lower():
                    results.append(f"Feature '{feature_key}': {impl}")
        
        # Buscar en arquitectura
        arch = self.get_architecture()
        for section_key, section_data in arch.items():
            if isinstance(section_data, dict) and 'files' in section_data:
                files = section_data['files']
                for file_key, file_desc in files.items():
                    if component_name.lower() in file_key.lower() or component_name.lower() in file_desc.lower():
                        path = section_data.get('path', '')
                        results.append(f"Architecture '{section_key}': {path}{file_key} - {file_desc}")
        
        return results
    
    def get_version_info(self) -> str:
        """Obtiene información de versión formateada."""
        metadata = self.get_metadata()
        version = metadata.get('version', 'Unknown')
        codename = metadata.get('codename', '')
        date = metadata.get('date', '')
        
        return f"Prunaverso Web v{version} '{codename}' ({date})"
    
    def generate_summary(self) -> str:
        """Genera un resumen ejecutivo del GDD."""
        concept = self.get_concept()
        metadata = self.get_metadata()
        current_phase = self.get_current_phase()
        
        summary = f"""
# PRUNAVERSO WEB - RESUMEN EJECUTIVO GDD

## Información General
- **Proyecto:** {concept.get('title', 'N/A')}
- **Versión:** {self.get_version_info()}
- **Tipo:** {concept.get('type', 'N/A')}
- **Tagline:** {concept.get('tagline', 'N/A')}

## Core Loop
{' → '.join(concept.get('coreLoop', []))}

## Fase Actual de Desarrollo
"""
        
        if current_phase:
            summary += f"**Fase {current_phase.get('phase', 'N/A')}:** {current_phase.get('name', 'N/A')}\n"
            summary += f"**Estado:** {current_phase.get('status', 'N/A')}\n"
            summary += f"**Fecha objetivo:** {current_phase.get('date', 'N/A')}\n"
        
        summary += f"""
## Progresión
{len(self.get_progression_levels())} niveles de evolución cognitiva definidos.

## Stack Tecnológico Principal
"""
        
        tech = self.get_technology_stack()
        if 'frontend' in tech:
            frontend_tools = list(tech['frontend'].keys())
            summary += f"**Frontend:** {', '.join(frontend_tools)}\n"
        
        if 'backend' in tech:
            backend_tools = list(tech['backend'].keys())
            summary += f"**Backend:** {', '.join(backend_tools)}\n"
        
        summary += f"""
## Rutas Principales
"""
        routes = self.get_routes()
        for route, description in routes.items():
            summary += f"- `{route}`: {description}\n"
        
        return summary.strip()

def main():
    """Función principal para testing del parser."""
    try:
        parser = PrunaversoGDDParser()
        
        print("=== PRUNAVERSO GDD PARSER ===")
        print(parser.get_version_info())
        print()
        
        # Ejemplo de consultas
        print("📋 Concepto central:")
        concept = parser.get_concept()
        print(f"  Tagline: {concept.get('tagline')}")
        print(f"  Core Loop: {' → '.join(concept.get('coreLoop', []))}")
        print()
        
        print("🎮 Fase actual de desarrollo:")
        current_phase = parser.get_current_phase()
        if current_phase:
            print(f"  Fase {current_phase.get('phase')}: {current_phase.get('name')}")
            print(f"  Estado: {current_phase.get('status')}")
        print()
        
        print("🧩 Niveles de progresión:")
        levels = parser.get_progression_levels()
        for level in levels[:3]:  # Mostrar solo los primeros 3
            print(f"  Nivel {level.get('level')}: {level.get('name')} ({level.get('maturity')})")
        print(f"  ... y {len(levels)-3} niveles más")
        print()
        
        print("🔍 Búsqueda de componente 'HUD':")
        hud_results = parser.search_implementation('HUD')
        for result in hud_results:
            print(f"  {result}")
        
        print("\n" + "="*50)
        print("✅ Parser funcionando correctamente")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()