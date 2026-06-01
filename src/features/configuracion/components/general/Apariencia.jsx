/**
 * Componente que decide qué vista de perfil mostrar según el rol del usuario.
 * Si el usuario es cliente, muestra AparienciaCliente; en caso contrario, AparienciaAdmin.
 * Utiliza el hook useConfiguracion para determinar si es cliente.
 * No requiere cambios porque el hook ya maneja el nuevo endpoint.
 */

import { useConfiguracion } from '../../hooks/useConfiguracion';
import AparienciaAdmin from './AparienciaAdmin';
import AparienciaCliente from './AparienciaCliente';

export default function Apariencia({ user, onUserUpdate, canEdit = false }) {
  const { esCliente } = useConfiguracion(user, onUserUpdate);

  // Si es cliente, muestra diseño de cliente
  if (esCliente) {
    return (
      <AparienciaCliente 
        user={user} 
        onUserUpdate={onUserUpdate} 
        canEdit={canEdit} 
      />
    );
  }

  // Si es admin/empleado, muestra diseño de admin
  return (
    <AparienciaAdmin 
      user={user} 
      onUserUpdate={onUserUpdate} 
      canEdit={canEdit} 
    />
  );
}