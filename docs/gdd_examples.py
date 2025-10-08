#!/usr/bin/env python3
"""
EJEMPLOS DE USO DEL GDD PARSER
=============================

Demostraciones prácticas de cómo consultar el Game Design Document 
del Prunaverso Web usando el parser.
"""

from gdd_parser import PrunaversoGDDParser

def ejemplo_consulta_completa():
    """Ejemplo de consulta completa del GDD."""
    parser = PrunaversoGDDParser()
    
    print("🧠 PRUNAVERSO WEB - CONSULTA TÉCNICA COMPLETA")
    print("=" * 60)
    
    # 1. Información del proyecto
    print("\n1️⃣ INFORMACIÓN DEL PROYECTO")
    metadata = parser.get_metadata()
    print(f"   Versión: {metadata.get('version')}")
    print(f"   Autor: {metadata.get('author')}")
    print(f"   Repositorio: {metadata.get('repository', {}).get('github')}")
    
    # 2. Arquitectura del sistema
    print("\n2️⃣ ARQUITECTURA DEL SISTEMA")
    arch = parser.get_architecture()
    for section, data in arch.items():
        if isinstance(data, dict) and 'path' in data:
            print(f"   📁 {section}: {data['path']}")
            if 'files' in data:
                for file, desc in data['files'].items():
                    print(f"      └─ {file}: {desc}")
    
    # 3. Fases de experiencia
    print("\n3️⃣ FLUJO DE EXPERIENCIA")
    flow = parser.get_experience_flow()
    for phase_key, phase_data in flow.items():
        if isinstance(phase_data, dict):
            name = phase_data.get('name', 'Sin nombre')
            route = phase_data.get('route', 'Sin ruta')
            print(f"   🎮 {phase_key}: {name} → {route}")
    
    # 4. Stack tecnológico
    print("\n4️⃣ STACK TECNOLÓGICO")
    tech = parser.get_technology_stack()
    for category, tools in tech.items():
        print(f"   🔧 {category.upper()}:")
        if isinstance(tools, dict):
            for tool, info in tools.items():
                status = info.get('status', 'unknown')
                use = info.get('use', 'No descripción')
                status_emoji = "✅" if status == "active" else "🔧" if status == "configured" else "⏳"
                print(f"      {status_emoji} {tool}: {use}")
    
    # 5. Progresión de niveles
    print("\n5️⃣ SISTEMA DE PROGRESIÓN")
    levels = parser.get_progression_levels()
    print(f"   Total de niveles: {len(levels)}")
    print("   Primeros 5 niveles:")
    for level in levels[:5]:
        level_num = level.get('level')
        name = level.get('name')
        maturity = level.get('maturity')
        xp = level.get('xp')
        print(f"      Lv{level_num}: {name} ({maturity}) - {xp} XP")
    
    # 6. Métricas de éxito
    print("\n6️⃣ MÉTRICAS DE ÉXITO")
    metrics = parser.get_metrics()
    for category, metric_list in metrics.items():
        print(f"   📊 {category.upper()}:")
        if isinstance(metric_list, dict):
            for metric, description in metric_list.items():
                print(f"      • {metric}: {description}")

def ejemplo_busqueda_componente():
    """Ejemplo de búsqueda de componentes específicos."""
    parser = PrunaversoGDDParser()
    
    print("\n🔍 BÚSQUEDA DE COMPONENTES")
    print("=" * 40)
    
    componentes_buscar = ["HUD", "Cognitive", "Lens", "InfoOrb", "Awakening"]
    
    for componente in componentes_buscar:
        print(f"\n🔎 Buscando '{componente}':")
        resultados = parser.search_implementation(componente)
        if resultados:
            for resultado in resultados:
                print(f"   ✅ {resultado}")
        else:
            print(f"   ❌ No se encontraron resultados para '{componente}'")

def ejemplo_consulta_fase_actual():
    """Ejemplo de consulta de la fase actual de desarrollo."""
    parser = PrunaversoGDDParser()
    
    print("\n🚀 ESTADO ACTUAL DEL DESARROLLO")
    print("=" * 45)
    
    fase_actual = parser.get_current_phase()
    if fase_actual:
        print(f"   Fase: {fase_actual.get('phase')} - {fase_actual.get('name')}")
        print(f"   Estado: {fase_actual.get('status')}")
        print(f"   Fecha objetivo: {fase_actual.get('date')}")
        
        deliverables = fase_actual.get('deliverables', [])
        if deliverables:
            print(f"   Entregables ({len(deliverables)}):")
            for deliverable in deliverables:
                print(f"      • {deliverable}")
    else:
        print("   ❌ No se encontró información de fase actual")

def ejemplo_resumen_ejecutivo():
    """Ejemplo de generación de resumen ejecutivo."""
    parser = PrunaversoGDDParser()
    
    print("\n📋 RESUMEN EJECUTIVO")
    print("=" * 30)
    print(parser.generate_summary())

def main():
    """Ejecuta todos los ejemplos."""
    try:
        ejemplo_consulta_completa()
        ejemplo_busqueda_componente() 
        ejemplo_consulta_fase_actual()
        ejemplo_resumen_ejecutivo()
        
        print("\n" + "="*60)
        print("✅ TODOS LOS EJEMPLOS EJECUTADOS CORRECTAMENTE")
        print("🎯 El GDD Parser está funcionando perfectamente")
        
    except Exception as e:
        print(f"❌ Error en los ejemplos: {e}")

if __name__ == "__main__":
    main()