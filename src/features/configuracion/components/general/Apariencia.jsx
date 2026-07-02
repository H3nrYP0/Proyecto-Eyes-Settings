/**
 * Componente que decide qué vista de perfil mostrar según el rol del usuario.
 * 
 * FIX: Se agrega componente de carga y se espera a que esCliente esté definido.
 */

import { useConfiguracion } from '../../hooks/useConfiguracion';
import AparienciaAdmin from './AparienciaAdmin';
import AparienciaCliente from './AparienciaCliente';
import Loading from '@shared/components/ui/Loading';

export default function Apariencia({ user, onUserUpdate, canEdit = false }) {
  // Una única instancia del hook para toda la jerarquía
  const configuracion = useConfiguracion(user, onUserUpdate);
  const { loading, error, esCliente } = configuracion;

  // Mientras carga o el rol aún no se ha determinado, mostrar loading
  if (loading || esCliente === undefined) {
    return <Loading />;
  }

  // Si hay error en la consulta, mostrar mensaje
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#d32f2f' }}>
        <Typography variant="h6">Error al cargar el perfil</Typography>
        <Typography variant="body2">{error.message || 'Intenta nuevamente más tarde'}</Typography>
      </div>
    );
  }

  if (esCliente) {
    return (
      <AparienciaCliente
        user={user}
        onUserUpdate={onUserUpdate}
        canEdit={canEdit}
        configuracion={configuracion}
      />
    );
  }

  return (
    <AparienciaAdmin
      user={user}
      onUserUpdate={onUserUpdate}
      canEdit={canEdit}
      configuracion={configuracion}
    />
  );
}