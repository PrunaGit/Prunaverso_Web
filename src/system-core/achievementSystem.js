/**
 * SISTEMA DE LOGROS PRUNAVERSO
 * ============================
 * 
 * Gestiona los logros del jugador según las especificaciones del GDD.
 * Integrado con el Sistema Operativo Cognitivo v2.0.
 */

export class AchievementSystem {
  constructor() {
    this.achievements = new Map();
    this.unlockedAchievements = new Set();
    this.listeners = new Set();
    
    this.initializeAchievements();
    this.loadProgress();
  }

  initializeAchievements() {
    // Logros según el GDD - 7 rarezas: Común, Raro, Épico, Legendario, Mítico, Divino, Φ
    
    // COMÚN
    this.registerAchievement({
      id: 'first_awakening',
      title: 'Primer Despertar',
      description: 'Completaste la experiencia de despertar cognitivo',
      icon: '🌅',
      rarity: 'Común',
      category: 'progression',
      xpReward: 50,
      condition: (state) => state.awakeningSeen === true
    });

    this.registerAchievement({
      id: 'portal_explorer', 
      title: 'Explorador de Portales',
      description: 'Visitaste el portal público por primera vez',
      icon: '🚪',
      rarity: 'Común',
      category: 'exploration',
      xpReward: 25,
      condition: (state) => state.portalVisits > 0
    });

    // RARO
    this.registerAchievement({
      id: 'mental_explorer',
      title: 'Explorador Mental',
      description: 'Exploraste tu mente usando los 4 módulos cognitivos',
      icon: '🧠',
      rarity: 'Raro',
      category: 'exploration',
      xpReward: 100,
      condition: (state) => state.mindModulesExplored >= 4
    });

    this.registerAchievement({
      id: 'hud_discoverer',
      title: 'Descubridor del HUD',
      description: 'Activaste el HUD cognitivo por primera vez',
      icon: '💻',
      rarity: 'Raro', 
      category: 'interface',
      xpReward: 75,
      condition: (state) => state.hudActivated === true
    });

    // ÉPICO
    this.registerAchievement({
      id: 'lens_changer',
      title: 'Cambiador de Lentes',
      description: 'Utilizaste 3 lentes cognitivas diferentes',
      icon: '🔮',
      rarity: 'Épico',
      category: 'cognitive',
      xpReward: 150,
      condition: (state) => state.lensesUsed >= 3
    });

    this.registerAchievement({
      id: 'level_up_master',
      title: 'Maestro del Progreso',
      description: 'Alcanzaste el nivel 5 en el sistema cognitivo',
      icon: '⬆️',
      rarity: 'Épico',
      category: 'progression',
      xpReward: 200,
      condition: (state) => state.nivel >= 5
    });

    // LEGENDARIO
    this.registerAchievement({
      id: 'deep_session',
      title: 'Sesión Profunda',
      description: 'Mantuviste coherencia >80% durante 10 minutos',
      icon: '⚡',
      rarity: 'Legendario',
      category: 'cognitive',
      xpReward: 300,
      condition: (state) => state.coherencia > 80 && state.sessionTime > 10
    });

    this.registerAchievement({
      id: 'high_vitalidad',
      title: 'Energía Máxima',
      description: 'Alcanzaste vitalidad de 90+ puntos',
      icon: '🔥',
      rarity: 'Legendario',
      category: 'cognitive', 
      xpReward: 250,
      condition: (state) => state.vitalidad >= 90
    });

    // MÍTICO
    this.registerAchievement({
      id: 'cognitive_master',
      title: 'Maestro Cognitivo',
      description: 'Mantuviste todas las métricas cognitivas >85%',
      icon: '🧘',
      rarity: 'Mítico',
      category: 'mastery',
      xpReward: 500,
      condition: (state) => state.vitalidad >= 85 && state.eutimia >= 85 && state.carga >= 85 && state.coherencia >= 85
    });

    this.registerAchievement({
      id: 'level_ten',
      title: 'Décimo Nivel',
      description: 'Alcanzaste el nivel 10 - Omnicon Φ∞',
      icon: '🌌',
      rarity: 'Mítico',
      category: 'progression',
      xpReward: 750,
      condition: (state) => state.nivel >= 10
    });

    // DIVINO
    this.registerAchievement({
      id: 'singularity_reached',
      title: 'Singularidad Alcanzada',
      description: 'Llegaste al nivel 11 - Singularidad completa',
      icon: '✨',
      rarity: 'Divino',
      category: 'transcendence',
      xpReward: 1000,
      condition: (state) => state.nivel >= 11
    });

    // Φ (PHI) - El logro supremo
    this.registerAchievement({
      id: 'phi_consciousness',
      title: 'Consciencia Φ',
      description: 'Trascendiste el sistema y creaste tu propio arquetipo',
      icon: 'Φ',
      rarity: 'Φ',
      category: 'transcendence',
      xpReward: 2000,
      condition: (state) => state.nivel >= 11 && state.customArchetypeCreated === true
    });
  }

