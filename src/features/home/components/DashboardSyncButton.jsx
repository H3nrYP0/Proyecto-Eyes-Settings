import { useState } from 'react';
import { useLandingSync } from '../../home/hooks/useLandingData';
import { forceSyncFromDashboard } from '../../home/services/landingDataService';
import '/src/shared/styles/features/home/DashboardSync.css';

const DashboardSyncButton = () => {
  const { syncProductsFromDashboard, syncServicesFromDashboard } = useLandingSync();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(localStorage.getItem('last_sync_dashboard'));

  const handleSync = async () => {
    setSyncing(true);
    
    try {
      const result = forceSyncFromDashboard(syncProductsFromDashboard, syncServicesFromDashboard);
      
      if (result.products && result.services) {
        // Actualizar timestamp de última sincronización
        const timestamp = new Date().toLocaleString();
        localStorage.setItem('last_sync_dashboard', timestamp);
        setLastSync(timestamp);
        
        console.log('✅ Sincronización completada:', result);
        alert('✅ Datos sincronizados correctamente con el landing page');
      } else {
        throw new Error('Error en la sincronización');
      }
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      alert('❌ Error al sincronizar datos con el landing page');
    } finally {
      setSyncing(false);
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="dashboard-sync-container">
      <div className="sync-info">
        <h4>Sincronización Landing Page</h4>
        <p className="sync-description">
          Sincroniza productos y servicios con la página pública
        </p>
        <p className="last-sync">
          Última sincronización: <strong>{formatLastSync(lastSync)}</strong>
        </p>
      </div>
      
      <button 
        className={`sync-button ${syncing ? 'syncing' : ''}`}
        onClick={handleSync}
        disabled={syncing}
      >
        {syncing ? (
          <>
            <div className="sync-spinner"></div>
            Sincronizando...
          </>
        ) : (
          <>
            <span className="sync-icon">🔄</span>
            Sincronizar Ahora
          </>
        )}
      </button>
    </div>
  );
};

export default DashboardSyncButton;