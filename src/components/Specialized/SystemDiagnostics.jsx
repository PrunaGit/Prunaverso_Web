/**
 * @module SystemDiagnostics
 * @description Panel de diagnóstico sistémico para monitorear el estado de todos los managers
 * del Sistema Operativo Cognitivo Prunaverso v2.1.0. Proporciona visualización en tiempo real
 * del estado de coherencia sistémica y métricas de rendimiento.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import React, { useState, useEffect } from 'react';
import { getSystemStatus } from '../../system-core/prunalgoritm.js';
import routerManager from '../../system-core/routerManager.js';
import atmosphereManager from '../../system-core/atmosphereManager.js';
import serviceConfig from '../../system-core/serviceConfig.js';
import serviceConnectivity, { CONNECTIVITY_STATUS } from '../../system-core/serviceConnectivity.js';
import { uiLogger } from '../../system-core/logManager.js';

/**
 * Componente principal del panel de diagnóstico
 */
export default function SystemDiagnostics() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [connectivityState, setConnectivityState] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [diagnosticHistory, setDiagnosticHistory] = useState([]);

  // Estado de diagnóstico por manager
  const [managerDetails, setManagerDetails] = useState({});

  // Refrescar datos del sistema
  const refreshSystemStatus = async () => {
    try {
      const status = getSystemStatus();
      const timestamp = new Date().toISOString();
      
      setSystemStatus(status);
      setLastRefresh(timestamp);
      setRefreshCount(prev => prev + 1);
      
      // Verificar conectividad externa
      const connectivity = await serviceConnectivity.checkAllServices();
      setConnectivityState(connectivity);
      
      // Agregar al historial (mantener últimas 10 entradas)
      setDiagnosticHistory(prev => {
        const newEntry = {
          timestamp,
          status: status.isReady,
          systems: Object.keys(status.systems).length,
          connectivity: connectivity,
          refreshCount
        };
        return [newEntry, ...prev].slice(0, 10);
      });

      // Obtener detalles específicos de cada manager
      setManagerDetails({
        router: routerManager.getStats(),
        atmosphere: atmosphereManager.getActiveAtmosphere(),
        services: serviceConfig.getEndpoints(),
        connectivity: serviceConnectivity.getConnectivityStats()
      });

      uiLogger.logDebug('DIAGNOSTICS', 'Estado del sistema actualizado', { status, connectivity });
      
    } catch (error) {
      uiLogger.logError('DIAGNOSTICS', 'Error obteniendo estado del sistema:', error);
    }
  };

  // Auto-refresh
  useEffect(() => {
    refreshSystemStatus(); // Carga inicial
    
    if (autoRefresh) {
      const interval = setInterval(refreshSystemStatus, 3000); // Cada 3 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Aplicar atmósfera de diagnóstico y configurar conectividad
  useEffect(() => {
    atmosphereManager.setAtmosphere('atmosphere-analytical');
    uiLogger.logInfo('DIAGNOSTICS', 'Panel de diagnóstico sistémico cargado');
    
    // Iniciar monitoreo de conectividad
    serviceConnectivity.startHealthMonitoring(5000); // Cada 5 segundos
    
    return () => {
      // Restaurar atmósfera anterior al salir
      atmosphereManager.setAtmosphere('atmosphere-exploration');
      
      // Detener monitoreo de conectividad
      serviceConnectivity.stopHealthMonitoring();
    };
  }, []);

  if (!systemStatus) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingIcon}>🧠</div>
        <p>Inicializando diagnóstico sistémico...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header del panel */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            🧪 Diagnóstico del Sistema Operativo Cognitivo
          </h1>
          <div style={styles.headerStats}>
            <div style={styles.statusBadge(systemStatus.isReady)}>
              {systemStatus.isReady ? '✅ SISTEMA ACTIVO' : '⚠️ SISTEMA INACTIVO'}
            </div>
            <div style={styles.refreshInfo}>
              Actualizaciones: {refreshCount} | Última: {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        </div>
        
        <div style={styles.controls}>
          <button 
            onClick={refreshSystemStatus}
            style={styles.button}
          >
            🔄 Refrescar Ahora
          </button>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={styles.button}
          >
            {autoRefresh ? '⏸️ Pausar Auto-Refresh' : '▶️ Activar Auto-Refresh'}
          </button>
        </div>
      </div>

      {/* Grid de managers */}
      <div style={styles.managersGrid}>
        {/* Profile Manager */}
        <ManagerCard
          title="Profile Manager"
          icon="👤"
          status={systemStatus.systems.profile}
          details={{
            'Usuario Actual': systemStatus.systems.profile.currentProfile || 'No cargado',
            'Tipo de Usuario': systemStatus.systems.profile.userType || 'Desconocido',
            'Estado': systemStatus.systems.profile.ready ? 'Operativo' : 'Inactivo'
          }}
        />

        {/* Lens Manager */}
        <ManagerCard
          title="Lens Manager"
          icon="🔍"
          status={systemStatus.systems.lens}
          details={{
            'Lente Activa': systemStatus.systems.lens.currentLens || 'Ninguna',
            'Estado del Sistema': systemStatus.systems.lens.systemState || 'Desconocido',
            'Estado': systemStatus.systems.lens.ready ? 'Operativo' : 'Inactivo'
          }}
        />

        {/* Log Manager */}
        <ManagerCard
          title="Log Manager"
          icon="📋"
          status={systemStatus.systems.logging}
          details={{
            'Total de Logs': systemStatus.systems.logging.totalLogs || 0,
            'Nivel de Log': systemStatus.systems.logging.config || 'INFO',
            'Estado': systemStatus.systems.logging.ready ? 'Operativo' : 'Inactivo'
          }}
        />

        {/* Atmosphere Manager */}
        <ManagerCard
          title="Atmosphere Manager"
          icon="🎨"
          status={systemStatus.systems.atmosphere}
          details={{
            'Tema Actual': systemStatus.systems.atmosphere.currentTheme || 'Ninguno',
            'Paleta': systemStatus.systems.atmosphere.palette || 'Default',
            'Estado': systemStatus.systems.atmosphere.ready ? 'Operativo' : 'Inactivo'
          }}
        />

        {/* Service Config */}
        <ManagerCard
          title="Service Config"
          icon="⚙️"
          status={systemStatus.systems.services}
          details={{
            'Ambiente': systemStatus.systems.services.environment || 'development',
            'Endpoints': systemStatus.systems.services.endpoints || 0,
            'Estado': systemStatus.systems.services.ready ? 'Configurado' : 'No configurado'
          }}
        />

        {/* Router Manager */}
        <ManagerCard
          title="Router Manager"
          icon="🔗"
          status={systemStatus.systems.router}
          details={{
            'Ruta Actual': systemStatus.systems.router.currentRoute || 'Ninguna',
            'Historial': `${systemStatus.systems.router.historyEntries || 0} entradas`,
            'Estado': systemStatus.systems.router.ready ? 'Operativo' : 'Inactivo'
          }}
        />

        {/* System Core */}
        <ManagerCard
          title="System Core"
          icon="🧠"
          status={{
            ready: systemStatus.isReady,
            lastUpdate: systemStatus.lastUpdate
          }}
          details={{
            'Última Actualización': systemStatus.lastUpdate ? new Date(systemStatus.lastUpdate).toLocaleString() : 'N/A',
            'Tiempo de Actividad': systemStatus.timestamp ? new Date(systemStatus.timestamp).toLocaleString() : 'N/A',
            'Estado General': systemStatus.isReady ? 'Todos los sistemas operativos' : 'Algunos sistemas inactivos'
          }}
        />
      </div>

      {/* Sección de Conectividad Externa */}
      <div style={styles.connectivitySection}>
        <h3 style={styles.sectionTitle}>🌐 Conectividad de Servicios Externos</h3>
        <div style={styles.connectivityGrid}>
          {/* Characters Service */}
          <ConnectivityCard
            title="Characters API"
            icon="👥"
            service="characters"
            connectivity={connectivityState?.characters}
          />

          {/* API Service */}
          <ConnectivityCard
            title="Backend API"
            icon="🔗"
            service="api"
            connectivity={connectivityState?.api}
          />

          {/* Connectivity Stats */}
          <div style={styles.connectivityStats}>
            <h4>📊 Estadísticas de Conectividad</h4>
            {managerDetails.connectivity && (
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Servicios Totales:</span>
                  <span style={styles.statValue}>{managerDetails.connectivity.totalServices}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Conectados:</span>
                  <span style={styles.statValue}>{managerDetails.connectivity.connected}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Con Errores:</span>
                  <span style={styles.statValue}>{managerDetails.connectivity.errors}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Salud General:</span>
                  <span style={styles.statValue}>
                    {Math.round((managerDetails.connectivity.overallHealth || 0) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial de diagnósticos */}
      <div style={styles.historySection}>
        <h3 style={styles.sectionTitle}>📊 Historial de Diagnósticos</h3>
        <div style={styles.historyGrid}>
          {diagnosticHistory.map((entry, index) => (
            <div key={index} style={styles.historyEntry}>
              <div style={styles.historyTime}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
              <div style={styles.historyStatus(entry.status)}>
                {entry.status ? '✅' : '❌'}
              </div>
              <div style={styles.historyInfo}>
                {entry.systems} managers activos
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div style={styles.additionalInfo}>
        <div style={styles.infoCard}>
          <h4>🔍 Detalles del Router</h4>
          <pre style={styles.jsonDisplay}>
            {JSON.stringify(managerDetails.router, null, 2)}
          </pre>
        </div>
        
        <div style={styles.infoCard}>
          <h4>🎨 Estado de Atmósfera</h4>
          <div style={styles.atmosphereInfo}>
            <p><strong>Atmósfera Activa:</strong> {managerDetails.atmosphere}</p>
            <p><strong>Aplicada en:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h4>⚙️ Configuración de Servicios</h4>
          <div style={styles.servicesInfo}>
            {Object.entries(managerDetails.services || {}).map(([key, value]) => (
              <div key={key} style={styles.serviceEntry}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para mostrar el estado de conectividad de un servicio
 */
function ConnectivityCard({ title, icon, service, connectivity }) {
  if (!connectivity) {
    return (
      <div style={styles.connectivityCard('unknown')}>
        <div style={styles.connectivityHeader}>
          <span style={styles.connectivityIcon}>{icon}</span>
          <h4 style={styles.connectivityTitle}>{title}</h4>
          <div style={styles.connectivityStatus('unknown')}>⚪</div>
        </div>
        <div style={styles.connectivityDetails}>
          <p>Verificando conectividad...</p>
        </div>
      </div>
    );
  }

  const statusIcon = {
    [CONNECTIVITY_STATUS.CONNECTED]: '✅',
    [CONNECTIVITY_STATUS.CONNECTING]: '🔄',
    [CONNECTIVITY_STATUS.DISCONNECTED]: '❌',
    [CONNECTIVITY_STATUS.ERROR]: '⚠️',
    [CONNECTIVITY_STATUS.UNKNOWN]: '⚪'
  };

  const statusText = {
    [CONNECTIVITY_STATUS.CONNECTED]: 'Conectado',
    [CONNECTIVITY_STATUS.CONNECTING]: 'Conectando...',
    [CONNECTIVITY_STATUS.DISCONNECTED]: 'Desconectado',
    [CONNECTIVITY_STATUS.ERROR]: 'Error',
    [CONNECTIVITY_STATUS.UNKNOWN]: 'Desconocido'
  };

  return (
    <div style={styles.connectivityCard(connectivity.status)}>
      <div style={styles.connectivityHeader}>
        <span style={styles.connectivityIcon}>{icon}</span>
        <h4 style={styles.connectivityTitle}>{title}</h4>
        <div style={styles.connectivityStatus(connectivity.status)}>
          {statusIcon[connectivity.status]}
        </div>
      </div>
      
      <div style={styles.connectivityDetails}>
        <div style={styles.connectivityRow}>
          <span>Estado:</span>
          <span>{statusText[connectivity.status]}</span>
        </div>
        
        {connectivity.latency && (
          <div style={styles.connectivityRow}>
            <span>Latencia:</span>
            <span>{connectivity.latency}ms</span>
          </div>
        )}
        
        {connectivity.lastCheck && (
          <div style={styles.connectivityRow}>
            <span>Última verificación:</span>
            <span>{new Date(connectivity.lastCheck).toLocaleTimeString()}</span>
          </div>
        )}
        
        {connectivity.error && (
          <div style={styles.connectivityRow}>
            <span>Error:</span>
            <span style={{color: 'var(--color-error, #ff6b6b)'}}>{connectivity.error}</span>
          </div>
        )}
        
        {connectivity.url && (
          <div style={styles.connectivityRow}>
            <span>URL:</span>
            <span style={{fontSize: '0.8rem', opacity: 0.8}}>{connectivity.url}</span>
          </div>
        )}
      </div>
    </div>
  );
}
function ManagerCard({ title, icon, status, details }) {
  const isReady = status?.ready || false;
  
  return (
    <div style={styles.managerCard(isReady)}>
      <div style={styles.managerHeader}>
        <span style={styles.managerIcon}>{icon}</span>
        <h3 style={styles.managerTitle}>{title}</h3>
        <div style={styles.managerStatus(isReady)}>
          {isReady ? '✅' : '❌'}
        </div>
      </div>
      
      <div style={styles.managerDetails}>
        {Object.entries(details).map(([key, value]) => (
          <div key={key} style={styles.detailRow}>
            <span style={styles.detailLabel}>{key}:</span>
            <span style={styles.detailValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: {
    padding: '2rem',
    minHeight: '100vh',
    background: 'var(--color-background-primary, linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%))',
    color: 'var(--color-text-primary, #ffffff)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },

  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    color: 'var(--color-text-primary, #ffffff)'
  },

  loadingIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    animation: 'pulse 2s infinite'
  },

  header: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'var(--color-surface-primary, rgba(26, 26, 46, 0.9))',
    borderRadius: '12px',
    border: '1px solid var(--color-border-primary, #333)'
  },

  headerContent: {
    marginBottom: '1rem'
  },

  title: {
    margin: '0 0 1rem 0',
    fontSize: '2rem',
    color: 'var(--color-accent-primary, #6c5ce7)'
  },

  headerStats: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  statusBadge: (isReady) => ({
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    background: isReady ? 'var(--color-success, #00b894)' : 'var(--color-warning, #fdcb6e)',
    color: '#000'
  }),

  refreshInfo: {
    fontSize: '0.9rem',
    opacity: 0.8
  },

  controls: {
    display: 'flex',
    gap: '1rem'
  },

  button: {
    padding: '0.75rem 1.5rem',
    background: 'var(--color-accent-primary, #6c5ce7)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'transform 0.2s ease'
  },

  managersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },

  managerCard: (isReady) => ({
    background: 'var(--color-surface-secondary, rgba(22, 33, 62, 0.9))',
    borderRadius: '12px',
    padding: '1.5rem',
    border: `2px solid ${isReady ? 'var(--color-success, #00b894)' : 'var(--color-error, #ff6b6b)'}`,
    transition: 'transform 0.2s ease'
  }),

  managerHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '0.75rem'
  },

  managerIcon: {
    fontSize: '1.5rem'
  },

  managerTitle: {
    flex: 1,
    margin: 0,
    fontSize: '1.1rem',
    color: 'var(--color-text-primary, #ffffff)'
  },

  managerStatus: (isReady) => ({
    fontSize: '1.2rem'
  }),

  managerDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.25rem 0'
  },

  detailLabel: {
    fontWeight: 'bold',
    opacity: 0.8
  },

  detailValue: {
    color: 'var(--color-accent-secondary, #a29bfe)'
  },

  historySection: {
    marginBottom: '2rem'
  },

  sectionTitle: {
    marginBottom: '1rem',
    color: 'var(--color-accent-primary, #6c5ce7)'
  },

  historyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },

  historyEntry: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: 'var(--color-surface-tertiary, rgba(15, 52, 96, 0.5))',
    borderRadius: '8px'
  },

  historyTime: {
    fontSize: '0.8rem',
    opacity: 0.8
  },

  historyStatus: (status) => ({
    fontSize: '1rem'
  }),

  historyInfo: {
    fontSize: '0.9rem',
    flex: 1
  },

  additionalInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },

  infoCard: {
    background: 'var(--color-surface-secondary, rgba(22, 33, 62, 0.9))',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid var(--color-border-primary, #333)'
  },

  jsonDisplay: {
    background: 'var(--color-surface-tertiary, #0f3460)',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    overflow: 'auto',
    maxHeight: '200px'
  },

  atmosphereInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  servicesInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  serviceEntry: {
    padding: '0.5rem',
    background: 'var(--color-surface-tertiary, rgba(15, 52, 96, 0.5))',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },

  // Estilos de conectividad
  connectivitySection: {
    marginBottom: '2rem'
  },

  connectivityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },

  connectivityCard: (status) => {
    const borderColors = {
      [CONNECTIVITY_STATUS.CONNECTED]: 'var(--color-success, #00b894)',
      [CONNECTIVITY_STATUS.CONNECTING]: 'var(--color-warning, #fdcb6e)',
      [CONNECTIVITY_STATUS.DISCONNECTED]: 'var(--color-error, #ff6b6b)',
      [CONNECTIVITY_STATUS.ERROR]: 'var(--color-error, #ff6b6b)',
      [CONNECTIVITY_STATUS.UNKNOWN]: 'var(--color-border-primary, #333)'
    };

    return {
      background: 'var(--color-surface-secondary, rgba(22, 33, 62, 0.9))',
      borderRadius: '12px',
      padding: '1.5rem',
      border: `2px solid ${borderColors[status] || borderColors[CONNECTIVITY_STATUS.UNKNOWN]}`,
      transition: 'transform 0.2s ease'
    };
  },

  connectivityHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '0.75rem'
  },

  connectivityIcon: {
    fontSize: '1.5rem'
  },

  connectivityTitle: {
    flex: 1,
    margin: 0,
    fontSize: '1.1rem',
    color: 'var(--color-text-primary, #ffffff)'
  },

  connectivityStatus: (status) => ({
    fontSize: '1.2rem'
  }),

  connectivityDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  connectivityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.25rem 0',
    fontSize: '0.9rem'
  },

  connectivityStats: {
    background: 'var(--color-surface-secondary, rgba(22, 33, 62, 0.9))',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid var(--color-border-primary, #333)'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    marginTop: '1rem'
  },

  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    background: 'var(--color-surface-tertiary, rgba(15, 52, 96, 0.5))',
    borderRadius: '6px'
  },

  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.8
  },

  statValue: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: 'var(--color-accent-secondary, #a29bfe)'
  }
};