  registerAchievement(achievement) {
    this.achievements.set(achievement.id, achievement);
  }

  checkAchievements(cognitiveState) {
    const newUnlocks = [];
    
    for (const [id, achievement] of this.achievements) {
      if (!this.unlockedAchievements.has(id)) {
        if (achievement.condition(cognitiveState)) {
          this.unlockAchievement(id);
          newUnlocks.push(achievement);
        }
      }
    }
    
    return newUnlocks;
  }

  unlockAchievement(achievementId) {
    if (!this.unlockedAchievements.has(achievementId)) {
      this.unlockedAchievements.add(achievementId);
      const achievement = this.achievements.get(achievementId);
      
      // Guardar progreso
      this.saveProgress();
      
      // Notificar a listeners
      this.notifyListeners('achievement_unlocked', achievement);
      
      // Mostrar notificación
      this.showAchievementNotification(achievement);
      
      return achievement;
    }
    return null;
  }

  showAchievementNotification(achievement) {
    // Crear notificación visual
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <div class="achievement-title">¡Logro Desbloqueado!</div>
          <div class="achievement-name">${achievement.title}</div>
          <div class="achievement-rarity">${achievement.rarity}</div>
        </div>
      </div>
    `;
    
    // Aplicar estilos
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      border: '2px solid #8b5cf6',
      borderRadius: '12px',
      padding: '16px',
      color: 'white',
      fontFamily: 'monospace',
      zIndex: '10000',
      animation: 'achievementSlideIn 0.5s ease-out',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
    });
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('achievement-styles')) {
      const style = document.createElement('style');
      style.id = 'achievement-styles';
      style.textContent = `
        @keyframes achievementSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .achievement-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .achievement-icon {
          font-size: 2em;
        }
        .achievement-title {
          font-weight: bold;
          color: #8b5cf6;
          font-size: 0.9em;
        }
        .achievement-name {
          font-weight: bold;
          margin: 4px 0;
        }
        .achievement-rarity {
          font-size: 0.8em;
          color: #a855f7;
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
      notification.style.animation = 'achievementSlideIn 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 5000);
  }

  getUnlockedAchievements() {
    return Array.from(this.unlockedAchievements).map(id => this.achievements.get(id));
  }

  getAllAchievements() {
    return Array.from(this.achievements.values());
  }

  getAchievementProgress() {
    const total = this.achievements.size;
    const unlocked = this.unlockedAchievements.size;
    return {
      total,
      unlocked,
      percentage: Math.round((unlocked / total) * 100)
    };
  }

  getAchievementsByRarity() {
    const byRarity = {};
    for (const achievement of this.achievements.values()) {
      if (!byRarity[achievement.rarity]) {
        byRarity[achievement.rarity] = [];
      }
      byRarity[achievement.rarity].push({
        ...achievement,
        unlocked: this.unlockedAchievements.has(achievement.id)
      });
    }
    return byRarity;
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners(event, data) {
    for (const listener of this.listeners) {
      listener(event, data);
    }
  }

  saveProgress() {
    const progress = {
      unlockedAchievements: Array.from(this.unlockedAchievements),
      lastUpdated: Date.now()
    };
    localStorage.setItem('prunaverso_achievements', JSON.stringify(progress));
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('prunaverso_achievements');
      if (saved) {
        const progress = JSON.parse(saved);
        this.unlockedAchievements = new Set(progress.unlockedAchievements || []);
      }
    } catch (e) {
      console.warn('Error loading achievement progress:', e);
    }
  }

  // Método para debug - desbloquear logro manualmente
  debugUnlock(achievementId) {
    if (this.achievements.has(achievementId)) {
      return this.unlockAchievement(achievementId);
    }
    return null;
  }

  // Resetear progreso (para testing)
  resetProgress() {
    this.unlockedAchievements.clear();
    localStorage.removeItem('prunaverso_achievements');
  }
}

// Instancia global del sistema de logros
export const achievementSystem = new AchievementSystem();

// Función de conveniencia para otros módulos
export const checkAndUnlockAchievements = (cognitiveState) => {
  return achievementSystem.checkAchievements(cognitiveState);
};

export default achievementSystem;